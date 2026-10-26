import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export type TestimonialStatus = "pending" | "approved";

export interface TestimonialItem {
  id: string;
  name: string;
  quote: string;
  rating: number;
  status: TestimonialStatus;
  role?: string;
  image?: string;
  createdAt: number;
}

const COLLECTION_NAME = "testimonials";

function toTestimonial(id: string, data: Record<string, unknown>): TestimonialItem {
  const createdAt = data.createdAt as { toMillis?: () => number } | number | undefined;

  let createdMillis = 0;
  if (typeof createdAt === "number") {
    createdMillis = createdAt;
  } else if (createdAt && typeof createdAt.toMillis === "function") {
    createdMillis = createdAt.toMillis();
  }

  return {
    id,
    name: typeof data.name === "string" ? data.name : "",
    quote: typeof data.quote === "string" ? data.quote : "",
    rating:
      typeof data.rating === "number" && Number.isInteger(data.rating)
        ? Math.min(5, Math.max(1, data.rating))
        : 5,
    status: data.status === "approved" ? "approved" : "pending",
    role: typeof data.role === "string" ? data.role : "",
    image: typeof data.image === "string" ? data.image : "",
    createdAt: createdMillis,
  };
}

async function getTestimonials(): Promise<TestimonialItem[]> {
  const snapshot = await getDocs(collection(db, COLLECTION_NAME));
  return snapshot.docs
    .map((testimonialDoc) => toTestimonial(testimonialDoc.id, testimonialDoc.data()))
    .sort((first, second) => second.createdAt - first.createdAt);
}

export async function getPublishedTestimonials(): Promise<TestimonialItem[]> {
  const snapshot = await getDocs(
    query(collection(db, COLLECTION_NAME), where("status", "==", "approved")),
  );

  return snapshot.docs
    .map((testimonialDoc) => toTestimonial(testimonialDoc.id, testimonialDoc.data()))
    .sort((first, second) => second.createdAt - first.createdAt);
}

export async function getAllTestimonials(): Promise<TestimonialItem[]> {
  return getTestimonials();
}

export async function submitTestimonial(input: {
  name: string;
  quote: string;
  rating: number;
}): Promise<void> {
  const name = input.name.trim();
  const quote = input.quote.trim();

  if (name.length < 2 || name.length > 80) {
    throw new Error("Name must contain between 2 and 80 characters.");
  }
  if (quote.length < 5 || quote.length > 1000) {
    throw new Error("Review must contain between 5 and 1000 characters.");
  }
  if (!Number.isInteger(input.rating) || input.rating < 1 || input.rating > 5) {
    throw new Error("Rating must be between 1 and 5.");
  }

  await addDoc(collection(db, COLLECTION_NAME), {
    name,
    quote,
    rating: input.rating,
    status: "pending",
    createdAt: serverTimestamp(),
  });
}

export async function setTestimonialStatus(
  id: string,
  status: TestimonialStatus,
): Promise<void> {
  await updateDoc(doc(db, COLLECTION_NAME, id), { status });
}

export async function deleteTestimonial(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION_NAME, id));
}

export async function saveTestimonial(input: {
  id?: string;
  name: string;
  quote: string;
  rating: number;
  status?: TestimonialStatus;
  role?: string;
  image?: string;
}): Promise<string> {
  const name = input.name.trim();
  const quote = input.quote.trim();
  const role = (input.role || "").trim();
  const image = (input.image || "").trim();
  const rating = Number(input.rating) || 5;
  const status: TestimonialStatus = input.status || "approved";

  if (!name) {
    throw new Error("يرجى كتابة اسم العميل.");
  }
  if (!quote) {
    throw new Error("يرجى كتابة نص رأي العميل.");
  }

  const payload: Record<string, unknown> = {
    name,
    quote,
    rating: Math.min(5, Math.max(1, rating)),
    status,
    role,
    image,
    updatedAt: serverTimestamp(),
  };

  if (input.id && input.id.trim()) {
    const docRef = doc(db, COLLECTION_NAME, input.id.trim());
    await updateDoc(docRef, payload);
    return input.id.trim();
  } else {
    payload.createdAt = serverTimestamp();
    const docRef = await addDoc(collection(db, COLLECTION_NAME), payload);
    return docRef.id;
  }
}
