/**
 * One-pass cleanup of Tour.description HTML to remove WordPress export noise:
 *
 *   - Strips inline `style` attributes that only set font-weight (the WP
 *     export tags every span with `style="font-weight: 400;"` which fights the
 *     prose typography).
 *   - Unwraps empty <span> tags left after style removal.
 *   - Removes `aria-level` attributes on <li>.
 *   - Strips literal &nbsp; runs and other zero-info whitespace.
 *   - Normalises `<h2><b>\n…</b></h2>` to clean headings.
 *
 * Re-runnable: idempotent — only writes when something actually changes.
 *
 * Run with:  npm run db:clean:descriptions
 */

import path from "node:path";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config();

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
if (!connectionString) throw new Error("DIRECT_URL or DATABASE_URL not set");
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

function cleanHtml(html: string): string {
  let out = html;

  // Drop style attributes that are pure WP noise (font-weight only).
  out = out.replace(/\s+style="font-weight:\s*\d+\s*;?\s*"/gi, "");

  // Drop empty style="" attributes (leftover after above).
  out = out.replace(/\s+style=""/gi, "");

  // Drop aria-level on list items — meaningless without a tree control.
  out = out.replace(/\s+aria-level="\d+"/gi, "");

  // Unwrap <span> tags with no attributes: <span>foo</span> -> foo
  out = out.replace(/<span>\s*([\s\S]*?)\s*<\/span>/gi, "$1");

  // Unwrap empty <b>/<strong> wrappers in headings: <h2><b>\nFoo</b></h2>
  out = out.replace(
    /(<h[1-6][^>]*>)\s*<b>\s*([\s\S]*?)\s*<\/b>\s*(<\/h[1-6]>)/gi,
    (_m, open, content, close) => `${open}${content.trim()}${close}`,
  );
  out = out.replace(
    /(<h[1-6][^>]*>)\s*<strong>\s*([\s\S]*?)\s*<\/strong>\s*(<\/h[1-6]>)/gi,
    (_m, open, content, close) => `${open}${content.trim()}${close}`,
  );

  // Collapse multiple <b> inside a heading like <h3><b>foo</b><b>bar</b></h3>
  out = out.replace(/(<h[1-6][^>]*>)([\s\S]*?)(<\/h[1-6]>)/gi, (_m, open, inner, close) => {
    let normalised = inner.replace(/<\/b>\s*<b>/gi, " ");
    normalised = normalised.replace(/<\/strong>\s*<strong>/gi, " ");
    return `${open}${normalised.trim()}${close}`;
  });

  // Strip stray &nbsp; and runs of whitespace.
  out = out.replace(/&nbsp;/g, " ");
  out = out.replace(/[ \t]+\n/g, "\n");

  // Remove empty paragraphs and lone <b> </b> tags.
  out = out.replace(/<p>\s*<\/p>/gi, "");
  out = out.replace(/<b>\s*<\/b>/gi, "");
  out = out.replace(/<strong>\s*<\/strong>/gi, "");

  // Collapse 3+ blank lines.
  out = out.replace(/\n{3,}/g, "\n\n");

  return out.trim();
}

async function main() {
  const tours = await prisma.tour.findMany({
    select: { id: true, slug: true, description: true },
  });

  let updated = 0;
  let untouched = 0;
  for (const t of tours) {
    if (!t.description) {
      untouched++;
      continue;
    }
    const cleaned = cleanHtml(t.description);
    if (cleaned === t.description) {
      untouched++;
      continue;
    }
    await prisma.tour.update({
      where: { id: t.id },
      data: { description: cleaned },
    });
    updated++;
    console.log(
      `✓ ${t.slug.padEnd(40)} ${t.description.length} -> ${cleaned.length} chars`,
    );
  }
  console.log(`\nDone. Updated ${updated}, unchanged ${untouched}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
