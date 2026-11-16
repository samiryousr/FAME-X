import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  serverTimestamp,
  type DocumentData,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase";

export interface ContactSettings {
  whatsappNumber: string;
  email: string;
  facebookUrl: string;
  instagramUrl: string;
  linkedinUrl?: string;
  updatedAt?: number;
}

export const DEFAULT_CONTACT_SETTINGS: ContactSettings = {
  whatsappNumber: "",
  email: "hello@famex.dev",
  facebookUrl: "https://facebook.com",
  instagramUrl: "https://instagram.com",
  linkedinUrl: "",
};

const SETTINGS_COLLECTION = "settings";
const CONTACT_DOC_ID = "contact";
const LOCAL_STORAGE_KEY = "famex_contact_settings";

export function cleanPhoneNumber(phone?: string): string {
  if (!phone) return "";
  return phone.replace(/[^0-9]/g, "");
}

export function getLocalContactSettings(): ContactSettings | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ContactSettings;
  } catch {
    return null;
  }
}

export function setLocalContactSettings(settings: ContactSettings): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
    window.dispatchEvent(
      new CustomEvent("famex_settings_updated", { detail: settings })
    );
    window.dispatchEvent(
      new StorageEvent("storage", { key: LOCAL_STORAGE_KEY })
    );
  } catch {
    // Ignore localStorage write error
  }
}

/**
 * Fetch contact settings from Firestore with local storage fallback.
 */
export async function getContactSettings(): Promise<ContactSettings> {
  try {
    const docRef = doc(getFirebaseDb(), SETTINGS_COLLECTION, CONTACT_DOC_ID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as DocumentData;
      const settings: ContactSettings = {
        whatsappNumber: data.whatsappNumber || "",
        email: data.email || DEFAULT_CONTACT_SETTINGS.email,
        facebookUrl: data.facebookUrl || DEFAULT_CONTACT_SETTINGS.facebookUrl,
        instagramUrl: data.instagramUrl || DEFAULT_CONTACT_SETTINGS.instagramUrl,
        linkedinUrl: data.linkedinUrl || "",
        updatedAt: data.updatedAt?.toMillis ? data.updatedAt.toMillis() : Date.now(),
      };
      setLocalContactSettings(settings);
      return settings;
    }

    const local = getLocalContactSettings();
    return local || DEFAULT_CONTACT_SETTINGS;
  } catch (err) {
    console.warn("Could not fetch contact settings from Firestore, using local cache:", err);
    return getLocalContactSettings() || DEFAULT_CONTACT_SETTINGS;
  }
}

/**
 * Save contact settings to Firestore & localStorage.
 */
export async function saveContactSettings(
  settings: Partial<ContactSettings>
): Promise<ContactSettings> {
  const merged: ContactSettings = {
    whatsappNumber: settings.whatsappNumber?.trim() || "",
    email: settings.email?.trim() || DEFAULT_CONTACT_SETTINGS.email,
    facebookUrl: settings.facebookUrl?.trim() || DEFAULT_CONTACT_SETTINGS.facebookUrl,
    instagramUrl: settings.instagramUrl?.trim() || DEFAULT_CONTACT_SETTINGS.instagramUrl,
    linkedinUrl: settings.linkedinUrl?.trim() || "",
    updatedAt: Date.now(),
  };

  // Immediate local update
  setLocalContactSettings(merged);

  // Firestore update
  try {
    const docRef = doc(getFirebaseDb(), SETTINGS_COLLECTION, CONTACT_DOC_ID);
    await setDoc(
      docRef,
      {
        ...merged,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (err) {
    console.warn("Could not save contact settings to Firestore (local save succeeded):", err);
  }

  return merged;
}

/**
 * Real-time subscription to contact settings from Firestore.
 */
export function subscribeToContactSettings(
  callback: (settings: ContactSettings) => void
): () => void {
  // Fast path: cached local settings
  const local = getLocalContactSettings();
  if (local) {
    callback(local);
  } else {
    callback(DEFAULT_CONTACT_SETTINGS);
  }

  // Parallel fetch to ensure fresh data
  getContactSettings()
    .then((fresh) => callback(fresh))
    .catch(() => {});

  try {
    const docRef = doc(getFirebaseDb(), SETTINGS_COLLECTION, CONTACT_DOC_ID);
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as DocumentData;
          const settings: ContactSettings = {
            whatsappNumber: data.whatsappNumber || "",
            email: data.email || DEFAULT_CONTACT_SETTINGS.email,
            facebookUrl: data.facebookUrl || DEFAULT_CONTACT_SETTINGS.facebookUrl,
            instagramUrl: data.instagramUrl || DEFAULT_CONTACT_SETTINGS.instagramUrl,
            linkedinUrl: data.linkedinUrl || "",
            updatedAt: data.updatedAt?.toMillis ? data.updatedAt.toMillis() : Date.now(),
          };
          setLocalContactSettings(settings);
          callback(settings);
        }
      },
      (err) => {
        console.warn("Firestore contact settings subscription error:", err);
      }
    );

    return unsubscribe;
  } catch (err) {
    console.warn("Could not setup Firestore contact settings subscription:", err);
    return () => {};
  }
}
