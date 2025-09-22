import Link from "next/link";
import ServiceOrderClient from "./serviceorderclient";
import { headers } from "next/headers";

type PageProps = {
  params: Promise<{ category: string; slug: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ params, searchParams }: PageProps) {
  const { category, slug } = await params;      // ✅ await
  const sp = (await searchParams) ?? {};        // ✅ await
  let vendorCode = typeof sp.code === "string" ? sp.code.trim() : "";

  if (!vendorCode) {
    try {
      const h = await headers(); // ✅ await di Next 15
      const base = `${h.get("x-forwarded-proto") ?? "http"}://${h.get("host") ?? "localhost:3000"}`;

      const res = await fetch(`${base}/api/layanan/resolve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, slug }),
        cache: "no-store",
      });

      if (res.ok) {
        const j = (await res.json()) as { code?: unknown };
        if (j?.code != null) vendorCode = String(j.code);
      }
    } catch {
      // biarkan kosong; client akan coba auto-resolve
    }
  }

  return (
    <>
      <div className="mx-auto max-w-6xl px-4 pt-8 text-white">
        <nav className="mb-6 text-sm text-white/60">
          <ol className="flex items-center gap-2">
            <li><Link href="/" className="hover:text-white/90">Home</Link></li>
            <li className="select-none">/</li>
            <li><Link href="/services" className="hover:text-white/90">Services</Link></li>
            <li className="select-none">/</li>
            <li className="capitalize">{category}</li>
            <li className="select-none">/</li>
            <li className="capitalize text-white/90">{slug.replace(/-/g, " ")}</li>
          </ol>
        </nav>
      </div>

      <ServiceOrderClient category={category} slug={slug} vendorCode={vendorCode || ""} />
    </>
  );
}
