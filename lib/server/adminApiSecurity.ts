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
  if (!apiKey || !adminUid) {
    return {
      response: jsonResponse({ error: "Service is not configured." }, 503),
    };
  }

  let tokenResponse: Response;
  try {
    tokenResponse = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
        cache: "no-store",
        signal: AbortSignal.timeout(5000),
      },
    );
  } catch {
    return {
      response: jsonResponse(
        { error: "Authentication service unavailable." },
        502,
      ),
    };
  }

  if (!tokenResponse.ok) {
    return {
      response: jsonResponse({ error: "Invalid authentication." }, 401),
    };
  }

  let tokenData: { users?: { localId?: string }[] };
  try {
    tokenData = (await tokenResponse.json()) as typeof tokenData;
  } catch {
    return {
      response: jsonResponse(
        { error: "Authentication service returned an invalid response." },
        502,
      ),
    };
  }

  const uid = tokenData.users?.[0]?.localId;
  if (!uid || uid !== adminUid) {
    return { response: jsonResponse({ error: "Forbidden." }, 403) };
  }

  return { uid };
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
    throw new Error("Rate limiting is not configured.");
  }

  const window = Math.floor(Date.now() / (windowSeconds * 1000));
  const key = `famex:${action}:${uid}:${window}`;
  const script =
    "local count = redis.call('INCR', KEYS[1]); " +
    "if count == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]); end; " +
    "return count";
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
    throw new Error("Rate limiter request failed.");
  }

  const result = (await response.json()) as
    | { result?: number; error?: string }[]
    | undefined;
  const count = result?.[0]?.result;
  if (typeof count !== "number") {
    throw new Error("Rate limiter returned an invalid response.");
  }

  return count <= limit;
}

export function apiError(message: string, status: number) {
  return jsonResponse({ error: message }, status);
}
