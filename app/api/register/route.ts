// app/api/register/route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { verifyCode } from '@/lib/otp';

/** Normalisasi nomor:
 * - hapus spasi
 * - jika mulai "08" → ganti ke "+62..."
 * - kalau sudah "+" biarkan
 */
function normalizePhone(input: unknown): string {
  const s = String(input ?? '').replace(/\s+/g, '');
  if (!s) return '';
  if (s.startsWith('+')) return s;
  if (s.startsWith('08')) return '+62' + s.slice(1);
  return s;
}

/** Type guards tanpa `any` */
function hasCode(err: unknown): err is { code: string } {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in (err as Record<string, unknown>) &&
    typeof (err as Record<string, unknown>).code === 'string'
  );
}

function hasName(err: unknown): err is { name: string } {
  return (
    typeof err === 'object' &&
    err !== null &&
    'name' in (err as Record<string, unknown>) &&
    typeof (err as Record<string, unknown>).name === 'string'
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as Record<string, unknown>));
    const name = String((body as Record<string, unknown>).name ?? '').trim();
    const phoneRaw = (body as Record<string, unknown>).phone;
    const password = String((body as Record<string, unknown>).password ?? '');
    const otp = String((body as Record<string, unknown>).otp ?? '');

    // --- Validations
    if (!name) {
      return NextResponse.json({ ok: false, message: 'Nama wajib diisi' }, { status: 400 });
    }

    const phone = normalizePhone(phoneRaw);
    if (!/^\+\d{6,15}$/.test(phone)) {
      return NextResponse.json(
        { ok: false, message: 'Nomor telepon tidak valid (gunakan +62… atau 08…)' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json({ ok: false, message: 'Password minimal 6 karakter' }, { status: 400 });
    }

    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json({ ok: false, message: 'OTP tidak valid' }, { status: 400 });
    }

    // --- Sudah terdaftar?
    const exists = await prisma.user.findUnique({ where: { phone } });
    if (exists) {
      return NextResponse.json({ ok: false, message: 'Nomor telepon sudah terdaftar' }, { status: 409 });
    }

    // --- Ambil OTP terbaru untuk phone + purpose "register"
    const record = await prisma.otp.findFirst({
      where: { phone, purpose: 'register' },
      orderBy: { createdAt: 'desc' },
    });
    if (!record) {
      return NextResponse.json(
        { ok: false, message: 'OTP tidak ditemukan / kadaluarsa' },
        { status: 400 }
      );
    }

    // --- Expired?
    if (record.expiresAt.getTime() < Date.now()) {
      return NextResponse.json({ ok: false, message: 'OTP sudah kadaluarsa' }, { status: 400 });
    }

    // --- Verifikasi hash OTP
    const ok = await verifyCode(otp, record.codeHash);
    if (!ok) {
      return NextResponse.json({ ok: false, message: 'OTP salah' }, { status: 400 });
    }

    // --- Buat user
    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.user.create({
      data: { name, phone, passwordHash },
    });

    // --- Bersihkan OTP register nomor ini
    await prisma.otp.deleteMany({ where: { phone, purpose: 'register' } });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err: unknown) {
    // Logging aman
    console.error(
      '[register] error:',
      hasCode(err) ? err.code : hasName(err) ? err.name : err
    );

    if (hasCode(err) && err.code === 'P2002') {
      return NextResponse.json({ ok: false, message: 'Nomor telepon sudah terdaftar' }, { status: 409 });
    }
    if (hasName(err) && err.name === 'PrismaClientInitializationError') {
      return NextResponse.json(
        { ok: false, message: 'Database bermasalah. Cek DATABASE_URL di Vercel.' },
        { status: 500 }
      );
    }
    return NextResponse.json({ ok: false, message: 'Server error' }, { status: 500 });
  }
}
