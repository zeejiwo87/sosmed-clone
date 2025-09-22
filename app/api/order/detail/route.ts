// app/api/order/detail/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { sbGetOrderDetail } from "@/lib/sosmedboost";
import crypto from "crypto";

const HMAC_SECRET = process.env.HMAC_SECRET ?? "ganti_di_env";

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

  const now = Date.now();
  const tsNum = Number(ts);
  if (!Number.isFinite(tsNum)) return { ok: false as const, reason: "Bad timestamp" };
  if (Math.abs(now - tsNum) > 3 * 60 * 1000) return { ok: false as const, reason: "Stale timestamp" };

  const method = req.method.toUpperCase();
  const path = req.nextUrl.pathname;

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

    let trx = "";
    if (ver.bodyText) {
      try {
        const body = JSON.parse(ver.bodyText) as { trx?: unknown };
        trx = typeof body?.trx === "string" ? body.trx : "";
      } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
      }
    }
    if (!trx) {
      return NextResponse.json({ error: "trx is required" }, { status: 400 });
    }

    const data = await sbGetOrderDetail(trx, "id");
    return NextResponse.json(data);
  } catch (e: unknown) {
    return NextResponse.json({ error: errMsg(e) }, { status: 500 });
  }
}
