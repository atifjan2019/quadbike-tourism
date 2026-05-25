import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const Body = z.object({
  name: z.string().min(1).optional(),
  country: z.string().optional().nullable(),
  message: z.string().min(1).optional(),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  avatar: z.string().optional().nullable(),
  order: z.coerce.number().int().optional(),
});

export async function PATCH(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const json = await request.json();
  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.issues }, { status: 400 });
  }
  const t = await prisma.testimonial.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ ok: true, testimonial: t });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  await prisma.testimonial.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
