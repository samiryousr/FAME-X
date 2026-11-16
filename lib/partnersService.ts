import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  type DocumentData,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase";

export interface Partner {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl?: string;
  order: number;
  showOnHome: boolean;
  createdAt?: number;
  updatedAt?: number;
}

const PARTNERS_COLLECTION = "partners";
const LOCAL_STORAGE_KEY = "famex_partners_cache";

export function getLocalPartnersCache(): Partner[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Partner[];
  } catch {
    return [];
  }
}

export function setLocalPartnersCache(partners: Partner[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(partners));
    window.dispatchEvent(
      new CustomEvent("famex_partners_updated", { detail: partners })
    );
  } catch {
    // Ignore storage write error
  }
}

function mapDocToPartner(id: string, data: DocumentData): Partner {
  return {
    id,
    name: data.name || "",
    logoUrl: data.logoUrl || "",
    websiteUrl: data.websiteUrl || "",
    order: typeof data.order === "number" ? data.order : 0,
    showOnHome: data.showOnHome !== false,
    createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : Date.now(),
    updatedAt: data.updatedAt?.toMillis ? data.updatedAt.toMillis() : Date.now(),
  };
}

/**
 * Fetch all partners from Firestore with local cache fallback.
 */
export async function getAllPartners(): Promise<Partner[]> {
  try {
    const colRef = collection(getFirebaseDb(), PARTNERS_COLLECTION);
    const q = query(colRef, orderBy("order", "asc"));
    const snap = await getDocs(q);

    const partners = snap.docs.map((d) => mapDocToPartner(d.id, d.data()));
    setLocalPartnersCache(partners);
    return partners;
  } catch (err) {
    console.warn("Could not fetch partners from Firestore, using cache:", err);
    return getLocalPartnersCache();
  }
}

/**
 * Create or update a partner in Firestore.
 */
export async function savePartner(
  partner: Omit<Partner, "id"> & { id?: string }
): Promise<string> {
  const colRef = collection(getFirebaseDb(), PARTNERS_COLLECTION);
  const targetDoc = partner.id ? doc(colRef, partner.id) : doc(colRef);

  const payload = {
    name: partner.name.trim(),
    logoUrl: partner.logoUrl.trim(),
    websiteUrl: partner.websiteUrl?.trim() || "",
    order: typeof partner.order === "number" ? partner.order : 0,
    showOnHome: Boolean(partner.showOnHome),
    updatedAt: serverTimestamp(),
    ...(partner.id ? {} : { createdAt: serverTimestamp() }),
  };

  await setDoc(targetDoc, payload, { merge: true });

  // Update local cache optimistically
  const cached = getLocalPartnersCache();
  const partnerId = targetDoc.id;
  const updatedItem: Partner = {
    id: partnerId,
    name: payload.name,
    logoUrl: payload.logoUrl,
    websiteUrl: payload.websiteUrl,
    order: payload.order,
    showOnHome: payload.showOnHome,
    updatedAt: Date.now(),
    createdAt: Date.now(),
  };

  const existingIndex = cached.findIndex((p) => p.id === partnerId);
  let updatedList: Partner[];
  if (existingIndex >= 0) {
    updatedList = [...cached];
    updatedList[existingIndex] = { ...cached[existingIndex], ...updatedItem };
  } else {
    updatedList = [...cached, updatedItem];
  }
  updatedList.sort((a, b) => a.order - b.order);
  setLocalPartnersCache(updatedList);

  return partnerId;
}

/**
 * Toggle partner visibility on homepage.
 */
export async function togglePartnerVisibility(
  id: string,
  showOnHome: boolean
): Promise<void> {
  const docRef = doc(getFirebaseDb(), PARTNERS_COLLECTION, id);
  await setDoc(
    docRef,
    {
      showOnHome,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  const cached = getLocalPartnersCache();
  const updatedList = cached.map((p) =>
    p.id === id ? { ...p, showOnHome } : p
  );
  setLocalPartnersCache(updatedList);
}

/**
 * Delete a partner from Firestore.
 */
export async function deletePartner(id: string): Promise<void> {
  const docRef = doc(getFirebaseDb(), PARTNERS_COLLECTION, id);
  await deleteDoc(docRef);

  const cached = getLocalPartnersCache();
  const updatedList = cached.filter((p) => p.id !== id);
  setLocalPartnersCache(updatedList);
}

/**
 * Real-time subscription to partners list.
 */
export function subscribeToPartners(
  callback: (partners: Partner[]) => void,
  onlyVisible = false
): () => void {
  // Fast path from local cache
  const cached = getLocalPartnersCache();
  if (cached.length > 0) {
    callback(onlyVisible ? cached.filter((p) => p.showOnHome) : cached);
  }

  // Parallel fresh fetch
  getAllPartners()
    .then((fresh) => {
      callback(onlyVisible ? fresh.filter((p) => p.showOnHome) : fresh);
    })
    .catch(() => {});

  try {
    const colRef = collection(getFirebaseDb(), PARTNERS_COLLECTION);
    const q = query(colRef, orderBy("order", "asc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((d) => mapDocToPartner(d.id, d.data()));
        setLocalPartnersCache(list);
        callback(onlyVisible ? list.filter((p) => p.showOnHome) : list);
      },
      (err) => {
        console.warn("Firestore partners subscription error:", err);
      }
    );

    return unsubscribe;
  } catch (err) {
    console.warn("Could not setup Firestore partners subscription:", err);
    return () => {};
  }
}
