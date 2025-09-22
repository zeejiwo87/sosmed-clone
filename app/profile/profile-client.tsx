// app/profile/profile-client.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { User, Mail, Phone, ShieldCheck, Settings, Loader2 } from "lucide-react";
import type { Session } from "next-auth";

/** Avatar inisial sederhana */
function initials(name?: string | null, phone?: string | null) {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/).slice(0, 2);
    const txt = parts.map((p) => p[0]?.toUpperCase()).join("");
    return txt || "U";
  }
  if (phone) {
    const last4 = phone.replace(/\D/g, "").slice(-4);
    return last4 ? `*${last4}` : "U";
  }
  return "U";
}

function InitialAvatar({
  name,
  phone,
  size = 80,
  className = "",
}: {
  name?: string | null;
  phone?: string | null;
  size?: number;
  className?: string;
}) {
  const key = (name || phone || "U").toLowerCase();
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  const hues = [270, 210, 330, 190, 250, 300, 220, 280];
  const hue = hues[h % hues.length];
  const bg = `hsl(${hue} 70% 22% / 1)`;
  const fontSize = Math.max(12, Math.floor(size * 0.4));

  return (
    <div
      className={`flex items-center justify-center rounded-full border border-white/15 text-white font-semibold select-none ${className}`}
      style={{ width: size, height: size, background: bg, fontSize }}
      role="img"
      aria-label="Avatar inisial"
    >
      {initials(name, phone)}
    </div>
  );
}

/** --------- PAGE (Client) --------- */
export default function ProfileClient({ session: serverSession }: { session: Session }) {
  const { data: clientSession, status, update } = useSession();
  const router = useRouter();

  // Pakai session dari client jika sudah siap; fallback ke server
  const session = clientSession ?? serverSession;

  type SessionUser = {
    id: string;
    name?: string | null;
    phone?: string | null;
    image?: string | null; // tidak dipakai lagi untuk avatar inisial
  };
  const user = session?.user as SessionUser | undefined;

  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "settings">("overview");
  const [name, setName] = useState<string>(user?.name ?? "");

  // Redirect kalau belum login (fallback; server sudah handle redirect juga)
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login?mode=login");
    }
  }, [status, router]);

  // Sambil nunggu session client
  if (status === "loading" && !session) {
    return (
      <main className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gradient-to-b from-[#0b0616] to-[#140a26]">
        <div className="inline-flex items-center gap-2 text-white/90">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Memuat profil...</span>
        </div>
      </main>
    );
  }

  if (!session?.user || !user) return null;

  const displayName = user.name || user.phone || "Pengguna";
  const displayPhone = user.phone || "—";
  const displayEmail = "—"; // belum ada email di DB

  // ---- Simpan perubahan profil (hanya name)
  async function onSave() {
    if (!user) return;

    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }), // hanya nama
    });

    if (!res.ok) {
      console.error("Gagal update profil");
      return;
    }

    const updated: { id: string; name?: string | null; phone?: string | null } = await res.json();

    setName(updated.name ?? "");

    const newUser: SessionUser = {
      id: user.id,
      name: updated.name ?? null,
      phone: user.phone ?? null,
      image: null, // avatar URL tidak dipakai
    };

    await update({ user: newUser });
  }

  return (
    <main className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-[#1a0d29] to-[#140a26] px-4 py-8 md:py-10">
      <div className="mx-auto w-full max-w-5xl space-y-6 md:space-y-8">
        {/* ===== Header Card ===== */}
        <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 md:p-6 backdrop-blur">
          <div className="pointer-events-none absolute -top-24 -left-24 h-56 w-56 rounded-full bg-fuchsia-600/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            {/* Kiri: avatar + nama */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-center sm:text-left">
              <InitialAvatar name={user.name} phone={user.phone} size={80} className="mx-auto sm:mx-0" />
              <div>
                <h1 className="text-lg sm:text-xl font-semibold text-white">{displayName}</h1>
                <p className="text-xs sm:text-sm text-gray-300">
                  Kelola profil, pesanan, dan keamanan akun.
                </p>
              </div>
            </div>

            {/* Kanan: actions */}
            <div className="flex flex-col sm:flex-row gap-2">
              <Link
                href="/wallet"
                className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/90 hover:border-white/20 text-center"
              >
                Lihat Saldo
              </Link>
              <Link
                href="/deposit"
                className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-500 text-center"
              >
                Top Up
              </Link>
            </div>
          </div>
        </section>

        {/* ===== Tabs ===== */}
        <div className="-mx-4 px-4 md:mx-0 md:px-0">
          <div className="flex gap-2 overflow-x-auto rounded-xl border border-white/10 bg-white/[0.03] p-1">
            {[
              { key: "overview", label: "Ringkasan" },
              { key: "orders", label: "Pesanan" },
              { key: "settings", label: "Pengaturan" },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key as typeof activeTab)}
                className={`relative rounded-lg px-4 py-2 text-sm transition min-w-fit ${
                  activeTab === (t.key as typeof activeTab) ? "text-white" : "text-gray-300 hover:text-white"
                }`}
              >
                {t.label}
                {activeTab === (t.key as typeof activeTab) && (
                  <span className="absolute inset-0 -z-10 rounded-lg bg-white/10" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ===== Content ===== */}
        {activeTab === "overview" && <OverviewSection email={displayEmail} phone={displayPhone} />}
        {activeTab === "orders" && <OrdersSection />}
        {activeTab === "settings" && (
          <SettingsSection
            name={name}
            setName={setName}
            onSave={onSave}
            onSignOut={() => signOut({ callbackUrl: "/" })}
          />
        )}
      </div>
    </main>
  );
}

/** --------- SECTIONS --------- */
function OverviewSection({ email, phone }: { email: string; phone: string }) {
  const emailVerified = false;
  return (
    <section className="grid gap-5 md:gap-6 md:grid-cols-2">
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 md:p-6">
        <h2 className="mb-4 flex items-center gap-2 text-base md:text-lg font-semibold text-white">
          <User className="h-5 w-5 text-purple-300" /> Data Profil
        </h2>
        <ul className="space-y-3 text-sm text-gray-200">
          <li className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-gray-400" /> {email}
          </li>
          <li className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-gray-400" /> {phone}
          </li>
          <li className="flex items-center gap-2">
            <ShieldCheck className={`h-4 w-4 ${emailVerified ? "text-emerald-400" : "text-gray-400"}`} />
            {emailVerified ? "Email terverifikasi" : "Email belum tersedia"}
          </li>
        </ul>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 md:p-6">
        <h2 className="mb-4 text-base md:text-lg font-semibold text-white">Statistik</h2>
        <div className="grid grid-cols-3 gap-3 md:gap-4 text-center">
          <StatBox label="Pesanan" value="0" />
          <StatBox label="Saldo" value="Rp 0" />
          <StatBox label="Wishlist" value="0" />
        </div>
      </div>
    </section>
  );
}

function OrdersSection() {
  const orders = useMemo(
    () => [
      { id: "INV-0012", item: "TikTok Live Viewers", qty: "1k", price: "Rp 60.000", status: "Selesai" },
      { id: "INV-0011", item: "Instagram Followers", qty: "1k", price: "Rp 25.000", status: "Proses" },
      { id: "INV-0010", item: "YouTube Subscribers", qty: "1k", price: "Rp 26.000", status: "Dibatalkan" },
    ],
    []
  );

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 md:p-6">
      <h2 className="mb-4 text-base md:text-lg font-semibold text-white">Riwayat Pesanan</h2>
      <div className="overflow-x-auto">
        <table className="min-w-[640px] w-full text-left text-xs sm:text-sm text-gray-200">
          <thead className="text-gray-300">
            <tr>
              <th className="border-b border-white/10 px-3 py-2">Invoice</th>
              <th className="border-b border-white/10 px-3 py-2">Item</th>
              <th className="border-b border-white/10 px-3 py-2">Qty</th>
              <th className="border-b border-white/10 px-3 py-2">Harga</th>
              <th className="border-b border-white/10 px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-white/5">
                <td className="border-b border-white/5 px-3 py-2">{o.id}</td>
                <td className="border-b border-white/5 px-3 py-2">{o.item}</td>
                <td className="border-b border-white/5 px-3 py-2">{o.qty}</td>
                <td className="border-b border-white/5 px-3 py-2">{o.price}</td>
                <td className="border-b border-white/5 px-3 py-2">
                  <StatusPill status={o.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-gray-400">*Data contoh. Hubungkan ke API untuk data asli.</p>
    </section>
  );
}

function SettingsSection({
  name,
  setName,
  onSave,
  onSignOut,
}: {
  name: string;
  setName: (v: string) => void;
  onSave: () => Promise<void>;
  onSignOut: () => void;
}) {
  return (
    <section className="grid gap-5 md:gap-6 md:grid-cols-2">
      {/* Update Profile */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 md:p-6">
        <h2 className="mb-4 flex items-center gap-2 text-base md:text-lg font-semibold text-white">
          <Settings className="h-5 w-5 text-purple-300" /> Pengaturan Akun
        </h2>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs md:text-sm text-gray-300">Nama</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama lengkap"
              className="w-full rounded-lg border border-white/10 bg-[#0f0820] px-3 py-2 text-white outline-none focus:border-purple-400"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={onSave}
              className="w-full sm:w-auto rounded-lg bg-purple-600 px-4 py-2 font-semibold text-white hover:bg-purple-500"
            >
              Simpan
            </button>
            <button
              type="button"
              onClick={onSignOut}
              className="w-full sm:w-auto rounded-lg border border-white/10 px-4 py-2 text-white hover:border-white/20"
            >
              Keluar
            </button>
            {/* Tombol Ubah Kata Sandi */}
            <a
              href="http://localhost:3000/auth/forgot-password"
              className="w-full sm:w-auto rounded-lg border border-purple-500/40 px-4 py-2 text-purple-300 hover:bg-purple-600/20 text-center"
            >
              Ubah Kata Sandi
            </a>
          </div>
        </div>
      </div>


      {/* Security */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 md:p-6">
        <h2 className="mb-4 flex items-center gap-2 text-base md:text-lg font-semibold text-white">
          <ShieldCheck className="h-5 w-5 text-emerald-400" /> Keamanan
        </h2>
        <ul className="space-y-3 text-sm text-gray-200">
          <li>• Ubah password secara berkala.</li>
          <li>• Aktifkan verifikasi dua langkah (2FA) jika tersedia.</li>
          <li>• Jangan bagikan OTP atau password ke siapa pun.</li>
        </ul>
      </div>
    </section>
  );
}

/** --------- UTILS --------- */
function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-4 md:py-5">
      <div className="text-xl md:text-2xl font-bold text-white">{value}</div>
      <div className="text-[11px] md:text-xs text-gray-300">{label}</div>
    </div>
  );
}

function StatusPill({ status }: { status: "Selesai" | "Proses" | "Dibatalkan" | string }) {
  const styles =
    status === "Selesai"
      ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
      : status === "Proses"
      ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
      : "bg-rose-500/15 text-rose-300 border-rose-500/30";
  return <span className={`rounded-full border px-2 py-0.5 text-[11px] sm:text-xs ${styles}`}>{status}</span>;
}
