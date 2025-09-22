// app/api/otp/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOtp, hashCode, sendWhatsApp } from "@/lib/otp";

export async function POST(req: Request) {
  try {
    const { phone, purpose } = await req.json();
    if (!phone || !/^\+\d{6,15}$/.test(phone)) {
      return NextResponse.json({ ok: false, message: "Nomor telepon tidak valid" }, { status: 400 });
    }
    const p = purpose ?? "register";

    // Rate limit sederhana (≤45 detik)
    const recent = await prisma.otp.findFirst({
      where: { phone, purpose: p },
      orderBy: { createdAt: "desc" },
    });
    if (recent && Date.now() - recent.createdAt.getTime() < 45_000) {
      return NextResponse.json({ ok: false, message: "Tunggu sebentar sebelum meminta OTP lagi" }, { status: 429 });
    }

    // Generate + hash
    const code = generateOtp();                  // ex: "123456"
    const codeHash = await hashCode(code);       // simpan hash (bcrypt)
    const expiresAt = new Date(Date.now() + (Number(process.env.OTP_EXPIRES_MINUTES ?? 5) * 60_000));

    await prisma.otp.create({ data: { phone, purpose: p, codeHash, expiresAt } });

    // Kirim via WhatsApp (implementasi di lib/otp.ts)
    await sendWhatsApp(phone, `Kode verifikasi kamu: ${code} (berlaku ${process.env.OTP_EXPIRES_MINUTES ?? 5} menit).`);

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, message: "Server error" }, { status: 500 });
  }
}
