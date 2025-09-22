// lib/serviceMap.ts
export type ServiceKey = `${Lowercase<string>}/${Lowercase<string>}`;

/**
 * Placeholder kosong supaya komponen yang masih import tidak error build.
 * Tidak ada mapping manual di sini.
 */
export const SERVICE_CODE_MAP: Record<ServiceKey, string> = {} as Record<ServiceKey, string>;
