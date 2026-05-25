import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const Body = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
  order: z.coerce.number().int().default(0),
});

export async function GET() {
  const items = await prisma.fAQ.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json({ ok: true, faqs: items });
}

export async function POST(request: Request) {
  const json = await request.json();
  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.issues }, { status: 400 });
  }
  const f = await prisma.fAQ.create({ data: parsed.data });
  return NextResponse.json({ ok: true, faq: f });
}
