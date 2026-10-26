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
  type DocumentData,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

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
  createdAt?: number;
}

export const DEFAULT_PROJECTS: ProjectItem[] = [
  {
    id: "commerce",
    title: "متجر إلكتروني طلقة وبيبيع",
    label: "أبلكيشن متجر",
    description: "تجربة تسوق سالكة وسريعة تخلي الزبون يملى السلة ويدفع في ثواني.",
    previewImage: "",
    images: [],
    demoScreen: "commerce",
    showOnHome: true,
    order: 1,
  },
  {
    id: "identity",
    title: "هوية بصرية تعلّم وتعيش",
    label: "براندينج وهوية",
    description: "ديزاين كامل مليان روح وشخصية بتعكس هيبة البراند وتفاصيله.",
    previewImage: "",
    images: [],
    demoScreen: "identity",
    showOnHome: true,
    order: 2,
  },
  {
    id: "platform",
    title: "داشبورد ومنصة إدارة ذكية",
    label: "منصة ويب وسحابية",
    description: "كل أرقام وبيانات بيزنسك في مكان واحد منظم وسهل من غير وجع دماغ.",
    previewImage: "",
    images: [],
    demoScreen: "platform",
    showOnHome: true,
    order: 3,
  },
];

const COLLECTION_NAME = "projects";
const LOCAL_STORAGE_KEY = "famex_saved_projects";

function getLocalProjects(): ProjectItem[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : null;
  } catch {
    return null;
  }
}

function setLocalProjects(projects: ProjectItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects));
    window.dispatchEvent(new CustomEvent("famex_projects_updated", { detail: projects }));
  } catch {
    // Ignore localStorage write error
  }
}

/**
 * Fetch all projects from Firestore with localStorage fallback and caching.
 * If collection is empty, returns DEFAULT_PROJECTS.
 */
export async function getAllProjects(): Promise<ProjectItem[]> {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy("order", "asc"));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
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
          createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : Date.now(),
        });
      });

      setLocalProjects(projects);
      return projects;
    }
  } catch (error) {
    console.warn("Could not fetch projects from Firestore, falling back to local storage / defaults:", error);
  }

  // Check local storage fallback
  const local = getLocalProjects();
  if (local && local.length > 0) {
    return local;
  }

  return DEFAULT_PROJECTS;
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
    createdAt: Date.now(),
  };

  // Immediate local update
  const currentList = getLocalProjects() || [...DEFAULT_PROJECTS];
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
    const docRef = doc(db, COLLECTION_NAME, docId);
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
export async function deleteProject(id: string): Promise<void> {
  // Immediate local update
  const currentList = getLocalProjects() || [...DEFAULT_PROJECTS];
  const updatedList = currentList.filter((p) => p.id !== id);
  setLocalProjects(updatedList);

  // Firestore delete
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn("Could not delete project from Firestore (local delete succeeded):", err);
  }
}
