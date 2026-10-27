import { createHash } from "crypto";
import { NextResponse } from "next/server";
import {
  apiError,
  authorizeAdminRequest,
  enforceRateLimit,
} from "@/lib/server/adminApiSecurity";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 4 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/avif",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_FILE_SIZE + 128 * 1024) {
    return apiError("Image is too large.", 413);
  }

  const authorization = await authorizeAdminRequest(request);
  if ("response" in authorization) return authorization.response;

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    return apiError("Service is not configured.", 503);
  }

  try {
    if (!(await enforceRateLimit(authorization.uid, "cloudinary-upload", 30))) {
      return apiError("Too many requests.", 429);
    }
  } catch (error) {
    console.error("Cloudinary upload rate limiter failed:", error);
    return apiError("Rate limiting is unavailable.", 503);
  }

  let file: FormDataEntryValue | null;
  try {
    file = (await request.formData()).get("file");
  } catch {
    return apiError("Invalid multipart request.", 400);
  }
  if (
    typeof File === "undefined" ||
    !(file instanceof File) ||
    file.size === 0 ||
    file.size > MAX_FILE_SIZE ||
    !ALLOWED_IMAGE_TYPES.has(file.type)
  ) {
    return apiError("Unsupported image or image size.", 400);
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = "famex";
  const signature = createHash("sha1")
    .update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`)
    .digest("hex");
  const formData = new FormData();
  formData.append("file", file, file.name);
  formData.append("folder", folder);
  formData.append("api_key", apiKey);
  formData.append("timestamp", String(timestamp));
  formData.append("signature", signature);

  let cloudinaryResponse: Response;
  try {
    cloudinaryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/upload`,
      {
        method: "POST",
        body: formData,
        cache: "no-store",
        signal: AbortSignal.timeout(15000),
      },
    );
  } catch {
    return apiError("Cloudinary is unavailable.", 502);
  }

  if (!cloudinaryResponse.ok) {
    return apiError("Cloudinary upload failed.", 502);
  }

  let uploadedImage: { secure_url?: string };
  try {
    uploadedImage = (await cloudinaryResponse.json()) as typeof uploadedImage;
  } catch {
    return apiError("Cloudinary returned an invalid response.", 502);
  }

  if (!uploadedImage.secure_url) {
    return apiError("Cloudinary returned no image URL.", 502);
  }

  let secureUrl: URL;
  try {
    secureUrl = new URL(uploadedImage.secure_url);
  } catch {
    return apiError("Cloudinary returned an invalid image URL.", 502);
  }
  if (
    secureUrl.protocol !== "https:" ||
    secureUrl.hostname !== "res.cloudinary.com" ||
    !secureUrl.pathname.startsWith(`/${cloudName}/image/upload/`)
  ) {
    return apiError("Cloudinary returned an unexpected image URL.", 502);
  }

  return NextResponse.json(
    { secureUrl: secureUrl.toString() },
    { headers: { "Cache-Control": "no-store" } },
  );
}
