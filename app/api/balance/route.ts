// app/api/balance/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { sbGetBalance } from "@/lib/sosmedboost";
import crypto from "crypto";

const HMAC_SECRET = process.env.HMAC_SECRET ?? "ganti_di_env";

// === Helpers ===
function errMsg(e: unknown) {
  return e instanceof Error ? e.message : "Internal error";
}

function timingSafeEqualHex(aHex: string, bHex: string) {
  const a = Buffer.from(aHex, "hex");
  const b = Buffer.from(bHex, "hex");
  // Samakan panjang untuk menghindari early-exit timing
  const len = Math.max(a.length, b.length);
  const pa = Buffer.concat([a, Buffer.alloc(len - a.length)]);
  const pb = Buffer.concat([b, Buffer.alloc(len - b.length)]);
  return crypto.timingSafeEqual(pa, pb);
}

function badRequest(text: string, status = 403) {
  return new NextResponse(text, {
    status,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

async function verifyRequest(req: NextRequest) {
  const sig = req.headers.get("x-signature")?.toLowerCase();
  const ts = req.headers.get("x-timestamp");

  if (!sig || !ts) return { ok: false as const, reason: "Missing signature" };

  // Cek skew waktu (±3 menit)
  const now = Date.now();
  const tsNum = Number(ts);
  if (!Number.isFinite(tsNum)) return { ok: false as const, reason: "Bad timestamp" };
  const skew = Math.abs(now - tsNum);
  if (skew > 3 * 60 * 1000) {
    return { ok: false as const, reason: "Stale timestamp" };
  }

  // Payload harus cocok dengan client secureFetch:
  // timestamp + method + path + (bodyJSON || "")
  const method = req.method.toUpperCase();
  const path = req.nextUrl.pathname; // penting: gunakan path saja, tanpa origin/query
  let bodyStr = "";

  if (method !== "GET" && method !== "HEAD") {
    try {
      const raw = await req.text(); // harus dibaca sekali
      bodyStr = raw || "";
      // Re-wrap request text untuk downstream? Tidak perlu karena kita tidak teruskan body.
    } catch {
      bodyStr = "";
    }
  }

  const payload = ts + method + path + bodyStr;

  const expected = crypto.createHmac("sha256", HMAC_SECRET).update(payload).digest("hex");

  const ok = timingSafeEqualHex(sig, expected);
  if (!ok) return { ok: false as const, reason: "Invalid signature" };

  return { ok: true as const };
}

// === Handler ===
export async function GET(req: NextRequest) {
  try {
    const ver = await verifyRequest(req);
    if (!ver.ok) {
      return badRequest("This endpoint requires a signed request.", 403);
    }

    const data = await sbGetBalance("id");
    return NextResponse.json(data);
  } catch (e: unknown) {
    return NextResponse.json({ error: errMsg(e) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const ver = await verifyRequest(req);
    if (!ver.ok) {
      return badRequest("This endpoint requires a signed request.", 403);
    }

    // contoh POST jika nanti butuh body:
    // const body = await req.json();

    const data = await sbGetBalance("id");
    return NextResponse.json(data);
  } catch (e: unknown) {
    return NextResponse.json({ error: errMsg(e) }, { status: 500 });
  }
}
