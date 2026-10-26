/**
 * Uploads an image file directly to Cloudinary using an unsigned upload preset.
 * Returns the secure CDN URL for the uploaded image.
 */
export async function uploadToCloudinary(file: File): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Cloudinary credentials missing. Please check NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in .env.local"
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.error?.message || `فشل رفع الصورة (${response.status})`
    );
  }

  const data = await response.json();
  return data.secure_url;
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
  try {
    const response = await fetch("/api/cloudinary/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageUrl }),
    });

    const data = await response.json();
    return data;
  } catch (error: unknown) {
    console.warn("Could not delete image from Cloudinary:", error);
    const err = error as { message?: string } | undefined;
    return { success: false, message: err?.message };
  }
}
