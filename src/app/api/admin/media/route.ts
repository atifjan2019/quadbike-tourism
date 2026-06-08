import { NextResponse } from "next/server";
import { readdir, stat, unlink } from "fs/promises";
import { existsSync } from "fs";
import path from "node:path";
import { del } from "@vercel/blob";
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
  const diskItems = [...uploads, ...images].map((f) => {
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

  // DB rows not present on disk — e.g. files stored in Vercel Blob (absolute URLs)
  const diskUrls = new Set([...uploads, ...images].map((f) => f.url));
  const blobItems: FileItem[] = dbRows
    .filter((r) => !diskUrls.has(r.url))
    .map((r) => ({
      id: encodeURIComponent(r.url),
      url: r.url,
      filename: r.filename,
      source: "uploads",
      sizeKB: 0,
      modifiedAt: r.createdAt.toISOString(),
      dbId: r.id,
      alt: r.alt ?? null,
      title: r.title ?? null,
      caption: r.caption ?? null,
      description: r.description ?? null,
    }));

  const all = [...blobItems, ...diskItems];
  all.sort((a, b) => (a.modifiedAt < b.modifiedAt ? 1 : -1));
  return NextResponse.json({ ok: true, media: all });
}

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const target = url.searchParams.get("url");
  if (!target) {
    return NextResponse.json({ ok: false, error: "Missing 'url' param" }, { status: 400 });
  }

  // Vercel Blob assets use absolute URLs — delete from blob storage, not disk
  if (/^https?:\/\//i.test(target)) {
    try {
      await del(target);
    } catch (e) {
      // If the blob is already gone, still clear the DB row below
      console.error("[media] blob delete failed:", e);
    }
    await prisma.media.deleteMany({ where: { url: target } });
    return NextResponse.json({ ok: true });
  }

  if (!target.startsWith("/")) {
    return NextResponse.json({ ok: false, error: "Invalid 'url' param" }, { status: 400 });
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
