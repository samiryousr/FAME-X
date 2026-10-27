import { createHash } from "crypto";
import { NextResponse } from "next/server";
import {
  apiError,
  authorizeAdminRequest,
  enforceRateLimit,
} from "@/lib/server/adminApiSecurity";

export const runtime = "nodejs";

function isValidPublicId(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length > 0 &&
    value.length <= 255 &&
    /^[\w./-]+$/.test(value) &&
    !value.startsWith("/") &&
    !value.split("/").some((part) => part === "." || part === "..")
  );
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 4096) {
    return apiError("Request body is too large.", 413);
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
    if (!(await enforceRateLimit(authorization.uid, "cloudinary-delete", 30))) {
      return apiError("Too many requests.", 429);
    }
  } catch (error) {
    console.error("Cloudinary delete rate limiter failed:", error);
    return apiError("Rate limiting is unavailable.", 503);
  }

  let payload: { publicId?: unknown; imageUrl?: unknown };
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return apiError("Invalid JSON body.", 400);
    }
    payload = body as typeof payload;
  } catch {
    return apiError("Invalid JSON body.", 400);
  }

  let targetPublicId = payload.publicId;
  if (!targetPublicId && typeof payload.imageUrl === "string") {
    try {
      const imageUrl = new URL(payload.imageUrl);
      if (
        imageUrl.protocol !== "https:" ||
        imageUrl.hostname !== "res.cloudinary.com"
      ) {
        return apiError("Invalid image URL.", 400);
      }

      const uploadPrefix = `/${cloudName}/image/upload/`;
      const uploadIndex = imageUrl.pathname.indexOf(uploadPrefix);
      if (uploadIndex === -1) return apiError("Invalid image URL.", 400);

      let extractedPublicId = decodeURIComponent(
        imageUrl.pathname.slice(uploadIndex + uploadPrefix.length),
      ).replace(/^v\d+\//, "");
      const extension = extractedPublicId.match(/\.[a-zA-Z0-9]+$/);
      if (extension) {
        extractedPublicId = extractedPublicId.slice(0, -extension[0].length);
      }
      targetPublicId = extractedPublicId;
    } catch {
      return apiError("Invalid image URL.", 400);
    }
  }

  if (!isValidPublicId(targetPublicId)) {
    return apiError("Invalid public ID.", 400);
  }
  const publicId = targetPublicId;

  const timestamp = Math.floor(Date.now() / 1000);
  const signature = createHash("sha1")
    .update(`public_id=${publicId}&timestamp=${timestamp}${apiSecret}`)
    .digest("hex");
  const formData = new FormData();
  formData.append("public_id", publicId);
  formData.append("api_key", apiKey);
  formData.append("timestamp", String(timestamp));
  formData.append("signature", signature);

  let cloudinaryResponse: Response;
  try {
    cloudinaryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/destroy`,
      {
        method: "POST",
        body: formData,
        cache: "no-store",
        signal: AbortSignal.timeout(8000),
      },
    );
  } catch {
    return apiError("Cloudinary is unavailable.", 502);
  }

  if (!cloudinaryResponse.ok) {
    return apiError("Cloudinary request failed.", 502);
  }

  let cloudinaryData: { result?: string };
  try {
    cloudinaryData = (await cloudinaryResponse.json()) as typeof cloudinaryData;
  } catch {
    return apiError("Cloudinary returned an invalid response.", 502);
  }

  if (cloudinaryData.result !== "ok") {
    return apiError("Image deletion failed.", 502);
  }

  return NextResponse.json(
    { success: true, publicId },
    { headers: { "Cache-Control": "no-store" } },
  );
}
