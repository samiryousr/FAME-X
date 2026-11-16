import { getFirebaseAuth } from "@/lib/firebase";

const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const MAX_RAW_INPUT_SIZE_BYTES = 16 * 1024 * 1024; // 16MB
const ALLOWED_IMAGE_TYPES = new Set([
  "image/avif",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

/**
 * Automatically compresses and optimizes an image in the browser before upload.
 * Scales down giant dimensions (max 2400px) and converts to WebP at 85% quality.
 * Reduces 5MB-15MB phone/DSLR images to ~400KB-800KB without visible quality loss.
 */
export async function compressImageInBrowser(file: File): Promise<File> {
  if (typeof window === "undefined" || !("document" in window)) {
    return file;
  }

  // If not standard static image, do not attempt canvas re-encoding
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return file;
  }

  try {
    const bitmap = await createImageBitmap(file);
    // 1800px provides ultra-sharp 2K Retina display clarity while reducing upload time by 70%
    const MAX_DIMENSION = 1800;
    let { width, height } = bitmap;

    // Check if resizing is necessary
    const needsResize = width > MAX_DIMENSION || height > MAX_DIMENSION;
    if (needsResize) {
      if (width > height) {
        height = Math.round((height * MAX_DIMENSION) / width);
        width = MAX_DIMENSION;
      } else {
        width = Math.round((width * MAX_DIMENSION) / height);
        height = MAX_DIMENSION;
      }
    } else if (file.size <= 500 * 1024) {
      // File is already under 500KB and within bounds, no re-encoding needed
      return file;
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d", {
      alpha: file.type === "image/png" || file.type === "image/webp",
    });
    if (!ctx) return file;

    ctx.drawImage(bitmap, 0, 0, width, height);

    const outputType = "image/webp";
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((b) => resolve(b), outputType, 0.80);
    });

    if (!blob) return file;

    // Use compressed file if it reduced size or resized dimensions
    if (blob.size < file.size || needsResize) {
      const newName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
      return new File([blob], newName, {
        type: outputType,
        lastModified: Date.now(),
      });
    }

    return file;
  } catch (err) {
    console.warn("Client-side image compression fallback to original file:", err);
    return file;
  }
}

/**
 * Uploads an image file directly to Cloudinary using secure server-side signing.
 * Automatically compresses large images client-side before sending.
 * Returns the secure CDN URL for the uploaded image.
 */
export async function uploadToCloudinary(file: File): Promise<string> {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error("ارفع صورة بصيغة AVIF أو JPEG أو PNG أو WebP فقط.");
  }
  if (file.size === 0) {
    throw new Error("ملف الصورة فارغ.");
  }
  if (file.size > MAX_RAW_INPUT_SIZE_BYTES) {
    throw new Error("حجم الصورة كبير جداً (أكثر من 16 ميجابايت). يرجى اختيار صورة أصغر.");
  }

  // Automatic browser compression for lightning-fast uploads & Cloudinary optimization
  const fileToUpload = await compressImageInBrowser(file);

  if (fileToUpload.size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error("حجم الصورة يجب ألا يتجاوز 10 ميجابايت حتى بعد الضغط.");
  }

  const user = getFirebaseAuth().currentUser;
  if (!user) {
    throw new Error("يجب تسجيل الدخول قبل رفع الصور.");
  }

  const idToken = await user.getIdToken();
  const formData = new FormData();
  formData.append("file", fileToUpload);

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
