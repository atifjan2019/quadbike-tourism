import { NextResponse } from "next/server";
import { readdir, stat, unlink } from "fs/promises";
import { existsSync } from "fs";
import path from "node:path";
import { prisma } from "@/lib/db";

const PUBLIC_DIR = path.join(process.cwd(), "public");
const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif", ".svg"]);

type FileItem = {
  id: string;           // URL-encoded relative URL — used as the identifier
  url: string;          // e.g. "/images/foo.png" or "/uploads/abc.webp"
  filename: string;
  source: "images" | "uploads";
  sizeKB: number;
  modifiedAt: string;
  dbId: string | null;  // matching Media row id, if any
  alt: string | null;
  title: string | null;
  caption: string | null;
  description: string | null;
};

async function scanDir(sub: "images" | "uploads"): Promise<FileItem[]> {
  const dir = path.join(PUBLIC_DIR, sub);
  if (!existsSync(dir)) return [];
  const entries = await readdir(dir);
  const out: FileItem[] = [];
  for (const name of entries) {
    const ext = path.extname(name).toLowerCase();
    if (!IMAGE_EXTS.has(ext)) continue;
    const abs = path.join(dir, name);
    const st = await stat(abs);
    if (!st.isFile()) continue;
    const url = `/${sub}/${name}`;
    out.push({
      id: encodeURIComponent(url),
      url,
      filename: name,
      source: sub,
      sizeKB: Math.round(st.size / 1024),
      modifiedAt: st.mtime.toISOString(),
      dbId: null,
      alt: null,
      title: null,
      caption: null,
      description: null,
    });
  }
  return out;
}

export async function GET() {
  const [images, uploads, dbRows] = await Promise.all([
    scanDir("images"),
    scanDir("uploads"),
    prisma.media.findMany(),
  ]);
  const dbByUrl = new Map(dbRows.map((r) => [r.url, r]));
  const all = [...uploads, ...images].map((f) => {
    const row = dbByUrl.get(f.url);
    return row
      ? {
          ...f,
          dbId: row.id,
          alt: row.alt ?? null,
          title: row.title ?? null,
          caption: row.caption ?? null,
          description: row.description ?? null,
        }
      : f;
  });
  all.sort((a, b) => (a.modifiedAt < b.modifiedAt ? 1 : -1));
  return NextResponse.json({ ok: true, media: all });
}

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const target = url.searchParams.get("url");
  if (!target || !target.startsWith("/")) {
    return NextResponse.json({ ok: false, error: "Missing or invalid 'url' param" }, { status: 400 });
  }
  if (!target.startsWith("/images/") && !target.startsWith("/uploads/")) {
    return NextResponse.json(
      { ok: false, error: "Only /images/ and /uploads/ paths can be deleted" },
      { status: 400 }
    );
  }
  // Resolve and safety-check the path
  const resolved = path.resolve(PUBLIC_DIR, "." + target);
  if (!resolved.startsWith(PUBLIC_DIR + path.sep)) {
    return NextResponse.json({ ok: false, error: "Path traversal blocked" }, { status: 400 });
  }
  try {
    await unlink(resolved);
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: (e as Error).message },
      { status: 404 }
    );
  }
  // Remove any DB record pointing at the same URL
  await prisma.media.deleteMany({ where: { url: target } });
  return NextResponse.json({ ok: true });
}
