"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useEffect, MouseEvent } from "react";
import { useSession } from "next-auth/react";

/* ================== Types ================== */
interface Service {
  title: string;
  price: string;
  img: string;
  category: string;
  slug: string;
}
interface ServiceListProps {
  selectedCategory: string;
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
  tiktok: "text-violet-300",
  instagram: "text-fuchsia-300",
  facebook: "text-blue-300",
  youtube: "text-red-300",
  telegram: "text-sky-300",
  other: "text-amber-300",
};
const colorFor = (c: string) => catColor[c.toLowerCase()] ?? catColor.other;

/* ================== Alert Login (Modal tengah — mobile & desktop) ================== */
function LoginPrompt({
  open,
  onClose,
  continueHref = "/login",
}: {
  open: boolean;
  onClose: () => void;
  continueHref?: string;
}) {
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
      <div
        className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm animate-in fade-in"
        onClick={onClose}
        aria-hidden
      />

      {/* Wrapper: center di semua ukuran layar */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-title"
        className="fixed inset-0 z-[100] flex items-center justify-center px-4"
      >
        <div
          className={cls(
            "w-full max-w-[520px] overflow-hidden",
            "rounded-2xl border border-white/12",
            "bg-gradient-to-br from-[#2b1740]/90 via-[#1a0d29]/90 to-[#1a0d29]/90",
            "shadow-2xl shadow-purple-900/30 backdrop-blur-xl",
            "max-h-[85vh] overflow-auto"
          )}
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 ring-1 ring-white/10 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" className="opacity-90">
                  <path fill="currentColor" d="M12 1a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V6a5 5 0 0 0-5-5m-3 8V6a3 3 0 0 1 6 0v3z"/>
                </svg>
              </div>
              <div className="min-w-0">
                <h3 id="login-title" className="text-white font-semibold text-base">
                  Login diperlukan
                </h3>
                <p className="text-white/70 text-sm">
                  Kamu harus login untuk melanjutkan pemesanan layanan.
                </p>
              </div>
              <button
                onClick={onClose}
                aria-label="Tutup"
                className="ml-auto rounded-lg p-2 hover:bg-white/5 text-white/70"
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Body + CTA (2 tombol) */}
          <div className="px-5 pt-4 pb-5">
            <div className="text-sm text-white/80">
              Masuk ke akun Sociostore kamu untuk menyelesaikan pesanan.
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2.5">
              {/* Batalkan */}
              <button
                onClick={onClose}
                className={cls(
                  "rounded-xl px-4 py-2.5 text-sm font-semibold",
                  "text-white/90 bg-white/5 ring-1 ring-white/10",
                  "hover:bg-white/10 active:translate-y-[1px] transition"
                )}
              >
                Batalkan
              </button>

              {/* Lanjutkan (ke login) */}
              <Link
                href={continueHref}
                className={cls(
                  "inline-flex items-center justify-center rounded-xl px-4 py-2.5",
                  "text-sm font-semibold text-white",
                  "bg-gradient-to-r from-orange-500 to-red-700",
                  "shadow-md shadow-red-500/30 ring-1 ring-orange-600/40",
                  "hover:brightness-110 active:translate-y-[1px] transition"
                )}
              >
                Lanjutkan
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ================== Component ================== */
export default function ServiceList({ selectedCategory }: ServiceListProps) {
  const { status } = useSession(); // tidak perlu ubah konfigurasi next-auth kamu
  const isLoggedIn = status === "authenticated";
  const [showPrompt, setShowPrompt] = useState(false);

  const filtered = useMemo(() => {
    if (!selectedCategory || selectedCategory === "Semua Kategori") return services;
    return services.filter((s) => s.category.toLowerCase() === selectedCategory.toLowerCase());
  }, [selectedCategory]);

  // Cegat klik pada kartu/ORDER ketika belum login
  const onServiceClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (isLoggedIn) return; // allow navigation
    e.preventDefault();
    setShowPrompt(true);
  };

  return (
    <div className="relative">
      <div className="p-3 sm:p-4 lg:p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filtered.map((service) => {
            const href = `/services/${service.category.toLowerCase()}/${service.slug.toLowerCase()}`;
            const catClass = colorFor(service.category);
            const orderDisabled = !isLoggedIn;

            return (
              <Link
                key={`${service.category}-${service.slug}`}
                href={href}
                className="block focus:outline-none"
                aria-label={`${service.title} — ${service.price}`}
                onClick={onServiceClick}
              >
                <div
                  className={cls(
                    "rounded-xl bg-[#0d1117] text-white",
                    "px-3 py-3 sm:px-4 sm:py-3",
                    "border border-white/10",
                    "hover:border-white/20 focus-visible:border-white/30",
                    "transition"
                  )}
                >
                  <div className="flex items-center gap-3">
                    {/* ICON */}
                    <Image
                      src={service.img}
                      alt={service.title}
                      width={36}
                      height={36}
                      className="h-9 w-9 object-contain shrink-0"
                    />

                    {/* TEXT */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold leading-tight truncate">{service.title}</p>
                        <span className={cls("text-[10px] uppercase tracking-wide", catClass)}>
                          {service.category}
                        </span>
                      </div>
                      <p className="text-xs text-white/60 mt-0.5 truncate">
                        Starts at {service.price}
                      </p>
                    </div>

                    {/* CTA ORDER — tampil disabled jika belum login, tapi tetap bisa diklik untuk munculkan alert */}
                    <span
                      role="button"
                      aria-disabled={orderDisabled}
                      title={orderDisabled ? "Login untuk melanjutkan" : "Lanjutkan pemesanan"}
                      className={cls(
                        "shrink-0 inline-flex items-center justify-center rounded-full px-4 py-2",
                        "text-[12px] font-semibold text-white",
                        "bg-gradient-to-r from-orange-500 to-red-700",
                        "ring-1 ring-orange-600/40 shadow-md shadow-red-500/30",
                        orderDisabled
                          ? "opacity-60 cursor-not-allowed"
                          : "transition-transform duration-200 ease-out hover:scale-105 hover:brightness-110 active:scale-95"
                      )}
                      onClick={(e) => {
                        if (!isLoggedIn) {
                          e.preventDefault();
                          e.stopPropagation();
                          setShowPrompt(true);
                        }
                      }}
                    >
                      ORDER
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="mt-6 rounded-lg bg-[#0d1117] p-4 text-center text-white/70">
            Belum ada layanan untuk kategori ini.
          </div>
        )}
      </div>

      {/* Alert (2 tombol: Lanjutkan / Batalkan) */}
      {!isLoggedIn && (
        <LoginPrompt open={showPrompt} onClose={() => setShowPrompt(false)} />
      )}
    </div>
  );
}
