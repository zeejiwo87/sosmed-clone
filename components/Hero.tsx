// components/Hero.tsx
"use client";

import Link from "next/link";   
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css/pagination";
import "swiper/css";

import Image from "next/image";
import { Users, Heart, ShieldCheck, Headphones } from "lucide-react";
import RunText from "./RunText";


const Hero = () => {
  const featureData = [
    {
      icon: <Users className="text-purple-400 w-10 h-10" />,
      title: "Boost Followers",
      description: "Tambah followers asli & aktif dengan cepat",
    },
    {
      icon: <Heart className="text-purple-400 w-10 h-10" />,
      title: "Instant Likes",
      description: "Auto likes untuk setiap postingan",
    },
    {
      icon: <ShieldCheck className="text-purple-400 w-10 h-10" />,
      title: "100% Aman",
      description: "Sistem terjamin aman & rahasia",
    },
    {
      icon: <Headphones className="text-purple-400 w-10 h-10" />,
      title: "24/7 Support",
      description: "Bantuan siap kapan saja",
    },
  ];

  return (
<section className="overflow-hidden pb-px md:pb-px xl:pb-0.5 pt-0 sm:pt-16 md:pt-20 xl:pt-8 bg-[#1a0d29] text-white">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        {/* ================= DESKTOP ================= */}
        {/* Kunci tinggi di grid supaya slider jadi patokan, kartu mengikuti 1/2 tinggi */}
        <div className="hidden xl:grid xl:h-[380px] xl:grid-cols-[757px_393px] xl:grid-rows-2 xl:gap-5">
          {/* LEFT: SLIDER (ikuti tinggi grid) */}
          <div className="row-span-2 h-full w-full">
            <div className="relative h-full rounded-[14px] border border-white/20 bg-[#2a123f]/60 backdrop-blur-md overflow-hidden">
              <Swiper
                /* Penting: jangan autoHeight di desktop supaya tidak nambah tinggi */
                spaceBetween={24}
                centeredSlides
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                modules={[Autoplay, Pagination]}
                className="hero-carousel h-full"
              >
               {/* Slide 1 */}
                <SwiperSlide>
                  <div className="h-full flex items-center pt-5 sm:pt-0 flex-col-reverse sm:flex-row">
                    <div className="max-w-[394px] py-8 pl-6 sm:pl-8">
                      <div className="flex items-center gap-4 mb-7 sm:mb-8">
                        <span className="block font-semibold text-6xl text-purple-400">5K+</span>
                        <span className="block text-lg leading-[20px]">
                          Followers <br /> Boost
                        </span>
                      </div>
                      <h1 className="font-semibold text-3xl mb-3">
                        Tingkatkan Popularitas Akun Sosial Media Anda
                      </h1>
                      <p className="text-gray-300">
                        Dapatkan followers asli & aktif untuk Instagram, TikTok, YouTube, dan lebih
                        banyak lagi dengan cepat.
                      </p>
                      <button
                        onClick={() => {
                          const target = document.getElementById("categories");
                          if (target) {
                            target.scrollIntoView({
                              behavior: "smooth",
                              block: "start",
                            });
                          }
                        }}
                        className="inline-flex font-medium text-white text-sm rounded-md bg-purple-600 py-3 px-9 mt-8 hover:bg-purple-500 transition-colors"
                      >
                        Boost Sekarang
                      </button>
                    </div>
                    <div className="pr-6 sm:pr-8">
                      <Image
                        src="/images/hero/followers.png"
                        alt="followers boost"
                        width={300}
                        height={300}
                        className="h-auto w-auto"
                        priority
                      />
                    </div>
                  </div>
                </SwiperSlide>


               {/* Slide 2 */}
              <SwiperSlide>
                <div className="h-full flex items-center pt-5 sm:pt-0 flex-col-reverse sm:flex-row">
                  <div className="max-w-[394px] py-8 pl-6 sm:pl-8">
                    <div className="flex items-center gap-4 mb-7 sm:mb-8">
                      <span className="block font-semibold text-6xl text-purple-400">100%</span>
                      <span className="block text-lg leading-[20px]">
                        Real <br /> Engagement
                      </span>
                    </div>
                    <h1 className="font-semibold text-3xl mb-3">Dapatkan Likes & Views Instan</h1>
                    <p className="text-gray-300">
                      Setiap postingan lebih menonjol dengan likes & views yang meningkat secara otomatis.
                    </p>
                    <button
                      onClick={() => {
                        const target = document.getElementById("categories");
                        if (target) {
                          target.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                        }
                      }}
                      className="inline-flex font-medium text-white text-sm rounded-md bg-purple-600 py-3 px-9 mt-8 hover:bg-purple-500 transition-colors"
                    >
                      Coba Sekarang
                    </button>
                  </div>
                  <div className="pr-6 sm:pr-8">
                    <Image
                      src="/images/hero/likes.png"
                      alt="likes boost"
                      width={300}
                      height={300}
                      className="h-auto w-auto"
                    />
                  </div>
                </div>
              </SwiperSlide>

              </Swiper>

              {/* shimmer */}
              <div className="pointer-events-none absolute inset-0 rounded-[14px] overflow-hidden">
                <div className="absolute inset-y-3 -left-1/3 w-1/3 rounded-full bg-gradient-to-r from-transparent via-white/15 to-transparent animate-shimmer" />
              </div>
            </div>
          </div>

          {/* RIGHT: PROMO CARDS (h-full = tepat 1/2 tinggi grid) */}
          {/* Card 1 */}
            <div className="col-start-2 row-start-1 min-h-0">
              <Link href="/services/instagram/followers" className="group block h-full min-h-0">
                <div className="relative h-full min-h-0 overflow-hidden rounded-[14px] border border-white/20 bg-[#2a123f]/60 backdrop-blur-md p-6 transition hover:border-violet-400/40 hover:shadow-lg hover:shadow-violet-500/10">
                  <div className="flex h-full items-center gap-6 min-h-0">
                    <div className="min-w-0">
                      <h2 className="font-semibold text-xl mb-3 line-clamp-2">Paket Followers Instagram</h2>
                      <p className="font-medium text-sm text-gray-400 mb-1.5">Mulai dari</p>
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-2xl text-purple-400 whitespace-nowrap">
                          Rp50.000
                        </span>
                        <span className="font-medium text-xl text-gray-400 line-through whitespace-nowrap">
                          Rp100.000
                        </span>
                      </div>
                    </div>
                    <div className="relative flex-shrink-0 w-[120] aspect-[3/4] ml-auto">
                      <Image src="/images/hero/ig.png" alt="instagram" fill className="object-contain" />
                    </div>
                  </div>

                  {/* shimmer */}
                  <div className="absolute inset-0 pointer-events-none rounded-[14px] overflow-hidden">
                    <div className="absolute inset-y-3 -left-1/3 w-1/3 rounded-full bg-gradient-to-r from-transparent via-white/15 to-transparent animate-shimmer" />
                  </div>
                </div>
              </Link>
            </div>


          {/* Card 2 */}
            <div className="col-start-2 row-start-2 min-h-0">
              <Link href="/services/tiktok/vt-viewers" className="group block h-full min-h-0">
                <div className="relative h-full min-h-0 overflow-hidden rounded-[14px] border border-white/20 bg-[#2a123f]/60 backdrop-blur-md p-6 transition hover:border-violet-400/40 hover:shadow-lg hover:shadow-violet-500/10">
                  <div className="flex h-full items-center gap-6 min-h-0">
                    <div className="min-w-0">
                      <h2 className="font-semibold text-xl mb-3 line-clamp-2">Paket Views TikTok</h2>
                      <p className="font-medium text-sm text-gray-400 mb-1.5">Mulai dari</p>
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-2xl text-purple-400 whitespace-nowrap">
                          Rp30.000
                        </span>
                        <span className="font-medium text-xl text-gray-400 line-through whitespace-nowrap">
                          Rp75.000
                        </span>
                      </div>
                    </div>
                    <div className="relative flex-shrink-0 w-[120px] aspect-[3/4] ml-auto">
                      <Image src="/images/hero/tiktok.png" alt="tiktok" fill className="object-contain" />
                    </div>
                  </div>

                  {/* shimmer */}
                  <div className="absolute inset-0 pointer-events-none rounded-[14px] overflow-hidden">
                    <div className="absolute inset-y-3 -left-1/3 w-1/3 rounded-full bg-gradient-to-r from-transparent via-white/15 to-transparent animate-shimmer" />
                  </div>
                </div>
              </Link>
            </div>
             {/* ⬇️ Tambahkan ini untuk menutup desktop grid */}
      </div> {/* <-- CLOSE: .hidden xl:grid ... */}


        {/* ================= MOBILE/TABLET (tidak diubah) ================= */}
        <div className="flex flex-wrap gap-5 xl:hidden">
          {/* LEFT: HERO */}
          <div className="xl:max-w-[757px] w-full">
            <div className="relative z-1 rounded-[14px] border border-white/15 bg-[#2a123f]/60 backdrop-blur-md overflow-hidden">
              <Swiper
                autoHeight
                spaceBetween={18}
                centeredSlides
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                modules={[Autoplay, Pagination]}
                className="hero-carousel"
                breakpoints={{
                  640: { spaceBetween: 18 },
                  768: { spaceBetween: 24 },
                  1024: { spaceBetween: 30 },
                }}
              >
                {/* Slide 1 */}
<SwiperSlide>
  {/* Dua kolom sejak ponsel: teks kiri, gambar kanan */}
  <div className="grid grid-cols-2 items-center gap-2 sm:gap-3">
    {/* KIRI: TEKS */}
    <div className="flex flex-col justify-center px-4 sm:pl-8 sm:pr-2 py-4 sm:py-6">
      {/* Angka + label */}
      <div className="flex items-end gap-2 sm:gap-3 mb-2 sm:mb-3">
        <span className="font-semibold text-3xl sm:text-5xl text-purple-300 leading-none">5K+</span>
        <span className="text-[11px] sm:text-sm text-purple-100/90 leading-tight">Followers&nbsp;Boost</span>
      </div>

      {/* Judul */}
      <h2 className="font-semibold text-[16px] sm:text-2xl leading-snug mb-1.5 sm:mb-2">
        Naikkan Followers Asli & Aktif
      </h2>

      {/* Deskripsi */}
      <p className="text-gray-300 text-[12px] sm:text-sm leading-relaxed">
        Instagram • TikTok • YouTube — cepat & aman.
      </p>

      {/* CTA */}
      <button
        onClick={() => {
          const target = document.getElementById("categories");
          if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
        }}
        className="inline-flex w-max items-center gap-2 font-medium text-white text-xs sm:text-sm rounded-md bg-purple-600 py-2.5 px-4 sm:py-3 sm:px-6 mt-4 sm:mt-5 hover:bg-purple-500 active:scale-95 transition"
      >
        Boost Sekarang
      </button>
    </div>

    {/* KANAN: GAMBAR (ukuran kotak dipertahankan) */}
    <div className="px-2 sm:px-3">
      <div className="relative mx-auto w-full h-[140px] sm:h-[180px] md:h-[200px]">
        <Image
          src="/images/hero/followers.png"
          alt="followers boost"
          fill
          sizes="100vw"
          className="object-contain"
          priority
        />
      </div>
    </div>
  </div>
</SwiperSlide>

{/* Slide 2 */}
<SwiperSlide>
  {/* Dua kolom sejak ponsel: teks kiri, gambar kanan */}
  <div className="grid grid-cols-2 items-center gap-2 sm:gap-3">
    {/* KIRI: TEKS */}
    <div className="flex flex-col justify-center px-4 sm:pl-8 sm:pr-2 py-4 sm:py-6">
      {/* Angka + label */}
      <div className="flex items-end gap-2 sm:gap-3 mb-2 sm:mb-3">
        <span className="font-semibold text-3xl sm:text-5xl text-purple-300 leading-none">100%</span>
        <span className="text-[11px] sm:text-sm text-purple-100/90 leading-tight">Real&nbsp;Engagement</span>
      </div>

      {/* Judul */}
      <h2 className="font-semibold text-[16px] sm:text-2xl leading-snug mb-1.5 sm:mb-2">
        Likes & Views Tumbuh Otomatis
      </h2>

      {/* Deskripsi */}
      <p className="text-gray-300 text-[12px] sm:text-sm leading-relaxed">
        Kontenmu langsung menonjol di feed.
      </p>

      {/* CTA */}
      <button
        onClick={() => {
          const target = document.getElementById("categories");
          if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
        }}
        className="inline-flex w-max items-center gap-2 font-medium text-white text-xs sm:text-sm rounded-md bg-purple-600 py-2.5 px-4 sm:py-3 sm:px-6 mt-4 sm:mt-5 hover:bg-purple-500 active:scale-95 transition"
      >
        Coba Sekarang
      </button>
    </div>

    {/* KANAN: GAMBAR (ukuran kotak dipertahankan) */}
    <div className="px-2 sm:px-3">
      <div className="relative mx-auto w-full h-[140px] sm:h-[180px] md:h-[200px]">
        <Image
          src="/images/hero/likes.png"
          alt="likes boost"
          fill
          sizes="100vw"
          className="object-contain"
        />
      </div>
    </div>
  </div>
</SwiperSlide>


              </Swiper>

              {/* shimmer mobile/tablet */}
              <div className="pointer-events-none absolute inset-0 rounded-[14px] overflow-hidden">
                <div className="absolute inset-y-3 -left-1/3 w-1/3 rounded-full bg-gradient-to-r from-transparent via-white/15 to-transparent animate-shimmer" />
              </div>
            </div>
          </div>

          {/* RIGHT: promo cards */}
<div className="w-full max-w-[480px] pt-2 mx-auto">
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

    {/* Card 1 → jadikan link */}
    <Link
      href="/services/instagram/followers"
      className="group relative rounded-[14px] border border-white/15 bg-[#2a123f]/60 backdrop-blur-md p-4 overflow-hidden transition hover:border-violet-400/40 hover:shadow-lg hover:shadow-violet-500/10"
    >
      <div className="flex items-center gap-3">
        <div className="min-w-0">
          <h4 className="font-semibold text-base sm:text-lg mb-1">Paket Followers Instagram</h4>
          <p className="text-[12px] sm:text-sm text-gray-400 mb-1">Mulai dari</p>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-lg sm:text-xl text-purple-300">Rp50.000</span>
            <span className="text-sm text-gray-400 line-through">Rp100.000</span>
          </div>
        </div>
        <div className="relative ml-auto h-[72px] sm:h-[96px] w-[72px] sm:w-[96px]">
          <Image src="/images/hero/ig.png" alt="instagram" fill className="object-contain" />
        </div>
      </div>

      {/* shimmer */}
      <div className="absolute inset-0 rounded-[14px] overflow-hidden pointer-events-none">
        <div className="absolute inset-y-3 -left-1/3 w-1/3 rounded-full bg-gradient-to-r from-transparent via-white/15 to-transparent animate-shimmer" />
      </div>
    </Link>

              {/* Card 2 → jadikan link */}
              <Link
                href="/services/tiktok/vt-viewers"
                aria-label="Pesan Paket Views TikTok"
                className="group relative block rounded-[14px] border border-white/15 bg-[#2a123f]/60 backdrop-blur-md p-4 overflow-hidden transition hover:border-violet-400/40 hover:shadow-lg hover:shadow-violet-500/10 active:scale-[0.99]"
              >
                <div className="flex items-center gap-3">
                  <div className="min-w-0">
                    <h4 className="font-semibold text-base sm:text-lg mb-1">Paket Views TikTok</h4>
                    <p className="text-[12px] sm:text-sm text-gray-400 mb-1">Mulai dari</p>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-lg sm:text-xl text-purple-300">Rp30.000</span>
                      <span className="text-sm text-gray-400 line-through">Rp75.000</span>
                    </div>
                  </div>
                  <div className="relative ml-auto h-[68px] sm:h-[90px] w-[68px] sm:w-[90px]">
                    <Image src="/images/hero/tiktok.png" alt="tiktok" fill className="object-contain" />
                  </div>
                </div>

                {/* shimmer */}
                <div className="absolute inset-0 rounded-[14px] overflow-hidden pointer-events-none">
                  <div className="absolute inset-y-3 -left-1/3 w-1/3 rounded-full bg-gradient-to-r from-transparent via-white/15 to-transparent animate-shimmer" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURE LIST (desktop) */}
      <div className="max-w-[1060px] w-full mx-auto px-4 sm:px-8 xl:px-0 hidden xl:block">
        <div className="flex items-center justify-between gap-8 mt-6 flex-nowrap overflow-x-auto">
          {featureData.map((item, key) => (
            <div className="flex items-center gap-4 min-w-[220px]" key={String(key)}>
              {item.icon}
              <div>
                <h3 className="font-medium text-lg">{item.title}</h3>
                <p className="text-sm text-gray-300">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURE LIST (mobile) */}
      <div className="max-w-[1060px] w-full mx-auto px-4 pt-1 sm:px-8 xl:px-0 xl:hidden">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          {featureData.map((item, key) => (
            <div
              key={String(key)}
              className="rounded-xl border border-white/10 bg-white/5 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] hover:bg-white/[0.08] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="grid place-items-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/25 to-fuchsia-500/20 ring-1 ring-white/10 text-purple-200">
                  <span className="scale-75">{item.icon}</span>
                </div>
                <div className="min-w-0">
                  <h4 className="font-medium text-sm leading-tight">{item.title}</h4>
                  <p className="text-[11px] text-gray-300/90 line-clamp-2">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <RunText />
    </section>
  );
};

export default Hero;
