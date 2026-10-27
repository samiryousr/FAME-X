import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const isDevelopment = process.env.NODE_ENV !== "production";

  // إعدادات CSP متوازنة تسمح بعمل Next.js (Hydration & Inline Scripts) مع دعم Firebase و Cloudinary و Vercel
  const cspDirectives = [
    "default-src 'self'",
    // السماح بالسكربتات الداخلية ومصادر Firebase و Vercel Analytics لتفادي تعليق شاشة التحميل
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.firebaseapp.com https://*.googleapis.com https://apis.google.com https://va.vercel-scripts.com",
    "script-src-elem 'self' 'unsafe-inline' https://*.firebaseapp.com https://*.googleapis.com https://apis.google.com https://va.vercel-scripts.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob: https://res.cloudinary.com https://*.cloudinary.com https://firebasestorage.googleapis.com https://*.googleusercontent.com https://images.unsplash.com",
    "font-src 'self' data: https://fonts.gstatic.com",
    `connect-src 'self' https://*.googleapis.com https://*.firebaseio.com wss://*.firebaseio.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://firestore.googleapis.com https://api.cloudinary.com https://*.cloudinary.com https://*.vercel.app https://vitals.vercel-insights.com${isDevelopment ? " http://localhost:* ws://localhost:*" : ""}`,
    "frame-src 'self' https://*.firebaseapp.com https://*.google.com",
    "media-src 'self' data: blob: https://res.cloudinary.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    ...(isDevelopment ? [] : ["upgrade-insecure-requests"]),
  ];

  const contentSecurityPolicy = cspDirectives.join("; ");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("Content-Security-Policy", contentSecurityPolicy);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  // إضافة ترويسات الأمان (Security Headers)
  response.headers.set("Content-Security-Policy", contentSecurityPolicy);
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  if (!isDevelopment) {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains",
    );
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * استثناء الملفات الثابتة والصور من الـ Middleware لزيادة السرعة
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
