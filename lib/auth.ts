// lib/auth.ts
import type { NextAuthOptions, Session, Profile } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import type { JWT } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { z } from "zod";

/* -------------------- Validasi credentials -------------------- */
const credentialsSchema = z.object({
  phone: z.string().min(6, "Nomor telepon tidak valid"),
  password: z.string().min(6, "Kata sandi minimal 6 karakter"),
});

/* -------------------- Bentuk user (credentials) -------------------- */
type CredUser = {
  id: string;
  name?: string | null;
  phone: string;
};

/* -------------------- Bentuk token yg kita pakai -------------------- */
type TokenShape = JWT & {
  id?: string; // DB id (credentials) atau Google sub (OAuth)
  name?: string | null;
  phone?: string | null;
  image?: string | null;
  email?: string | null;
  provider?: "google" | "credentials";
};

type SessionUser = {
  id: string;
  name?: string | null;
  phone?: string | null;
  image?: string | null;
  email?: string | null;
  provider?: "google" | "credentials" | null;
};

/* Helper: ambil URL foto dari Profile (google pakai 'picture', generik pakai 'image') */
function getProfileImage(p?: Profile | null): string | null {
  if (!p) return null;
  const rec = p as Record<string, unknown>;
  if (typeof rec.picture === "string") return rec.picture;
  if (typeof rec.image === "string") return rec.image;
  return null;
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    /* ---------- Google OAuth (tanpa tulis ke DB, cukup token) ---------- */
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),

    /* ---------- Credentials (phone + password) ---------- */
    Credentials({
      id: "credentials",
      name: "Phone & Password",
      credentials: {
        phone: { label: "Nomor Telepon", type: "text" },
        password: { label: "Kata Sandi", type: "password" },
      },
      authorize: async (rawCreds): Promise<CredUser | null> => {
        const parsed = credentialsSchema.safeParse(rawCreds);
        if (!parsed.success) return null;

        const { phone, password } = parsed.data;

        const user = await prisma.user.findUnique({
          where: { phone },
          select: { id: true, name: true, phone: true, passwordHash: true },
        });
        if (!user) return null;

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;

        return { id: user.id, name: user.name ?? user.phone, phone: user.phone };
      },
    }),
  ],

  callbacks: {
    /* -------------------- JWT -------------------- */
    async jwt({ token, user, account, profile }) {
      const t = token as TokenShape;

      // Login via Credentials
      if (user && account?.provider === "credentials") {
        const u = user as CredUser;
        t.id = u.id;
        t.name = u.name ?? null;
        t.phone = u.phone ?? null;
        t.provider = "credentials";
        return t;
      }

      // Login via Google
      if (account?.provider === "google") {
        const p = (profile ?? null) as Profile | null;
        t.provider = "google";
        t.id = account.providerAccountId; // Google sub
        t.name = typeof p?.name === "string" ? p.name : t.name ?? null;
        t.email = typeof p?.email === "string" ? p.email : t.email ?? null;
        const pic = getProfileImage(p);
        t.image = pic ?? t.image ?? null;
        return t;
      }

      // Refresh token biasa
      return t;
    },

    /* -------------------- Session -------------------- */
    async session({ session, token }: { session: Session; token: JWT }) {
      const t = token as TokenShape;

      // User dari Google: jangan query DB
      if (t.provider === "google") {
        const sUser: SessionUser = {
          id: t.id ?? "",
          name: t.name ?? null,
          phone: null,
          image: t.image ?? null,
          email: t.email ?? null,
          provider: "google",
        };
        session.user = sUser as unknown as Session["user"];
        return session;
      }

      // User credentials: ambil data FRESH dari DB
      if (t.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: t.id },
          select: { id: true, name: true, phone: true, avatarUrl: true },
        });

        if (dbUser) {
          const sUser: SessionUser = {
            id: dbUser.id,
            name: dbUser.name ?? null,
            phone: dbUser.phone ?? null,
            image: dbUser.avatarUrl ?? null,
            email: null,
            provider: "credentials",
          };
          session.user = sUser as unknown as Session["user"];
          return session;
        }
      }

      // Fallback
      const sUser: SessionUser = {
        id: t.id ?? "",
        name: t.name ?? null,
        phone: t.phone ?? null,
        image: t.image ?? null,
        email: t.email ?? null,
        provider: t.provider ?? null,
      };
      session.user = sUser as unknown as Session["user"];
      return session;
    },
  },
};
