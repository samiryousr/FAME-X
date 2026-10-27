import { getFirebaseAuth } from "@/lib/firebase";

const MAX_IMAGE_SIZE_BYTES = 4 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/avif",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

/**
 * Uploads an image file directly to Cloudinary using an unsigned upload preset.
 * Returns the secure CDN URL for the uploaded image.
 */
export async function uploadToCloudinary(file: File): Promise<string> {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error("ارفع صورة بصيغة AVIF أو JPEG أو PNG أو WebP فقط.");
  }
  if (file.size === 0 || file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error("حجم الصورة يجب ألا يتجاوز 4 ميجابايت.");
  }

  const user = getFirebaseAuth().currentUser;
  if (!user) {
    throw new Error("يجب تسجيل الدخول قبل رفع الصور.");
  }

  const idToken = await user.getIdToken();
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/cloudinary/upload", {
    method: "POST",
    headers: { Authorization: `Bearer ${idToken}` },
    body: formData,
    cache: "no-store",
  });

  const data = (await response.json()) as {
    secureUrl?: string;
    error?: string;
  };
  if (!response.ok) {
    throw new Error(data.error || `فشل رفع الصورة (${response.status})`);
  }
  if (
    !data.secureUrl ||
    new URL(data.secureUrl).hostname !== "res.cloudinary.com" ||
    !data.secureUrl.startsWith("https://")
  ) {
    throw new Error("استجابة Cloudinary لا تحتوي على رابط صورة آمن.");
  }

  return data.secureUrl;
}

/**
 * Upload multiple files to Cloudinary in parallel.
 */
export async function uploadMultipleToCloudinary(
  files: File[]
): Promise<string[]> {
  const uploadPromises = files.map((file) => uploadToCloudinary(file));
  return Promise.all(uploadPromises);
}

/**
 * Deletes an image from Cloudinary by its URL or publicId.
 */
export async function deleteFromCloudinary(
  imageUrl: string
): Promise<{ success: boolean; message?: string }> {
  const user = getFirebaseAuth().currentUser;
  if (!user) {
    throw new Error("يجب تسجيل الدخول قبل حذف الصور.");
  }

  const idToken = await user.getIdToken();
  const response = await fetch("/api/cloudinary/delete", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ imageUrl }),
    cache: "no-store",
  });
  const data = (await response.json()) as {
    success?: boolean;
    error?: string;
  };
  if (!response.ok || !data.success) {
    throw new Error(data.error || "تعذر حذف الصورة من Cloudinary.");
  }

  return { success: true };
}
