import { NextResponse } from "next/server";
import { z } from "zod";
import path from "node:path";
import { prisma } from "@/lib/db";

const Body = z.object({
  url: z.string().min(1),
  alt: z.string().nullable().optional(),
  title: z.string().nullable().optional(),
  caption: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
});

export async function PATCH(request: Request) {
  const json = await request.json();
  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.issues }, { status: 400 });
  }
  const { url, ...meta } = parsed.data;
  const filename = path.basename(url);

  // Upsert by URL so files that exist on disk but have no DB row get one on first edit
  const media = await prisma.media.upsert({
    where: { url },
    update: meta,
    create: { url, filename, ...meta },
  });
  return NextResponse.json({ ok: true, media });
}
