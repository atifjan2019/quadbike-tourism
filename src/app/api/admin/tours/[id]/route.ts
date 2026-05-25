import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const TourUpdate = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  categoryId: z.string().min(1).optional(),
  shortDesc: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  featuredImage: z.string().optional().nullable(),
  gallery: z.array(z.string()).optional(),
  priceFrom: z.coerce.number().nonnegative().optional(),
  durationMin: z.coerce.number().int().nonnegative().optional().nullable(),
  maxGuests: z.coerce.number().int().nonnegative().optional().nullable(),
  includes: z.array(z.string()).optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]).optional(),
  featured: z.boolean().optional(),
  seoTitle: z.string().optional().nullable(),
  seoDesc: z.string().optional().nullable(),
});

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const tour = await prisma.tour.findUnique({
    where: { id },
    include: { category: true, variations: true },
  });
  if (!tour) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true, tour });
}

export async function PATCH(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const json = await request.json();
  const parsed = TourUpdate.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.issues }, { status: 400 });
  }
  const tour = await prisma.tour.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ ok: true, tour });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  await prisma.tour.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
