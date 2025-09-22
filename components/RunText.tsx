// components/RunText.tsx
"use client";

import Marquee from "react-fast-marquee";

const lines = [
  "🚀 Tingkatkan Popularitas Anda Sekarang!",
  "❤️ Dapatkan auto likes Instagram & TikTok secara instan, aman, dan stabil.",
  "🎥 Tambah views YouTube real & aktif untuk meningkatkan kepercayaan audiens.",
  "🔥 Naikkan engagement rate akun Anda dengan layanan 100% aman & terpercaya.",
  "📈 Cocok untuk personal brand, bisnis online, influencer, hingga content creator.",
  "💎 Proses cepat, harga terjangkau, hasil maksimal.",
  "📞 Didukung tim support 24/7 yang selalu siap membantu kapan saja.",
  "✨ Saatnya buktikan! Buat akun Anda makin dikenal & kredibel.",
];

export default function RunText() {
  return (
    <div className="w-full bg-purple-900/50 border border-purple-400/30 rounded-md py-3 mt-9 overflow-hidden">
      <Marquee
        gradient={false}
        speed={50}
        pauseOnHover
        className="text-white font-medium text-sm sm:text-base"
      >
        {/* prefix kecil agar tidak langsung mepet */}
        <span className="opacity-70 mr-6">INFO:</span>
        {lines.map((t, i) => (
          <span key={i} className="mr-10 whitespace-nowrap">
            {t}
          </span>
        ))}
      </Marquee>
    </div>
  );
}
