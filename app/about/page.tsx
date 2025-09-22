// app/about/page.tsx
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Tentang Kami — Sociostore",
  description:
    "Kenalan dengan tim kecil kami yang fokus pada layanan social media yang cepat, aman, dan transparan.",
};

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center rounded-xl border border-white/10 bg-white/5 px-4 py-3">
      <p className="text-2xl font-extrabold text-purple-300">{value}</p>
      <p className="text-xs text-gray-300">{label}</p>
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-200">
      {children}
    </span>
  );
}

/* ===== Team Card (tanpa kotak inisial) ===== */
function TeamCard({
  name,
  role,
  src,
}: {
  name: string;
  role: string;
  src: string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/15 bg-[#2a123f]/60 backdrop-blur-md">
      <div className="relative aspect-[4/3]">
        <Image src={src} alt={name} fill className="object-cover" />
      </div>
      <div className="p-4">
        <p className="font-semibold text-white leading-tight">{name}</p>
        <p className="text-xs text-gray-300">{role}</p>
      </div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <main className="bg-[#1a0d29] text-white">
      {/* HERO (BG flat, konten mepet navbar) */}
      <section className="relative overflow-hidden bg-[#1a0d29]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-[56px] sm:pt-[72px] md:pt-[80px]">
          <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_.9fr]">
            {/* Text */}
            <div>
              <span className="inline-block rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] tracking-wide text-gray-200">
                TENTANG KAMI
              </span>
              <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold leading-tight">
                Sociostore — tim kecil, misi besar:{" "}
                <span className="text-purple-300">naikkan kredibilitas</span>{" "}
                akun sosialmu dengan cara yang{" "}
                <span className="text-purple-300">cepat & aman</span>.
              </h1>
              <p className="mt-3 text-gray-300">
                Kami berfokus pada kualitas layanan, transparansi, serta
                dukungan 24/7. Dengan pengalaman mengelola ribuan order,
                Sociostore hadir untuk kreator, UMKM, dan brand yang ingin
                bertumbuh.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <Pill>Real Engagement</Pill>
                <Pill>Aman & Terpercaya</Pill>
                <Pill>Laporan Progres</Pill>
                <Pill>Support 24/7</Pill>
              </div>

              <div className="mt-6 flex flex-wrap gap-4">
                <Link
                  href="/#categories"
                  className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-red-700 ring-1 ring-orange-600/40 shadow-md shadow-red-500/30 hover:brightness-110 active:translate-y-[1px] transition"
                >
                  Lihat Layanan
                </Link>
                <Link
                  href="/faq"
                  className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold border border-white/15 hover:border-white/25 bg-white/5"
                >
                  FAQ
                </Link>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3 max-w-md">
                <Stat value="5K+" label="Order diproses" />
                <Stat value="99.5%" label="Tingkat sukses" />
                <Stat value="24/7" label="Bantuan aktif" />
              </div>
            </div>

            {/* Photo collage */}
            <div className="relative">
              <div className="relative mx-auto max-w-[520px]">
                <div className="relative rounded-2xl border border-white/15 bg-[#2a123f]/60 p-2 backdrop-blur-md">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                    <Image
                      src="/images/about-us/about.jpg"
                      alt="Sesi kerja tim Sociostore"
                      fill
                      priority
                      className="object-cover"
                    />
                  </div>
                </div>

                <div className="relative -mt-6 ml-auto w-[82%] rounded-2xl border border-white/15 bg-[#2a123f]/60 p-2 backdrop-blur-md">
                  <div className="relative aspect-[16/9] overflow-hidden rounded-xl">
                    <Image
                      src="/images/about-us/about-1.jpg"
                      alt="Kolaborasi tim Sociostore"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VISI MISI */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-12">
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/15 bg-[#2a123f]/60 p-6 backdrop-blur-md">
            <h2 className="text-xl font-semibold">Visi</h2>
            <p className="mt-2 text-sm text-gray-300">
              Menjadi partner pertumbuhan digital paling dipercaya di
              Indonesia—mendorong para kreator, pebisnis, dan brand untuk
              terlihat kredibel dan berkembang pesat di media sosial.
            </p>
          </div>
          <div className="rounded-2xl border border-white/15 bg-[#2a123f]/60 p-6 backdrop-blur-md">
            <h2 className="text-xl font-semibold">Misi</h2>
            <ul className="mt-2 space-y-2 text-sm text-gray-300">
              <li>• Menyediakan layanan cepat, stabil, dan aman.</li>
              <li>• Mengedepankan transparansi dan dukungan responsif.</li>
              <li>• Mengoptimalkan pengalaman pelanggan end-to-end.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* TIM KAMI (grid 2 kolom; tanpa kotak inisial) */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-12">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h3 className="text-2xl sm:text-3xl font-extrabold">Tim Kami</h3>
            <p className="text-sm text-gray-300">
              Orang-orang di balik layar Sociostore.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-5">
          <TeamCard
            name="Dodik Hermawan"
            role="Co-Founder & Ops Lead"
            src="/images/about-us/about.jpg"
          />
          <TeamCard
            name="Endruuuuuuuu"
            role="Co-Founder & Tech Lead"
            src="/images/about-us/about-1.jpg"
          />
        </div>
      </section>

      {/* CTA Strip */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-12">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h4 className="text-lg font-semibold">Siap berkembang bareng?</h4>
              <p className="text-sm text-gray-300">
                Konsultasi gratis untuk pilih paket yang pas dengan kebutuhanmu.
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/#categories"
                className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-red-700 ring-1 ring-orange-600/40 shadow-md shadow-red-500/30 hover:brightness-110 active:translate-y-[1px] transition"
              >
                Mulai Sekarang
              </Link>
              <a
                href="https://wa.me/6285876846768"
                className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold border border-white/15 hover:border-white/25 bg-white/5"
              >
                Hubungi Kami
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
