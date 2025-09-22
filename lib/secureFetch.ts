// lib/secureFetch.ts
type HttpMethod = "GET" | "POST";

export class SecureApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "SecureApiError";
    this.status = status;
  }
}

function stableStringify(input: unknown): string {
  if (input === null || typeof input !== "object") return JSON.stringify(input);
  if (Array.isArray(input)) return `[${input.map(stableStringify).join(",")}]`;
  const obj = input as Record<string, unknown>;
  const keys = Object.keys(obj).sort();
  return `{${keys.map((k) => JSON.stringify(k) + ":" + stableStringify(obj[k])).join(",")}}`;
}

function toCanonicalPath(path: string): string {
  try {
    const url = new URL(
      path,
      typeof window !== "undefined" ? window.location.origin : "http://localhost"
    );
    return url.pathname;
  } catch {
    return path.startsWith("/") ? path : `/${path}`;
  }
}

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error("Request timeout")), ms);
    p.then(
      (v) => { clearTimeout(t); resolve(v); },
      (e) => { clearTimeout(t); reject(e); }
    );
  });
}

export async function secureFetch(
  path: string,
  method: HttpMethod = "GET",
  body?: unknown,
  // Dev only: pakai NEXT_PUBLIC_HMAC_DEV_SECRET
  secret = process.env.NEXT_PUBLIC_HMAC_DEV_SECRET || "dev_only_secret_change_me",
  timeoutMs = 12000
): Promise<Response> {
  const timestamp = Date.now().toString();
  const canonicalPath = toCanonicalPath(path);
  const payload = timestamp + method + canonicalPath + (body ? stableStringify(body) : "");

  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sigBuffer = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  const signature = Array.from(new Uint8Array(sigBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const headers: Record<string, string> = {
    "x-signature": signature,
    "x-timestamp": timestamp,
  };
  if (method === "POST") headers["Content-Type"] = "application/json";

  const res = await withTimeout(fetch(canonicalPath, {
    method,
    headers,
    body: method === "POST" && body ? stableStringify(body) : undefined,
    cache: "no-store",
    credentials: "include", // ✅ penting: kirim cookie/sesi (NextAuth)
  }), timeoutMs);

  if (!res.ok) {
    let msg = "";
    try { msg = (await res.text())?.slice(0, 200) || ""; } catch {}
    throw new SecureApiError(msg || `HTTP ${res.status}`, res.status);
  }
  return res;
}
