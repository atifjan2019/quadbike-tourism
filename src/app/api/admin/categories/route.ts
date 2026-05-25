import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const Body = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  image: z.string().optional().nullable(),
  order: z.coerce.number().int().default(0),
});

export async function GET() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { tours: true } } },
    orderBy: { order: "asc" },
  });
  return NextResponse.json({ ok: true, categories });
}

export async function POST(request: Request) {
  const json = await request.json();
  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.issues }, { status: 400 });
  }
  const category = await prisma.category.create({ data: parsed.data });
  return NextResponse.json({ ok: true, category });
}
