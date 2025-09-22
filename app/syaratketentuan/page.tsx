// app/syaratketentuan/page.tsx
import Link from "next/link";
import {
  CheckCircle2,
  ShieldAlert,
  AlertTriangle,
  Info,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

export default function SyaratKetentuanPage() {
  return (
    <main className="min-h-screen bg-[#10071a] text-gray-100">
      {/* BG FX */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
      >
        
      </div>

      {/* Header / Hero */}
      <section className="border-b border-white/10 bg-gradient-to-b from-[#1a0d29]/80 to-transparent">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
          <div className="flex items-start gap-4">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur">
              <ShieldAlert className="h-5 w-5 text-violet-200" />
            </span>
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
                <span className="bg-gradient-to-r from-violet-200 via-white to-fuchsia-200 bg-clip-text text-transparent">
                  Syarat & Ketentuan
                </span>
              </h1>
              <p className="mt-2 max-w-2xl text-sm sm:text-base text-white/70">
                Baca halaman ini sebelum melakukan pemesanan layanan. Dengan
                melanjutkan order, Anda dianggap setuju.
              </p>
            </div>
          </div>

          {/* Breadcrumb */}
          <nav className="mt-5 text-xs sm:text-sm text-white/60" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2">
              <li>
                <Link href="/" className="hover:text-white/90">
                  Beranda
                </Link>
              </li>
              <ChevronRight className="h-4 w-4" />
              <li className="text-white/80">Syarat & Ketentuan</li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
          {/* Main */}
          <article className="space-y-8">
            {/* Instagram Important Setting */}
            <div className="rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 p-[1px]">
              <div className="rounded-[calc(1rem-1px)] bg-[#150a22]/80 p-5 sm:p-6 shadow-[0_0_0_1px_rgba(255,255,255,.03)]">
                <div className="mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-violet-300" />
                  <h2 className="text-lg sm:text-xl font-semibold text-violet-200">
                    Ketentuan & Syarat Order – Penting untuk Instagram Followers
                  </h2>
                </div>

                <p className="text-sm leading-relaxed text-violet-100/90">
                  Agar proses penambahan followers dapat langsung terlihat dan
                  tidak tertahan, harap{" "}
                  <span className="font-semibold underline decoration-violet-400/50 underline-offset-4">
                    nonaktifkan
                  </span>{" "}
                  opsi <span className="mx-1 italic">“Laporkan untuk ditinjau”</span>{" "}
                  di akun Instagram Anda.
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm font-medium">Langkah (Indonesia)</p>
                    <p className="mt-1 text-sm text-white/70">
                      Pengaturan dan aktivitas → Ikuti dan undang teman → Laporkan
                      untuk ditinjau (nonaktifkan).
                    </p>
                    <Link
                      href="https://prnt.sc/e71qXX2LkHQ4"
                      target="_blank"
                      className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-violet-300 hover:underline"
                    >
                      Contoh tangkapan layar <ExternalLink className="h-4 w-4" />
                    </Link>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm font-medium">Steps (English)</p>
                    <p className="mt-1 text-sm text-white/70">
                      Settings and privacy → Follow and invite friends → Flag for
                      review (disable).
                    </p>
                    <Link
                      href="https://prnt.sc/ITf2lcZ_ZSkP"
                      target="_blank"
                      className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-violet-300 hover:underline"
                    >
                      Example screenshot <ExternalLink className="h-4 w-4" />
                    </Link>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-amber-400/20 bg-amber-400/10 p-4">
                  <p className="text-sm text-amber-100/90">
                    Ini akan memungkinkan pengikut baru diterima secara otomatis tanpa
                    perlu persetujuan manual.{" "}
                    <span className="ml-1 font-semibold text-amber-200">
                      Tidak ada refund/refill
                    </span>{" "}
                    jika fitur ini tidak dinonaktifkan saat melakukan order.
                  </p>
                </div>
              </div>
            </div>

            {/* Rules before buying */}
            <section
              id="peraturan"
              className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6"
            >
              <div className="mb-3 flex items-center gap-2">
                <Info className="h-5 w-5 text-fuchsia-300" />
                <h2 className="text-lg sm:text-xl font-semibold">
                  Peraturan Sebelum Melakukan Pembelian
                </h2>
              </div>

              <ul className="space-y-3 text-sm leading-relaxed text-white/85">
                {[
                  "Pastikan link / username yang Anda input sudah benar dan tidak dalam keadaan private.",
                  "Pastikan format data pembelian yang Anda masukkan sudah sesuai. Minta bantuan admin jika perlu.",
                  "Dilarang memasukkan data yang sama jika order sebelumnya belum selesai.",
                  "Jika akun private/link tidak valid saat pengecekan, maka order dianggap selesai (completed).",
                  "Estimasi speed hanya acuan, bisa berubah tergantung kondisi server dan jumlah pesanan.",
                  "Keluhan hanya diterima setelah 1x24 jam dari waktu order.",
                  "Order yang sudah dikirim ke server tidak bisa dibatalkan, kecuali gagal dari sisi server.",
                  "Tidak ada jaminan refill jika akun Anda sudah punya lebih dari 100K followers/likes/views.",
                  "Tidak ada pengembalian dana untuk kesalahan input oleh user.",
                  "Layanan ditulis dalam format: SERVICE NAME [MAXIMUM ORDER] [START TIME - SPEED]",
                  "Simbol yang digunakan: 🔥 = Layanan teratas, 💧 = Dripfeed aktif, ♻ = Mudah untuk refill, 🛑 = Mudah untuk cancel, Rxx = Refill periode (mis. R30 = isi ulang 30 hari), ARxx = Isi ulang otomatis (mis. AR30 = auto refill 30 hari)",
                  "INSTANT bisa butuh hingga 1 jam untuk mulai. H = jam (mis. 1H, 12H). HQ/LQ = High/Low Quality.",
                  'Layanan dengan label "Layanan Murah (Mungkin Menghadapi Beberapa Masalah)" bisa mengalami delay.',
                  "Layanan Top Best Seller = kualitas tinggi, populer, dan andal.",
                ].map((t, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-violet-300" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Must read */}
            <section
              id="wajib-baca"
              className="rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 p-[1px]"
            >
              <div className="rounded-[calc(1rem-1px)] bg-[#150a22]/80 p-5 sm:p-6">
                <h2 className="mb-3 text-lg sm:text-xl font-semibold text-violet-200">
                  Wajib Baca
                </h2>
                <ul className="space-y-3 text-sm leading-relaxed text-white/85">
                  {[
                    "Jangan masukkan link yang salah karena tidak bisa dibatalkan.",
                    "Jangan gunakan lebih dari satu layanan untuk target yang sama secara bersamaan.",
                    "Jika link/username berubah saat order berjalan, status akan jadi completed otomatis.",
                    "Panel bersifat otomatis, kesalahan pengguna bukan tanggung jawab admin.",
                    "Jika status order partial/canceled, saldo otomatis di-refund.",
                    "Maksimum = total kuota layanan untuk satu akun. Jika sudah habis, pakai layanan lain dengan kuota lebih besar.",
                    "Deskripsi layanan hanya estimasi. Bisa berubah tergantung kondisi server.",
                    "Dengan order, Anda menyetujui semua syarat & ketentuan Sosmedboost.",
                  ].map((t, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-violet-300" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Steps */}
            <section
              id="langkah-order"
              className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6"
            >
              <div className="mb-2 flex items-center justify-between gap-3">
                <h2 className="text-lg sm:text-xl font-semibold">Langkah-Langkah Order</h2>
                <span className="hidden sm:inline-flex items-center rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-200">
                  Guide
                </span>
              </div>

              <ol className="space-y-3 text-sm leading-relaxed text-white/85 [counter-reset:step]">
                {[
                  "Pilih kategori yang tersedia.",
                  "Pilih layanan yang tersedia.",
                  "Masukkan data yang sesuai (username, link, dll).",
                  "Masukkan jumlah sesuai minimal dan maksimal layanan.",
                  "Klik tombol Pesan untuk membuat order.",
                  "Jika ingin mengulang order dengan target yang sama, pastikan order sebelumnya sudah selesai. Status order bisa dicek melalui menu riwayat. Jika terjadi kendala, silakan hubungi admin.",
                ].map((t, i) => (
                  <li key={i} className="relative pl-10">
                    <span className="absolute left-0 top-0 inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-gradient-to-br from-white/10 to-white/5 text-xs font-semibold">
                      {i + 1}
                    </span>
                    {t}
                  </li>
                ))}
              </ol>

              <div className="mt-5 rounded-xl border border-white/10 bg-black/30 p-4 text-sm text-white/80">
                <p>
                  <span className="font-semibold">CATATAN:</span> Untuk followers,
                  isi kolom dengan <span className="font-semibold">username</span>{" "}
                  saja. Untuk likes, masukkan{" "}
                  <span className="font-semibold">link foto</span>. Akun Instagram{" "}
                  <span className="font-semibold">tidak boleh private</span>.
                </p>
              </div>
            </section>

            {/* SLA & Support */}
            <section id="sla" className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
              <h2 className="mb-3 text-lg sm:text-xl font-semibold">Bantuan & SLA</h2>
              <ul className="space-y-3 text-sm leading-relaxed text-white/85">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-violet-300" />
                  <span>
                    Jika dalam <span className="font-semibold">3x24 jam</span> order
                    masih pending/proses, silakan hubungi admin. Tidak ada refund
                    untuk kesalahan pengguna.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-violet-300" />
                  <span>
                    Jika <span className="font-semibold">drop down</span> menu
                    layanan tidak muncul, pastikan JavaScript di browser aktif
                    (Settings → Site Setting → JavaScript → Allowed).
                  </span>
                </li>
              </ul>
            </section>
          </article>

          {/* Sidebar / TOC */}
          <aside className="lg:sticky lg:top-24 h-max space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-white/60">
                Navigasi
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                {[
                  { id: "peraturan", label: "Peraturan Pembelian" },
                  { id: "wajib-baca", label: "Wajib Baca" },
                  { id: "langkah-order", label: "Langkah-Langkah Order" },
                  { id: "sla", label: "Bantuan & SLA" },
                ].map((i) => (
                  <li key={i.id}>
                    <a
                      href={`#${i.id}`}
                      className="group inline-flex w-full items-center justify-between gap-2 rounded-lg px-2 py-2 hover:bg-white/5"
                    >
                      <span className="inline-flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-white/40 group-hover:bg-white" />
                        {i.label}
                      </span>
                      <ChevronRight className="h-4 w-4 text-white/40 group-hover:text-white/70" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-amber-400/30 bg-gradient-to-br from-amber-400/15 to-orange-400/10 p-4">
              <p className="text-sm text-amber-100/90">
                Dengan melakukan order, Anda{" "}
                <span className="font-semibold">menyatakan setuju</span> terhadap
                semua Syarat & Ketentuan yang berlaku.
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="border-t border-white/10 bg-[#140a26]/90 backdrop-blur">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-semibold">Siap melanjutkan order?</h3>
            <p className="text-sm text-white/70">
              Pastikan semua pengaturan akun sudah sesuai agar proses lancar.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold text-gray-900 bg-gradient-to-br from-orange-400 to-rose-400 shadow shadow-rose-900/20 ring-1 ring-black/10 hover:brightness-110 active:translate-y-[1px]"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </section>
    </main>
  );
}
