// app/wallet/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Wallet, ArrowUpRight, Plus, History, Info } from "lucide-react";
import { useBalanceStore } from "@/lib/useBalanceStore";

const formatRupiah = (v: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(v);

export default function WalletPage() {
  const balance = useBalanceStore((s) => s.balance);
  const fetchRealBalance = useBalanceStore((s) => s.fetchRealBalance);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    // sinkron saldo dari API saat pertama kali halaman dibuka
    fetchRealBalance();
  }, [fetchRealBalance]);

  // Contoh activity statis (boleh dihapus saat sudah ada API)
  const activities = useMemo(
    () =>
      [
        {
          id: "TX-0012",
          waktu: "18/08/2025 14:10",
          tipe: "Deposit" as const,
          nominal: 100_000,
          keterangan: "BCA VA (otomatis)",
        },
        {
          id: "TX-0011",
          waktu: "17/08/2025 10:03",
          tipe: "Pembelian" as const,
          nominal: -60_000,
          keterangan: "TikTok Live Viewers 1k",
        },
      ] as Array<{
        id: string;
        waktu: string;
        tipe: "Deposit" | "Pembelian" | "Penyesuaian";
        nominal: number;
        keterangan: string;
      }>,
    []
  );

  return (
    <main className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-[#1a0d29] to-[#140a26] px-4 py-8 md:py-10">
      <div className="mx-auto w-full max-w-6xl space-y-6 md:space-y-8">
        {/* ===== Header (mobile stacked; desktop tetap) ===== */}
        <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 md:p-6 backdrop-blur">
          <div className="pointer-events-none absolute -top-24 -left-24 h-56 w-56 rounded-full bg-fuchsia-600/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg border border-white/10 bg-white/[0.06] p-2">
                <Wallet className="h-6 w-6 text-purple-300" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-white">Dompet</h1>
                <p className="text-sm text-gray-300">Kelola saldo dan lihat aktivitas terbaru.</p>
              </div>
            </div>

            {/* Actions: mobile menumpuk vertikal, tablet/desktop sejajar */}
            <div className="flex flex-col sm:flex-row gap-2">
              <Link
                href="/deposit"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-500"
              >
                <Plus className="h-4 w-4" /> Top Up
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-white hover:border-white/20"
              >
                Katalog <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Quick actions bar (khusus mobile/tablet) */}
          <div className="mt-3 grid grid-cols-2 gap-2 sm:hidden">
            <Link
              href="/deposit"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white hover:border-white/20"
            >
              <History className="h-4 w-4" /> Riwayat Deposit
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white hover:border-white/20"
            >
              Jelajah Layanan
            </Link>
          </div>
        </section>

        {/* ===== Grid ===== */}
        <section className="grid gap-5 md:gap-6 md:grid-cols-3">
          {/* Saldo & Info */}
          <div className="md:col-span-1 space-y-5 md:space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 md:p-6">
              <p className="text-sm text-gray-300">Saldo Sekarang</p>
              <p className="mt-1 text-2xl md:text-3xl font-bold text-white" suppressHydrationWarning>
                {hydrated ? formatRupiah(balance) : "Rp 0"}
              </p>

              {/* Tombol: full-width pada mobile */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Link
                  href="/deposit"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-500"
                >
                  <Plus className="h-4 w-4" /> Top Up
                </Link>
                <Link
                  href="/deposit"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-white hover:border-white/20"
                >
                  <History className="h-4 w-4" /> Deposit
                </Link>
              </div>

              <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-gray-200">
                <Info className="h-4 w-4 text-cyan-300" />
                Untuk produksi, hubungkan payment gateway & update saldo via webhook.
              </div>
            </div>
          </div>

          {/* Aktivitas Terbaru */}
          <div className="md:col-span-2 rounded-2xl border border-white/10 bg-white/[0.03] p-5 md:p-6">
            <h2 className="mb-4 text-base md:text-lg font-semibold text-white">Aktivitas Terbaru</h2>

            {/* MOBILE: kartu */}
            <div className="space-y-3 md:hidden">
              {activities.map((o) => {
                const positif = o.nominal >= 0;
                return (
                  <div key={o.id} className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">{o.id}</span>
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[11px] ${
                          o.tipe === "Deposit"
                            ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                            : o.tipe === "Pembelian"
                            ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                            : "bg-cyan-500/15 text-cyan-300 border-cyan-500/30"
                        }`}
                      >
                        {o.tipe}
                      </span>
                    </div>

                    <div className="mt-2 text-white font-medium">{o.keterangan}</div>

                    <div className="mt-1 grid grid-cols-2 gap-2 text-sm text-gray-200">
                      <div>
                        <span className="text-gray-400">Waktu</span>
                        <div>{o.waktu}</div>
                      </div>
                      <div className="text-right">
                        <span className="text-gray-400">Nominal</span>
                        <div className={positif ? "text-emerald-300" : "text-rose-300"}>
                          {positif ? "+" : ""}
                          {formatRupiah(o.nominal)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {activities.length === 0 && (
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-6 text-center text-gray-400">
                  Belum ada aktivitas.
                </div>
              )}
            </div>

            {/* DESKTOP: tabel */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full w-full text-left text-sm text-gray-200">
                <thead className="text-gray-300">
                  <tr>
                    <th className="border-b border-white/10 px-3 py-2">ID</th>
                    <th className="border-b border-white/10 px-3 py-2">Waktu</th>
                    <th className="border-b border-white/10 px-3 py-2">Tipe</th>
                    <th className="border-b border-white/10 px-3 py-2">Keterangan</th>
                    <th className="border-b border-white/10 px-3 py-2 text-right">Nominal</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((a) => (
                    <tr key={a.id} className="hover:bg-white/5">
                      <td className="border-b border-white/5 px-3 py-2">{a.id}</td>
                      <td className="border-b border-white/5 px-3 py-2">{a.waktu}</td>
                      <td className="border-b border-white/5 px-3 py-2">{a.tipe}</td>
                      <td className="border-b border-white/5 px-3 py-2">{a.keterangan}</td>
                      <td className="border-b border-white/5 px-3 py-2 text-right">
                        <span className={a.nominal >= 0 ? "text-emerald-300" : "text-rose-300"}>
                          {a.nominal >= 0 ? "+" : ""}
                          {formatRupiah(a.nominal)}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {activities.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-3 py-6 text-center text-gray-400">
                        Belum ada aktivitas.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <p className="mt-3 text-xs text-gray-400">*Data contoh. Sinkronkan dengan API/DB untuk histori asli.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
