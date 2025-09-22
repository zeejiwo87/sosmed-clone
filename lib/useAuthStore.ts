"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type User = {
  id: string;
  name?: string;
  phone: string; // E.164, contoh: +62812xxxxxxx
  avatarUrl?: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
  login: (payload: { user: User; token: string }) => void;
  logout: () => void;
  setUser: (u: Partial<User>) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: ({ user, token }) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
      setUser: (u) => set((s) => (s.user ? { user: { ...s.user, ...u } } : s)),
    }),
    { name: "auth-store" }
  )
);

// Normalisasi nomor ke E.164 (Indonesia)
export function normalizeIndoPhone(raw: string) {
  const only = raw.replace(/[^\d]/g, "");
  if (only.startsWith("62")) return `+${only}`;
  if (only.startsWith("0")) return `+62${only.slice(1)}`;
  if (only.startsWith("8")) return `+62${only}`;
  if (raw.startsWith("+62")) return raw;
  return `+${only}`;
}
