// lib/useBalanceStore.ts
"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { secureFetch, SecureApiError } from "@/lib/secureFetch";

type BalanceState = {
  balance: number; // saldo saat ini (Rp)
  deposit: (amount: number) => void;
  charge: (amount: number) => boolean; // true jika cukup saldo (saldo dipotong), false jika tidak cukup
  reset: () => void;
  setBalance: (n: number) => void; // set saldo manual (misal dari API)
  fetchRealBalance: () => Promise<void>; // sinkronisasi dari /api/balance
};

export const useBalanceStore = create<BalanceState>()(
  persist(
    (set, get) => ({
      balance: 0,

      setBalance: (n) => set({ balance: Math.max(0, Math.floor(n)) }),

      deposit: (amount) => {
        if (amount <= 0) return;
        set((s) => ({ balance: s.balance + Math.floor(amount) }));
      },

      charge: (amount) => {
        if (amount <= 0) return true;
        const need = Math.floor(amount);
        const curr = get().balance;
        if (curr < need) return false;
        set({ balance: curr - need });
        return true;
      },

      reset: () => set({ balance: 0 }),

      // === Ambil saldo asli via endpoint HMAC-protected ===
      fetchRealBalance: async () => {
        try {
          const res = await secureFetch("/api/balance", "GET");
          const json = await res.json() as { status?: boolean; saldo?: number; error?: string };

          if (!json || json.status !== true || typeof json.saldo !== "number") {
            throw new Error(json?.error || "Format data tidak valid");
          }
          set({ balance: Math.max(0, Math.floor(json.saldo)) });
        } catch (e) {
          // Tangani error 403 (akses langsung / signature salah) atau error lain
          if (e instanceof SecureApiError) {
            // Bisa log ke monitoring; di UI biarkan nilai existing/Persisted
            console.warn("fetchRealBalance rejected:", e.status, e.message);
          } else {
            console.warn("fetchRealBalance error:", (e as Error)?.message);
          }
          // tidak me-reset balance agar UX tetap ada nilai terakhir (persist)
        }
      },
    }),
    {
      name: "balance-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ balance: s.balance }),
      version: 1,
    }
  )
);
