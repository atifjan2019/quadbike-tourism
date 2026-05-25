import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ slug: string }> }
) {
  const { slug } = await ctx.params;
  const tour = await prisma.tour.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: { category: true, variations: true },
  });
  if (!tour) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true, tour });
}
