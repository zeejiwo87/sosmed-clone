"use client";
import dynamic from "next/dynamic";

const Hero = dynamic(() => import("./Hero"), {
  ssr: false,
  loading: () => <div style={{ height: 320 }} />,
});

export default function HeroClient() {
  return <Hero />;
}
