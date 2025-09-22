// app/api/layanan/resolve/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { sbGetLayanan, sbGetLayananDetail } from "@/lib/sosmedboost";
import crypto from "crypto";

const HMAC_SECRET = process.env.HMAC_SECRET ?? "ganti_di_env";

type Body = {
  code?: string;
  category?: string;
  slug?: string;
};

function errMsg(e: unknown) {
  return e instanceof Error ? e.message : "Internal error";
}

function timingSafeEqualHex(aHex: string, bHex: string) {
  const a = Buffer.from(aHex || "", "hex");
  const b = Buffer.from(bHex || "", "hex");
  const len = Math.max(a.length, b.length);
  const pa = Buffer.concat([a, Buffer.alloc(len - a.length)]);
  const pb = Buffer.concat([b, Buffer.alloc(len - b.length)]);
  try {
    return crypto.timingSafeEqual(pa, pb);
  } catch {
    return false;
  }
}

function deny(text: string, status = 403) {
  return new NextResponse(text, {
    status,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

async function verifyRequest(req: NextRequest) {
  const sig = req.headers.get("x-signature")?.toLowerCase();
  const ts = req.headers.get("x-timestamp");
  if (!sig || !ts) return { ok: false as const, reason: "Missing signature" };

  // Skew waktu ±3 menit
  const now = Date.now();
  const tsNum = Number(ts);
  if (!Number.isFinite(tsNum)) return { ok: false as const, reason: "Bad timestamp" };
  if (Math.abs(now - tsNum) > 3 * 60 * 1000) return { ok: false as const, reason: "Stale timestamp" };

  const method = req.method.toUpperCase();
  const path = req.nextUrl.pathname;

  // Baca body sekali untuk payload
  let bodyText = "";
  if (method !== "GET" && method !== "HEAD") {
    try {
      bodyText = await req.text();
    } catch {
      bodyText = "";
    }
  }

  const payload = ts + method + path + bodyText;
  const expected = crypto.createHmac("sha256", HMAC_SECRET).update(payload).digest("hex");
  const ok = timingSafeEqualHex(sig, expected);
  if (!ok) return { ok: false as const, reason: "Invalid signature" };

  return { ok: true as const, bodyText };
}

export async function POST(req: NextRequest) {
  try {
    const ver = await verifyRequest(req);
    if (!ver.ok) return deny("This endpoint requires a signed request.", 403);

    // parse body dari bodyText yang sudah dipakai untuk verifikasi
    let body: Body = {};
    if (ver.bodyText) {
      try {
        body = JSON.parse(ver.bodyText) as Body;
      } catch {
        return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
      }
    }

    const code = (body.code ?? "").trim();
    const result = code ? await sbGetLayananDetail(code, "id") : await sbGetLayanan("id");

    return NextResponse.json({ ok: true, result });
  } catch (e) {
    return NextResponse.json({ ok: false, error: errMsg(e) }, { status: 500 });
  }
}
