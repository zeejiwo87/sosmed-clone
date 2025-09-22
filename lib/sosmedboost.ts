// lib/sosmedboost.ts
// Server-only helper untuk memanggil SosmedBoost secara aman (pakai env di server)
import axios, { AxiosResponse } from "axios";

const BASE_URL =
  process.env.SOSMEDBOOST_BASE_URL || "https://sosmedboost.com/api/service";

function required(name: string, v?: string) {
  if (!v) throw new Error(`Missing env ${name}`);
  return v;
}

const apiKey = required("SOSMEDBOOST_API_KEY", process.env.SOSMEDBOOST_API_KEY);
const secretKey = required("SOSMEDBOOST_SECRET_KEY", process.env.SOSMEDBOOST_SECRET_KEY);

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    apiKey,
    secretKey,
  },
  timeout: 20000,
});

// ====== Types ======
// Kita belum tahu bentuk response resmi dari vendor, jadi sementara gunakan `unknown`.
// Nanti bisa diganti pakai Zod untuk memvalidasi dan get typed data.

type LangReq = { lang: string };
type LayananDetailReq = { lang: string; code: string };
type OrderDetailReq = { lang: string; trx: string };
type OrderProductReq = { lang: string; product_id: string; data: string; quantity: number };

// Util umum untuk POST ke ?type=<endpoint>
async function post<TReq extends Record<string, unknown>, TResp = unknown>(
  endpoint: string,
  payload: TReq
): Promise<TResp> {
  const url = `${BASE_URL}?type=${encodeURIComponent(endpoint)}`;
  const res: AxiosResponse<TResp> = await client.post<TResp>(url, payload ?? ({} as TReq));
  return res.data;
}

// ==== Wrapper functions ====
export async function sbGetLayanan(lang: string = "id"): Promise<unknown> {
  return post<LangReq, unknown>("layanan", { lang });
}

export async function sbGetLayananDetail(code: string, lang: string = "id"): Promise<unknown> {
  return post<LayananDetailReq, unknown>("get-layanan-detail", { lang, code });
}

export async function sbGetBalance(lang: string = "id"): Promise<unknown> {
  return post<LangReq, unknown>("get-balance", { lang });
}

export async function sbGetOrderDetail(trx: string, lang: string = "id"): Promise<unknown> {
  return post<OrderDetailReq, unknown>("get-order-detail", { lang, trx });
}

export async function sbOrderProduct(params: {
  product_id: string;
  data: string;
  quantity: number;
  lang?: string;
}): Promise<unknown> {
  const { product_id, data, quantity, lang = "id" } = params;
  return post<OrderProductReq, unknown>("order-product", {
    lang,
    product_id,
    data,
    quantity,
  });
}
