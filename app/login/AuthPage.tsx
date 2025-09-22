"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion, type Variants, cubicBezier } from "framer-motion";
import { Loader2, LockIcon, User as UserIcon, CheckCircle2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { FaWhatsapp } from "react-icons/fa";

import dynamic from "next/dynamic";
const PhoneInput = dynamic(() => import("react-phone-input-2"), { ssr: false });
import "react-phone-input-2/lib/style.css";

const EASE_OUT = cubicBezier(0.16, 1, 0.3, 1);

/* ------------------------------ Page ------------------------------ */
export default function AuthPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const initialMode = (searchParams.get("mode") as "login" | "register") || "login";
  const [mode, setMode] = useState<"login" | "register">(initialMode);

  useEffect(() => {
    const current = searchParams.get("mode");
    if (current !== mode) {
      const query = new URLSearchParams(searchParams.toString());
      query.set("mode", mode);
      router.replace(`${pathname}?${query.toString()}`, { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const blob: Variants = useMemo(
    () => ({
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 0.65, scale: 1, transition: { duration: 1.2, ease: EASE_OUT } },
      hover: { scale: 1.03 },
    }),
    []
  );

  return (
    <main className="relative min-h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden bg-[#1a0d29] px-4 py-16">
      {/* Glow grid */}
      <div className="pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)]">
        <svg className="absolute -top-32 left-1/2 -translate-x-1/2" width="1400" height="900">
          <defs>
            <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#6d28d9" />
              <stop offset="1" stopColor="#22d3ee" />
            </linearGradient>
          </defs>
          <g fill="none" stroke="url(#g)" strokeOpacity=".15">
            {Array.from({ length: 22 }).map((_, r) => (
              <path key={r} d={`M0 ${r * 40} H 1400`} />
            ))}
            {Array.from({ length: 35 }).map((_, c) => (
              <path key={c} d={`M ${c * 40} 0 V 900`} />
            ))}
          </g>
        </svg>
      </div>

      {/* Floating blobs (muncul hanya ≥ sm) */}
      <motion.div
        variants={blob}
        initial="initial"
        animate="animate"
        whileHover="hover"
        className="hidden sm:block absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl bg-fuchsia-600/30"
      />
      <motion.div
        variants={blob}
        initial="initial"
        animate="animate"
        whileHover="hover"
        className="hidden sm:block absolute -bottom-28 -right-28 h-80 w-80 rounded-full blur-3xl bg-cyan-400/20"
      />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: EASE_OUT }}
        className="relative w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl backdrop-blur-xl"
      >
        <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-r from-fuchsia-500/20 to-cyan-400/20 [mask:linear-gradient(#000,transparent_30%)]" />

        {/* Tabs */}
        <div className="relative z-10 mb-6 grid grid-cols-2 rounded-xl bg-white/5 p-1">
          <button
            onClick={() => setMode("login")}
            className={`relative rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              mode === "login" ? "text-white" : "text-gray-300 hover:text-white/90"
            }`}
          >
            <span className="relative z-10">Masuk</span>
            {mode === "login" && (
              <motion.span
                layoutId="pill"
                className="absolute inset-0 rounded-lg bg-gradient-to-r from-fuchsia-600 to-indigo-600 shadow-[0_0_0_1px_rgba(255,255,255,0.1)_inset]"
              />
            )}
          </button>
          <button
            onClick={() => setMode("register")}
            className={`relative rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              mode === "register" ? "text-white" : "text-gray-300 hover:text-white/90"
            }`}
          >
            <span className="relative z-10">Daftar</span>
            {mode === "register" && (
              <motion.span
                layoutId="pill"
                className="absolute inset-0 rounded-lg bg-gradient-to-r from-fuchsia-600 to-indigo-600 shadow-[0_0_0_1px_rgba(255,255,255,0.1)_inset]"
              />
            )}
          </button>
        </div>

        {/* Forms */}
        <div className="relative z-10">
          <AnimatePresence mode="wait">
            {mode === "login" ? <LoginWithPasswordForm key="login" /> : <RegisterForm key="register" />}
          </AnimatePresence>
        </div>

        {/* Footer links */}
        <div className="relative z-10 mt-6 text-center text-sm text-gray-300">
          {mode === "login" ? (
            <p>
              Belum punya akun?{" "}
              <button onClick={() => setMode("register")} className="text-fuchsia-300 hover:underline">
                Daftar
              </button>
            </p>
          ) : (
            <p>
              Sudah punya akun?{" "}
              <button onClick={() => setMode("login")} className="text-fuchsia-300 hover:underline">
                Masuk
              </button>
            </p>
          )}
        </div>
      </motion.div>
    </main>
  );
}

/* -------------------- Tombol Google (inline, reusable) -------------------- */
function GoogleButton() {
  const [loading, setLoading] = useState(false);

  return (
    <button
      onClick={async () => {
        try {
          setLoading(true);
          const sp = new URLSearchParams(window.location.search);
          const callbackUrl = sp.get("callbackUrl") ?? "/";
          await signIn("google", { callbackUrl });
        } finally {
          setLoading(false);
        }
      }}
      disabled={loading}
      className="group relative w-full overflow-hidden rounded-lg border border-white/15 bg-white/[0.03] px-4 py-2 font-semibold text-white hover:bg-white/[0.06] disabled:opacity-70"
    >
      <span className="relative z-10 inline-flex items-center justify-center gap-2">
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        Masuk dengan Google
      </span>
      <span className="absolute inset-0 -translate-x-full bg-white/10 transition-transform duration-700 group-hover:translate-x-0" />
    </button>
  );
}

/* -------------------- Divider kecil -------------------- */
function OrDivider() {
  return (
    <div className="my-4 flex items-center gap-3">
      <div className="h-px flex-1 bg-white/10" />
      <span className="text-xs text-gray-400">atau</span>
      <div className="h-px flex-1 bg-white/10" />
    </div>
  );
}

/* -------------------- LOGIN -------------------- */
function LoginWithPasswordForm() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!/^\+\d{6,15}$/.test(phone)) return setError("Nomor telepon tidak valid.");
    if (!password) return setError("Kata sandi wajib diisi.");

    setLoading(true);
    try {
      const res = await signIn("credentials", {
        phone,
        password,
        redirect: false, // navigasi manual
      });

      if (res?.error) {
        setError("Login gagal. Periksa nomor/kata sandi.");
        return;
      }

      const sp = new URLSearchParams(window.location.search);
      const redirectTo = sp.get("callbackUrl") ?? "/";
      router.replace(redirectTo);
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25, ease: EASE_OUT }}
      onSubmit={onSubmit}
      className="space-y-4"
    >
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-md border border-red-800 bg-red-900/30 px-3 py-2 text-sm text-red-200"
        >
          {error}
        </motion.div>
      )}

      {/* Phone */}
      <Field
        label="Nomor WhatsApp"
        icon={<FaWhatsapp className="h-5 w-5 text-gray-400 group-focus-within:text-green-500" />}
      >
        <PhoneInput
          country={"id"}
          value={phone}
          onChange={(val) => setPhone("+" + val)}
          specialLabel=""                          // ← penting: hilangkan label "Phone"
          inputProps={{ name: "phone", autoComplete: "tel" }}
          inputStyle={{
            background: "#0f0820",
            color: "white",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "0.5rem",
            width: "100%",
            padding: "0.5rem 0.75rem",
          }}
          buttonStyle={{ background: "#0f0820", border: "none" }}
          dropdownStyle={{ background: "#1a0f2f", color: "white", zIndex: 9999 }}
        />
      </Field>

      {/* Password */}
      <Field label="Kata Sandi" icon={<LockIcon className="h-4 w-4" />}>
        <input
          type="password"
          placeholder="Kata sandi"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg bg-[#0f0820] border border-white/10 px-3 py-2 text-white placeholder-gray-400 outline-none ring-0 focus:border-fuchsia-400"
        />
      </Field>

      <div className="flex items-center justify-between text-sm">
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" className="accent-fuchsia-500" />
          <span className="text-white">Ingat saya</span>
        </label>
        <a href="/auth/forgot-password" className="text-white hover:underline">
          Lupa kata sandi
        </a>
      </div>

      <motion.button
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.98 }}
        disabled={loading}
        type="submit"
        className="group relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-fuchsia-600 to-indigo-600 px-4 py-2 font-semibold text-white disabled:opacity-70"
      >
        <span className="relative z-10 inline-flex items-center justify-center gap-2">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />} Masuk
        </span>
        <span className="absolute inset-0 -translate-x-full bg-white/10 transition-transform duration-700 group-hover:translate-x-0" />
      </motion.button>

      {/* Divider + Google */}
      <OrDivider />
      <GoogleButton />
    </motion.form>
  );
}

/* -------------------- REGISTER -------------------- */
function RegisterForm() {
  const [step, setStep] = useState<"form" | "otp" | "done">("form");
  const [values, setValues] = useState({ name: "", phone: "", password: "" });
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  // KIRIM OTP -> /api/otp
  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!values.name.trim()) return setError("Nama wajib diisi.");
    if (!/^\+\d{6,15}$/.test(values.phone)) return setError("Nomor telepon tidak valid.");
    if (!values.password || values.password.length < 6) return setError("Password minimal 6 karakter.");

    setLoading(true);
    try {
      const res = await fetch("/api/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: values.phone, purpose: "register" }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok) {
        setError(data?.message || "Gagal mengirim OTP. Coba lagi.");
        return;
      }
      setStep("otp");
    } catch {
      setError("Gagal mengirim OTP. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  // VERIFIKASI OTP + BUAT USER -> /api/register
  const verifyOtp = async () => {
    setError(null);
    if (!otp || otp.length !== 6) return setError("Masukkan kode OTP 6 digit.");

    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name.trim(),
          phone: values.phone,
          password: values.password,
          otp,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok) {
        setError(data?.message || "Verifikasi gagal.");
        return;
      }

      // Auto sign-in ke NextAuth
      const signed = await signIn("credentials", {
        phone: values.phone,
        password: values.password,
        redirect: false,
      });
      if (signed?.error) {
        setStep("done");
        setError("Akun dibuat, namun auto login gagal. Silakan login manual.");
        return;
      }

      setStep("done");
      const sp = new URLSearchParams(window.location.search);
      const redirectTo = sp.get("callbackUrl") ?? "/";
      router.replace(redirectTo);
    } catch {
      setError("Verifikasi gagal. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {step === "form" && (
        <motion.form
          key="register-form"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25, ease: EASE_OUT }}
          onSubmit={sendOtp}
          className="space-y-4"
        >
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-md border border-red-800 bg-red-900/30 px-3 py-2 text-sm text-red-200"
            >
              {error}
            </motion.div>
          )}

          <Field label="Nama Lengkap" icon={<UserIcon className="h-4 w-4" />}>
            <input
              type="text"
              name="name"
              placeholder="Nama lengkap"
              value={values.name}
              onChange={(e) => setValues((v) => ({ ...v, [e.target.name]: e.target.value }))}
              className="w-full rounded-lg bg-[#0f0820] border border-white/10 px-3 py-2 text-white placeholder-gray-400 outline-none ring-0 focus:border-fuchsia-400"
            />
          </Field>

          <Field
            label="Nomor WhatsApp"
            icon={<FaWhatsapp className="h-5 w-5 text-gray-400 group-focus-within:text-green-500" />}
          >
            <PhoneInput
              country={"id"}
              value={values.phone}
              onChange={(val) => setValues((s) => ({ ...s, phone: "+" + val }))}
              specialLabel=""                          // ← penting
              inputProps={{ name: "phone", autoComplete: "tel" }}
              inputStyle={{
                background: "#0f0820",
                color: "white",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "0.5rem",
                width: "100%",
                padding: "0.5rem 0.75rem",
              }}
              buttonStyle={{ background: "#0f0820", border: "none" }}
              dropdownStyle={{ background: "#1a0f2f", color: "white", zIndex: 9999 }}
            />
          </Field>

          <Field label="Password" icon={<LockIcon className="h-4 w-4" />}>
            <input
              type="password"
              name="password"
              placeholder="Password (min 6 karakter)"
              value={values.password}
              onChange={(e) => setValues((v) => ({ ...v, [e.target.name]: e.target.value }))}
              className="w-full rounded-lg bg-[#0f0820] border border-white/10 px-3 py-2 text-white outline-none ring-0 focus:border-fuchsia-400"
            />
          </Field>

          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            type="submit"
            className="group relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-fuchsia-600 to-indigo-600 px-4 py-2 font-semibold text-white disabled:opacity-70"
          >
            <span className="relative z-10 inline-flex items-center justify-center gap-2">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />} Kirim OTP via WhatsApp
            </span>
            <span className="absolute inset-0 -translate-x-full bg-white/10 transition-transform duration-700 group-hover:translate-x-0" />
          </motion.button>

          {/* Divider + Google */}
          <OrDivider />
          <GoogleButton />
        </motion.form>
      )}

      {step === "otp" && (
        <motion.div
          key="register-otp"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25, ease: EASE_OUT }}
          className="space-y-4"
        >
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-md border border-red-800 bg-red-900/30 px-3 py-2 text-sm text-red-200"
            >
              {error}
            </motion.div>
          )}

          <Field label="Kode OTP (6 digit)">
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="••••••"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/[^\d]/g, ""))}
              className="w-full rounded-lg bg-[#0f0820] border border-white/10 px-3 py-2 text-white placeholder-gray-400 outline-none ring-0 focus:border-fuchsia-400 tracking-widest text-center"
            />
          </Field>

          <div className="flex items-center justify-between text-sm text-gray-300">
            <button onClick={() => setStep("form")} className="hover:underline">
              Ganti nomor
            </button>
            <button
              disabled={loading}
              onClick={async () => {
                setError(null);
                try {
                  const res = await fetch("/api/otp", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ phone: values.phone, purpose: "register" }),
                  });
                  const data = await res.json().catch(() => ({}));
                  if (!res.ok || !data?.ok) setError(data?.message || "Gagal mengirim ulang OTP.");
                } catch {
                  setError("Gagal mengirim ulang OTP.");
                }
              }}
              className="text-fuchsia-300 hover:underline disabled:opacity-60"
            >
              Kirim ulang OTP
            </button>
          </div>

          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            onClick={verifyOtp}
            className="group relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-fuchsia-600 to-indigo-600 px-4 py-2 font-semibold text-white disabled:opacity-70"
          >
            <span className="relative z-10 inline-flex items-center justify-center gap-2">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />} Verifikasi OTP
            </span>
            <span className="absolute inset-0 -translate-x-full bg-white/10 transition-transform duration-700 group-hover:translate-x-0" />
          </motion.button>
        </motion.div>
      )}

      {step === "done" && (
        <motion.div
          key="register-done"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25, ease: EASE_OUT }}
          className="flex flex-col items-center justify-center gap-3 py-6 text-center text-green-300"
        >
          <CheckCircle2 className="h-10 w-10" />
          <p>Pendaftaran berhasil! Mengalihkan...</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* -------------------- FIELD WRAPPER -------------------- */
function Field({ label, icon, children }: { label: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="space-y-1 overflow-visible">
      <label className="text-sm text-gray-300">{label}</label>
      <div className="relative flex items-center rounded-lg border border-white/10 bg-[#0f0820] px-3 focus-within:border-fuchsia-400 overflow-visible">
        {icon && <div className="mr-2 flex-shrink-0 text-gray-400">{icon}</div>}
        <div className="flex-1 overflow-visible">{children}</div>
      </div>
    </div>
  );
}
