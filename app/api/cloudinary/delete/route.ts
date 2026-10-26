import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { publicId, imageUrl } = await request.json();

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    // Resolve publicId if full URL was passed
    let targetPublicId = publicId;
    if (!targetPublicId && imageUrl) {
      try {
        const parts = imageUrl.split("/upload/");
        if (parts.length >= 2) {
          const afterUpload = parts[1];
          // remove optional version v12345/
          const withoutVersion = afterUpload.replace(/^v\d+\//, "");
          const lastDot = withoutVersion.lastIndexOf(".");
          targetPublicId =
            lastDot !== -1 ? withoutVersion.substring(0, lastDot) : withoutVersion;
        }
      } catch (e) {
        console.warn("Could not extract publicId from url:", e);
      }
    }

    if (!targetPublicId) {
      return NextResponse.json(
        { error: "لم يتم تحديد معرف الصورة (publicId)" },
        { status: 400 }
      );
    }

    if (!cloudName) {
      return NextResponse.json(
        { error: "Cloudinary Cloud Name غير موجود في الإعدادات" },
        { status: 400 }
      );
    }

    // Check if API Key and Secret are available for server-side authenticated destroy
    if (!apiKey || !apiSecret) {
      console.warn(
        "CLOUDINARY_API_KEY or CLOUDINARY_API_SECRET is missing. Cannot perform remote destruction on Cloudinary, skipping."
      );
      return NextResponse.json({
        success: false,
        missingCredentials: true,
        message:
          "يرجى إضافة CLOUDINARY_API_KEY و CLOUDINARY_API_SECRET في ملف .env.local لتفعيل حذف الصور نهائياً من سيرفر Cloudinary.",
      });
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    const signatureStr = `public_id=${targetPublicId}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto
      .createHash("sha1")
      .update(signatureStr)
      .digest("hex");

    const formData = new FormData();
    formData.append("public_id", targetPublicId);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp.toString());
    formData.append("signature", signature);

    const cloudinaryRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await cloudinaryRes.json();

    if (data.result === "ok") {
      return NextResponse.json({
        success: true,
        result: data.result,
        publicId: targetPublicId,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          result: data.result,
          error: data.result || "فشل حذف الصورة من Cloudinary",
        },
        { status: 400 }
      );
    }
  } catch (err: any) {
    console.error("Cloudinary delete error:", err);
    return NextResponse.json(
      { error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
