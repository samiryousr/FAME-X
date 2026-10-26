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

/**
 * Fetch all projects from Firestore.
 * If the collection is empty, returns DEFAULT_PROJECTS.
 */
export async function getAllProjects(): Promise<ProjectItem[]> {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy("order", "asc"));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return DEFAULT_PROJECTS;
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
        createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : Date.now(),
      });
    });

    return projects;
  } catch (error) {
    console.warn("Could not fetch projects from Firestore, using defaults:", error);
    return DEFAULT_PROJECTS;
  }
}

/**
 * Fetch projects marked to show on Home.
 */
export async function getHomeProjects(): Promise<ProjectItem[]> {
  const all = await getAllProjects();
  return all.filter((p) => p.showOnHome);
}

/**
 * Add or overwrite a project.
 */
export async function saveProject(
  project: Omit<ProjectItem, "id"> & { id?: string }
): Promise<string> {
  const docId =
    project.id && project.id.trim()
      ? project.id.trim()
      : `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  const docRef = doc(db, COLLECTION_NAME, docId);
  const existing = await getDoc(docRef);

  const payload: Record<string, any> = {
    title: project.title,
    label: project.label || "",
    description: project.description || "",
    previewImage: project.previewImage || (project.images?.[0] ?? ""),
    images: project.images || [],
    url: project.url || "",
    showOnHome: Boolean(project.showOnHome),
    order: Number(project.order) || 1,
  };

  if (project.demoScreen) {
    payload.demoScreen = project.demoScreen;
  }

  if (existing.exists()) {
    payload.updatedAt = serverTimestamp();
    await updateDoc(docRef, payload);
  } else {
    payload.createdAt = serverTimestamp();
    await setDoc(docRef, payload);
  }

  return docId;
}

/**
 * Delete a project.
 */
export async function deleteProject(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}
