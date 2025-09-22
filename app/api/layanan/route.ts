export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { sbGetLayanan } from "@/lib/sosmedboost";

function errMsg(e: unknown) {
  return e instanceof Error ? e.message : "Internal error";
}

export async function GET() {
  try {
    const data = await sbGetLayanan("id");
    return NextResponse.json(data);
  } catch (e: unknown) {
    return NextResponse.json({ error: errMsg(e) }, { status: 500 });
  }
}
