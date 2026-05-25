import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { unlink } from "fs/promises";
import path from "path";

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const m = await prisma.media.findUnique({ where: { id } });
  if (!m) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  // Remove file from disk if it lives under /public/uploads
  if (m.url.startsWith("/uploads/")) {
    const p = path.join(process.cwd(), "public", m.url);
    try {
      await unlink(p);
    } catch {
      // file may already be gone — ignore
    }
  }
  await prisma.media.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
