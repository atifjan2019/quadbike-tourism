import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const Body = z.object({
  name: z.string().min(1),
  country: z.string().optional().nullable(),
  message: z.string().min(1),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  avatar: z.string().optional().nullable(),
  order: z.coerce.number().int().default(0),
});

export async function GET() {
  const items = await prisma.testimonial.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json({ ok: true, testimonials: items });
}

export async function POST(request: Request) {
  const json = await request.json();
  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.issues }, { status: 400 });
  }
  const t = await prisma.testimonial.create({ data: parsed.data });
  return NextResponse.json({ ok: true, testimonial: t });
}
