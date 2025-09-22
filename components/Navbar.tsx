// components/Navbar.tsx (Client Component)
"use client";

import Link from "next/link";
// di paling atas bersama import lucide-react
import type { LucideIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Search,
  Phone,
  User as UserIcon,
  Wallet,
  RefreshCw,
  Heart,
  ChevronDown,
  LogOut,
  Menu,
  X,
  Lock,
} from "lucide-react";
import { createPortal } from "react-dom";
import Image from "next/image";

/* ========= Utils ========= */
function initials(name?: string | null, phone?: string | null) {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/).slice(0, 2);
    const txt = parts.map((p) => p[0]?.toUpperCase()).join("");
    return txt || "U";
  }
  if (phone) {
    const last4 = phone.replace(/\D/g, "").slice(-4);
    return last4 ? `${last4}` : "U";
  }
  return "U";
}

function Avatar({
  name,
  phone,
  size = 36,
  title,
}: {
  name?: string | null;
  phone?: string | null;
  size?: number;
  title?: string;
}) {
  const label = initials(name, phone);
  return (
    <div
      className="flex items-center justify-center rounded-full bg-purple-500/30 border border-purple-400/40 text-xs font-semibold text-white select-none"
      style={{ width: size, height: size, lineHeight: `${size}px` }}
      aria-label="Inisial avatar"
      title={title ?? (name || phone || "User")}
    >
      {label}
    </div>
  );
}

/* ========= Portal ========= */
function Portal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(children, document.body);
}

/* ========= Sub: MobileAccordion ========= */
function MobileAccordion({
  title,
  items,
  openState,
  onNavigate,
}: {
  title: string;
  items: { href: string; label: string }[];
  openState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  onNavigate: () => void;
}) {
  const [open, setOpen] = openState;
  const panelId = `${title}-panel`;

  return (
    <div className="px-1">
      <button
        onClick={() => setOpen((s) => !s)}
        className="w-full flex items-center justify-between px-2 py-2 rounded-md hover:bg-[#220d3b] transition-colors"
        aria-expanded={open}
        aria-controls={panelId}
        type="button"
      >
        <span>{title}</span>
        <ChevronDown
          className={`transition-transform ${open ? "rotate-180" : ""}`}
          size={16}
        />
      </button>

      <div
        id={panelId}
        className={`grid transition-all duration-300 ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          {items.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              className="block px-4 py-2 rounded-md hover:bg-[#220d3b]"
              onClick={onNavigate}
            >
              {it.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ========= Navbar ========= */
export default function Navbar() {
  // --- Desktop hover dropdowns ---
  const [openPages, setOpenPages] = useState(false);
  const [openBlogs, setOpenBlogs] = useState(false);

  // --- Mobile UI ---
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mSearchOpen, setMSearchOpen] = useState(false);
  const [mPagesOpen, setMPagesOpen] = useState(false);
  const [mBlogsOpen, setMBlogsOpen] = useState(false);

  const { data: session, status } = useSession();
  const user = session?.user as
    | { name?: string | null; phone?: string | null; image?: string | null }
    | undefined;

  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);

  // Tutup drawer/search saat pindah halaman
  useEffect(() => {
    setDrawerOpen(false);
    setMSearchOpen(false);
  }, [pathname]);

  // Lock scroll saat drawer terbuka
  useEffect(() => {
    if (drawerOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const isActive = (href: string) =>
    pathname === href
      ? "text-purple-300 after:w-full"
      : "hover:text-purple-300 hover:after:w-full";

  // === Gating helper: arahkan ke login jika belum login ===
  const gateHref = (target: string) =>
    user ? target : `/login?mode=login&next=${encodeURIComponent(target)}`;

  const mainLinks = useMemo(
    () =>
      [
        { href: "/", label: "Beranda", auth: false },
        { href: "/profile", label: "Profil", auth: true },
        { href: "/deposit", label: "Deposit", auth: true },
      ] as { href: string; label: string; auth?: boolean }[],
    []
  );

  const quickLinks = useMemo(
  () =>
    [
      { href: "/recent", label: "Baru Dilihat", Icon: RefreshCw, auth: false },
      { href: "/wishlist", label: "Wishlist", Icon: Heart, auth: false },
      { href: "/wallet", label: "Wallet", Icon: Wallet, auth: true },
    ] as { href: string; label: string; Icon: LucideIcon; auth?: boolean }[],
  []
);


  // Pages (static)
  const pagesItems = useMemo(
    () => [
      { href: "/about", label: "Tentang Kami" },
      { href: "/faq", label: "FAQ" },
      { href: "/syaratketentuan", label: "Syarat & Ketentuan" },
    ],
    []
  );

  return (
    <header className="w-full fixed top-0 left-0 right-0 z-50 shadow-md bg-[#2a1246]/95 backdrop-blur-md text-white">
      {/* ======= TOP BAR (Desktop/Tablet) ======= */}
      <div className="hidden md:flex items-center justify-between px-[150px] py-8 max-[1200px]:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1">
          <Image
            src="/images/vercel.svg"
            alt="Logo SocioStore"
            width={30}
            height={30}
            className="rounded-full mt-[-15px] "
            priority
          />
          <span className="text-3xl font-bold tracking-wide">SOCIOSTORE</span>
        </Link>

        {/* Search */}
        <div className="hidden md:flex items-center border border-[#401a6b] rounded-md overflow-hidden max-w-3xl bg-[#220d3b]">
          <button
            className="flex items-center px-4 border-r border-[#401a6b] transition-colors duration-300 hover:text-purple-300"
            type="button"
          >
            Semua Kategori <ChevronDown size={16} className="ml-1" />
          </button>
          <input
            type="text"
            placeholder="Saya mencari..."
            className="flex-1 px-4 py-2 outline-none bg-transparent text-white placeholder-gray-400"
          />
          <button
            className="px-4 transition-colors duration-300 hover:text-purple-300"
            aria-label="Cari"
            type="button"
          >
            <Search size={20} />
          </button>
        </div>

        {/* Right Section (TOP) */}
        <div className="flex items-center gap-6 text-sm">
          {/* Support phone */}
          <div className="hidden lg:flex items-center gap-2">
            <Phone size={18} className="text-purple-300" />
            <div>
              <p className="text-[10px] text-gray-300">SUPPORT 24/7</p>
              <p className="font-medium">(+62) 8587-6846-768</p>
            </div>
          </div>

          <div className="hidden lg:block h-8 border-l border-[#401a6b]" />

          {/* Auth area */}
          {status === "loading" && (
            <div
              aria-busy="true"
              aria-label="Memuat status login"
              className="h-9 w-9 rounded-full border border-purple-400/40 animate-pulse"
            />
          )}

          {status !== "loading" && !user && (
            <>
              <Link
                href="/login?mode=login"
                className="flex items-center gap-1 transition-colors duration-300 hover:text-purple-300"
              >
                <UserIcon size={18} />
                <span>Masuk</span>
              </Link>
              <Link
                href="/login?mode=register"
                className="rounded-md border border-purple-500/40 px-3 py-1.5 font-medium transition hover:border-purple-400 hover:text-purple-300"
              >
                Daftar
              </Link>
            </>
          )}

          {status !== "loading" && user && (
            <div className="relative group">
              <button className="flex items-center gap-2" aria-haspopup="menu" aria-expanded="false">
                <Avatar
                  name={user?.name}
                  phone={user?.phone}
                  size={36}
                  title={user?.name ?? user?.phone ?? "Pengguna"}
                />
                <ChevronDown size={16} />
              </button>
              <ul className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all absolute right-0 mt-2 w-52 rounded-lg border border-[#401a6b] bg-[#2a1246] text-white shadow-xl pointer-events-none group-hover:pointer-events-auto">
                <li>
                  <Link href="/profile" className="block px-4 py-2 hover:bg-[#220d3b]">
                    Profil
                  </Link>
                </li>
                <li>
                  <Link href="/wallet" className="block px-4 py-2 hover:bg-[#220d3b]">
                    Wallet
                  </Link>
                </li>
                <li className="border-t border-[#401a6b]" />
                <li>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-[#220d3b]"
                  >
                    <LogOut size={16} /> Keluar
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* ======= BOTTOM BAR (Desktop/Tablet) ======= */}
      <nav className="hidden md:flex items-center justify-between px-[150px] py-5 border-t border-[#401a6b] text-sm font-medium max-[1200px]:px-6">
        {/* Left Menu */}
        <ul className="flex gap-8">
          <li>
            <Link
              href="/"
              className={`relative transition-colors duration-300 after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-purple-300 after:transition-all after:duration-300 ${isActive(
                "/"
              )}`}
            >
              Beranda
            </Link>
          </li>

          {/* Gated: Profil */}
          <li title={!user ? "Login untuk mengakses Profil" : undefined}>
            <Link
              href={gateHref("/profile")}
              aria-disabled={!user}
              className={`relative inline-flex items-center gap-1 transition-colors duration-300 after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-purple-300 after:transition-all after:duration-300 ${isActive(
                "/profile"
              )} ${!user ? "opacity-70 hover:opacity-80" : ""}`}
            >
              {!user && <Lock size={14} className="mr-1 opacity-80" />} Profil
            </Link>
          </li>

          {/* Gated: Deposit */}
          <li title={!user ? "Login untuk mengakses Deposit" : undefined}>
            <Link
              href={gateHref("/deposit")}
              aria-disabled={!user}
              className={`relative inline-flex items-center gap-1 transition-colors duration-300 after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-purple-300 after:transition-all after:duration-300 ${isActive(
                "/deposit"
              )} ${!user ? "opacity-70 hover:opacity-80" : ""}`}
            >
              {!user && <Lock size={14} className="mr-1 opacity-80" />} Deposit
            </Link>
          </li>

          {/* Dropdown Pages */}
          <li
            className="relative"
            onMouseEnter={() => setOpenPages(true)}
            onMouseLeave={() => setOpenPages(false)}
          >
            <button
              className="flex items-center transition-colors duration-300 hover:text-purple-300"
              type="button"
            >
              Pages <ChevronDown size={16} className="ml-1" />
            </button>
            {openPages && (
              <ul className="absolute left-0 mt-2 w-48 rounded-lg border border-[#401a6b] bg-[#2a1246] text-white shadow-xl">
                {pagesItems.map((p) => (
                  <li key={p.href}>
                    <Link href={p.href} className="block px-4 py-2 hover:bg-[#220d3b]">
                      {p.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>

          {/* Dropdown Blog */}
          <li
            className="relative"
            onMouseEnter={() => setOpenBlogs(true)}
            onMouseLeave={() => setOpenBlogs(false)}
          >
            <button
              className="flex items-center transition-colors duration-300 hover:text-purple-300"
              type="button"
            >
              Blog <ChevronDown size={16} className="ml-1" />
            </button>
            {openBlogs && (
              <ul className="absolute left-0 mt-2 w-44 rounded-lg border border-[#401a6b] bg-[#2a1246] text-white shadow-xl">
                <li>
                  <Link href="/blog/latest" className="block px-4 py-2 hover:bg-[#220d3b]">
                    Terbaru
                  </Link>
                </li>
                <li>
                  <Link href="/blog/trending" className="block px-4 py-2 hover:bg-[#220d3b]">
                    Trending
                  </Link>
                </li>
              </ul>
            )}
          </li>
        </ul>

        {/* Right Menu (BOTTOM) */}
        <ul className="flex gap-8">
          <li>
            <Link
              href="/recent"
              className="flex items-center gap-1 transition-colors duration-300 hover:text-purple-300"
            >
              <RefreshCw size={16} /> <span>Baru Dilihat</span>
            </Link>
          </li>
          <li>
            <Link
              href="/wishlist"
              className="flex items-center gap-1 transition-colors duration-300 hover:text-purple-300"
            >
              <Heart size={16} /> <span>Wishlist</span>
            </Link>
          </li>

          {/* Gated: Wallet */}
          <li className="hidden md:flex" title={!user ? "Login untuk mengakses Wallet" : undefined}>
            <Link
              href={gateHref("/wallet")}
              aria-disabled={!user}
              className={`flex items-center gap-1 transition-colors duration-300 hover:text-purple-300 ${
                !user ? "opacity-70 hover:opacity-80" : ""
              }`}
            >
              {!user && <Lock size={14} className="opacity-80" />} <Wallet size={18} />{" "}
              <span>Wallet</span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* ======= TOP BAR (Mobile) ======= */}
      <div className="md:hidden flex items-center justify-between px-4 py-3">
        <button
          onClick={() => setDrawerOpen(true)}
          className="p-2 rounded-md border border-[#401a6b] hover:bg-[#220d3b]"
          aria-label="Buka menu"
        >
          <Menu size={20} />
        </button>

        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/vercel.svg"
            alt="Logo SocioStore"
            width={20}
            height={20}
            className="rounded-full mt-[-10px]"
            priority
          />
          <span className="text-2xl font-bold tracking-wide">SOCIOSTORE</span>
        </Link>

        <button
          onClick={() => setMSearchOpen((s) => !s)}
          className="p-2 rounded-md border border-[#401a6b] hover:bg-[#220d3b]"
          aria-label="Buka pencarian"
        >
          <Search size={20} />
        </button>
      </div>

      {/* Mobile Search */}
      {mSearchOpen && (
        <div className="md:hidden px-4 pb-3">
          <div className="flex items-center border border-[#401a6b] rounded-md overflow-hidden bg-[#220d3b]">
            <button className="flex items-center px-3 border-r border-[#401a6b] text-sm" type="button">
              Semua <ChevronDown size={14} className="ml-1" />
            </button>
            <input
              type="text"
              placeholder="Saya mencari..."
              className="flex-1 px-3 py-2 outline-none bg-transparent text-white placeholder-gray-400 text-sm"
              aria-label="Kolom pencarian ponsel"
            />
            <button className="px-3" aria-label="Cari" type="button">
              <Search size={18} />
            </button>
          </div>
        </div>
      )}

      {/* ===== Overlay & Drawer via PORTAL ===== */}
      <Portal>
        {/* Overlay solid */}
        <div
          ref={overlayRef}
          className={`md:hidden fixed inset-0 bg-[#2a1246] z-[9998] transition-opacity ${
            drawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
          onClick={(e) => {
            if (e.target === overlayRef.current) setDrawerOpen(false);
          }}
        />
        {/* Drawer panel */}
        <aside
          className={`md:hidden fixed top-0 left-0 h-full w-[88%] max-w-[360px] bg-[#2a1246] text-white border-r border-[#401a6b] shadow-2xl z-[9999] transition-transform duration-300 ${
            drawerOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Menu ponsel"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#401a6b]">
            <Link href="/" className="flex items-center gap-2" onClick={() => setDrawerOpen(false)}>
              <Image
                src="/images/vercel.svg"
                alt="Logo SocioStore"
                width={36}
                height={36}
                className="rounded-full"
                priority
              />
              <span className="text-xl font-bold tracking-wide">SOCIOSTORE</span>
            </Link>
            <button
              onClick={() => setDrawerOpen(false)}
              className="p-2 rounded-md border border-[#401a6b] hover:bg-[#220d3b]"
              aria-label="Tutup menu"
            >
              <X size={20} />
            </button>
          </div>

          {/* Auth / Profile */}
          <div className="px-4 py-3 border-b border-[#401a6b]">
            {status === "loading" && (
              <div className="h-9 w-9 rounded-full border border-purple-400/40 animate-pulse" aria-busy="true" />
            )}

            {status !== "loading" && !user && (
              <div className="flex items-center justify-between gap-3">
                <Link
                  href="/login?mode=login"
                  className="flex-1 flex items-center justify-center gap-2 rounded-md border border-purple-500/40 px-3 py-2 font-medium transition hover:border-purple-400 hover:text-purple-300"
                  onClick={() => setDrawerOpen(false)}
                >
                  <UserIcon size={18} /> Masuk
                </Link>
                <Link
                  href="/login?mode=register"
                  className="flex-1 flex items-center justify-center gap-2 rounded-md bg-purple-600/20 border border-purple-500/40 px-3 py-2 font-medium transition hover:border-purple-400 hover:text-purple-200"
                  onClick={() => setDrawerOpen(false)}
                >
                  Daftar
                </Link>
              </div>
            )}

            {status !== "loading" && user && (
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar
                    name={user?.name}
                    phone={user?.phone}
                    size={40}
                    title={user?.name ?? user?.phone ?? "Pengguna"}
                  />
                  <div>
                    <p className="font-semibold leading-5">{user?.name ?? "Pengguna"}</p>
                    <p className="text-xs text-gray-300">{user?.phone ?? "—"}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setDrawerOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                  className="p-2 rounded-md border border-[#401a6b] hover:bg-[#220d3b]"
                  aria-label="Keluar"
                  title="Keluar"
                >
                  <LogOut size={18} />
                </button>
              </div>
            )}
          </div>

          {/* Links utama */}
          <nav className="px-2 py-2 space-y-1 text-sm">
            {mainLinks.map((l) => {
              const href = l.auth ? gateHref(l.href) : l.href;
              const disabled = !!l.auth && !user;
              return (
                <Link
                  key={l.href}
                  href={href}
                  aria-disabled={disabled}
                  title={disabled ? "Login untuk mengakses" : undefined}
                  className={`block px-3 py-2 rounded-md transition-colors ${
                    pathname === l.href ? "bg-[#220d3b] text-purple-200" : "hover:bg-[#220d3b]"
                  } ${disabled ? "opacity-70" : ""}`}
                  onClick={() => setDrawerOpen(false)}
                >
                  {disabled && <Lock size={14} className="inline mr-2 translate-y-[-1px] opacity-80" />}
                  {l.label}
                </Link>
              );
            })}

            {/* Pages accordion (dengan S&K) */}
            <MobileAccordion
              title="Pages"
              items={pagesItems}
              openState={[mPagesOpen, setMPagesOpen]}
              onNavigate={() => setDrawerOpen(false)}
            />

            {/* Blog accordion */}
            <MobileAccordion
              title="Blog"
              items={[
                { href: "/blog/latest", label: "Terbaru" },
                { href: "/blog/trending", label: "Trending" },
              ]}
              openState={[mBlogsOpen, setMBlogsOpen]}
              onNavigate={() => setDrawerOpen(false)}
            />
          </nav>

          {/* Quick actions */}
          <div className="mt-1 px-2 py-2 border-t border-[#401a6b]">
            <div className="grid grid-cols-3 gap-2">
              {quickLinks.map(({ href, label, Icon, auth }) => {
                const gatedHref = auth ? gateHref(href) : href;
                const disabled = !!auth && !user;
                return (
                  <Link
                    key={href}
                    href={gatedHref}
                    aria-disabled={disabled}
                    title={disabled ? "Login untuk mengakses" : undefined}
                    className={`flex flex-col items-center gap-1 rounded-lg border border-[#401a6b] py-3 hover:bg-[#220d3b] transition-colors ${
                      disabled ? "opacity-70" : ""
                    }`}
                    onClick={() => setDrawerOpen(false)}
                  >
                    <Icon size={18} />
                    <span className="text-xs">{label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Support footer */}
          <div className="mt-auto px-4 py-4 border-t border-[#401a6b]">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-[#220d3b] border border-[#401a6b]">
                <Phone size={18} className="text-purple-300" />
              </div>
              <div>
                <p className="text-[10px] text-gray-300">SUPPORT 24/7</p>
                <p className="font-medium">(+62) 8587-6846-768</p>
              </div>
            </div>
          </div>
        </aside>
      </Portal>
    </header>
  );
}
