/**
 * Sweeps Tour and BlogPost rows, replacing every
 *   https://quadbiketourism.com/wp-content/uploads/.../<basename>
 * URL with /uploads/<basename> if a matching file exists in public/uploads/.
 *
 * Safe to re-run: only writes when something actually changes.
 *
 * Run with: npm run db:rewrite:images
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

const UPLOADS_DIR = path.resolve(process.cwd(), "public/uploads");
const localFiles = new Set(fs.readdirSync(UPLOADS_DIR));

const REMOTE_RE =
  /https?:\/\/quadbiketourism\.com\/wp-content\/uploads\/[^\s"'<>)]+/g;

function rewriteOne(url: string): string | null {
  try {
    const basename = decodeURIComponent(path.basename(new URL(url).pathname));
    if (localFiles.has(basename)) return `/uploads/${basename}`;
    return null;
  } catch {
    return null;
  }
}

function rewriteHtml(s: string | null | undefined): {
  value: string | null;
  changed: number;
} {
  if (!s) return { value: s ?? null, changed: 0 };
  let changed = 0;
  const replaced = s.replace(REMOTE_RE, (m) => {
    const local = rewriteOne(m);
    if (local) {
      changed++;
      return local;
    }
    return m;
  });
  return { value: replaced, changed };
}

async function main() {
  let toursUpdated = 0;
  let postsUpdated = 0;
  let totalRewrites = 0;
  const unmatched = new Set<string>();

  // ── Tours ─────────────────────────────────────────────
  const tours = await prisma.tour.findMany();
  for (const t of tours) {
    let count = 0;
    const newFeatured = t.featuredImage
      ? rewriteOne(t.featuredImage) ?? t.featuredImage
      : t.featuredImage;
    if (newFeatured !== t.featuredImage) count++;
    else if (t.featuredImage?.includes("quadbiketourism.com"))
      unmatched.add(t.featuredImage);

    const newGallery = t.gallery.map((u) => {
      const r = rewriteOne(u);
      if (r) {
        count++;
        return r;
      }
      if (u.includes("quadbiketourism.com")) unmatched.add(u);
      return u;
    });

    const descRes = rewriteHtml(t.description);
    count += descRes.changed;
    // collect unmatched remote URLs from description
    if (t.description) {
      const matches = t.description.match(REMOTE_RE) ?? [];
      for (const m of matches) if (!rewriteOne(m)) unmatched.add(m);
    }

    if (count > 0) {
      await prisma.tour.update({
        where: { id: t.id },
        data: {
          featuredImage: newFeatured,
          gallery: newGallery,
          description: descRes.value,
        },
      });
      toursUpdated++;
      totalRewrites += count;
      console.log(`  tour  ${t.slug.padEnd(40)} rewrites=${count}`);
    }
  }

  // ── Blog posts ────────────────────────────────────────
  const posts = await prisma.blogPost.findMany();
  for (const p of posts) {
    let count = 0;
    const newFeatured = p.featuredImage
      ? rewriteOne(p.featuredImage) ?? p.featuredImage
      : p.featuredImage;
    if (newFeatured !== p.featuredImage) count++;
    else if (p.featuredImage?.includes("quadbiketourism.com"))
      unmatched.add(p.featuredImage);

    const contentRes = rewriteHtml(p.content);
    count += contentRes.changed;
    if (p.content) {
      const matches = p.content.match(REMOTE_RE) ?? [];
      for (const m of matches) if (!rewriteOne(m)) unmatched.add(m);
    }

    if (count > 0) {
      await prisma.blogPost.update({
        where: { id: p.id },
        data: {
          featuredImage: newFeatured,
          content: contentRes.value,
        },
      });
      postsUpdated++;
      totalRewrites += count;
      console.log(`  blog  ${p.slug.padEnd(40)} rewrites=${count}`);
    }
  }

  console.log(
    `\nDone. Tours updated: ${toursUpdated}, Posts updated: ${postsUpdated}, total URL rewrites: ${totalRewrites}`,
  );

  if (unmatched.size) {
    console.log(`\nRemote URLs with NO local match (${unmatched.size}):`);
    for (const u of unmatched) console.log(`  - ${u}`);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
