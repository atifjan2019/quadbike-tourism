import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const media = await prisma.media.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ ok: true, media });
}
