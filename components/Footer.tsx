// components/Footer.tsx
import Link from "next/link";
import { Mail, Phone, MapPin, ChevronDown, Instagram, Facebook } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-0 border-t border-white/10 bg-[#140a26] text-gray-300">
      {/* ===== Mobile: Accordion (hidden on md and up) ===== */}
      <div className="mx-auto max-w-6xl px-4 py-8 md:hidden">
        {/* Brand + CTA */}
        <div className="text-center">
          <h3 className="text-2xl font-extrabold tracking-tight text-white">SOCIOSTORE</h3>
          <p className="mt-2 text-sm text-gray-400">
            Layanan sosial media yang cepat, aman, dan terpercaya.
          </p>

          {/* 3 tombol sejajar seperti “Hubungi Kami”: WA, IG, FB */}
          <div className="mt-5 grid grid-cols-3 gap-2">
            {/* WA */}
            <a
              href="https://wa.me/6285876846768"
              className="inline-flex items-center justify-center gap-2 rounded-xl
                        bg-gradient-to-r from-purple-500 to-fuchsia-500 px-3 py-2
                        text-sm font-semibold text-white shadow-lg shadow-purple-500/20
                        active:scale-[0.98] transition"
              aria-label="Hubungi kami via WhatsApp"
            >
              <Phone className="h-4 w-4" />
              <span className="truncate">Hubungi</span>
            </a>

            {/* Instagram */}
            <a
              href="https://instagram.com/zeejiwo87"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl
                        bg-gradient-to-r from-rose-500 to-orange-500 px-3 py-2
                        text-sm font-semibold text-white ring-1 ring-white/10
                        hover:brightness-110 active:scale-[0.98] transition"
              aria-label="Kunjungi Instagram @zeejiwo87"
            >
              <Instagram className="h-4 w-4" />
              <span className="truncate">Instagram</span>
            </a>

            {/* Facebook */}
            <a
              href="https://facebook.com/"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl
                        bg-gradient-to-r from-sky-500 to-blue-600 px-3 py-2
                        text-sm font-semibold text-white ring-1 ring-white/10
                        hover:brightness-110 active:scale-[0.98] transition"
              aria-label="Kunjungi Facebook"
            >
              <Facebook className="h-4 w-4" />
              <span className="truncate">Facebook</span>
            </a>
          </div>
        </div>


        {/* Accordion Items */}
        <div className="mt-6 space-y-3">
          <details className="group rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
            <summary className="flex cursor-pointer list-none items-center justify-between text-white">
              <span className="text-sm font-semibold">Menu</span>
              <ChevronDown className="h-5 w-5 transition-transform duration-200 group-open:rotate-180" />
            </summary>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/" className="hover:text-purple-300">Beranda</Link></li>
              <li><Link href="/profile" className="hover:text-purple-300">Profil</Link></li>
              <li><Link href="/deposit" className="hover:text-purple-300">Deposit</Link></li>
              <li><Link href="/faq" className="hover:text-purple-300">FAQ</Link></li>
            </ul>
          </details>

          <details className="group rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
            <summary className="flex cursor-pointer list-none items-center justify-between text-white">
              <span className="text-sm font-semibold">Bantuan</span>
              <ChevronDown className="h-5 w-5 transition-transform duration-200 group-open:rotate-180" />
            </summary>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/blog/latest" className="hover:text-purple-300">Blog</Link></li>
              <li><Link href="/about" className="hover:text-purple-300">Tentang Kami</Link></li>
              <li><Link href="/syaratketentuan" className="hover:text-purple-300">Syarat & Ketentuan</Link></li>
              <li><Link href="/privacy" className="hover:text-purple-300">Kebijakan Privasi</Link></li>
            </ul>
          </details>

          <details className="group rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
            <summary className="flex cursor-pointer list-none items-center justify-between text-white">
              <span className="text-sm font-semibold">Kontak</span>
              <ChevronDown className="h-5 w-5 transition-transform duration-200 group-open:rotate-180" />
            </summary>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-purple-300" /> (+62) 8587-6846-768</li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-purple-300" /> support@sociostore.id</li>
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-purple-300" /> Indonesia</li>
            </ul>
          </details>
        </div>
      </div>

      {/* ===== Tablet layout (md) – 3 columns ===== */}
      <div className="mx-auto hidden max-w-6xl grid-cols-1 gap-6 px-4 py-10 md:grid lg:hidden md:grid-cols-3">
        {/* Brand */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-xl font-bold text-white">SOCIOSTORE</h3>
          <p className="mt-2 text-sm text-gray-400">
            Layanan sosial media yang cepat, aman, dan terpercaya.
          </p>
          <div className="mt-4 flex items-center gap-3">
            <a
              href="https://wa.me/6285876846768"
              className="rounded-xl bg-gradient-to-r from-purple-500 to-fuchsia-500 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-purple-500/20 active:scale-[0.98] transition"
            >
              Hubungi Kami
            </a>
            <div className="flex items-center gap-2 text-gray-400">
              <a aria-label="Instagram" href="#" className="rounded-lg p-2 hover:bg-white/5">
                <Instagram className="h-5 w-5" />
              </a>
              <a aria-label="Facebook" href="#" className="rounded-lg p-2 hover:bg-white/5">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h4 className="mb-3 text-sm font-semibold text-white">Menu</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-purple-300">Beranda</Link></li>
            <li><Link href="/profile" className="hover:text-purple-300">Profil</Link></li>
            <li><Link href="/deposit" className="hover:text-purple-300">Deposit</Link></li>
            <li><Link href="/faq" className="hover:text-purple-300">FAQ</Link></li>
          </ul>
        </div>

        {/* Bantuan + Kontak */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h4 className="mb-3 text-sm font-semibold text-white">Bantuan</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/blog/latest" className="hover:text-purple-300">Blog</Link></li>
            <li><Link href="/about" className="hover:text-purple-300">Tentang Kami</Link></li>
            <li><Link href="/syaratketentuan" className="hover:text-purple-300">Syarat & Ketentuan</Link></li>
            <li><Link href="/privacy" className="hover:text-purple-300">Kebijakan Privasi</Link></li>
          </ul>

          <div className="mt-5 h-px w-full bg-white/10" />

          <h4 className="mb-3 mt-5 text-sm font-semibold text-white">Kontak</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-purple-300" /> (+62) 8587-6846-768</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-purple-300" /> support@sociostore.id</li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-purple-300" /> Indonesia</li>
          </ul>
        </div>
      </div>

      {/* ===== Desktop (lg+) – 4 columns ===== */}
      <div className="mx-auto hidden max-w-6xl grid-cols-4 gap-8 px-4 py-10 lg:grid">
        {/* Brand */}
        <div>
          <h3 className="text-xl font-bold text-white">SOCIOSTORE</h3>
          <p className="mt-2 text-sm text-gray-400">
            Layanan sosial media yang cepat, aman, dan terpercaya.
          </p>
        </div>

        {/* Menu */}
        <div>
          <h4 className="mb-3 text-sm font-semibold text-white">Menu</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-purple-300">Beranda</Link></li>
            <li><Link href="/profile" className="hover:text-purple-300">Profil</Link></li>
            <li><Link href="/deposit" className="hover:text-purple-300">Deposit</Link></li>
            <li><Link href="/faq" className="hover:text-purple-300">FAQ</Link></li>
          </ul>
        </div>

        {/* Bantuan */}
        <div>
          <h4 className="mb-3 text-sm font-semibold text-white">Bantuan</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/blog/latest" className="hover:text-purple-300">Blog</Link></li>
            <li><Link href="/about" className="hover:text-purple-300">Tentang Kami</Link></li>
            <li><Link href="/syaratketentuan" className="hover:text-purple-300">Syarat & Ketentuan</Link></li>
            <li><Link href="/privacy" className="hover:text-purple-300">Kebijakan Privasi</Link></li>
          </ul>
        </div>

        {/* Kontak */}
        <div>
          <h4 className="mb-3 text-sm font-semibold text-white">Kontak</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-purple-300" /> (+62) 8587-6846-768</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-purple-300" /> support@sociostore.id</li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-purple-300" /> Indonesia</li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-4 text-center text-xs text-gray-400 md:flex md:items-center md:justify-between">
          <p>
            © {year} sosmedboost.com. All rights reserved.{" "}
            <br className="block sm:hidden" />
            Dibuat dengan <span className="text-red-500">❤️</span> oleh{" "}
            <span className="font-semibold text-white">VHtear</span> X{" "}
            <span className="font-semibold text-white">AF</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
