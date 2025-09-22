// app/api/password/reset/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { verifyCode } from "@/lib/otp";

export async function POST(req: Request) {
  try {
    const { phone, otp, newPassword } = await req.json();

    if (!phone || !/^\+\d{6,15}$/.test(phone) || !otp || !newPassword) {
      return NextResponse.json({ ok: false, message: "Data tidak valid" }, { status: 400 });
    }
    if (String(newPassword).length < 8) {
      return NextResponse.json({ ok: false, message: "Password minimal 8 karakter" }, { status: 400 });
    }

    // Ambil OTP terbaru dgn purpose 'reset'
    const rec = await prisma.otp.findFirst({
      where: { phone, purpose: "reset" },
      orderBy: { createdAt: "desc" },
    });
    if (!rec) {
      return NextResponse.json({ ok: false, message: "OTP tidak ditemukan" }, { status: 400 });
    }
    if (rec.expiresAt.getTime() < Date.now()) {
      return NextResponse.json({ ok: false, message: "OTP kedaluwarsa" }, { status: 400 });
    }

    const ok = await verifyCode(otp, rec.codeHash);
    if (!ok) {
      return NextResponse.json({ ok: false, message: "OTP salah" }, { status: 400 });
    }

    // Update password user
    const user = await prisma.user.findUnique({ where: { phone } });
    if (!user) {
      return NextResponse.json({ ok: false, message: "User tidak ditemukan" }, { status: 404 });
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    // (opsional) hapus OTP agar sekali pakai
    await prisma.otp.delete({ where: { id: rec.id } });

    // (opsional) revoke session kalau pakai model Session NextAuth
    // await prisma.session.deleteMany({ where: { userId: user.id } });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, message: "Server error" }, { status: 500 });
  }
}
