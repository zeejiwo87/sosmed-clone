// app/api/register/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { verifyCode } from "@/lib/otp";

export async function POST(req: Request) {
  try {
    const { name, phone, password, otp } = await req.json();

    if (!name || !name.trim()) {
      return NextResponse.json({ ok: false, message: "Nama wajib diisi" }, { status: 400 });
    }
    if (!phone || !/^\+\d{6,15}$/.test(phone)) {
      return NextResponse.json({ ok: false, message: "Nomor telepon tidak valid" }, { status: 400 });
    }
    if (!password || password.length < 6) {
      return NextResponse.json({ ok: false, message: "Password minimal 6 karakter" }, { status: 400 });
    }
    if (!otp || !/^\d{6}$/.test(otp)) {
      return NextResponse.json({ ok: false, message: "OTP tidak valid" }, { status: 400 });
    }

    // Sudah terdaftar?
    const exists = await prisma.user.findUnique({ where: { phone } });
    if (exists) {
      return NextResponse.json({ ok: false, message: "Nomor telepon sudah terdaftar" }, { status: 409 });
    }

    // Ambil OTP terbaru untuk phone + purpose: "register"
    const record = await prisma.otp.findFirst({
      where: { phone, purpose: "register" },
      orderBy: { createdAt: "desc" },
    });
    if (!record) {
      return NextResponse.json({ ok: false, message: "OTP tidak ditemukan / kadaluarsa" }, { status: 400 });
    }

    // Expired?
    if (record.expiresAt.getTime() < Date.now()) {
      return NextResponse.json({ ok: false, message: "OTP sudah kadaluarsa" }, { status: 400 });
    }

    // Verifikasi hash OTP
    const ok = await verifyCode(otp, record.codeHash);
    if (!ok) {
      return NextResponse.json({ ok: false, message: "OTP salah" }, { status: 400 });
    }

    // Buat user
    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.user.create({
      data: { name: name.trim(), phone, passwordHash },
    });

    // Bersihkan semua OTP untuk nomor ini & purpose register
    await prisma.otp.deleteMany({ where: { phone, purpose: "register" } });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, message: "Server error" }, { status: 500 });
  }
}
