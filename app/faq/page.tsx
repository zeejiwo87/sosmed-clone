// app/faq/page.tsx
"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import {
  Search,
  HelpCircle,
  MessageSquare,
  ShieldCheck,
  Clock,
  ChevronDown,
  Phone,
  Mail,
  AlertCircle,
  Sparkles,
} from "lucide-react";

/* ================== Data ================== */
type Faq = {
  q: string;
  a: string;
  cat: "Akun & Keamanan" | "Pembayaran" | "Pesanan" | "Layanan" | "Teknis";
  keywords?: string[];
};

const FAQS: Faq[] = [
  {
    cat: "Layanan",
    q: "Apa itu Sociostore dan layanan apa saja yang tersedia?",
    a: "Sociostore menyediakan layanan peningkatan engagement untuk platform seperti Instagram, TikTok, YouTube, Telegram, dan Facebook. Contohnya followers, likes, views, live viewers, hingga paket khusus.",
    keywords: ["instagram", "tiktok", "youtube", "followers", "likes", "views"],
  },
  {
    cat: "Pesanan",
    q: "Berapa lama pesanan diproses?",
    a: "Sebagian besar layanan mulai berjalan dalam 0–15 menit setelah pembayaran terverifikasi. Durasi selesai bervariasi tergantung paket & volume.",
    keywords: ["estimasi", "waktu", "durasi", "mulai"],
  },
  {
    cat: "Akun & Keamanan",
    q: "Apakah aman untuk akun saya?",
    a: "Ya. Kami menggunakan metode yang aman serta tidak meminta kata sandi. Hindari melanggar kebijakan platform agar akun tetap sehat.",
    keywords: ["password", "aman", "ban", "limit"],
  },
  {
    cat: "Pembayaran",
    q: "Metode pembayaran apa yang didukung?",
    a: "Kami mendukung e-wallet & bank transfer populer di Indonesia. Instruksi akan muncul saat checkout atau deposit.",
    keywords: ["ewallet", "bank", "transfer", "pembayaran"],
  },
  {
    cat: "Pesanan",
    q: "Bagaimana jika link/username target salah?",
    a: "Batalkan dan buat ulang pesanan dengan link yang benar. Jika sudah berjalan, hubungi support untuk pengecekan lanjutan.",
    keywords: ["target", "url", "username", "salah"],
  },
  {
    cat: "Teknis",
    q: "Views/Likes belum bertambah, apa yang harus saya lakukan?",
    a: "Cek kembali privasi akun (disarankan publik) dan pastikan konten tidak dihapus/arsip. Jika tetap belum jalan setelah 60 menit, kontak support 24/7.",
    keywords: ["pending", "delay", "tidak jalan"],
  },
  {
    cat: "Pembayaran",
    q: "Apakah ada garansi refill atau drop-protection?",
    a: "Beberapa layanan memiliki masa garansi. Detailnya tercantum pada deskripsi varian saat pemesanan.",
    keywords: ["garansi", "refill", "drop"],
  },
  {
    cat: "Akun & Keamanan",
    q: "Apakah perlu memberikan email atau kata sandi?",
    a: "Tidak. Kami hanya butuh link/username target. Jaga kredensialmu dan aktifkan keamanan akun.",
    keywords: ["password", "login", "credential"],
  },
  {
    cat: "Teknis",
    q: "Apakah akun private bisa dikerjakan?",
    a: "Untuk sebagian besar layanan, akun harus publik selama proses. Setelah selesai, boleh diprivat kembali.",
    keywords: ["private", "kunci", "publik"],
  },
  {
    cat: "Pesanan",
    q: "Bisakah mengubah paket setelah transaksi?",
    a: "Selama belum berjalan, masih bisa diubah/dibatalkan. Jika sudah aktif, perubahan mengikuti kebijakan layanan terkait.",
    keywords: ["ubah paket", "upgrade", "downgrade"],
  },
];

/* ================== UI Utilities ================== */
const cls = (...v: Array<string | false | null | undefined>) => v.filter(Boolean).join(" ");

// Buat union literal dari kategori agar tidak perlu `any`
const CATS = ["Semua", "Layanan", "Pesanan", "Pembayaran", "Akun & Keamanan", "Teknis"] as const;
type CatAll = typeof CATS[number];

/* ================== Component ================== */
export default function FAQPage() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<CatAll>("Semua");
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  // filter FAQs
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FAQS.filter((f) => {
      const byCat = cat === "Semua" || f.cat === cat;
      if (!q) return byCat;
      const hay = [f.q, f.a, f.cat, ...(f.keywords ?? [])].join(" ").toLowerCase();
      return byCat && hay.includes(q);
    });
  }, [query, cat]);

  // schema.org JSON-LD (FAQPage)
  const jsonLd = useMemo(() => {
    const list = filtered.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    }));
    return JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: list });
  }, [filtered]);

  // Reset accordion saat jumlah hasil berubah (mematuhi react-hooks/exhaustive-deps)
  useEffect(() => {
    setOpenIdx(filtered.length ? 0 : null);
  }, [filtered.length]);

  return (
    <main className="min-h-screen bg-[#1a0d29] pt-[5px] sm:pt-[80px] lg:pt-[152px] text-white">

      {/* JSON-LD for SEO */}
      <Script id="faq-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />

      {/* Hero head */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-[14px] border border-white/15 bg-[#2a123f]/60 backdrop-blur-md p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center gap-5">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 text-xs text-purple-200/80">
                <Sparkles size={14} /> FAQ • Bantuan 24/7
              </div>
              <h1 className="mt-1 text-2xl sm:text-3xl font-bold">Pusat Bantuan & Pertanyaan Umum</h1>
              <p className="mt-2 text-white/80 max-w-2xl text-sm sm:text-base">
                Temukan jawaban tercepat tentang pesanan, pembayaran, keamanan akun, dan hal teknis.
              </p>
            </div>

            {/* Quick Contact (desktop row) */}
            <div className="md:ml-auto grid grid-cols-2 gap-3 w-full md:w-auto md:grid-cols-2">
              <a
                href="https://wa.me/6285876846768"
                className="rounded-xl px-4 py-3 text-sm font-semibold text-white ring-1 ring-orange-600/40 bg-gradient-to-r from-orange-500 to-red-700 shadow-md shadow-red-500/30 hover:brightness-110 active:translate-y-[1px] text-center"
              >
                Hubungi WhatsApp
              </a>
              <Link
                href="/deposit"
                className="rounded-xl px-4 py-3 text-sm font-semibold text-white/90 bg-white/5 ring-1 ring-white/10 hover:bg-white/10 active:translate-y-[1px] text-center"
              >
                Coba Layanan Kami
              </Link>
            </div>
          </div>

          {/* shimmer */}
          <div className="pointer-events-none absolute inset-0 rounded-[14px] overflow-hidden">
            <div className="absolute inset-y-3 -left-1/3 w-1/3 rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-6 sm:mt-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 lg:gap-8">
        {/* Left: FAQ list */}
        <div className="space-y-4">
          {/* Search + Category */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg border border-white/10 bg-[#0f141b] px-3 py-2 flex-1 flex items-center">
                <Search size={18} className="mr-2 opacity-80" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Cari: pembayaran, estimasi, akun, views…"
                  className="w-full bg-transparent outline-none text-sm placeholder:text-white/60"
                />
              </div>

              {/* Category select (mobile) */}
              <div className="lg:hidden">
                <select
                  value={cat}
                  onChange={(e) => setCat(e.target.value as CatAll)}
                  className="rounded-lg border border-white/10 bg-[#0f141b] px-3 py-2 text-sm"
                >
                  {CATS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Category pills (tablet/desktop) */}
            <div className="hidden lg:flex flex-wrap items-center gap-2 mt-3">
              {CATS.map((c) => {
                const active = cat === c;
                return (
                  <button
                    key={c}
                    onClick={() => setCat(c)}
                    className={cls(
                      "px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors",
                      active
                        ? "bg-[#141b23] border-violet-500 text-white"
                        : "bg-[#0f141b] border-white/10 text-white/80 hover:border-white/20"
                    )}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
              <AlertCircle className="mx-auto mb-2 text-purple-300" />
              <p className="text-white/80">Tidak ada hasil untuk pencarianmu.</p>
              <p className="text-white/60 text-sm">Coba kata kunci atau kategori lain.</p>
            </div>
          )}

          {/* FAQ accordion */}
          <div className="space-y-3">
            {filtered.map((f, i) => {
              const open = openIdx === i;
              return (
                <div
                  key={`${f.cat}-${f.q}`}
                  className={cls(
                    "rounded-2xl border p-4 sm:p-5 transition-colors",
                    open ? "border-violet-500 bg-[#141b23]" : "border-white/10 bg-white/5 hover:border-white/20"
                  )}
                >
                  <button
                    className="w-full text-left flex items-start gap-3"
                    onClick={() => setOpenIdx(open ? null : i)}
                    aria-expanded={open}
                  >
                    <div className="mt-[2px]">
                      {f.cat === "Akun & Keamanan" && <ShieldCheck size={18} className="text-purple-300" />}
                      {f.cat === "Pembayaran" && <Clock size={18} className="text-purple-300" />}
                      {f.cat === "Pesanan" && <MessageSquare size={18} className="text-purple-300" />}
                      {f.cat === "Layanan" && <HelpCircle size={18} className="text-purple-300" />}
                      {f.cat === "Teknis" && <AlertCircle size={18} className="text-purple-300" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="font-semibold leading-snug text-base">{f.q}</h3>
                        <ChevronDown
                          className={cls(
                            "shrink-0 transition-transform duration-200",
                            open ? "rotate-180 opacity-100" : "opacity-80"
                          )}
                          size={18}
                        />
                      </div>
                      <div
                        className={cls(
                          "grid transition-all duration-200",
                          open ? "grid-rows-[1fr] opacity-100 mt-2" : "grid-rows-[0fr] opacity-0"
                        )}
                      >
                        <div className="overflow-hidden">
                          <p className="text-sm text-white/80 leading-relaxed">{f.a}</p>
                        </div>
                      </div>
                      <div className="mt-2 text-[11px] text-white/50">{f.cat}</div>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Sidebar (sticky on desktop) */}
        <aside className="lg:sticky lg:top-24 space-y-4">
          {/* Contact card */}
          <div className="rounded-2xl border border-white/10 bg-[#2a123f]/60 backdrop-blur-md p-5">
            <h4 className="text-lg font-semibold">Butuh bantuan cepat?</h4>
            <p className="text-sm text-white/80 mt-1">
              Tim support siap 24/7 untuk bantu cek status pesanan, pembayaran, dan lainnya.
            </p>

            <div className="mt-4 space-y-2">
              <a
                href="https://wa.me/6285876846768"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white ring-1 ring-orange-600/40 bg-gradient-to-r from-orange-500 to-red-700 shadow-md shadow-red-500/30 hover:brightness-110 active:translate-y-[1px]"
              >
                <Phone size={16} /> WhatsApp
              </a>
              <a
                href="mailto:support@sociostore.id"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white/90 bg-white/5 ring-1 ring-white/10 hover:bg-white/10 active:translate-y-[1px]"
              >
                <Mail size={16} /> Email Support
              </a>
            </div>

            <div className="mt-4 rounded-lg border border-white/10 bg-white/5 p-3 text-xs text-white/70">
              <p>Tips cepat:</p>
              <ul className="list-disc ml-4 mt-1 space-y-1">
                <li>Pastikan akun publik saat proses berjalan.</li>
                <li>Gunakan link/username yang benar.</li>
                <li>Hindari menghapus/arsip konten saat order aktif.</li>
              </ul>
            </div>
          </div>

          {/* Quick links */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h4 className="text-sm font-semibold">Mulai dari sini</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-purple-300">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/deposit" className="hover:text-purple-300">
                  Deposit
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-purple-300">
                  Syarat & Ketentuan
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-purple-300">
                  Kebijakan Privasi
                </Link>
              </li>
            </ul>
          </div>

          {/* Tiny brand box */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 flex items-center gap-3">
            <Image src="/images/vercel.svg" alt="logo" width={36} height={36} className="rounded-full" />
            <div className="min-w-0">
              <p className="font-semibold">SOCIOSTORE</p>
              <p className="text-xs text-white/70">Cepat • Aman • Terpercaya</p>
            </div>
          </div>
        </aside>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-8 mb-10">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
          <p className="text-center sm:text-left text-sm sm:text-base text-white/90">
            Masih butuh bantuan? Tim kami siap bantu kapan pun.
          </p>
          <div className="sm:ml-auto flex items-center gap-3">
            <Link
              href="/profile"
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-white/90 bg-white/5 ring-1 ring-white/10 hover:bg-white/10 active:translate-y-[1px]"
            >
              Masuk Akun
            </Link>
            <a
              href="https://wa.me/6285876846768"
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-white ring-1 ring-orange-600/40 bg-gradient-to-r from-orange-500 to-red-700 shadow-md shadow-red-500/30 hover:brightness-110 active:translate-y-[1px]"
            >
              Chat Support
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
