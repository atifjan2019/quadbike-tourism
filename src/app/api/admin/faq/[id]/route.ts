import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const Body = z.object({
  question: z.string().min(1).optional(),
  answer: z.string().min(1).optional(),
  order: z.coerce.number().int().optional(),
});

export async function PATCH(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const json = await request.json();
  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.issues }, { status: 400 });
  }
  const f = await prisma.fAQ.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ ok: true, faq: f });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  await prisma.fAQ.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
