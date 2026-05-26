/**
 * Re-imports the full HTML product descriptions from the WordPress WC export
 * and writes them into each Tour.description.
 *
 * Match strategy: WP product slug (from <wp:post_name>) maps to existing
 * Tour.slug. Tours with no matching XML entry are left untouched.
 *
 * After writing the description, remote image URLs in the HTML are rewritten
 * to local /uploads/* paths using the same logic as rewrite-image-urls.ts so
 * we don't reintroduce the quadbiketourism.com references we just removed.
 *
 * Run with:  npm run db:import:descriptions
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

const XML_PATH = path.resolve(
  process.cwd(),
  "test/quadbiketourism.WordPress.2026-05-26 (3).xml",
);

const UPLOADS_DIR = path.resolve(process.cwd(), "public/uploads");
const localFiles = new Set(fs.readdirSync(UPLOADS_DIR));
const REMOTE_RE =
  /https?:\/\/quadbiketourism\.com\/wp-content\/uploads\/[^\s"'<>)]+/g;

function rewriteRemote(s: string): string {
  return s.replace(REMOTE_RE, (m) => {
    try {
      const basename = decodeURIComponent(path.basename(new URL(m).pathname));
      if (localFiles.has(basename)) return `/uploads/${basename}`;
    } catch {
      /* fall through */
    }
    return m;
  });
}

function extractCdata(field: string, source: string): string | null {
  const re = new RegExp(`<${field}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${field}>`);
  const m = source.match(re);
  return m ? m[1] : null;
}

type Product = { slug: string; title: string; description: string };

function parseProducts(xml: string): Product[] {
  const items = xml.split("<item>").slice(1);
  const out: Product[] = [];
  const seen = new Set<string>();

  for (const raw of items) {
    if (!raw.includes("<wp:post_type><![CDATA[product]]>")) continue;
    const slug = extractCdata("wp:post_name", raw);
    if (!slug || seen.has(slug)) continue;
    seen.add(slug);
    const title = extractCdata("title", raw) ?? "";
    const description = extractCdata("content:encoded", raw) ?? "";
    if (!description.trim()) continue;
    out.push({ slug, title, description });
  }
  return out;
}

async function main() {
  if (!fs.existsSync(XML_PATH)) throw new Error(`XML not found at ${XML_PATH}`);

  const xml = fs.readFileSync(XML_PATH, "utf8");
  const products = parseProducts(xml);
  console.log(`Parsed ${products.length} products with descriptions`);

  let updated = 0;
  const unmatched: string[] = [];

  for (const p of products) {
    const tour = await prisma.tour.findUnique({ where: { slug: p.slug } });
    if (!tour) {
      unmatched.push(p.slug);
      continue;
    }
    const rewritten = rewriteRemote(p.description);
    if (rewritten === tour.description) continue;
    await prisma.tour.update({
      where: { id: tour.id },
      data: { description: rewritten },
    });
    updated++;
    console.log(
      `✓ ${tour.slug.padEnd(40)} ${p.description.length} ch -> ${rewritten.length} ch`,
    );
  }

  console.log(`\nDone. Tours updated: ${updated}`);
  if (unmatched.length) {
    console.log(`\nXML products with no matching Tour slug:`);
    for (const u of unmatched) console.log(`  - ${u}`);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
