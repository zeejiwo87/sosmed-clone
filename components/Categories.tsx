"use client";

import React, { useRef, useState } from "react";
import { FaFacebook, FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa";
import { SiTelegram } from "react-icons/si";
import ServiceList from "./ServiceList";

/* ===== Types ===== */
type Category = { name: string; icon: React.ReactNode };

/* ===== Data ===== */
const categories: Category[] = [
  { name: "TikTok",    icon: <FaTiktok className="text-white" /> },
  { name: "Instagram", icon: <FaInstagram className="text-fuchsia-400" /> },
  { name: "Facebook",  icon: <FaFacebook className="text-blue-400" /> },
  { name: "YouTube",   icon: <FaYoutube className="text-red-400" /> },
  { name: "Telegram",  icon: <SiTelegram className="text-sky-400" /> },
  { name: "Other",     icon: <span className="text-xl leading-none text-amber-300">⚡</span> },
];

const cls = (...v: Array<string | false | null | undefined>) => v.filter(Boolean).join(" ");

export default function Categories() {
  const [selectedCategory, setSelectedCategory] = useState<string>("TikTok");
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const handleSelect = (name: string) => setSelectedCategory(name);

  const onKeyNav = (e: React.KeyboardEvent<HTMLButtonElement>, idx: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = e.key === "ArrowRight" ? (idx + 1) % categories.length : (idx - 1 + categories.length) % categories.length;
    const nextId = `cat-pill-${next}`;
    const el = document.getElementById(nextId) as HTMLButtonElement | null;
    el?.focus();
    handleSelect(categories[next].name);

    if (scrollRef.current && el) {
      const parent = scrollRef.current;
      const parentRect = parent.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      const offset = elRect.left - parentRect.left - parent.clientWidth / 2 + elRect.width / 2;
      parent.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
  <section
    id="categories" // tambahin ini biar bisa di-scroll dari link
    className={cls(
      "pt-0 pb-10 sm:pb-12", // background tetap nempel di atas
      "bg-[#0a0e14]"
    )}
  >
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
      {/* Title */}
      <h2 className="text-2xl sm:text-3xl font-extrabold text-white/90 text-center mb-6 tracking-wide">
        JENIS LAYANAN
      </h2>


       {/* ====== MOBILE/TABLET: Grid 2 kolom, active sama seperti desktop ====== */}
<div className="lg:hidden mb-6">
  <div
    ref={scrollRef}
    role="tablist"
    aria-label="Pilih kategori"
    className="grid grid-cols-2 gap-3 px-1"
  >
    {categories.map((c, i) => {
      const active = selectedCategory === c.name;
      return (
        <button
          key={c.name}
          id={`cat-pill-${i}`}
          role="tab"
          aria-selected={active}
          aria-controls="services-panel"
          tabIndex={active ? 0 : -1}
          onKeyDown={(e) => onKeyNav(e, i)}
          onClick={() => handleSelect(c.name)}
          className={cls(
            // ukuran & bentuk
            "w-full h-14 inline-flex items-center gap-3 rounded-xl border px-4 text-sm font-medium transition-colors",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500",
            // === SAMAKAN DENGAN DESKTOP ===
            active
              ? "bg-[#141b23] border-violet-500 text-white" // <-- kelas aktif desktop
              : "bg-[#0f141b] border-white/10 text-white/80 hover:border-white/20" // <-- kelas non-aktif desktop
          )}
        >
          <span className="text-lg">{c.icon}</span>
          <span className="truncate">{c.name}</span>
        </button>
      );
    })}
  </div>
</div>


        {/* ====== DESKTOP: 6 pills grid (dark) ====== */}
        <div className="hidden lg:grid grid-cols-6 gap-4 mb-10">
          {categories.map((c, i) => {
            const active = selectedCategory === c.name;
            return (
              <button
                key={i}
                onClick={() => handleSelect(c.name)}
                role="tab"
                aria-selected={active}
                aria-controls="services-panel"
                className={cls(
                  "group flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-semibold",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500",
                  active
                    ? "bg-[#141b23] border-violet-500 text-white"
                    : "bg-[#0f141b] border-white/10 text-white/80 hover:border-white/20"
                )}
              >
                <span
                  className={cls(
                    "flex h-8 w-8 items-center justify-center rounded-lg",
                    active ? "bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white" : "bg-white/5 text-white/70"
                  )}
                >
                  {c.icon}
                </span>
                <span className={active ? "text-white" : "text-white/90"}>{c.name}</span>
              </button>
            );
          })}
        </div>

        {/* ====== Panel Layanan ====== */}
        <div
          id="services-panel"
          role="tabpanel"
          aria-live="polite"
          className="mt-4" // cukup kasih margin atas biar ada jarak
        >
          <ServiceList selectedCategory={selectedCategory} />
        </div>

      </div>
    </section>
  );
}
