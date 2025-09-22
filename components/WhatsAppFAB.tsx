"use client";

import { useEffect, useRef, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";

type Contact = { label: string; phone: string };

export default function WhatsAppFAB({
  contacts = [
    { label: "Admin 1", phone: "+62 851 7977 8353" },
    { label: "Admin 2", phone: "+62 858 7684 6768" },
  ],
  preset = "Halo, saya butuh bantuan.",
}: {
  contacts?: Contact[];
  preset?: string;
}) {
  const [open, setOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);

  // Tutup panel saat klik di luar
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!open) return;
      const t = e.target as Node | null;
      if (!t) return;
      if (rootRef.current?.contains(t)) return; // klik masih di dalam root (panel/tombol)
      setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const toWaLink = (raw: string) => {
    const digits = raw.replace(/[^\d]/g, "");
    const text = encodeURIComponent(preset);
    return `https://wa.me/${digits}?text=${text}`;
  };

  return (
    <div
      ref={rootRef}
      // wrapper fixed, tidak berubah ukuran
      className="fixed right-4 bottom-4 sm:right-6 sm:bottom-6 z-[2147483647]"
      style={{ paddingBottom: "max(0px, env(safe-area-inset-bottom))" }}
    >
      {/* Panel absolute, tidak memengaruhi layout tombol */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={cardRef}
            key="wa-panel"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="
              absolute right-0
              bottom-[calc(100%+12px)]
              rounded-xl border border-white/10 bg-[#1e1330]/95
              shadow-2xl backdrop-blur
              p-2
              w-[calc(100vw-2rem)] max-w-[340px]   /* mobile lebar enak */
              sm:w-80 sm:max-w-none                /* tablet/desktop */
            "
            style={{ willChange: "transform, opacity" }}
          >
            <p className="px-2 pt-2 pb-1 text-xs text-gray-300">WhatsApp kami</p>
            <div className="space-y-2">
              {contacts.map((c) => (
                <a
                  key={c.phone}
                  href={toWaLink(c.phone)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg border border-[#2c1b4b] bg-[#220d3b] px-3 py-2 hover:bg-[#251641]"
                >
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-green-500/20">
                    {/* icon kecil & stabil */}
                    <FaWhatsapp className="h-4 w-4 text-green-400" />
                  </span>
                  <div className="min-w-0">
                    <div className="text-sm text-white">{c.label}</div>
                    <div className="truncate text-xs text-gray-400">{c.phone}</div>
                  </div>
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tombol bulat — ukuran fix, tanpa transform supaya ikon TIDAK pindah */}
      <button
        onClick={() => setOpen((v) => !v)}  // klik 1 buka, klik 2 tutup
        aria-label="Hubungi via WhatsApp"
        aria-expanded={open}
        className="
          relative inline-flex items-center justify-center
          h-12 w-12 rounded-full
          bg-green-500 text-white
          shadow-lg
          leading-none select-none
          outline-none focus:outline-none focus:ring-0
          transition-none
        "
        style={{
          willChange: "auto",
          transform: "none", // pastikan tidak ada transform
        }}
      >
        <FaWhatsapp className="h-5 w-5" style={{ transform: "none" }} />
      </button>
    </div>
  );
}
