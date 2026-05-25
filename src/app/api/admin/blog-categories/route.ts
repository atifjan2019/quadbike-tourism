import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const Body = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  order: z.number().int().default(0),
});

export async function POST(request: Request) {
  const json = await request.json();
  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.issues }, { status: 400 });
  }
  const cat = await prisma.blogCategory.create({ data: parsed.data });
  return NextResponse.json({ ok: true, category: cat });
}
