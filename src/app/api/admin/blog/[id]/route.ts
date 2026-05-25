import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const Body = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  excerpt: z.string().optional().nullable(),
  content: z.string().optional().nullable(),
  featuredImage: z.string().optional().nullable(),
  author: z.string().optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED"]).optional(),
  publishedAt: z.string().datetime().optional().nullable(),
  seoTitle: z.string().optional().nullable(),
  seoDesc: z.string().optional().nullable(),
  categoryId: z.string().optional().nullable(),
});

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true, post });
}

export async function PATCH(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const json = await request.json();
  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.issues }, { status: 400 });
  }
  const data: Record<string, unknown> = { ...parsed.data };
  if (parsed.data.publishedAt !== undefined) {
    data.publishedAt = parsed.data.publishedAt ? new Date(parsed.data.publishedAt) : null;
  }
  // Auto-set publishedAt when first transitioning to PUBLISHED if not provided
  if (parsed.data.status === "PUBLISHED" && data.publishedAt === undefined) {
    const existing = await prisma.blogPost.findUnique({ where: { id } });
    if (existing && !existing.publishedAt) data.publishedAt = new Date();
  }
  const post = await prisma.blogPost.update({ where: { id }, data });
  return NextResponse.json({ ok: true, post });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  await prisma.blogPost.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
