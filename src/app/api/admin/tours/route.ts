import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const TourCreate = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  categoryId: z.string().min(1),
  shortDesc: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  featuredImage: z.string().optional().nullable(),
  gallery: z.array(z.string()).default([]),
  priceFrom: z.coerce.number().nonnegative(),
  durationMin: z.coerce.number().int().nonnegative().optional().nullable(),
  maxGuests: z.coerce.number().int().nonnegative().optional().nullable(),
  includes: z.array(z.string()).default([]),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
  featured: z.boolean().default(false),
  seoTitle: z.string().optional().nullable(),
  seoDesc: z.string().optional().nullable(),
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q") ?? "";
  const tours = await prisma.tour.findMany({
    where: q
      ? { OR: [{ title: { contains: q, mode: "insensitive" } }, { slug: { contains: q, mode: "insensitive" } }] }
      : undefined,
    include: { category: true, _count: { select: { bookings: true } } },
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json({ ok: true, tours });
}

export async function POST(request: Request) {
  const json = await request.json();
  const parsed = TourCreate.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.issues }, { status: 400 });
  }
  const tour = await prisma.tour.create({ data: parsed.data });
  return NextResponse.json({ ok: true, tour });
}
