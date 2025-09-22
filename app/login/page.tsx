import { Suspense } from "react";
import AuthPage from "./AuthPage";

export const dynamic = "force-dynamic"; // aman untuk halaman auth

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6 text-gray-300">Memuat…</div>}>
      <AuthPage />
    </Suspense>
  );
}
