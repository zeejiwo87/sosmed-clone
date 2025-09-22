// app/api/layanan/codes/route.ts
import { NextResponse } from "next/server";
import { sbGetLayanan } from "@/lib/sosmedboost";

type PlainObj = Record<string, unknown>;
type VendorItem = PlainObj;

function isPlainObject(x: unknown): x is PlainObj {
  return typeof x === "object" && x !== null && Object.getPrototypeOf(x) === Object.prototype;
}
function toStr(v: unknown): string {
  return typeof v === "string" ? v : v != null ? String(v) : "";
}
function toInt(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return Math.round(v);
  if (typeof v === "string") {
    const s = v.trim();
    if (!s) return null;
    const digits = s.replace(/[^\d]/g, "");
    if (!digits) return null;
    const n = Number.parseInt(digits, 10);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

/** Ambil array of objects dari struktur apapun */
function extractListDeep(resp: unknown): VendorItem[] {
  // kalau langsung array
  if (Array.isArray(resp)) return resp.filter(isPlainObject);

  // kalau object: cari kunci umum
  if (isPlainObject(resp)) {
    const r = resp as PlainObj;

    // umum: data / services / items / variants / result / results / payload / response / list
    const candidateKeys = [
      "data",
      "services",
      "items",
      "variants",
      "result",
      "results",
      "payload",
      "response",
      "list",
      "layanan",
    ] as const;

    for (const k of candidateKeys) {
      const v = r[k];
      if (Array.isArray(v)) return v.filter(isPlainObject);
    }

    // nested .data.data
    const nestedParents = ["data", "result", "payload", "response"] as const;
    for (const p of nestedParents) {
      const pv = r[p];
      if (isPlainObject(pv)) {
        const arr = (pv as PlainObj).data;
        if (Array.isArray(arr)) return arr.filter(isPlainObject);
      }
    }

    // fallback: cari array of objects pertama
    for (const v of Object.values(r)) {
      if (Array.isArray(v)) {
        const arr = v.filter(isPlainObject);
        if (arr.length) return arr;
      }
      if (isPlainObject(v)) {
        const deeper = extractListDeep(v);
        if (deeper.length) return deeper;
      }
    }
  }

  return [];
}

/** Beberapa panel memaketkan layanan di field 'links' di tiap item platform. Flatten di sini. */
function flattenLinks(list: VendorItem[]): VendorItem[] {
  const out: VendorItem[] = [];
  for (const it of list) {
    const links = isPlainObject(it) ? it["links"] : undefined;
    if (Array.isArray(links)) {
      for (const l of links) {
        if (isPlainObject(l)) out.push(l);
      }
    } else {
      out.push(it);
    }
  }
  return out;
}

function pickTitle(o: VendorItem): string {
  // di dalam links biasanya ada: name/title/text/label
  const candidates: (keyof VendorItem)[] = [
    "name",
    "title",
    "text",
    "label",
    "service",
    "nama",
    "judul",
    "layanan",
  ];
  for (const k of candidates) {
    const s = toStr(o[k]);
    if (s) return s;
  }
  return "";
}
function pickCode(o: VendorItem): string {
  // di dalam links sering ada: code/value/key/slug/id/product_id
  const candidates: (keyof VendorItem)[] = [
    "code",
    "service_code",
    "serviceCode",
    "value",
    "key",
    "slug",
    "id",
    "product_id",
    "service_id",
    "kode",
    "kode_layanan",
    "code_layanan",
    "href", // beberapa panel kasih link siap pakai; tetap kita tampung
    "url",
  ];
  for (const k of candidates) {
    const s = toStr(o[k]);
    if (s) return s;
  }
  return "";
}
function pickMin(o: VendorItem): number | null {
  const candidates: (keyof VendorItem)[] = ["min", "min_order", "minorder", "minimum", "start"];
  for (const k of candidates) {
    const n = toInt(o[k]);
    if (n !== null) return n;
  }
  return null;
}
function pickMax(o: VendorItem): number | null {
  const candidates: (keyof VendorItem)[] = ["max", "max_order", "maxorder", "maximum", "limit"];
  for (const k of candidates) {
    const n = toInt(o[k]);
    if (n !== null) return n;
  }
  return null;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const debug = url.searchParams.get("debug") === "1";

  const raw: unknown = await sbGetLayanan("id");

  // level pertama
  const level1 = extractListDeep(raw);
  // flatten 'links' jika ada
  const flat = flattenLinks(level1);

  const simplified = flat.map((it) => ({
    title: pickTitle(it),
    code: pickCode(it),
    min: pickMin(it),
    max: pickMax(it),
  }));

  const debugInfo =
    debug
      ? {
          level1SampleKeys: level1.slice(0, 3).map((o) => (isPlainObject(o) ? Object.keys(o) : [])),
          flatSampleKeys: flat.slice(0, 5).map((o) => (isPlainObject(o) ? Object.keys(o) : [])),
          topLevelType: Array.isArray(raw) ? "array" : typeof raw,
          topLevelKeys: isPlainObject(raw) ? Object.keys(raw) : [],
        }
      : undefined;

  return NextResponse.json({
    count: simplified.length,
    items: simplified,
    ...(debugInfo ? { debug: debugInfo } : {}),
  });
}
