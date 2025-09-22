// app/privacy/page.tsx
import Link from "next/link";

export const metadata = {
  title: "Kebijakan Privasi — Sociostore",
  description:
    "Pelajari bagaimana Sociostore mengumpulkan, menggunakan, dan melindungi data pribadi Anda. Transparan, aman, dan sesuai peraturan yang berlaku.",
};

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] tracking-wide text-gray-200">
      {children}
    </span>
  );
}

// ⬇️ Perbaikan: Card sekarang menerima prop `id`
function Card({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <div
      id={id}
      className={`rounded-2xl border border-white/15 bg-[#2a123f]/60 backdrop-blur-md ${className}`}
    >
      {children}
    </div>
  );
}

function H2({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="text-xl font-semibold text-white scroll-mt-24">
      {children}
    </h2>
  );
}

function P({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <p className={`text-sm text-gray-300 ${className}`}>{children}</p>;
}

const LAST_UPDATED = "9 September 2025";

export default function PrivacyPage() {
  return (
    <main className="bg-[#1a0d29] text-white">
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-[56px] sm:pt-[72px] md:pt-[80px] pb-8 sm:pb-10">
          <Badge>KEBIJAKAN PRIVASI</Badge>
          <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold leading-tight">
            Transparansi data di <span className="text-purple-300">Sociostore</span>
          </h1>
          <P className="mt-2 max-w-2xl">
            Kami menghargai privasi Anda. Halaman ini menjelaskan jenis data yang kami kumpulkan,
            tujuan penggunaannya, serta hak-hak Anda terkait data tersebut.
          </P>

          <div className="mt-5 flex flex-wrap gap-3">
            <span className="inline-flex items-center rounded-xl px-3 py-1 text-[12px] text-gray-200 border border-white/10 bg-white/5">
              Terakhir diperbarui: {LAST_UPDATED}
            </span>
            <Link
              href="#kontak"
              className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-red-700 ring-1 ring-orange-600/40 shadow-md shadow-red-500/30 hover:brightness-110 active:translate-y-[1px] transition"
            >
              Butuh Bantuan?
            </Link>
          </div>
        </div>
      </section>

      {/* ===== CONTENT WRAPPER ===== */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-12 sm:pb-16 grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* ==== TOC (sticky on desktop) ==== */}
        <aside className="hidden lg:block">
          <Card className="p-4 sticky top-24">
            <h3 className="text-sm font-semibold">Navigasi</h3>
            <nav className="mt-3 text-sm text-gray-300">
              <ul className="space-y-2">
                <li><a href="#pengumpulan" className="hover:text-purple-300">Data yang Kami Kumpulkan</a></li>
                <li><a href="#penggunaan" className="hover:text-purple-300">Cara Kami Menggunakan Data</a></li>
                <li><a href="#pembagian" className="hover:text-purple-300">Berbagi dan Transfer Data</a></li>
                <li><a href="#hak" className="hover:text-purple-300">Hak Anda</a></li>
                <li><a href="#keamanan" className="hover:text-purple-300">Keamanan</a></li>
                <li><a href="#penyimpanan" className="hover:text-purple-300">Retensi/Penyimpanan</a></li>
                <li><a href="#cookie" className="hover:text-purple-300">Cookie & Teknologi Serupa</a></li>
                <li><a href="#anak" className="hover:text-purple-300">Anak di Bawah Umur</a></li>
                <li><a href="#perubahan" className="hover:text-purple-300">Perubahan Kebijakan</a></li>
                <li><a href="#kontak" className="hover:text-purple-300">Kontak</a></li>
              </ul>
            </nav>
          </Card>
        </aside>

        {/* ==== MAIN CONTENT ==== */}
        <div className="space-y-6">
          {/* Mobile TOC as accordion */}
          <details className="lg:hidden group rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
            <summary className="flex cursor-pointer list-none items-center justify-between text-white">
              <span className="text-sm font-semibold">Navigasi</span>
              <svg
                className="h-5 w-5 transition-transform duration-200 group-open:rotate-180"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </summary>
            <ul className="mt-3 space-y-2 text-sm text-gray-300">
              <li><a href="#pengumpulan" className="hover:text-purple-300">Data yang Kami Kumpulkan</a></li>
              <li><a href="#penggunaan" className="hover:text-purple-300">Cara Kami Menggunakan Data</a></li>
              <li><a href="#pembagian" className="hover:text-purple-300">Berbagi dan Transfer Data</a></li>
              <li><a href="#hak" className="hover:text-purple-300">Hak Anda</a></li>
              <li><a href="#keamanan" className="hover:text-purple-300">Keamanan</a></li>
              <li><a href="#penyimpanan" className="hover:text-purple-300">Retensi/Penyimpanan</a></li>
              <li><a href="#cookie" className="hover:text-purple-300">Cookie & Teknologi Serupa</a></li>
              <li><a href="#anak" className="hover:text-purple-300">Anak di Bawah Umur</a></li>
              <li><a href="#perubahan" className="hover:text-purple-300">Perubahan Kebijakan</a></li>
              <li><a href="#kontak" className="hover:text-purple-300">Kontak</a></li>
            </ul>
          </details>

          {/* Sections */}
          <Card className="p-5 sm:p-6">
            <H2 id="pengumpulan">Data yang Kami Kumpulkan</H2>
            <div className="mt-2 grid gap-3 text-sm text-gray-300">
              <P>Jenis data yang dapat kami kumpulkan:</P>
              <ul className="list-disc pl-5 space-y-1">
                <li>Data identitas dasar (nama, email, nomor WhatsApp).</li>
                <li>Data akun/target layanan (username/link media sosial yang Anda berikan).</li>
                <li>Data transaksi (riwayat order, metode pembayaran, jumlah/top up).</li>
                <li>Data teknis (alamat IP, device/OS, jenis browser, log aktivitas).</li>
                <li>Data komunikasi (chat bantuan, tiket support, korespondensi).</li>
              </ul>
            </div>
          </Card>

          <Card className="p-5 sm:p-6">
            <H2 id="penggunaan">Cara Kami Menggunakan Data</H2>
            <ul className="mt-2 list-disc pl-5 space-y-1 text-sm text-gray-300">
              <li>Memproses dan memenuhi pesanan layanan Anda.</li>
              <li>Mengelola akun, memverifikasi identitas (misal OTP via WhatsApp), dan mencegah penyalahgunaan.</li>
              <li>Menyediakan dukungan pelanggan dan peningkatan kualitas layanan.</li>
              <li>Mengirimkan notifikasi operasional penting (status pesanan, gangguan, perubahan harga).</li>
              <li>Analitik internal untuk meningkatkan stabilitas dan keamanan sistem.</li>
            </ul>
          </Card>

          <Card className="p-5 sm:p-6">
            <H2 id="pembagian">Berbagi dan Transfer Data</H2>
            <P className="mt-2">
              Kami tidak menjual data pribadi Anda. Kami dapat membagikan data secara terbatas kepada pihak ketiga
              tepercaya untuk tujuan operasional, misalnya penyedia pembayaran, penyedia infrastruktur, atau mitra
              layanan yang dibutuhkan guna memproses pesanan. Setiap pihak ketiga terikat pada perjanjian kerahasiaan
              dan kepatuhan keamanan data.
            </P>
          </Card>

          <Card className="p-5 sm:p-6">
            <H2 id="hak">Hak Anda</H2>
            <ul className="mt-2 list-disc pl-5 space-y-1 text-sm text-gray-300">
              <li>Hak akses: meminta salinan data pribadi Anda yang kami simpan.</li>
              <li>Hak perbaikan: memperbarui data yang tidak akurat.</li>
              <li>Hak penghapusan: meminta penghapusan data tertentu sesuai ketentuan yang berlaku.</li>
              <li>Hak menolak/menarik persetujuan: untuk komunikasi pemasaran opsional.</li>
            </ul>
            <P className="mt-2">
              Untuk menggunakan hak-hak ini, hubungi kami melalui informasi pada bagian{" "}
              <a href="#kontak" className="text-purple-300 underline-offset-2 hover:underline">
                Kontak
              </a>.
            </P>
          </Card>

          <Card className="p-5 sm:p-6">
            <H2 id="keamanan">Keamanan</H2>
            <P className="mt-2">
              Kami menerapkan kontrol keamanan wajar (enkripsi in-transit, pembatasan akses, audit internal) untuk
              melindungi data. Namun, tidak ada metode transmisi/penyimpanan yang sepenuhnya aman; kami terus
              meningkatkan praktik keamanan sesuai standar industri.
            </P>
          </Card>

          <Card className="p-5 sm:p-6">
            <H2 id="penyimpanan">Retensi/Penyimpanan</H2>
            <P className="mt-2">
              Data disimpan selama diperlukan untuk tujuan yang dijelaskan di kebijakan ini atau sebagaimana diwajibkan
              oleh hukum (misal catatan transaksi). Setelah itu, data akan dihapus atau dianonimkan secara aman.
            </P>
          </Card>

          <Card className="p-5 sm:p-6">
            <H2 id="cookie">Cookie & Teknologi Serupa</H2>
            <P className="mt-2">
              Kami menggunakan cookie/penyimpanan lokal untuk fungsi esensial (autentikasi sesi, preferensi) dan
              analitik dasar. Anda dapat mengatur preferensi cookie melalui pengaturan browser. Menonaktifkan cookie
              tertentu dapat memengaruhi fungsi situs.
            </P>
          </Card>

          <Card className="p-5 sm:p-6">
            <H2 id="anak">Anak di Bawah Umur</H2>
            <P className="mt-2">
              Layanan kami tidak ditujukan untuk anak di bawah 13 tahun. Jika Anda adalah orang tua/wali dan yakin
              anak Anda memberikan data kepada kami, silakan hubungi kami untuk tindakan yang sesuai.
            </P>
          </Card>

          <Card className="p-5 sm:p-6">
            <H2 id="perubahan">Perubahan Kebijakan</H2>
            <P className="mt-2">
              Kami dapat memperbarui kebijakan ini dari waktu ke waktu. Tanggal pembaruan terbaru akan ditampilkan di
              bagian atas halaman. Perubahan material akan diberitahukan melalui notifikasi yang relevan.
            </P>
          </Card>

          {/* Contact */}
          <Card id="kontak" className="p-5 sm:p-6">
            <H2>Kontak</H2>
            <P className="mt-2">Jika Anda memiliki pertanyaan terkait kebijakan privasi ini, hubungi kami:</P>
            <ul className="mt-3 space-y-2 text-sm text-gray-300">
              <li>
                Email:{" "}
                <a href="mailto:support@sociostore.id" className="text-purple-300 underline-offset-2 hover:underline">
                  support@sociostore.id
                </a>
              </li>
              <li>
                WhatsApp:{" "}
                <a
                  href="https://wa.me/6285876846768"
                  className="text-purple-300 underline-offset-2 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  +62 8587-6846-768
                </a>
              </li>
              <li>Lokasi: Indonesia</li>
            </ul>
          </Card>

          {/* CTA strip */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h4 className="text-lg font-semibold">Kelola preferensi & akun Anda</h4>
                <P>Anda selalu dapat memperbarui data, kata sandi, atau menghubungi kami kapan pun.</P>
              </div>
              <div className="flex gap-3">
                <Link
                  href="/profile"
                  className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-red-700 ring-1 ring-orange-600/40 shadow-md shadow-red-500/30 hover:brightness-110 active:translate-y-[1px] transition"
                >
                  Buka Profil
                </Link>
                <a
                  href="https://wa.me/6285876846768"
                  className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold border border-white/15 hover:border-white/25 bg-white/5"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Chat Admin
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
