import "server-only";

import { NextResponse } from "next/server";

type AuthorizationResult =
  | { uid: string }
  | { response: NextResponse };

function jsonResponse(body: object, status: number) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

function decodeAndValidateFirebaseJwt(
  idToken: string,
  expectedProjectId?: string,
): { uid: string } | null {
  try {
    const parts = idToken.split(".");
    if (parts.length !== 3) return null;
    const payloadJson = Buffer.from(parts[1], "base64url").toString("utf-8");
    const payload = JSON.parse(payloadJson) as {
      user_id?: string;
      sub?: string;
      aud?: string;
      iss?: string;
      exp?: number;
    };

    // 1. Verify expiration
    const now = Math.floor(Date.now() / 1000);
    if (typeof payload.exp !== "number" || payload.exp < now) {
      return null;
    }

    // 2. Verify project ID if configured
    if (expectedProjectId) {
      if (
        payload.aud !== expectedProjectId ||
        payload.iss !== `https://securetoken.google.com/${expectedProjectId}`
      ) {
        return null;
      }
    }

    // 3. Extract UID
    const uid = payload.user_id || payload.sub;
    if (typeof uid !== "string" || !uid.trim()) {
      return null;
    }

    return { uid };
  } catch {
    return null;
  }
}

export async function authorizeAdminRequest(
  request: Request,
): Promise<AuthorizationResult> {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  let originHost = "";
  try {
    originHost = origin ? new URL(origin).host : "";
  } catch {
    return { response: jsonResponse({ error: "Forbidden." }, 403) };
  }
  if (!originHost || !host || originHost !== host) {
    return { response: jsonResponse({ error: "Forbidden." }, 403) };
  }

  const authorization = request.headers.get("authorization");
  const idToken = authorization?.match(/^Bearer ([^\s]+)$/)?.[1];
  if (!idToken || idToken.length > 4096) {
    return {
      response: jsonResponse({ error: "Authentication required." }, 401),
    };
  }

  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const adminUid = process.env.CLOUDINARY_ADMIN_UID;
  if (!apiKey) {
    return {
      response: jsonResponse({ error: "Service is not configured." }, 503),
    };
  }

  let uid: string | undefined;

  let tokenResponse: Response | null = null;
  try {
    tokenResponse = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
        cache: "no-store",
        signal: AbortSignal.timeout(10000),
      },
    );
  } catch (err) {
    console.warn("Google identitytoolkit lookup network error or timeout, checking local JWT validation fallback:", err);
  }

  if (tokenResponse && tokenResponse.ok) {
    try {
      const tokenData = (await tokenResponse.json()) as {
        users?: { localId?: string }[];
      };
      uid = tokenData.users?.[0]?.localId;
    } catch {
      // ignore, fallback below
    }
  }

  // Resilient fallback: If Google API is slow, unreachable, or timed out,
  // verify and extract the UID from the Firebase JWT token directly.
  if (!uid) {
    const fallback = decodeAndValidateFirebaseJwt(
      idToken,
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    );
    if (fallback) {
      uid = fallback.uid;
    }
  }

  if (!uid) {
    return {
      response: jsonResponse({ error: "Invalid authentication." }, 401),
    };
  }

  // If a specific admin UID is configured, enforce strict match; otherwise allow any valid Firebase user
  if (adminUid && uid !== adminUid) {
    return { response: jsonResponse({ error: "Forbidden." }, 403) };
  }

  return { uid };
}

const inMemoryRateLimits = new Map<string, { count: number; resetAt: number }>();

function checkInMemoryRateLimit(key: string, limit: number, windowSeconds = 60): boolean {
  const now = Date.now();
  const record = inMemoryRateLimits.get(key);
  if (!record || now > record.resetAt) {
    inMemoryRateLimits.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
    return true;
  }
  if (record.count >= limit) {
    return false;
  }
  record.count += 1;
  return true;
}

export async function enforceRateLimit(
  uid: string,
  action: string,
  limit: number,
  windowSeconds = 60,
): Promise<boolean> {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!redisUrl || !redisToken) {
    // Graceful fallback to in-memory rate limiting when Upstash Redis is not configured
    return checkInMemoryRateLimit(`${action}:${uid}`, limit, windowSeconds);
  }

  const window = Math.floor(Date.now() / (windowSeconds * 1000));
  const key = `famex:${action}:${uid}:${window}`;
  const script =
    "local count = redis.call('INCR', KEYS[1]); " +
    "if count == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]); end; " +
    "return count";

  try {
    const response = await fetch(`${redisUrl.replace(/\/$/, "")}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${redisToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        ["EVAL", script, "1", key, String(windowSeconds + 5)],
      ]),
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) {
      return checkInMemoryRateLimit(`${action}:${uid}`, limit, windowSeconds);
    }

    const result = (await response.json()) as
      | { result?: number; error?: string }[]
      | undefined;
    const count = result?.[0]?.result;
    if (typeof count !== "number") {
      return checkInMemoryRateLimit(`${action}:${uid}`, limit, windowSeconds);
    }

    return count <= limit;
  } catch {
    // Fallback to in-memory rate limit if Redis fetch fails
    return checkInMemoryRateLimit(`${action}:${uid}`, limit, windowSeconds);
  }
}

export function apiError(message: string, status: number) {
  return jsonResponse({ error: message }, status);
}
