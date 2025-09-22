"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, CheckCircle2, ArrowLeft, Shield, PhoneCall } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import dynamic from "next/dynamic";

// Pakai dynamic agar aman dari SSR
const PhoneInput = dynamic(() => import("react-phone-input-2"), { ssr: false });
import "react-phone-input-2/lib/style.css";

export default function ForgotPasswordPage() {
  type Step = "phone" | "otp" | "reset" | "done";
  const [step, setStep] = useState<Step>("phone");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  // state
  const [phone, setPhone] = useState(""); // selalu simpan dengan "+"
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // fokus untuk border kotak input WA
  const [phoneFocused, setPhoneFocused] = useState(false);

  // resend timer
  const RESEND_SECONDS = 45;
  const [cooldown, setCooldown] = useState(0);
  useEffect(() => {
    if (!cooldown) return;
    const id = setInterval(() => setCooldown((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  function resetAlerts() {
    setError(null);
    setInfo(null);
  }

  // 1) Kirim OTP -> /api/otp { phone, purpose: "reset" }
  async function requestOtp() {
    resetAlerts();
    if (!/^\+\d{6,15}$/.test(phone)) {
      setError("Nomor harus format internasional, contoh: +62812xxxxxxxx");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, purpose: "reset" }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok) throw new Error(data?.message || "Gagal mengirim OTP");
      setStep("otp");
      setInfo("Kode OTP telah dikirim ke WhatsApp Anda.");
      setCooldown(RESEND_SECONDS);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Terjadi kesalahan. Coba lagi.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  // 2) Verifikasi OTP -> /api/otp/verify { phone, purpose: "reset", code }
  async function verifyOtp() {
    resetAlerts();
    if (!/^\d{6}$/.test(otp)) {
      setError("OTP harus 6 digit angka.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, purpose: "reset", code: otp }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok) throw new Error(data?.message || "OTP salah/kedaluwarsa");
      setStep("reset");
      setInfo("OTP terverifikasi. Silakan buat kata sandi baru.");
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Terjadi kesalahan. Coba lagi.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  // 3) Reset password -> /api/password/reset { phone, otp, newPassword }
  async function resetPassword() {
    resetAlerts();
    if (newPassword.length < 8) {
      setError("Kata sandi minimal 8 karakter.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp, newPassword }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok) throw new Error(data?.message || "Gagal reset sandi");
      setStep("done");
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Terjadi kesalahan. Coba lagi.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  function resendOtp() {
    if (cooldown > 0) return;
    requestOtp();
  }

  return (
    <main
      className={`
        min-h-[calc(100vh-80px)]
        bg-[#1a0d29] /* === MOBILE BG: sesuai permintaan === */
        px-4 py-8

        /* ===== Tablet/iPad (md) dapat grid 2 kolom khusus ===== */
        md:bg-gradient-to-b md:from-[#0b0616] md:to-[#140a26]
        md:px-6 md:py-12 md:grid md:grid-cols-2 md:gap-6 md:max-w-5xl md:mx-auto

        /* ===== Desktop (lg+) kembali ke tampilan awal (single card) ===== */
        lg:block lg:max-w-none
      `}
    >
      {/* ===== MOBILE TOP ACCENT (hanya mobile) ===== */}
      <div className="md:hidden pointer-events-none absolute inset-x-0 top-0 h-40">
        <div className="mx-auto h-full w-full max-w-md">
          <div className="absolute -left-10 top-6 h-24 w-24 rounded-full bg-fuchsia-500/20 blur-2xl" />
          <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-purple-500/20 blur-2xl" />
        </div>
      </div>

      {/* ===== MOBILE HERO (hanya <md) ===== */}
      <div className="mb-6 md:hidden">
        <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-gradient-to-br from-purple-600 to-fuchsia-500/80 p-2.5 shadow-lg shadow-purple-500/20">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white">Lupa Kata Sandi</h1>
              <p className="text-xs text-gray-300">Atur ulang sandi dengan verifikasi WhatsApp.</p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-gray-300/90">
            <PhoneCall className="h-4 w-4 text-purple-300" />
            Gunakan nomor aktif yang terhubung WhatsApp.
          </div>
        </div>
      </div>

      {/* ===== TABLET/iPAD ASIDE (khusus md; disembunyikan di desktop agar desktop tetap sama) ===== */}
      <aside className="hidden md:flex lg:hidden">
        <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur">
          {/* aksen gradient */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full bg-fuchsia-500/20 blur-2xl"></div>
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-purple-500/20 blur-2xl"></div>

          <div className="relative">
            <h2 className="text-xl font-bold text-white">Aman & Cepat</h2>
            <p className="mt-2 text-sm text-gray-300">
              Proses verifikasi dilakukan via WhatsApp. Kode OTP berlaku 10 menit.
            </p>

            <ul className="mt-6 space-y-3 text-sm text-gray-200">
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-block h-2.5 w-2.5 rounded-full bg-purple-400" />
                Verifikasi <span className="mx-1 font-semibold text-white">6 digit</span> yang dikirim ke WA.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-block h-2.5 w-2.5 rounded-full bg-fuchsia-400" />
                Hindari membagikan kode OTP kepada siapa pun.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-block h-2.5 w-2.5 rounded-full bg-emerald-400" />
                Gunakan kata sandi minimal <span className="mx-1 font-semibold text-white">8 karakter</span>.
              </li>
            </ul>

            <div className="mt-6 flex items-center gap-3 text-sm text-gray-300">
              <div className="rounded-xl bg-[#0f0820] p-2">
                <FaWhatsapp className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <div className="font-medium text-white">Bantuan WhatsApp</div>
                <a
                  href="https://wa.me/6285876846768"
                  className="text-xs text-purple-300 hover:text-purple-200"
                >
                  Chat Admin
                </a>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ===== FORM WRAPPER ===== */}
      {/* md: col-span-1 agar berdampingan dgn aside; lg+: balik ke center single card */}
      <div className="mx-auto w-full max-w-md md:col-span-1">
        {/* Link back: tampil di semua ukuran */}
        <div className="mb-4">
          <Link
            href="/login?mode=login"
            className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Kembali ke Login
          </Link>
        </div>

        {/* ===== CARD FORM ===== */}
        {/* Desktop (lg+) tetap seperti versi awal: border, bg, spacing sama */}
        {/* Mobile/Tablet: card sedikit lebih glassy & beraksen */}
        <div
          className={`
            rounded-2xl border border-white/10 bg-white/[0.03] p-6
            shadow-[0_10px_30px_rgba(0,0,0,0.25)]

            md:bg-white/[0.05] md:backdrop-blur

            lg:bg-white/[0.03]  /* jaga agar desktop tetap sama feel-nya */
          `}
        >
          {/* Header: tampil untuk md+ dan lg sama, mobile pakai hero di atas */}
          <div className="hidden md:block">
            <h1 className="mb-1 text-xl font-semibold text-white">Lupa Kata Sandi</h1>
            <p className="mb-6 text-sm text-gray-300">Atur ulang sandi dengan verifikasi WhatsApp.</p>
          </div>

          <Stepper step={step} />

          {info && (
            <div
              role="status"
              aria-live="polite"
              className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300"
            >
              {info}
            </div>
          )}
          {error && (
            <div
              role="alert"
              aria-live="assertive"
              className="mb-4 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-300"
            >
              {error}
            </div>
          )}

          {step === "phone" && (
            <section className="space-y-4">
              <Field
                label="Nomor WhatsApp"
                icon={
                  <FaWhatsapp className="h-5 w-5 text-gray-400 group-focus-within:text-green-500" />
                }
                focused={phoneFocused}
              >
                <PhoneInput
                  country={"id"}
                  value={phone.replace(/^\+/, "")}
                  onChange={(val) => setPhone(val.startsWith("+") ? val : "+" + val)}
                  inputProps={{
                    name: "phone",
                    required: true,
                    autoFocus: true,
                    onFocus: () => setPhoneFocused(true),
                    onBlur: () => setPhoneFocused(false),
                  }}
                  // Border dari wrapper Field saja
                  inputStyle={{
                    background: "#0f0820",
                    color: "white",
                    border: "none",
                    width: "100%",
                  }}
                  buttonStyle={{ background: "#0f0820", border: "none" }}
                  dropdownStyle={{ background: "#1a0f2f", color: "white", zIndex: 9999 }}
                />
              </Field>

              <button
                onClick={requestOtp}
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 px-4 py-2.5 font-semibold text-white shadow-lg shadow-purple-500/20 hover:opacity-95 active:scale-[0.99] disabled:opacity-50"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Mengirim...
                  </span>
                ) : (
                  "Kirim Kode"
                )}
              </button>
              <p className="text-xs text-gray-400">Kami akan mengirim kode 6 digit ke WhatsApp Anda.</p>
            </section>
          )}

          {step === "otp" && (
            <section className="space-y-4">
              <div>
                <label className="mb-1 block text-sm text-gray-300">Masukkan Kode OTP</label>
                <input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^\d]/g, ""))}
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="••••••"
                  className="
                    w-full rounded-xl border border-white/10 bg-[#0f0820] px-3 py-3 text-white
                    outline-none focus:border-purple-400 tracking-[0.6em] text-center text-lg
                  "
                />
              </div>
              <button
                onClick={verifyOtp}
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 px-4 py-2.5 font-semibold text-white shadow-lg shadow-purple-500/20 hover:opacity-95 active:scale-[0.99] disabled:opacity-50"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Memverifikasi...
                  </span>
                ) : (
                  "Verifikasi"
                )}
              </button>

              <button
                type="button"
                onClick={resendOtp}
                disabled={cooldown > 0 || loading}
                className="w-full rounded-xl border border-white/10 px-4 py-2.5 text-white hover:border-white/20 disabled:opacity-50"
              >
                {cooldown > 0 ? `Kirim ulang kode (${cooldown}s)` : "Kirim ulang kode"}
              </button>

              <p className="text-xs text-gray-400">Kode berlaku 10 menit.</p>
            </section>
          )}

          {step === "reset" && (
            <section className="space-y-4">
              <div>
                <label className="mb-1 block text-sm text-gray-300">Kata sandi baru</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimal 8 karakter"
                  className="w-full rounded-xl border border-white/10 bg-[#0f0820] px-3 py-3 text-white outline-none focus:border-purple-400"
                />
              </div>
              <button
                onClick={resetPassword}
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 px-4 py-2.5 font-semibold text-white shadow-lg shadow-purple-500/20 hover:opacity-95 active:scale-[0.99] disabled:opacity-50"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Menyimpan...
                  </span>
                ) : (
                  "Simpan Kata Sandi"
                )}
              </button>
            </section>
          )}

          {step === "done" && (
            <section className="flex flex-col items-center gap-4 py-6 text-center">
              <CheckCircle2 className="h-12 w-12 text-emerald-400" />
              <div>
                <h2 className="text-lg font-semibold text-white">Kata sandi berhasil direset</h2>
                <p className="mt-1 text-sm text-gray-300">Silakan masuk dengan sandi baru Anda.</p>
              </div>
              <Link
                href="/login?mode=login"
                className="rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
              >
                Kembali ke Login
              </Link>
            </section>
          )}
        </div>

        {/* FOOTNOTE MOBILE (rapi hanya di mobile) */}
        <div className="mt-4 grid gap-3 md:hidden">
          <div className="rounded-xl border border-white/10 bg-white/[0.06] p-3 text-xs text-gray-300">
            <span className="font-medium text-white">Tips:</span> pastikan sinyal WhatsApp stabil agar OTP cepat masuk.
          </div>
        </div>
      </div>
    </main>
  );
}

/* ====== Komponen Stepper & Field ====== */

function Stepper({ step }: { step: "phone" | "otp" | "reset" | "done" }) {
  const steps = [
    { key: "phone", label: "Nomor" },
    { key: "otp", label: "OTP" },
    { key: "reset", label: "Sandi Baru" },
  ] as const;

  const activeIndex = steps.findIndex((s) => s.key === step);

  return (
    <div className="mb-6 grid grid-cols-3 gap-2">
      {steps.map((s, idx) => (
        <div
          key={s.key}
          className={`rounded-lg border px-3 py-2 text-center text-xs transition
            ${idx <= activeIndex ? "border-purple-400/40 bg-purple-500/10 text-white" : "border-white/10 bg-white/[0.03] text-gray-300"}
          `}
        >
          {s.label}
        </div>
      ))}
    </div>
  );
}

function Field({
  label,
  icon,
  children,
  focused,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  focused?: boolean;
}) {
  return (
    <div className="space-y-1 overflow-visible">
      <label className="text-sm text-gray-300">{label}</label>
      <div
        className={[
          "relative flex items-center rounded-xl px-3 overflow-visible bg-[#0f0820]",
          "border transition-colors duration-150",
          focused ? "border-fuchsia-400 ring-1 ring-fuchsia-400/40" : "border-white/10",
          "focus-within:border-fuchsia-400 focus-within:ring-1 focus-within:ring-fuchsia-400/40",
        ].join(" ")}
      >
        {icon && <div className="mr-2 flex-shrink-0 text-gray-400">{icon}</div>}
        <div className="flex-1 overflow-visible">{children}</div>
      </div>
    </div>
  );
}
