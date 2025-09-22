// ServiceOrderClient (FINAL) — pakai secureFetch untuk semua request API
"use client";

import { useEffect, useMemo, useState, type ReactNode, useCallback } from "react";
import { notFound, useRouter } from "next/navigation";
import Link from "next/link";
import { secureFetch } from "@/lib/secureFetch";

/* ================== Types ================== */
type LinkItem = { category?: unknown; title?: unknown };
type PlatformBlock = { platform?: unknown; links?: unknown };
type VendorListResult = { data?: unknown; status?: unknown; [k: string]: unknown };
type VendorDetailResult = unknown;

type VariantView = {
  id: string;
  name: string;
  min: number;
  max: number;
  pricePerK?: number; // opsional
  idx: number;        // index dalam array mentah → dipakai untuk /api/order
};

/** Bentuk umum baris varian dari berbagai vendor, TANPA any */
type RawVariant = {
  product_id?: unknown;
  id?: unknown;
  service_id?: unknown;
  serviceId?: unknown;
  productId?: unknown;
  kode?: unknown;
  code?: unknown;

  name?: unknown;
  title?: unknown;
  service?: unknown;

  min?: unknown;
  min_order?: unknown;
  start?: unknown;

  max?: unknown;
  max_order?: unknown;
  limit?: unknown;

  harga?: unknown;
  rate?: unknown;
  price_per_1000?: unknown;
  price_per_k?: unknown;
  price?: unknown;
  cost?: unknown;
  idr?: unknown;

  [k: string]: unknown;
};

/* ================= Utils umum ================== */
const norm = (s: string) =>
  s.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9 ]+/g, " ").trim();

function asArray<T = unknown>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}
function asString(v: unknown): string {
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  return "";
}
function toInt(v: unknown): number {
  if (typeof v === "number" && Number.isFinite(v)) return Math.round(v);
  if (typeof v === "string") {
    const s = v.trim();
    if (!s) return 0;
    const digitsOnly = s.replace(/[^\d]/g, "");
    if (!digitsOnly) return 0;
    const n = parseInt(digitsOnly, 10);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}
function pickPricePerK(o: Record<string, unknown>): number {
  const direct =
    o.harga ?? o.rate ?? o.price_per_1000 ?? o.price_per_k ?? o.price ?? o.cost ?? o.idr;
  let n = toInt(direct);
  if (n) return n;
  for (const [k, v] of Object.entries(o)) {
    if (/harga|price|rate/i.test(k)) {
      n = toInt(v);
      if (n) return n;
    }
  }
  return 0;
}
const idr = (n: number) => "Rp " + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const PLATFORM_ALIASES: Record<string, string[]> = {
  tiktok: ["tiktok", "tik tok", "tt"],
  instagram: ["instagram", "insta", "ig"],
  youtube: ["youtube", "yt", "you tube"],
  facebook: ["facebook", "fb"],
  telegram: ["telegram", "tg"],
  other: ["other", "lain"],
};
function keywordsForSlug(slug: string): string[] {
  const s = slug.toLowerCase();
  if (s.includes("vt-like")) return ["vt", "like"];
  if (s.includes("vt-viewers")) return ["vt", "view", "views", "viewers", "penonton"];
  if (s.includes("vt-favorit")) return ["vt", "favorit", "favorite", "fav", "save", "bookmark"];
  if (s.includes("vt-share")) return ["vt", "share", "bagikan", "repost", "reshare", "save", "bookmark"];
  if (s.includes("followers") || s.includes("subscribers")) return ["follow", "followers", "subs", "subscriber"];
  if (s.includes("viewers")) return ["view", "views", "viewers", "penonton"];
  if (s.includes("like")) return ["like", "likes", "suka", "heart"];
  if (s.includes("live-tap-tap")) return ["live", "tap"];
  if (s.includes("live-viewers") || s.includes("live")) return ["live", "viewers", "penonton", "broadcast", "stream"];
  if (s.includes("pk-battle")) return ["pk", "battle"];
  if (s.includes("shorts-views")) return ["shorts", "short", "views"];
  return norm(s).split(" ").filter(Boolean);
}

/* ================= Selektor data dari respons ================= */
function findPlatformBlock(result: unknown, category: string): PlatformBlock | undefined {
  const arr = asArray<PlatformBlock>((result as VendorListResult)?.data);
  const wanted = PLATFORM_ALIASES[category.toLowerCase()] ?? [category.toLowerCase()];
  for (const item of arr) {
    const name = norm(asString(item?.platform));
    if (name && wanted.some((w) => name.includes(norm(w)))) return item;
  }
  return undefined;
}
function pickCodeFromLinks(block: PlatformBlock | undefined, slug: string): string | null {
  if (!block) return null;
  const links = asArray<LinkItem>(block.links);
  const kws = keywordsForSlug(slug).map(norm);

  const scored: Array<{ code: string; title: string; score: number }> = [];
  for (const l of links) {
    const title = norm(asString(l?.title));
    const code = asString(l?.category);
    if (!title || !code) continue;
    let score = 0;
    for (const k of kws) if (k && title.includes(k)) score++;
    scored.push({ code, title, score });
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.length && scored[0].score > 0 ? scored[0].code : null;
}

/**
 * Ambil array varian dari detail raw vendor TANPA mapping manual.
 */
function extractVariants(detailRaw: unknown): VariantView[] {
  const tryFromData = (r: unknown): unknown[] => {
    if (r && typeof r === "object" && !Array.isArray(r)) {
      const maybe = (r as { data?: unknown }).data;
      if (Array.isArray(maybe)) return maybe;
    }
    return [];
  };

  let list: unknown[] = [];
  list = tryFromData(detailRaw);
  if (!list.length && Array.isArray(detailRaw)) list = detailRaw;
  if (!list.length && detailRaw && typeof detailRaw === "object") {
    for (const v of Object.values(detailRaw as Record<string, unknown>)) {
      if (Array.isArray(v)) { list = v; break; }
    }
  }
  if (!list.length && detailRaw && typeof detailRaw === "object") {
    for (const v of Object.values(detailRaw as Record<string, unknown>)) {
      if (v && typeof v === "object" && !Array.isArray(v)) {
        for (const vv of Object.values(v as Record<string, unknown>)) {
          if (Array.isArray(vv)) { list = vv; break; }
        }
      }
      if (list.length) break;
    }
  }

  const arr = asArray<RawVariant>(list);
  const out: VariantView[] = [];
  arr.forEach((obj, idx) => {
    const idRaw =
      obj.product_id ?? obj.id ?? obj.service_id ?? obj.serviceId ?? obj.productId ?? obj.kode ?? obj.code;
    const id = asString(idRaw);
    if (!id) return;

    const name =
      asString(obj.name) ||
      asString(obj.title) ||
      asString(obj.service) ||
      `Produk ${id}`;

    const min = toInt(obj.min ?? obj.min_order ?? obj.start);
    const max = toInt(obj.max ?? obj.max_order ?? obj.limit);
    const pricePerK = pickPricePerK(obj as Record<string, unknown>);

    out.push({ id, name, min, max, pricePerK: pricePerK || undefined, idx });
  });

  return out;
}

/* ================== Helper UI ================== */
const cls = (...s: (string | false | null | undefined)[]) => s.filter(Boolean).join(" ");
const tagFromName = (name: string): string[] => {
  const tags: string[] = [];
  if (/promo/i.test(name)) tags.push("Promo");
  if (/refill/i.test(name)) tags.push("Refill");
  if (/instant|instan|fast|🚀|⚡/i.test(name)) tags.push("Fast");
  if (/worldwide|🌎/i.test(name)) tags.push("Worldwide");
  return tags.slice(0, 3);
};

function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide">
      {children}
    </span>
  );
}

/* ===== Toast ringan (bawah, non-modal) ===== */
type ToastState = { kind: "success" | "error"; title: string; desc?: string } | null;
function Toast({ state, onClose }: { state: ToastState; onClose: () => void }) {
  if (!state) return null;
  const isSuccess = state.kind === "success";
  return (
    <div className="fixed inset-x-0 bottom-6 z-[100] flex justify-center px-4">
      <div
        className={cls(
          "w-full max-w-md rounded-xl border p-3 shadow-lg backdrop-blur",
          isSuccess
            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
            : "border-rose-500/30 bg-rose-500/10 text-rose-200"
        )}
      >
        <div className="flex items-start gap-3">
          <span className="mt-0.5 text-lg">{isSuccess ? "✅" : "⚠️"}</span>
          <div className="min-w-0">
            <p className="font-semibold leading-tight">{state.title}</p>
            {state.desc ? <p className="text-sm opacity-90 line-clamp-2">{state.desc}</p> : null}
          </div>
          <button onClick={onClose} className="ml-auto text-white/70 hover:text-white" aria-label="Tutup">✕</button>
        </div>
      </div>
    </div>
  );
}

/* ===== Modal Konfirmasi ===== */
function ConfirmModal({
  open,
  onClose,
  onConfirm,
  summary,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  summary: {
    variant?: string;
    target: string;
    qty: number;
    pricePerK?: number;
    estTotal?: number;
    code?: string;
  };
}) {
  // tutup dengan ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center"
      aria-modal="true"
      role="dialog"
      aria-labelledby="confirm-title"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" />

      {/* Dialog */}
      <div
        className="relative w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl border border-white/10 bg-[#150b22] p-5 sm:p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="confirm-title" className="text-lg font-semibold">Apakah sudah benar orderan Anda?</h3>
        <p className="mt-1 text-sm text-white/70">Periksa detail pesanan di bawah ini sebelum melanjutkan.</p>

        <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-4 text-sm">
          <div className="flex items-center justify-between py-1">
            <span className="text-white/70">Varian</span>
            <span className="font-medium text-right line-clamp-1">{summary.variant || "—"}</span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-white/70">Target</span>
            <span className="font-medium text-right max-w-[60%] truncate">{summary.target || "—"}</span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-white/70">Jumlah</span>
            <span className="font-medium">{summary.qty} pcs</span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-white/70">Harga / 1k</span>
            <span className="font-medium">{summary.pricePerK ? idr(summary.pricePerK) : "—"}</span>
          </div>
          <div className="mt-3 border-t border-white/10 pt-3 flex items-center justify-between">
            <span className="text-white/90 font-semibold">Estimasi Total</span>
            <span className="text-base font-bold">{summary.estTotal != null ? idr(summary.estTotal) : "—"}</span>
          </div>
          {summary.code && (
            <div className="mt-2 text-[11px] text-white/50 text-right">code: {summary.code}</div>
          )}
        </div>

        <div className="mt-5 flex flex-col sm:flex-row gap-2">
          <button
            onClick={onConfirm}
            className="w-full inline-flex items-center justify-center rounded-xl px-4 py-3 font-semibold bg-violet-600 hover:bg-violet-500 active:translate-y-[1px] transition"
          >
            Benar
          </button>
          <button
            onClick={onClose}
            className="w-full inline-flex items-center justify-center rounded-xl px-4 py-3 font-semibold bg-white/10 hover:bg-white/15 active:translate-y-[1px] transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= Komponen Utama ================= */
export default function ServiceOrderClient({
  category,
  slug,
  vendorCode,
}: {
  category: string;
  slug: string;
  vendorCode: string;
}) {
  if (!category || !slug) notFound();
  const router = useRouter();

  const [detailRaw, setDetailRaw] = useState<VendorDetailResult | null>(null);
  const [pickedCode, setPickedCode] = useState<string>(vendorCode || "");
  const [loading, setLoading] = useState<boolean>(true);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  // form order
  const variants = useMemo(() => extractVariants(detailRaw), [detailRaw]);
  const [variantIndex, setVariantIndex] = useState<number | null>(null);
  const [target, setTarget] = useState<string>("");
  const [qty, setQty] = useState<number>(0);

  const selectedVariant = useMemo(
    () => (variantIndex !== null ? variants[variantIndex] : undefined),
    [variants, variantIndex]
  );
  const isQtyValid = selectedVariant ? qty >= selectedVariant.min && qty <= selectedVariant.max : false;
  const canOrder = Boolean(pickedCode && selectedVariant && isQtyValid && target.trim());

  // toast & loading order
  const [toast, setToast] = useState<ToastState>(null);
  const [loadingOrder, setLoadingOrder] = useState<boolean>(false);

  // modal konfirmasi
  const [showConfirm, setShowConfirm] = useState(false);

  const estTotal = useMemo(() => {
    if (!selectedVariant?.pricePerK) return undefined;
    const total = (qty * selectedVariant.pricePerK) / 1000;
    return Math.max(0, Math.round(total));
  }, [qty, selectedVariant?.pricePerK]);

  // load list → pick code (kalau kosong) → load detail
  useEffect(() => {
    let mounted = true;

    (async () => {
      setLoading(true);
      setErrMsg(null);
      setDetailRaw(null);
      setVariantIndex(null);
      setQty(0);

      try {
        // ambil list & auto-pick code (kalau belum ada dari URL)
        if (!pickedCode) {
          const resList = await secureFetch("/api/layanan/resolve", "POST", { category, slug });
          const hasilList: { result?: unknown; error?: unknown } = await resList.json();

          const block = findPlatformBlock(hasilList.result, category);
          const autoCode = pickCodeFromLinks(block, slug);
          if (autoCode && mounted) setPickedCode(autoCode);
        }

        // ambil detail berdasarkan code
        const codeToUse = pickedCode || "";
        if (codeToUse) {
          const resDetail = await secureFetch("/api/layanan/resolve", "POST", { code: codeToUse, category, slug });
          const hasilDetail: { result?: unknown; error?: unknown } = await resDetail.json();
          if (mounted) setDetailRaw(hasilDetail.result as VendorDetailResult);
        }
      } catch (e) {
        if (mounted) setErrMsg(e instanceof Error ? e.message : "Terjadi kesalahan");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, [category, slug, pickedCode]);

  const doOrder = useCallback(async () => {
    if (!canOrder || selectedVariant == null || variantIndex == null || loadingOrder) return;

    try {
      setLoadingOrder(true);

      const res = await secureFetch("/api/order", "POST", {
        code: pickedCode,
        variantIndex, // BE kamu pakai index
        data: target,
        quantity: qty,
      });

      const text = await res.text();
      let trx = "-";
      try {
        const json = JSON.parse(text) as { trx?: unknown };
        if (json && json.trx != null) trx = String(json.trx);
      } catch {
        // ignore parse error
      }

      // Toast sukses + redirect
      setToast({
        kind: "success",
        title: "Pesanan berhasil dibuat",
        desc: `TRX: ${trx}`,
      });
      setTimeout(() => router.push("/"), 1500);
    } catch (e) {
      setToast({
        kind: "error",
        title: "Gagal membuat pesanan",
        desc: e instanceof Error ? e.message : "Terjadi kesalahan",
      });
    } finally {
      setLoadingOrder(false);
    }
  }, [canOrder, selectedVariant, variantIndex, loadingOrder, pickedCode, target, qty, router]);

  function openConfirm() {
    if (!canOrder || loadingOrder) return;
    setShowConfirm(true);
  }

  /* ================== UI ================== */
  return (
    <div className="mx-auto max-w-6xl px-4 pb-12 text-white">
      {/* Header */}
      <header className="mb-8 rounded-2xl border border-white/10 bg-gradient-to-br from-[#2b1740] to-black p-[1px]">
        <div className="rounded-[calc(1rem-1px)] bg-[#1f0f2f]/70 p-5 sm:p-7">
          <div className="flex flex-col items-start sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold capitalize">
                {slug.replace(/-/g, " ")}
              </h1>
              <p className="mt-1 text-sm text-white/70">
                Kategori: <span className="font-semibold capitalize">{category}</span>{" "}
                • Mode:{" "}
                <Link
                  href="/syaratketentuan"
                  className="font-semibold text-orange-200 hover:underline"
                >
                  Sebelum Order, WAJIB MEMBACA Syarat dan Ketentuan yang Berlaku
                </Link>
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs text-violet-200">
              <span className={cls("inline-block h-2 w-2 rounded-full", loading ? "animate-pulse bg-violet-400" : errMsg ? "bg-rose-400" : "bg-emerald-400")} />
              {loading ? "Memuat…" : errMsg ? "Gagal memuat" : "Siap Order"}
            </div>
          </div>
        </div>
      </header>

      {/* GRID — 1 kolom di mobile, 2 kolom di tablet, 3 kolom di desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* VARIANTS LIST */}
        <section className="md:col-span-2" aria-busy={loading}>
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#2b1740] to-black p-[1px]">
            <div className="relative rounded-[calc(1rem-1px)] bg-[#1b0f2a]/70 p-5">
              {/* Header list */}
              <div className={cls(loading && "opacity-70")}>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Pilih Varian Layanan</h3>
                  {pickedCode && (
                    <span className="text-[10px] rounded-full bg-violet-500/10 px-2 py-0.5 border border-violet-400/30 text-violet-200">
                      code: {pickedCode}
                    </span>
                  )}
                </div>

                {errMsg && (
                  <div className="mt-3 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-100">
                    {errMsg}
                  </div>
                )}

                {/* === LIST === */}
                {!errMsg && (
                  <>
                    {loading ? (
                      <VariantListSkeleton />
                    ) : variants.length > 0 ? (
                      <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-3 animate-fade-in">
                        {variants.map((v, i) => {
                          const active = i === variantIndex;
                          const tags = tagFromName(v.name);

                          return (
                            <button
                              key={`${v.id}-${i}`}
                              type="button"
                              onClick={() => setVariantIndex(i)}
                              className={cls(
                                "w-full text-left rounded-xl px-4 py-3 transition-colors",
                                "bg-[#24123b]", // solid background lebih muda dari #1a0d29
                                "border border-purple-600/40",
                                active ? "ring-2 ring-purple-950" : "hover:border-purple-400/70"
                              )}
                            >
                              <div className="flex items-start justify-between gap-3">
                                {/* LEFT SIDE */}
                                <div className="min-w-0">
                                  <p
                                    className={cls(
                                      "font-medium leading-snug text-[13px] line-clamp-2 transition-colors",
                                      active ? "text-purple-400" : "text-white"
                                    )}
                                  >
                                    {v.name}
                                  </p>

                                  {tags.length > 0 && (
                                    <div className="mt-1 flex flex-wrap gap-1">
                                      {tags.map((t) => (
                                        <Badge key={t}>{t}</Badge>
                                      ))}
                                    </div>
                                  )}

                                  <div className="mt-1 text-[11px] text-white/60 flex flex-wrap gap-x-2 gap-y-0.5">
                                    <span>Min: {v.min}</span>
                                    <span className="opacity-40">•</span>
                                    <span>Max: {v.max}</span>
                                    <span className="opacity-40">•</span>
                                    <span>ID: {v.id}</span>
                                  </div>
                                </div>

                                {/* RIGHT SIDE */}
                                <div className="shrink-0 text-right">
                                  <span className="inline-block rounded-md border border-purple-400/40 bg-purple-500/10 px-2.5 py-1 text-[12px] font-semibold text-purple-200">
                                    {v.pricePerK ? `${idr(v.pricePerK)}/1k` : "—"}
                                  </span>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="mt-4 rounded-xl border border-white/10 bg-black/30 p-4 text-sm text-white/70">
                        Tidak ada varian ditemukan untuk code saat ini.
                      </div>
                    )}
                  </>
                )}

              </div>

              {/* ===== CSS: shimmer & motion ===== */}
              <style jsx global>{`
              @keyframes fadeIn {
                from { opacity: 0; transform: translateY(2px); }
                to   { opacity: 1; transform: translateY(0); }
              }
              .animate-fade-in { animation: fadeIn 320ms ease-out both; }

              @keyframes sweep {
                0%   { transform: translateX(-30%); opacity: 0.35; }
                50%  { opacity: 0.55; }
                100% { transform: translateX(130%); opacity: 0.35; }
              }
              .before\\:animate-sweep::before { animation: sweep 1.6s ease-in-out infinite; will-change: transform, opacity; }

              @keyframes spotlight {
                0%   { --x: 15%; --y: 18%; }
                50%  { --x: 85%; --y: 35%; }
                100% { --x: 15%; --y: 18%; }
              }
              .animate-spotlight { animation: spotlight 4.8s ease-in-out infinite; }

              @keyframes shimmer {
                0%   { background-position: -120% 0; }
                100% { background-position: 120% 0; }
              }
              .skeleton-shimmer {
                background-image: linear-gradient(90deg,
                  rgba(255,255,255,0.06) 0%,
                  rgba(255,255,255,0.12) 40%,
                  rgba(255,255,255,0.06) 80%
                );
                background-size: 200% 100%;
                animation: shimmer 1.25s linear infinite;
                will-change: background-position;
              }

              @media (prefers-reduced-motion: reduce) {
                .before\\:animate-sweep::before,
                .animate-spotlight,
                .skeleton-shimmer {
                  animation: none !important;
                }
              }
            `}</style>

            </div>
          </div>
        </section>

        {/* ORDER CARD (sticky di desktop) */}
        <aside className="md:col-span-1">
          <div className="lg:sticky lg:top-24 space-y-4">
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#2b1740] to-black p-[1px]">
              <div className="rounded-[calc(1rem-1px)] bg-[#1b0f2a]/70 p-5">
                <h4 className="text-lg font-semibold">Buat Pesanan</h4>

                {/* Target */}
                <div className="mt-3">
                  <label className="mb-1 block text-xs text-white/70">Target (URL/Username)</label>
                  <input
                    type="text"
                    placeholder="https://"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none focus:border-violet-500"
                  />
                </div>

                {/* Qty */}
                <div className="mt-3">
                  <label className="mb-1 block text-xs text-white/70">Jumlah</label>
                  <input
                    type="number"
                    value={qty || ""}
                    onChange={(e) => setQty(Number(e.target.value))}
                    min={selectedVariant?.min ?? 0}
                    max={selectedVariant?.max ?? 0}
                    className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none focus:border-violet-500"
                  />
                  {selectedVariant && !isQtyValid && (
                    <p className="mt-1 text-xs text-amber-300">
                      Jumlah harus di antara {selectedVariant.min} dan {selectedVariant.max}.
                    </p>
                  )}
                </div>

                {/* Summary ringkas */}
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Varian</span>
                    <span className="font-medium text-right line-clamp-1">
                      {selectedVariant ? selectedVariant.name : "—"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Harga / 1k</span>
                    <span className="font-medium">
                      {selectedVariant?.pricePerK ? idr(selectedVariant.pricePerK) : "—"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Jumlah</span>
                    <span className="font-medium">{qty || 0} pcs</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Est. total</span>
                    <span className="font-semibold">
                      {estTotal != null ? idr(estTotal) : "—"}
                    </span>
                  </div>
                </div>

                {/* Action */}
                <button
                  onClick={openConfirm}
                  disabled={!canOrder || loadingOrder}
                  className={cls(
                    "mt-5 w-full rounded-xl px-4 py-3 font-semibold transition",
                    !canOrder || loadingOrder
                      ? "bg-white/10 text-white/50 cursor-not-allowed"
                      : "bg-violet-600 hover:bg-violet-500 text-white"
                  )}
                >
                  {loadingOrder ? "Memproses…" : "Order"}
                </button>

                <p className="mt-3 text-[11px] leading-relaxed text-white/60">
                  Varian dibaca langsung dari detail raw vendor (tanpa mapping manual).
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Modal Konfirmasi */}
      <ConfirmModal
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => {
          setShowConfirm(false);
          doOrder();
        }}
        summary={{
          variant: selectedVariant?.name,
          target,
          qty: qty || 0,
          pricePerK: selectedVariant?.pricePerK,
          estTotal,
          code: pickedCode || undefined,
        }}
      />

      {/* Toast */}
      <Toast state={toast} onClose={() => setToast(null)} />
    </div>
  );
}

/* ===== Skeletons (dipertahankan) ===== */
function SkeletonLine({ w = "w-24" }: { w?: string }) {
  return <span className={cls("block h-3 rounded-full bg-white/10 overflow-hidden relative", w, "skeleton-shimmer")} />;
}
function SkeletonPill({ w = "w-14" }: { w?: string }) {
  return <span className={cls("inline-block h-5 rounded-full bg-white/10 align-middle relative overflow-hidden", w, "skeleton-shimmer")} />;
}

function SkeletonRadio() {
  return <span className="mt-1 inline-block h-4 w-4 rounded-full border border-white/20 bg-white/5" />;
}
function VariantCardSkeleton() {
  return (
    <div className={"relative overflow-hidden rounded-2xl border bg-[#0c0713]/70 backdrop-blur border-white/10"}>
      <div className="pointer-events-none absolute -inset-1 bg-[radial-gradient(120px_100px_at_var(--x,20%)_var(--y,20%),rgba(139,92,246,0.12),transparent_60%)] animate-spotlight" />
      <div className="
        pointer-events-none absolute inset-0
        before:content-['']
        before:absolute before:-inset-12 before:rotate-12
        before:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent)]
        before:animate-sweep
      " />
      <div className="relative p-4 sm:p-5">
        <div className="flex flex-col items-start sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-start gap-3">
              <SkeletonRadio />
              <div className="min-w-0">
                <SkeletonLine w="w-56 sm:w-72" />
                <div className="mt-2 space-y-1.5">
                  <SkeletonLine w="w-28" />
                  <div className="mt-2 flex gap-1.5">
                    <SkeletonPill w="w-14" />
                    <SkeletonPill w="w-16" />
                    <SkeletonPill w="w-12" />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
function VariantListSkeleton() {
  return (
    <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <VariantCardSkeleton key={i} />
      ))}
    </div>
  );
}
