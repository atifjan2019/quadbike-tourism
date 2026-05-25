import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config();

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
if (!connectionString) throw new Error("DIRECT_URL or DATABASE_URL not set");
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

const XML_PATH = path.resolve(process.cwd(), "prisma/wordpress-export.xml");
const DEFAULT_AUTHOR = "Ayesha";

function getCdata(block: string, tag: string): string | null {
  const re = new RegExp(`<${tag}>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*</${tag}>`);
  const m = block.match(re);
  return m ? m[1] : null;
}

function getRawTag(block: string, tag: string): string | null {
  const re = new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`);
  const m = block.match(re);
  if (!m) return null;
  const inner = m[1].trim();
  const cdata = inner.match(/^<!\[CDATA\[([\s\S]*)\]\]>$/);
  return cdata ? cdata[1] : inner;
}

function getMeta(block: string, key: string): string | null {
  const re = new RegExp(
    `<wp:postmeta>\\s*<wp:meta_key>\\s*<!\\[CDATA\\[${key.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")}\\]\\]>\\s*</wp:meta_key>\\s*<wp:meta_value>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*</wp:meta_value>\\s*</wp:postmeta>`,
  );
  const m = block.match(re);
  return m ? m[1] : null;
}

function stripWpComments(html: string): string {
  return html
    .replace(/<!--\s*\/?wp:[^>]*?-->/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function splitItems(xml: string): string[] {
  const items: string[] = [];
  const re = /<item>([\s\S]*?)<\/item>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml)) !== null) items.push(m[1]);
  return items;
}

function firstCategory(block: string): { slug: string; name: string } | null {
  const re = /<category\s+domain="category"\s+nicename="([^"]+)">\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*<\/category>/;
  const m = block.match(re);
  if (!m) return null;
  return { slug: m[1], name: m[2] };
}

// Minimal PHP-serialize parser, enough for `a:N:{ s:..; a:..{ s:..; s:..; }; ... }` shape.
// Returns the decoded value or null on failure.
function unserialize(input: string): unknown | null {
  const bytes = Buffer.from(input, "utf8");
  let pos = 0;

  function readUntil(ch: number): string {
    const start = pos;
    while (pos < bytes.length && bytes[pos] !== ch) pos++;
    const s = bytes.subarray(start, pos).toString("utf8");
    return s;
  }
  function expect(ch: string) {
    if (bytes[pos] !== ch.charCodeAt(0)) {
      throw new Error(`Expected '${ch}' at ${pos}, got '${String.fromCharCode(bytes[pos])}'`);
    }
    pos++;
  }
  function parse(): unknown {
    const type = String.fromCharCode(bytes[pos]);
    pos++;
    expect(":");
    if (type === "s") {
      const lenStr = readUntil(":".charCodeAt(0));
      const len = parseInt(lenStr, 10);
      expect(":");
      expect('"');
      const s = bytes.subarray(pos, pos + len).toString("utf8");
      pos += len;
      expect('"');
      expect(";");
      return s;
    }
    if (type === "i") {
      const v = readUntil(";".charCodeAt(0));
      expect(";");
      return parseInt(v, 10);
    }
    if (type === "b") {
      const v = bytes[pos];
      pos++;
      expect(";");
      return v === "1".charCodeAt(0);
    }
    if (type === "N") {
      // N; (null)
      return null;
    }
    if (type === "a") {
      const lenStr = readUntil(":".charCodeAt(0));
      const len = parseInt(lenStr, 10);
      expect(":");
      expect("{");
      const obj: Record<string, unknown> = {};
      for (let i = 0; i < len; i++) {
        const key = parse();
        const value = parse();
        obj[String(key)] = value;
      }
      expect("}");
      return obj;
    }
    throw new Error(`Unknown type '${type}' at ${pos}`);
  }

  try {
    return parse();
  } catch {
    return null;
  }
}

function parseFaqs(raw: string | null): { question: string; answer: string }[] | null {
  if (!raw) return null;
  const decoded = unserialize(raw);
  if (!decoded || typeof decoded !== "object") return null;
  const out: { question: string; answer: string }[] = [];
  for (const v of Object.values(decoded as Record<string, unknown>)) {
    if (v && typeof v === "object") {
      const obj = v as Record<string, unknown>;
      const q = typeof obj.question === "string" ? obj.question.trim() : "";
      const a = typeof obj.answer === "string" ? obj.answer.trim() : "";
      if (q && a) out.push({ question: q, answer: a });
    }
  }
  return out.length ? out : null;
}

async function main() {
  const xml = fs.readFileSync(XML_PATH, "utf8");
  const items = splitItems(xml);
  console.log(`Found ${items.length} items in WXR`);

  // Build attachment id -> URL map
  const attachmentUrlById = new Map<string, string>();
  for (const item of items) {
    const postType = getCdata(item, "wp:post_type");
    if (postType !== "attachment") continue;
    const id = getRawTag(item, "wp:post_id");
    const urlMatch = item.match(/<wp:attachment_url>\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*<\/wp:attachment_url>/);
    if (id && urlMatch) attachmentUrlById.set(id, urlMatch[1]);
  }
  console.log(`Mapped ${attachmentUrlById.size} attachments`);

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const item of items) {
    const postType = getCdata(item, "wp:post_type");
    if (postType !== "post") continue;

    const status = getCdata(item, "wp:status");
    if (status !== "publish") {
      skipped++;
      continue;
    }

    const title = getCdata(item, "title") ?? "";
    const slug = getCdata(item, "wp:post_name") ?? "";
    const author = DEFAULT_AUTHOR;
    const contentRaw = getCdata(item, "content:encoded") ?? "";
    const excerptRaw = getCdata(item, "excerpt:encoded") ?? "";
    const dateGmt = getRawTag(item, "wp:post_date_gmt");

    if (!title || !slug) {
      console.warn(`Skipping item with missing title/slug (title=${title}, slug=${slug})`);
      skipped++;
      continue;
    }

    const content = stripWpComments(contentRaw);
    const excerpt = excerptRaw.trim() || null;
    const seoDesc = getMeta(item, "rank_math_description");
    const seoTitleRaw = getMeta(item, "rank_math_title");
    const seoTitle = seoTitleRaw && seoTitleRaw !== "%title%" ? seoTitleRaw : null;
    const thumbnailId = getMeta(item, "_thumbnail_id");
    const featuredImage = thumbnailId ? attachmentUrlById.get(thumbnailId) ?? null : null;
    const faqsParsed = parseFaqs(getMeta(item, "faqs"));

    let publishedAt: Date | null = null;
    if (dateGmt && dateGmt !== "0000-00-00 00:00:00") {
      // WP exports GMT as "YYYY-MM-DD HH:MM:SS"; treat as UTC
      publishedAt = new Date(dateGmt.replace(" ", "T") + "Z");
      if (isNaN(publishedAt.getTime())) publishedAt = null;
    }

    // Resolve / create category from first <category> tag in the item
    let categoryId: string | null = null;
    const cat = firstCategory(item);
    if (cat) {
      const existingCat = await prisma.blogCategory.upsert({
        where: { slug: cat.slug },
        update: { name: cat.name },
        create: { slug: cat.slug, name: cat.name },
      });
      categoryId = existingCat.id;
    }

    const data = {
      title,
      slug,
      excerpt,
      content,
      featuredImage,
      author,
      status: "PUBLISHED" as const,
      publishedAt,
      seoTitle,
      seoDesc,
      categoryId,
      faqs: faqsParsed ?? undefined,
    };

    const existing = await prisma.blogPost.findUnique({ where: { slug } });
    if (existing) {
      await prisma.blogPost.update({ where: { slug }, data });
      updated++;
    } else {
      await prisma.blogPost.create({ data });
      created++;
    }
  }

  console.log(`Done. Created: ${created}, Updated: ${updated}, Skipped: ${skipped}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
