// app/api/auth/[...nextauth]/route.ts
import NextAuth, { type NextAuthOptions,} from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { z } from "zod";
import type { JWT } from "next-auth/jwt";

const credentialsSchema = z.object({
  phone: z.string().min(6, "Nomor telepon tidak valid"),
  password: z.string().min(6, "Kata sandi minimal 6 karakter"),
});

type CredUser = {
  id: string;
  name?: string | null;
  phone: string;
  avatarUrl?: string | null;
};

type TokenShape = JWT & {
  id?: string;
  name?: string | null;
  phone?: string | null;
  image?: string | null;
};

if (!process.env.NEXTAUTH_SECRET) {
  console.warn("[NextAuth] Warning: NEXTAUTH_SECRET is missing");
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },

  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          }),
        ]
      : []),

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
          select: {
            id: true,
            name: true,
            phone: true,
            passwordHash: true,
            avatarUrl: true,
          },
        });
        if (!user) return null;

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;

        return {
          id: user.id,
          name: user.name ?? user.phone,
          phone: user.phone,
          avatarUrl: user.avatarUrl ?? null,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as Partial<CredUser>;
        const t = token as TokenShape;
        if (u.id) t.id = u.id;
        t.name = (u.name as string) ?? t.name ?? null;
        t.phone = (u.phone as string) ?? t.phone ?? null;
        t.image = (u.avatarUrl as string) ?? t.image ?? null;
        return t;
      }
      return token;
    },

    async session({ session, token }) {
      const t = token as TokenShape;

      // default dari token
      let freshName = t.name ?? null;
      let freshImage = t.image ?? null;
      let freshPhone = t.phone ?? null;

      // ambil data terbaru dari DB jika ada id — tapi jangan pernah lempar error
      if (t.id) {
        try {
          const fresh = await prisma.user.findUnique({
            where: { id: t.id as string },
            select: { name: true, avatarUrl: true, phone: true },
          });
          if (fresh) {
            freshName = fresh.name ?? freshPhone ?? null;
            freshImage = fresh.avatarUrl ?? null;
            freshPhone = fresh.phone ?? null;
          }
        } catch (e) {
          console.error("[NextAuth session] DB fetch failed:", e);
        }
      }

      // karena kamu sudah extend tipe Session, set field langsung
      session.user = {
        ...(session.user || {}),
        id: (t.id as string) ?? "",
        name: freshName,
        image: freshImage,
        phone: freshPhone,
      };

      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
export const dynamic = "force-dynamic";
