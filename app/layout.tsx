// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "react-international-phone/style.css";

import Providers from "./providers";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WhatsAppFAB from "../components/WhatsAppFAB"; // ← Tambahkan ini

const inter = Inter({ variable: "--font-sans", subsets: ["latin"] });

// Ganti ke domain kamu
const SITE_URL = "https://94ec61b5e2ec.ngrok-free.app";
const OG_BANNER = `${SITE_URL}/images/banner.png`;
const OG_LOGO   = `${SITE_URL}/images/sociostore.png`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "SOCIOSTORE — Layanan Sosial Media Termurah",
    template: "%s — SOCIOSTORE",
  },
  description:
    "Kami menyediakan berbagai layanan sosial media dengan harga termurah, kualitas terjamin, dan proses cepat untuk membantu akunmu berkembang.",
  applicationName: "SOCIOSTORE",
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    siteName: "SOCIOSTORE",
    url: SITE_URL,
    title: "SOCIOSTORE — Layanan Sosial Media Termurah",
    description:
      "Kami menyediakan berbagai layanan sosial media dengan harga termurah, kualitas terjamin, dan proses cepat untuk membantu akunmu berkembang.",
    images: [
      { url: OG_BANNER, secureUrl: OG_BANNER, width: 1200, height: 630, alt: "SOCIOSTORE Banner" },
      { url: OG_LOGO, secureUrl: OG_LOGO, width: 512, height: 512, alt: "SOCIOSTORE Logo" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SOCIOSTORE — Layanan Sosial Media Termurah",
    description:
      "Kami menyediakan berbagai layanan sosial media dengan harga termurah, kualitas terjamin, dan proses cepat untuk membantu akunmu berkembang.",
    images: [OG_BANNER],
  },
  alternates: { canonical: SITE_URL },
  robots: { index: true, follow: true },
  icons: {
    icon: "/favicon.ico",
    apple: "/images/sociostore.png",
    shortcut: ["/icons/icon-192.png"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "SOCIOSTORE",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#140a26",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${inter.variable} antialiased bg-[#0b0616] text-white`}
      >
        <Providers>
          <Navbar />
          <main className="min-h-[calc(100vh-80px)] pt-24 md:pt-36 xl:pt-40">
            {children}
          </main>
          <Footer />

          {/* Floating WhatsApp tampil di SEMUA halaman */}
          <WhatsAppFAB
            contacts={[
              { label: "Admin 1", phone: "+62 851 7977 8353" },
              { label: "Admin 2", phone: "+62 858 7684 6768" },
            ]}
            preset="Halo, saya butuh bantuan."
          />
        </Providers>
      </body>
    </html>
  );
}
