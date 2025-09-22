// app/api/otp/verify/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyCode } from "@/lib/otp";

export async function POST(req: Request) {
  try {
    const { phone, purpose, code } = await req.json();

    if (!phone || !/^\+\d{6,15}$/.test(phone) || !code) {
      return NextResponse.json({ ok: false, message: "Data tidak valid" }, { status: 400 });
    }
    const p = purpose ?? "register";

    // Ambil OTP terbaru utk nomor + purpose tsb
    const rec = await prisma.otp.findFirst({
      where: { phone, purpose: p },
      orderBy: { createdAt: "desc" },
    });

    if (!rec) {
      return NextResponse.json({ ok: false, message: "OTP tidak ditemukan" }, { status: 400 });
    }
    if (rec.expiresAt.getTime() < Date.now()) {
      return NextResponse.json({ ok: false, message: "OTP kedaluwarsa" }, { status: 400 });
    }

    const ok = await verifyCode(code, rec.codeHash);
    if (!ok) {
      return NextResponse.json({ ok: false, message: "OTP salah" }, { status: 400 });
    }

    // (opsional) jadikan sekali-pakai:
    // await prisma.otp.delete({ where: { id: rec.id } });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, message: "Server error" }, { status: 500 });
  }
}
