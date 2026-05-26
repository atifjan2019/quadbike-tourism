import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const VariationInput = z.object({
  id: z.string().optional(),
  label: z.string().min(1),
  price: z.coerce.number().nonnegative(),
  durationMin: z.coerce.number().int().nonnegative().optional().nullable(),
  maxGuests: z.coerce.number().int().nonnegative().optional().nullable(),
});

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
  variations: z.array(VariationInput).optional(),
});

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const tour = await prisma.tour.findUnique({
    where: { id },
    include: { category: true, variations: { orderBy: { price: "asc" } } },
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

  const { variations, ...tourData } = parsed.data;

  const tour = await prisma.$transaction(async (tx) => {
    const updated = await tx.tour.update({ where: { id }, data: tourData });

    if (variations) {
      const existing = await tx.variation.findMany({
        where: { tourId: id },
        select: { id: true },
      });
      const incomingIds = new Set(variations.map((v) => v.id).filter(Boolean) as string[]);
      const toDelete = existing.filter((v) => !incomingIds.has(v.id)).map((v) => v.id);
      if (toDelete.length) {
        await tx.variation.deleteMany({ where: { id: { in: toDelete } } });
      }
      for (const v of variations) {
        if (v.id) {
          await tx.variation.update({
            where: { id: v.id },
            data: {
              label: v.label,
              price: v.price,
              durationMin: v.durationMin ?? null,
              maxGuests: v.maxGuests ?? null,
            },
          });
        } else {
          await tx.variation.create({
            data: {
              tourId: id,
              label: v.label,
              price: v.price,
              durationMin: v.durationMin ?? null,
              maxGuests: v.maxGuests ?? null,
            },
          });
        }
      }
    }

    return updated;
  });

  return NextResponse.json({ ok: true, tour });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  await prisma.tour.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
