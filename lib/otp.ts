// lib/otp.ts
import "server-only";               // ⛑️ pastikan tidak terbundle ke client
import bcrypt from "bcrypt";
import { sendMessage } from "./whatsapp";

/** Generate 6-digit numeric OTP */
export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/** Hash OTP dengan bcrypt (saltRounds=10 sudah cukup untuk OTP) */
export async function hashCode(code: string): Promise<string> {
  return bcrypt.hash(code, 10);
}

/** Verifikasi OTP dengan bcrypt.compare */
export async function verifyCode(code: string, codeHash: string): Promise<boolean> {
  return bcrypt.compare(code, codeHash);
}

/**
 * Normalisasi nomor untuk gateway:
 * - Hilangkan semua spasi/dash/kurung
 * - Jika diawali '+', hapus tanda '+'
 */
function normalizeForGateway(raw: string): string {
  if (!raw) return raw;
  const cleaned = raw.replace(/[\s\-()]/g, "");
  return cleaned.startsWith("+") ? cleaned.slice(1) : cleaned;
}

/** Kirim OTP via WhatsApp gateway kamu */
export async function sendWhatsApp(to: string, message: string): Promise<void> {
  const number = normalizeForGateway(to);
  await sendMessage({
    text: message,
    type: "text",
    number,      // gateway kamu menerima di field "number"
    imageUrl: "",// tidak kirim gambar untuk OTP
  });
}
