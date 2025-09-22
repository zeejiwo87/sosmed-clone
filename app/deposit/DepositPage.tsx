// app/deposit/DepositPage.tsx
"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import {
  CreditCard,
  QrCode,
  Landmark,
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle,
  Info,
} from "lucide-react";
import { useBalanceStore } from "@/lib/useBalanceStore"; // sambungkan ke global saldo

// ===================== Data & Utils =====================
type AutoCode = "QRIS" | "BCAVA" | "BRIVA" | "BNIVA" | "PERMATAVA" | "MANDIRIVA";
type ManualCode = "DANA" | "BCA_TRANSFER" | "OVO" | "GOPAY" | "SHOPEEPAY";
type AnyMethod = AutoCode | ManualCode;

const AUTO_METHODS: { code: AutoCode; name: string; desc: string }[] = [
  { code: "QRIS", name: "QRIS (Otomatis)", desc: "Scan QR — verifikasi otomatis" },
  { code: "BCAVA", name: "BCA VA", desc: "Virtual Account BCA (otomatis)" },
  { code: "BRIVA", name: "BRI VA", desc: "Virtual Account BRI (otomatis)" },
  { code: "BNIVA", name: "BNI VA", desc: "Virtual Account BNI (otomatis)" },
  { code: "PERMATAVA", name: "Permata VA", desc: "Virtual Account Permata (otomatis)" },
  { code: "MANDIRIVA", name: "Mandiri VA", desc: "Virtual Account Mandiri (otomatis)" },
];

const MANUAL_METHODS: { code: ManualCode; name: string; desc: string }[] = [
  { code: "DANA", name: "DANA (Manual)", desc: "Kirim bukti transfer" },
  { code: "BCA_TRANSFER", name: "BCA Transfer (Manual)", desc: "Kirim bukti transfer" },
  { code: "OVO", name: "OVO (Manual)", desc: "Kirim bukti transfer" },
  { code: "GOPAY", name: "GoPay (Manual)", desc: "Kirim bukti transfer" },
  { code: "SHOPEEPAY", name: "ShopeePay (Manual)", desc: "Kirim bukti transfer" },
];

const formatRupiah = (v: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(v);

// Contoh biaya admin simulasi
const calcFee = (method: AnyMethod, amount: number) => {
  if (!amount) return 0;
  const base = method === "QRIS" ? 0.007 : (String(method).endsWith("VA") ? 0.003 : 0); // 0.7% QRIS, 0.3% VA, manual 0
  const min = method === "QRIS" ? 1000 : (String(method).endsWith("VA") ? 500 : 0);
  return Math.max(Math.round(amount * base), min);
};

type Status = "Menunggu" | "Berhasil" | "Gagal";
type HistoryRow = {
  id: string;
  waktu: string; // ISO
  metode: string;
  nominal: number;
  biaya: number;
  total: number;
  status: Status;
  jenis: "OTOMATIS" | "MANUAL";
};

// ===================== Page =====================
export default function DepositPage({ nowISO }: { nowISO: string }) {
  // ====== GLOBAL SALDO (Zustand) ======
  const balance = useBalanceStore((s) => s.balance);
  const depositToBalance = useBalanceStore((s) => s.deposit);

  // ====== Local state UI ======
  const [tab, setTab] = useState<"OTOMATIS" | "MANUAL">("OTOMATIS");
  const [selected, setSelected] = useState<AnyMethod>("QRIS");
  const [amount, setAmount] = useState<string>("");

  // Gunakan snapshot SERVER untuk init riwayat → stabil SSR vs Client
  const now = new Date(nowISO).getTime();
  const [history, setHistory] = useState<HistoryRow[]>(() => [
    {
      id: "DP-0012",
      waktu: new Date(now - 24 * 3600 * 1000).toISOString(),
      metode: "BCA VA",
      nominal: 100_000,
      biaya: 500,
      total: 100_500,
      status: "Berhasil",
      jenis: "OTOMATIS",
    },
    {
      id: "DP-0011",
      waktu: new Date(now - 48 * 3600 * 1000).toISOString(),
      metode: "DANA (Manual)",
      nominal: 50_000,
      biaya: 0,
      total: 50_000,
      status: "Menunggu",
      jenis: "MANUAL",
    },
  ]);

  // daftar metode sesuai tab
  const methods = useMemo(() => (tab === "OTOMATIS" ? AUTO_METHODS : MANUAL_METHODS), [tab]);

  // pastikan selected valid saat pindah tab (FIX pakai useEffect)
  useEffectFixSelected(tab, selected, setSelected);

  const numericAmount = useMemo(() => Number((amount || "0").replace(/[^\d]/g, "")), [amount]);
  const fee = useMemo(() => calcFee(selected, numericAmount), [selected, numericAmount]);
  const total = numericAmount + fee;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!numericAmount || numericAmount < 10000) {
      alert("Minimal deposit Rp 10.000");
      return;
    }
    const label = getMethodLabel(selected);

    // Tambahkan ke riwayat (operasi setelah mount → tidak mengganggu hydration)
    const row: HistoryRow = {
      id: "DP-" + String(history.length + 13).padStart(4, "0"),
      waktu: new Date().toISOString(),
      metode: label,
      nominal: numericAmount,
      biaya: fee,
      total,
      status: "Menunggu",
      jenis: tab,
    };
    setHistory((h) => [row, ...h]);

    // Tambah SALDO GLOBAL
    depositToBalance(numericAmount);

    alert(
      `Deposit dibuat: ${label}\nNominal Masuk: ${formatRupiah(numericAmount)}\nSaldo sekarang: ${formatRupiah(
        balance + numericAmount
      )}`
    );
  };

  return (
    <main className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-[#1a0d29] to-[#140a26] px-4 py-10">
      <div className="mx-auto w-full max-w-6xl space-y-8">
        {/* BreadCrumb */}
        <div className="text-sm text-gray-300">
          <Link href="/" className="hover:underline">Beranda</Link>
          <span className="mx-2">/</span>
          <span className="text-white">Deposit</span>
        </div>

        {/* Header */}
        <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur">
          <div className="absolute -top-24 -left-24 h-56 w-56 rounded-full bg-fuchsia-600/20 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="relative z-10">
            <h1 className="text-2xl font-bold text-white">Deposit Saldo</h1>
            <p className="mt-1 text-sm text-gray-300">
              Pilih metode pembayaran, masukkan nominal, lalu buat permintaan deposit.
            </p>

            {/* Info saldo saat ini */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-gray-200">
                <Info className="h-4 w-4 text-cyan-300" />
                Proses otomatis: saldo terisi setelah pembayaran tervalidasi (simulasi: langsung menambah saldo).
              </div>
              <div className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200">
                Saldo saat ini: <strong className="text-emerald-300">{formatRupiah(balance)}</strong>
              </div>
            </div>
          </div>
        </section>

        {/* Card utama */}
        <section className="grid gap-6 md:grid-cols-3">
          {/* Pilih metode */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:col-span-2">
            {/* Tabs */}
            <div className="mb-4 inline-flex rounded-xl border border-white/10 bg-white/[0.03] p-1">
              {(["OTOMATIS", "MANUAL"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`relative rounded-lg px-4 py-2 text-sm transition ${
                    tab === t ? "text-white" : "text-gray-300 hover:text-white"
                  }`}
                >
                  {t === "OTOMATIS" ? "Otomatis (VA/QRIS)" : "Manual (E-Wallet/Transfer)"}
                  {tab === t && <span className="absolute inset-0 -z-10 rounded-lg bg-white/10" />}
                </button>
              ))}
            </div>

            {/* Grid metode */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {methods.map((m) => (
                <label
                  key={m.code}
                  className={`cursor-pointer rounded-xl border p-4 transition ${
                    selected === m.code
                      ? "border-purple-400 bg-purple-500/10"
                      : "border-white/10 bg-white/[0.03] hover:border-white/20"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-lg bg-white/10 p-2">
                      {tab === "OTOMATIS" ? <QrCode className="h-5 w-5" /> : <Landmark className="h-5 w-5" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-white">{m.name}</p>
                        <input
                          type="radio"
                          name="paymethod"
                          checked={selected === (m.code as AnyMethod)}
                          onChange={() => setSelected(m.code as AnyMethod)}
                          className="accent-purple-500"
                        />
                      </div>
                      <p className="text-xs text-gray-300">{m.desc}</p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Ringkasan & Form */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-white">
              <CreditCard className="h-5 w-5 text-purple-300" /> Detail Deposit
            </h3>

            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm text-gray-300">Metode</label>
                <div className="rounded-lg border border-white/10 bg-[#0f0820] px-3 py-2 text-white">
                  {getMethodLabel(selected)}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-300">Nominal</label>
                <input
                  inputMode="numeric"
                  placeholder="cth: 100000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-[#0f0820] px-3 py-2 text-white outline-none focus:border-purple-400"
                />
                <p className="mt-1 text-xs text-gray-400">Minimal Rp 10.000</p>
                <div className="mt-2 grid grid-cols-3 gap-2">
                {[50000, 100000, 200000].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setAmount(String(n))}
                    className="rounded-lg border border-violet-500/30 bg-violet-700/40 px-3 py-2 text-sm text-white hover:border-violet-400"
                  >
                    {formatRupiah(n)}
                  </button>
                ))}
              </div>

              </div>

              <div className="space-y-1 rounded-lg border border-white/10 bg-white/[0.02] p-3 text-sm">
                <Row label="Subtotal" value={formatRupiah(numericAmount || 0)} />
                <Row label="Biaya Admin" value={formatRupiah(fee)} />
                <div className="h-px bg-white/10" />
                <Row label="Total" value={formatRupiah(total)} bold />
              </div>

              <button
                type="submit"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-fuchsia-600 to-indigo-600 px-4 py-2 font-semibold text-white transition hover:opacity-95 disabled:opacity-60"
                disabled={!numericAmount || numericAmount < 10000}
              >
                Lanjutkan
                <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </button>
            </form>
          </div>
        </section>

        {/* Riwayat Deposit */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">Riwayat Deposit</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-gray-200">
              <thead className="text-gray-300">
                <tr>
                  <th className="border-b border-white/10 px-3 py-2">ID</th>
                  <th className="border-b border-white/10 px-3 py-2">Waktu</th>
                  <th className="border-b border-white/10 px-3 py-2">Metode</th>
                  <th className="border-b border-white/10 px-3 py-2">Jenis</th>
                  <th className="border-b border-white/10 px-3 py-2">Nominal</th>
                  <th className="border-b border-white/10 px-3 py-2">Biaya</th>
                  <th className="border-b border-white/10 px-3 py-2">Total</th>
                  <th className="border-b border-white/10 px-3 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h) => (
                  <tr key={h.id} className="hover:bg-white/5">
                    <td className="border-b border-white/5 px-3 py-2">{h.id}</td>
                    <td className="border-b border-white/5 px-3 py-2">
                      {new Date(h.waktu).toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })}
                    </td>
                    <td className="border-b border-white/5 px-3 py-2">{h.metode}</td>
                    <td className="border-b border-white/5 px-3 py-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${
                          h.jenis === "OTOMATIS"
                            ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"
                            : "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                        }`}
                      >
                        {h.jenis}
                      </span>
                    </td>
                    <td className="border-b border-white/5 px-3 py-2">{formatRupiah(h.nominal)}</td>
                    <td className="border-b border-white/5 px-3 py-2">{formatRupiah(h.biaya)}</td>
                    <td className="border-b border-white/5 px-3 py-2">{formatRupiah(h.total)}</td>
                    <td className="border-b border-white/5 px-3 py-2">
                      <StatusBadge status={h.status} />
                    </td>
                  </tr>
                ))}
                {history.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-3 py-6 text-center text-gray-400">
                      Belum ada riwayat deposit.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-gray-400">
            *Data simulasi. Untuk produksi, hubungkan ke payment gateway & update status via webhook.
          </p>
        </section>
      </div>
    </main>
  );
}

// ===================== Komponen Kecil =====================
function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-300">{label}</span>
      <span className={bold ? "font-semibold text-white" : "text-white"}>{value}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: Status }) {
  if (status === "Berhasil")
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2 py-0.5 text-xs text-emerald-300">
        <CheckCircle2 className="h-3.5 w-3.5" /> {status}
      </span>
    );
  if (status === "Gagal")
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/15 px-2 py-0.5 text-xs text-rose-300">
        <XCircle className="h-3.5 w-3.5" /> {status}
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/15 px-2 py-0.5 text-xs text-amber-300">
      <Clock className="h-3.5 w-3.5" /> {status}
    </span>
  );
}

// ===================== Hooks Kecil =====================
const AUTO_CODES: AutoCode[] = ["QRIS", "BCAVA", "BRIVA", "BNIVA", "PERMATAVA", "MANDIRIVA"];
const MANUAL_CODES: ManualCode[] = ["DANA", "BCA_TRANSFER", "OVO", "GOPAY", "SHOPEEPAY"];
const isAuto = (m: AnyMethod): m is AutoCode => AUTO_CODES.includes(m as AutoCode);
const isManual = (m: AnyMethod): m is ManualCode => MANUAL_CODES.includes(m as ManualCode);

function useEffectFixSelected(
  tab: "OTOMATIS" | "MANUAL",
  selected: AnyMethod,
  setSelected: (v: AnyMethod) => void
) {
  const firstAuto = AUTO_METHODS[0].code;
  const firstManual = MANUAL_METHODS[0].code;

  // on mount & saat tab/selected berubah → pastikan pilihan valid untuk tab tsb
  useEffect(() => {
    if (tab === "OTOMATIS" && !isAuto(selected)) setSelected(firstAuto);
    if (tab === "MANUAL" && !isManual(selected)) setSelected(firstManual);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);
}

function getMethodLabel(code: AnyMethod) {
  const auto = AUTO_METHODS.find((m) => m.code === code);
  if (auto) return auto.name;
  const man = MANUAL_METHODS.find((m) => m.code === code);
  return man ? man.name : String(code);
}
