import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  onSnapshot,
  type DocumentData,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase";

export interface ProjectItem {
  id: string;
  title: string;
  label: string;
  description: string;
  previewImage: string;
  images: string[];
  url?: string;
  showOnHome: boolean;
  order: number;
  demoScreen?: "commerce" | "identity" | "platform";
  imageFit?: "smart" | "cover" | "contain";
  iconName?: string;
  createdAt?: number;
}

export const DEFAULT_PROJECTS: ProjectItem[] = [];

const COLLECTION_NAME = "projects";
const LOCAL_STORAGE_KEY = "famex_saved_projects";

export function getLocalProjects(): ProjectItem[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;

    // حذف المشاريع التجريبية السابقة نهائياً من الذاكرة المحلية
    const cleaned = parsed.filter(
      (p: ProjectItem) =>
        p &&
        p.id !== "commerce" &&
        p.id !== "identity" &&
        p.id !== "platform"
    );

    return cleaned;
  } catch {
    return null;
  }
}

export function setLocalProjects(projects: ProjectItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects));
    window.dispatchEvent(new CustomEvent("famex_projects_updated", { detail: projects }));
    window.dispatchEvent(new StorageEvent("storage", { key: LOCAL_STORAGE_KEY }));
  } catch {
    // Ignore localStorage write error
  }
}

/**
 * Fetch all projects from Firestore with localStorage fallback and caching.
 */
export async function getAllProjects(): Promise<ProjectItem[]> {
  try {
    let snapshot;
    try {
      const q = query(collection(getFirebaseDb(), COLLECTION_NAME), orderBy("order", "asc"));
      snapshot = await getDocs(q);
    } catch {
      // Fallback query without orderBy in case field/index issues
      snapshot = await getDocs(collection(getFirebaseDb(), COLLECTION_NAME));
    }

    const projects: ProjectItem[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data() as DocumentData;
      projects.push({
        id: docSnap.id,
        title: data.title || "",
        label: data.label || "",
        description: data.description || "",
        previewImage: data.previewImage || (data.images && data.images[0]) || "",
        images: Array.isArray(data.images) ? data.images : [],
        url: data.url || "",
        showOnHome: data.showOnHome !== false,
        order: typeof data.order === "number" ? data.order : 99,
        demoScreen: data.demoScreen,
        imageFit: (data.imageFit as "smart" | "cover" | "contain") || "smart",
        iconName: data.iconName || "",
        createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : Date.now(),
      });
    });

    projects.sort((a, b) => a.order - b.order);
    setLocalProjects(projects);
    return projects;
  } catch (error) {
    console.warn("Could not fetch projects from Firestore, falling back to local storage:", error);
    const local = getLocalProjects();
    return local ?? [];
  }
}

/**
 * Real-time subscription to projects from Firestore.
 * Updates local cache and immediately triggers callback on every database mutation.
 */
export function subscribeToProjects(
  callback: (projects: ProjectItem[]) => void
): () => void {
  // 1. Fast path: Immediately invoke callback with local cached data if available (zero flicker)
  const local = getLocalProjects();
  if (local && local.length > 0) {
    callback(local);
  }

  // 2. Parallel immediate direct fetch (guarantees fresh data even if WebSockets are slow/blocked)
  getAllProjects()
    .then((fresh) => {
      if (fresh) {
        callback(fresh);
      }
    })
    .catch((err) => {
      console.warn("Direct fetch in subscribeToProjects failed:", err);
    });

  // 3. Setup real-time listener from Firestore
  try {
    const q = query(
      collection(getFirebaseDb(), COLLECTION_NAME),
      orderBy("order", "asc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const projects: ProjectItem[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as DocumentData;
          projects.push({
            id: docSnap.id,
            title: data.title || "",
            label: data.label || "",
            description: data.description || "",
            previewImage: data.previewImage || (data.images && data.images[0]) || "",
            images: Array.isArray(data.images) ? data.images : [],
            url: data.url || "",
            showOnHome: data.showOnHome !== false,
            order: typeof data.order === "number" ? data.order : 99,
            demoScreen: data.demoScreen,
            imageFit: (data.imageFit as "smart" | "cover" | "contain") || "smart",
            iconName: data.iconName || "",
            createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : Date.now(),
          });
        });

        projects.sort((a, b) => a.order - b.order);
        setLocalProjects(projects);
        callback(projects);
      },
      (error) => {
        console.warn("Firestore real-time subscription error, using local data:", error);
        // Fallback to direct fetch on subscription error
        getAllProjects().then((items) => {
          if (items) callback(items);
        }).catch(() => {});
      }
    );

    return unsubscribe;
  } catch (err) {
    console.warn("Could not establish Firestore subscription:", err);
    return () => {};
  }
}

/**
 * Fetch projects marked to show on Home.
 * ALWAYS capped at exactly 3 projects max for the home page.
 */
export async function getHomeProjects(): Promise<ProjectItem[]> {
  const all = await getAllProjects();
  const homeOnly = all.filter((p) => p.showOnHome !== false);
  return (homeOnly.length > 0 ? homeOnly : all).slice(0, 3);
}

/**
 * Add or overwrite a project.
 * Updates both Firestore and localStorage, notifying listeners in real-time.
 */
export async function saveProject(
  project: Omit<ProjectItem, "id"> & { id?: string }
): Promise<string> {
  const docId =
    project.id && project.id.trim()
      ? project.id.trim()
      : `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  const newItem: ProjectItem = {
    id: docId,
    title: project.title,
    label: project.label || "",
    description: project.description || "",
    previewImage: project.previewImage || (project.images?.[0] ?? ""),
    images: project.images || [],
    url: project.url || "",
    showOnHome: Boolean(project.showOnHome),
    order: Number(project.order) || 1,
    demoScreen: project.demoScreen,
    imageFit: project.imageFit || "smart",
    iconName: project.iconName || "",
    createdAt: Date.now(),
  };

  // Immediate local update
  const currentList = getLocalProjects() || [];
  const existingIdx = currentList.findIndex((p) => p.id === docId);
  let updatedList: ProjectItem[];
  if (existingIdx >= 0) {
    updatedList = [...currentList];
    updatedList[existingIdx] = { ...updatedList[existingIdx], ...newItem };
  } else {
    updatedList = [...currentList, newItem];
  }
  updatedList.sort((a, b) => a.order - b.order);
  setLocalProjects(updatedList);

  // Firestore update
  try {
    const docRef = doc(getFirebaseDb(), COLLECTION_NAME, docId);
    const existing = await getDoc(docRef);

    const payload: Record<string, unknown> = {
      title: newItem.title,
      label: newItem.label,
      description: newItem.description,
      previewImage: newItem.previewImage,
      images: newItem.images,
      url: newItem.url,
      showOnHome: newItem.showOnHome,
      order: newItem.order,
      imageFit: newItem.imageFit,
      iconName: newItem.iconName || "",
    };

    if (newItem.demoScreen) {
      payload.demoScreen = newItem.demoScreen;
    }

    if (existing.exists()) {
      payload.updatedAt = serverTimestamp();
      await updateDoc(docRef, payload);
    } else {
      payload.createdAt = serverTimestamp();
      await setDoc(docRef, payload);
    }
  } catch (err) {
    console.warn("Could not sync project with Firestore (local save succeeded):", err);
  }

  return docId;
}

/**
 * Delete a project.
 */
export async function deleteProject(id: string): Promise<boolean> {
  // 1. Immediate local update
  const currentList = getLocalProjects() || [];
  const updatedList = currentList.filter((p) => p.id !== id);
  setLocalProjects(updatedList);

  // 2. Broadcast across tabs immediately
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("famex_projects_updated", { detail: updatedList }));
  }

  // 3. Firestore delete
  let firestoreSuccess = false;
  try {
    const docRef = doc(getFirebaseDb(), COLLECTION_NAME, id);
    await deleteDoc(docRef);
    firestoreSuccess = true;
  } catch (err) {
    console.error("Could not delete project from Firestore:", err);
  }

  // Force-sync fresh cache if successful
  if (firestoreSuccess) {
    getAllProjects().catch(() => {});
  }

  return firestoreSuccess;
}
