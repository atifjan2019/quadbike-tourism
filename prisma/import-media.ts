/**
 * Imports WordPress attachments from the WXR media export and:
 *  1. Downloads each remote URL into public/uploads/<basename>
 *  2. Creates an idempotent Media row pointing at the new local URL
 *
 * Re-runnable: if a file already exists locally it is skipped and only the
 * Media row is upserted by url.
 *
 * Run with:  npm run db:import:media
 */

import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config();

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
if (!connectionString) throw new Error("DIRECT_URL or DATABASE_URL not set");
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

const XML_PATH =
  process.argv[2] ??
  "/Users/atifjan/Downloads/quadbiketourism.WordPress.2026-05-26 (4).xml";

const UPLOADS_DIR = path.resolve(process.cwd(), "public/uploads");
// Only images get imported. Fonts/other binaries from the WP export are skipped.
const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"]);

type Attachment = {
  postId: string;
  title: string;
  remoteUrl: string;
  alt: string | null;
};

function decodeCdata(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8211;/g, "-");
}

function extractCdata(field: string, source: string): string | null {
  const re = new RegExp(`<${field}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${field}>`);
  const m = source.match(re);
  return m ? decodeCdata(m[1]) : null;
}

function parseAttachments(xml: string): Attachment[] {
  const items = xml.split("<item>").slice(1);
  const out: Attachment[] = [];
  for (const raw of items) {
    if (!raw.includes("<wp:post_type><![CDATA[attachment]]>")) continue;
    const postId = extractCdata("wp:post_id", raw) ?? "";
    const title = extractCdata("title", raw) ?? "";
    const remoteUrl = extractCdata("wp:attachment_url", raw);
    if (!remoteUrl) continue;

    // Find _wp_attachment_image_alt meta value
    let alt: string | null = null;
    const metaRe =
      /<wp:meta_key><!\[CDATA\[_wp_attachment_image_alt\]\]><\/wp:meta_key>\s*<wp:meta_value><!\[CDATA\[([\s\S]*?)\]\]><\/wp:meta_value>/;
    const altMatch = raw.match(metaRe);
    if (altMatch) alt = decodeCdata(altMatch[1]).trim() || null;

    out.push({ postId, title, remoteUrl, alt });
  }
  return out;
}

async function downloadFile(url: string, destPath: string): Promise<void> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(destPath, buf);
}

function uniqueLocalName(remoteUrl: string, taken: Set<string>): string {
  const base = path.basename(new URL(remoteUrl).pathname);
  if (!taken.has(base)) return base;
  // Disambiguate by appending the WP year/month prefix if present
  const parts = new URL(remoteUrl).pathname.split("/").filter(Boolean);
  // .../uploads/2024/11/foo.jpg -> 2024-11-foo.jpg
  const idx = parts.indexOf("uploads");
  if (idx >= 0 && parts.length > idx + 2) {
    const candidate = `${parts[idx + 1]}-${parts[idx + 2]}-${base}`;
    if (!taken.has(candidate)) return candidate;
  }
  let n = 1;
  const ext = path.extname(base);
  const stem = base.slice(0, base.length - ext.length);
  while (taken.has(`${stem}-${n}${ext}`)) n++;
  return `${stem}-${n}${ext}`;
}

async function main() {
  if (!fs.existsSync(XML_PATH)) {
    throw new Error(`XML not found at ${XML_PATH}`);
  }
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });

  const xml = fs.readFileSync(XML_PATH, "utf8");
  const attachments = parseAttachments(xml);

  // Filter to images only.
  const images = attachments.filter((a) => {
    const ext = path.extname(new URL(a.remoteUrl).pathname).toLowerCase();
    return IMAGE_EXTS.has(ext);
  });

  console.log(
    `Parsed ${attachments.length} attachments, ${images.length} images to import`,
  );

  const takenNames = new Set<string>(fs.readdirSync(UPLOADS_DIR));

  let created = 0;
  let downloaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const att of images) {
    const filename = uniqueLocalName(att.remoteUrl, takenNames);
    const localPath = path.join(UPLOADS_DIR, filename);
    const localUrl = `/uploads/${filename}`;

    // Download if file missing locally
    if (!fs.existsSync(localPath)) {
      try {
        await downloadFile(att.remoteUrl, localPath);
        downloaded++;
        process.stdout.write(`↓ ${filename}\n`);
      } catch (err) {
        failed++;
        console.warn(
          `! failed: ${att.remoteUrl} — ${err instanceof Error ? err.message : err}`,
        );
        continue;
      }
    } else {
      skipped++;
    }
    takenNames.add(filename);

    // Upsert Media row keyed by local URL
    await prisma.media.upsert({
      where: { url: localUrl },
      create: {
        url: localUrl,
        filename,
        alt: att.alt,
        title: att.title || null,
      },
      update: {
        filename,
        alt: att.alt,
        title: att.title || null,
      },
    });
    created++;
  }

  console.log(
    `\nDone. Media rows upserted: ${created}, downloaded: ${downloaded}, already-local: ${skipped}, failed: ${failed}`,
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
