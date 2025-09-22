"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useEffect, type MouseEvent } from "react";
import { useSession } from "next-auth/react";
import { Search, SlidersHorizontal, X, ChevronRight } from "lucide-react";

/* ================== Types ================== */
interface Service {
  title: string;
  price: string; // e.g. "Rp 3.000 / k" or "Starts at Rp 300 / k"
  img: string;
  category: string;
  slug: string;
}

/* ================== Data (lengkap) ================== */
const services: Service[] = [
  // TikTok
  { title: "VT Like",       price: "Rp 3.000 / k",      img: "/images/hero/tik-tok.png",  category: "TikTok",   slug: "vt-like" },
  { title: "VT Viewers",    price: "Rp 800 / k",        img: "/images/hero/tik-tok.png",  category: "TikTok",   slug: "vt-viewers" },
  { title: "VT Favorit",    price: "Rp 1.000 / k",      img: "/images/hero/tik-tok.png",  category: "TikTok",   slug: "vt-favorit" },
  { title: "VT Share",      price: "Rp 400 / k",        img: "/images/hero/tik-tok.png",  category: "TikTok",   slug: "vt-share" },
  { title: "Live Tap-Tap",  price: "Rp 400 / k",        img: "/images/hero/tik-tok.png",  category: "TikTok",   slug: "live-tap-tap" },
  { title: "Live Viewers",  price: "Rp 60.000 / k",     img: "/images/hero/tik-tok.png",  category: "TikTok",   slug: "live-viewers" },
  { title: "Followers",     price: "Rp 43.000 / k",     img: "/images/hero/tik-tok.png",  category: "TikTok",   slug: "followers" },
  { title: "PK-Battle",     price: "Rp 4.000 / k",      img: "/images/hero/tik-tok.png",  category: "TikTok",   slug: "pk-battle" },

  // Instagram
  { title: "Like",          price: "Starts at Rp 300 / k",     img: "/images/hero/instagram.png", category: "Instagram", slug: "like" },
  { title: "Viewers",       price: "Starts at Rp 300 / k",     img: "/images/hero/instagram.png", category: "Instagram", slug: "viewers" },
  { title: "Followers",     price: "Starts at Rp 25.000 / k",  img: "/images/hero/instagram.png", category: "Instagram", slug: "followers" },

  // Facebook
  { title: "Like",          price: "Starts at Rp 12.000 / k",  img: "/images/hero/facebook.png",  category: "Facebook",  slug: "like" },
  { title: "Viewers",       price: "Starts at Rp 600 / k",     img: "/images/hero/facebook.png",  category: "Facebook",  slug: "viewers" },
  { title: "Reaction",      price: "Starts at Rp 40.000 / k",  img: "/images/hero/facebook.png",  category: "Facebook",  slug: "reaction" },
  { title: "Live",          price: "Starts at Rp 20.000 / k",  img: "/images/hero/facebook.png",  category: "Facebook",  slug: "live" },
  { title: "Followers",     price: "Starts at Rp 15.000 / k",  img: "/images/hero/facebook.png",  category: "Facebook",  slug: "followers" },
  { title: "Page",          price: "Starts at Rp 10.000 / k",  img: "/images/hero/facebook.png",  category: "Facebook",  slug: "page" },

  // YouTube
  { title: "Like",          price: "Starts at Rp 2.000 / k",   img: "/images/hero/youtube.png",   category: "YouTube",   slug: "like" },
  { title: "Viewers",       price: "Starts at Rp 14.000 / k",  img: "/images/hero/youtube.png",   category: "YouTube",   slug: "viewers" },
  { title: "Live",          price: "Starts at Rp 100.000 / k", img: "/images/hero/youtube.png",   category: "YouTube",   slug: "live" },
  { title: "Subscribers",   price: "Starts at Rp 26.000 / k",  img: "/images/hero/youtube.png",   category: "YouTube",   slug: "subscribers" },
  { title: "Shorts Views",  price: "Starts at Rp 10.000 / k",  img: "/images/hero/youtube.png",   category: "YouTube",   slug: "shorts-views" },

  // Telegram
  { title: "Members",       price: "Starts at Rp 70.000 / k",  img: "/images/hero/telegram.png",  category: "Telegram",  slug: "members" },
  { title: "Reaction",      price: "Starts at Rp 2.000 / k",   img: "/images/hero/telegram.png",  category: "Telegram",  slug: "reaction" },
  { title: "Channel",       price: "Starts at Rp 700.000 / k", img: "/images/hero/telegram.png",  category: "Telegram",  slug: "channel" },

  // Other
  { title: "Custom Service", price: "Contact us",               img: "/images/hero/other.png",     category: "Other",     slug: "custom-service" },
];

/* ================== Helpers ================== */
const cls = (...v: Array<string | false | null | undefined>) => v.filter(Boolean).join(" ");
const catColor: Record<string, string> = {
  tiktok: "text-violet-200",
  instagram: "text-fuchsia-200",
  facebook: "text-blue-200",
  youtube: "text-red-200",
  telegram: "text-sky-200",
  other: "text-amber-200",
};
const chipBg: Record<string, string> = {
  tiktok: "bg-violet-500/15 ring-violet-400/40 text-violet-100",
  instagram: "bg-fuchsia-500/15 ring-fuchsia-400/40 text-fuchsia-100",
  facebook: "bg-blue-500/15 ring-blue-400/40 text-blue-100",
  youtube: "bg-red-500/15 ring-red-400/40 text-red-100",
  telegram: "bg-sky-500/15 ring-sky-400/40 text-sky-100",
  other: "bg-amber-500/15 ring-amber-400/40 text-amber-100",
};
const colorFor = (c: string) => catColor[c.toLowerCase()] ?? catColor.other;
const chipFor = (c: string) => chipBg[c.toLowerCase()] ?? chipBg.other;

function parsePriceNumber(price: string): number {
  const match = price.replace(/[^0-9.,]/g, "");
  if (!match) return Number.POSITIVE_INFINITY;
  const normalized = match.replace(/\./g, "").replace(",", ".");
  const n = parseFloat(normalized);
  return isNaN(n) ? Number.POSITIVE_INFINITY : n;
}

/* ================== Alert Login (Modal tengah — mobile & desktop) ================== */
function LoginPrompt({ open, onClose, continueHref = "/login" }: { open: boolean; onClose: () => void; continueHref?: string; }) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={onClose} aria-hidden />

      {/* Wrapper: center di semua ukuran layar */}
      <div role="dialog" aria-modal="true" aria-labelledby="login-title" className="fixed inset-0 z-[100] flex items-center justify-center px-4">
        <div className={cls(
          "w-full max-w-[520px] overflow-hidden",
          "rounded-2xl border border-white/12",
          "bg-gradient-to-br from-[#2b1740]/90 via-[#1a0d29]/90 to-[#1a0d29]/90",
          "shadow-2xl shadow-purple-900/30 backdrop-blur-xl",
          "max-h-[85vh] overflow-auto"
        )}>
          {/* Header */}
          <div className="px-5 py-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 ring-1 ring-white/10 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" className="opacity-90">
                  <path fill="currentColor" d="M12 1a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V6a5 5 0 0 0-5-5m-3 8V6a3 3 0 0 1 6 0v3z"/>
                </svg>
              </div>
              <div className="min-w-0">
                <h3 id="login-title" className="text-white font-semibold text-base">Login diperlukan</h3>
                <p className="text-white/80 text-sm">Kamu harus login untuk melanjutkan pemesanan layanan.</p>
              </div>
              <button onClick={onClose} aria-label="Tutup" className="ml-auto rounded-lg p-2 hover:bg-white/5 text-white/80">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Body + CTA (2 tombol) */}
          <div className="px-5 pt-4 pb-5">
            <div className="text-sm text-white/90">Masuk ke akun Sociostore kamu untuk menyelesaikan pesanan.</div>
            <div className="mt-4 grid grid-cols-2 gap-2.5">
              <button onClick={onClose} className={cls(
                "rounded-xl px-4 py-2.5 text-sm font-semibold",
                "text-white bg-white/10 ring-1 ring-white/15",
                "hover:bg-white/15 active:translate-y-[1px] transition"
              )}>Batalkan</button>
              <Link href={continueHref} className={cls(
                "inline-flex items-center justify-center rounded-xl px-4 py-2.5",
                "text-sm font-semibold text-white",
                "bg-gradient-to-r from-orange-500 to-red-700",
                "shadow-md shadow-red-500/30 ring-1 ring-orange-600/40",
                "hover:brightness-110 active:translate-y-[1px] transition"
              )}>Lanjutkan</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ================== Service Card ================== */
function ServiceCard({ svc, isLoggedIn, onGate }: { svc: Service; isLoggedIn: boolean; onGate: (e: MouseEvent) => void; }) {
  const href = `/services/${svc.category.toLowerCase()}/${svc.slug.toLowerCase()}`;
  const catClass = colorFor(svc.category);
  const chipClass = chipFor(svc.category);

  return (
    <Link
      href={href}
      onClick={(e) => {
        if (!isLoggedIn) {
          e.preventDefault();
          onGate(e);
        }
      }}
      className="group block focus:outline-none"
    >
      <div
        className={cls(
          "relative overflow-hidden rounded-xl", // persegi panjang rapi
          "bg-[#1a0f2f]",
          "border border-white/12",
          "transition duration-300",
          "hover:-translate-y-0.5 hover:border-white/20",
          "min-h-[112px]" // memastikan bentuk persegi panjang, tidak terlalu kotak
        )}
      >
        {/* subtle glow */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden>
          <div className="absolute -inset-1 bg-gradient-to-br from-purple-700/10 via-fuchsia-600/10 to-transparent blur-2xl" />
        </div>

        <div className="relative z-10 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            {/* ICON */}
            <div className="relative h-12 w-12 sm:h-12 sm:w-12 shrink-0 rounded-lg ring-1 ring-white/10 bg-[#140a26]/80 flex items-center justify-center">
              <Image src={svc.img} alt={svc.title} fill className="object-contain p-1" />
            </div>

            {/* TEXT */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold leading-snug text-white truncate">
                  {svc.title}
                </h3>
                <span className={cls("text-[10px] uppercase tracking-wide", catClass)}>{svc.category}</span>
              </div>

              {/* harga tanpa prefix tambahan */}
              <p className="text-[13px] text-white mt-1 font-medium truncate">
                {svc.price}
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <span className={cls("px-2 py-0.5 text-[10px] rounded-full ring-1", chipClass)}>Real & Active</span>
                <span className="px-2 py-0.5 text-[10px] rounded-full ring-1 ring-white/15 bg-white/10 text-white">Fast Process</span>
                <span className="px-2 py-0.5 text-[10px] rounded-full ring-1 ring-white/15 bg-white/10 text-white">Secure</span>
              </div>
            </div>

            {/* CTA */}
            <div className="ml-auto flex items-center">
              <span
                role="button"
                title={isLoggedIn ? "Lanjutkan pemesanan" : "Login untuk melanjutkan"}
                className={cls(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5",
                  "text-[12px] font-semibold text-white",
                  "bg-gradient-to-r from-orange-500 to-red-700",
                  "ring-1 ring-orange-600/40 shadow-md shadow-red-500/30",
                  "transition-transform duration-200 ease-out",
                  isLoggedIn ? "group-hover:scale-[1.03] group-active:scale-95" : "opacity-70 cursor-not-allowed"
                )}
                onClick={(e) => {
                  if (!isLoggedIn) {
                    e.preventDefault();
                    e.stopPropagation();
                    onGate(e);
                  }
                }}
              >
                ORDER <ChevronRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ================== Page ================== */
export default function ServicesPage() {
  const { status } = useSession();
  const isLoggedIn = status === "authenticated";
  const [showPrompt, setShowPrompt] = useState(false);

  const categories = useMemo(() => {
    const uniq = Array.from(new Set(services.map((s) => s.category)));
    return ["Semua Kategori", ...uniq];
  }, []);

  const [selectedCategory, setSelectedCategory] = useState<string>("Semua Kategori");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"relevance" | "price-asc" | "price-desc">("relevance");

  const filtered = useMemo(() => {
    let list = services.slice();

    if (selectedCategory && selectedCategory !== "Semua Kategori") {
      list = list.filter((s) => s.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((s) => s.title.toLowerCase().includes(q) || s.category.toLowerCase().includes(q));
    }

    if (sortBy !== "relevance") {
      list.sort((a, b) => {
        const pa = parsePriceNumber(a.price);
        const pb = parsePriceNumber(b.price);
        return sortBy === "price-asc" ? pa - pb : pb - pa;
      });
    }

    return list;
  }, [selectedCategory, query, sortBy]);

  return (
    <main className="relative min-h-[calc(100vh-80px)] bg-[#140a26]">
      {/* ===== Hero / Heading ===== */}
      <section className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 pt-6 pb-3 sm:pt-8 sm:pb-6">
        <div className="flex flex-col gap-3 sm:gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">Layanan Sociostore</h1>
            <p className="mt-1 text-sm sm:text-base text-white/80 max-w-2xl">Pilih paket yang kamu butuhkan — cepat, aman, dan transparan.</p>
          </div>

          {/* ===== Filters Bar (sticky on desktop) ===== */}
          <div className="rounded-2xl border border-white/12 bg-[#1a0f2f]/80 backdrop-blur md:sticky md:top-16">
            <div className="flex flex-col gap-3 p-3 sm:p-4">
              {/* Top row: search + sort */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Cari layanan atau kategori..."
                    className="w-full rounded-xl bg-[#140a26] border border-white/12 pl-9 pr-3 py-2.5 text-sm text-white placeholder:text-white/60 focus:outline-none focus:border-white/25"
                  />
                </div>
                {/* Sort */}
                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline text-xs text-white/70">Urutkan</span>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as "relevance" | "price-asc" | "price-desc")}
                      className="appearance-none rounded-xl bg-[#140a26] border border-white/12 py-2.5 pl-3 pr-9 text-sm text-white focus:outline-none focus:border-white/25"
                    >
                      <option value="relevance">Relevansi</option>
                      <option value="price-asc">Harga Termurah</option>
                      <option value="price-desc">Harga Termahal</option>
                    </select>
                    <SlidersHorizontal className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
                  </div>
                </div>
              </div>

              {/* Category chips — horizontally scrollable on mobile */}
              <div className="-mx-1 overflow-x-auto scrollbar-thin scrollbar-thumb-white/10">
                <div className="px-1 flex items-center gap-2 min-w-max">
                  {categories.map((cat) => {
                    const active = selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={cls(
                          "px-3 py-1.5 rounded-full text-xs font-medium ring-1",
                          active
                            ? "bg-white/15 ring-white/25 text-white"
                            : "bg-white/[0.06] ring-white/15 text-white/90 hover:bg-white/15"
                        )}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Grid (desktop = 3 kolom) ===== */}
      <section className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 pb-10">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-white/12 bg-[#1a0f2f]/80 p-6 text-center">
            <p className="text-white/80">Tidak ditemukan layanan untuk pencarian/kategori ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-4">
            {filtered.map((svc) => (
              <ServiceCard key={`${svc.category}-${svc.slug}`} svc={svc} isLoggedIn={isLoggedIn} onGate={() => setShowPrompt(true)} />
            ))}
          </div>
        )}
      </section>

      {/* Alert Login */}
      {!isLoggedIn && <LoginPrompt open={showPrompt} onClose={() => setShowPrompt(false)} />}
    </main>
  );
}
