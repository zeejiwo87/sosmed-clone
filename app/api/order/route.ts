// app/api/order/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { sbGetLayananDetail, sbOrderProduct } from "@/lib/sosmedboost";
import crypto from "crypto";

const HMAC_SECRET = process.env.HMAC_SECRET ?? "ganti_di_env";

/* ---------- Utils ---------- */
type UnknownRecord = Record<string, unknown>;

function isRecord(v: unknown): v is UnknownRecord {
  return !!v && typeof v === "object" && !Array.isArray(v);
}
function toNum(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}
function readNum(o: UnknownRecord, keys: string[]): number | null {
  for (const k of keys) {
    if (k in o) {
      const n = toNum(o[k]);
      if (n !== null) return n;
    }
  }
  return null;
}

function extractArrayCandidates(obj: UnknownRecord): unknown[] {
  const topKeys = ["variants", "services", "items", "list", "data"] as const;
  for (const k of topKeys) {
    const v = obj[k];
    if (Array.isArray(v)) return v;
  }
  const nestRoots = ["data", "response", "result", "payload"] as const;
  for (const root of nestRoots) {
    const nv = obj[root];
    if (isRecord(nv)) {
      const keys = ["variants", "items", "data", "list"] as const;
      for (const k of keys) {
        const arr = nv[k as keyof typeof nv];
        if (Array.isArray(arr)) return arr as unknown[];
      }
    }
  }
  return [];
}
function extractVariants(resp: unknown): UnknownRecord[] {
  if (Array.isArray(resp)) return resp.filter(isRecord);
  if (isRecord(resp)) return extractArrayCandidates(resp).filter(isRecord);
  return [];
}
function resolveProductId(obj: UnknownRecord): string {
  const candidates = ["product_id", "service_id", "id", "code", "value", "key", "slug"];
  for (const k of candidates) {
    const v = obj[k];
    if (typeof v === "string" && v) return v;
    if (v != null) return String(v);
  }
  return "";
}

function errMsg(e: unknown) {
  return e instanceof Error ? e.message : "Internal error";
}

/* ---------- HMAC helpers ---------- */
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

/* ---------- Handler ---------- */
export async function POST(req: NextRequest) {
  try {
    const ver = await verifyRequest(req);
    if (!ver.ok) return deny("This endpoint requires a signed request.", 403);

    let body: UnknownRecord = {};
    if (ver.bodyText) {
      try {
        body = JSON.parse(ver.bodyText) as UnknownRecord;
      } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
      }
    }

    const productIdDirect =
      typeof body.product_id === "string"
        ? body.product_id.trim()
        : body.product_id != null
        ? String(body.product_id)
        : "";

    const code = typeof body.code === "string" ? body.code.trim() : "";
    const data = typeof body.data === "string" ? body.data : "";
    const quantity = toNum(body.quantity);

    const variantIndex =
      typeof body.variantIndex === "number"
        ? body.variantIndex
        : typeof body.variantIndex === "string"
        ? Number(body.variantIndex)
        : NaN;

    if (!data) {
      return NextResponse.json({ error: "data is required" }, { status: 400 });
    }
    if (!quantity || !Number.isFinite(quantity) || quantity <= 0) {
      return NextResponse.json({ error: "quantity must be > 0" }, { status: 400 });
    }

    let product_id = productIdDirect;

    // resolve product_id dari detail(code) jika tidak dikirim langsung
    if (!product_id) {
      if (!code) {
        return NextResponse.json(
          { error: "Either product_id or (code + variantIndex) is required" },
          { status: 400 }
        );
      }
      if (!Number.isFinite(variantIndex) || variantIndex < 0) {
        return NextResponse.json(
          { error: "variantIndex must be a non-negative number" },
          { status: 400 }
        );
      }

      const detailResp = await sbGetLayananDetail(code, "id");
      const variants = extractVariants(detailResp);

      if (variants.length === 0) {
        return NextResponse.json({ error: "No variants found for this code" }, { status: 502 });
      }
      if (variantIndex >= variants.length) {
        return NextResponse.json({ error: "variantIndex out of range" }, { status: 400 });
      }

      const picked = variants[variantIndex];
      product_id = resolveProductId(picked);

      if (!product_id) {
        return NextResponse.json(
          { error: "Unable to resolve product_id from vendor response", sample: picked },
          { status: 502 }
        );
      }

      // Validasi qty vs min/max kalau tersedia
      const min = readNum(picked, ["min", "min_order", "minimum", "start"]);
      const max = readNum(picked, ["max", "max_order", "maximum", "limit"]);
      if (min !== null && quantity < min) {
        return NextResponse.json({ error: `quantity < min (${min})` }, { status: 400 });
      }
      if (max !== null && quantity > max) {
        return NextResponse.json({ error: `quantity > max (${max})` }, { status: 400 });
      }
    }

    // Order ke vendor
    const resp = await sbOrderProduct({
      product_id,
      data,
      quantity,
      lang: "id",
    });

    return NextResponse.json(resp);
  } catch (e: unknown) {
    return NextResponse.json({ error: errMsg(e) }, { status: 500 });
  }
}
