import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import sharp from "sharp";
import { prisma } from "@/lib/db";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const PUBLIC_PREFIX = "/uploads/";

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB
const ACCEPTED = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get("file");
    const alt = (form.get("alt") as string | null) ?? null;

    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, error: "Missing file" }, { status: 400 });
    }
    if (!ACCEPTED.has(file.type)) {
      return NextResponse.json(
        { ok: false, error: `Unsupported type: ${file.type}` },
        { status: 400 }
      );
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ ok: false, error: "File too large (max 8 MB)" }, { status: 400 });
    }

    if (!existsSync(UPLOAD_DIR)) await mkdir(UPLOAD_DIR, { recursive: true });

    const arrayBuf = await file.arrayBuffer();
    const buf = Buffer.from(arrayBuf);

    const safeName = file.name.replace(/[^a-z0-9._-]/gi, "_");
    const stamp = Date.now().toString(36);
    const baseName = `${stamp}-${safeName}`;
    const webpName = baseName.replace(/\.(jpe?g|png|avif|webp)$/i, ".webp");
    const targetPath = path.join(UPLOAD_DIR, webpName);

    // Resize/compress to webp (max 1600px wide)
    const out = await sharp(buf)
      .rotate()
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();

    await writeFile(targetPath, out);
    const url = PUBLIC_PREFIX + webpName;
    const media = await prisma.media.create({ data: { url, filename: webpName, alt } });
    return NextResponse.json({ ok: true, media });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    console.error("[media/upload] failed:", err);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
