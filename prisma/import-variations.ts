/**
 * Imports pricing variations from a WAPF (WooCommerce Advanced Product Fields)
 * WordPress export and attaches them to existing Tour rows.
 *
 * Usage: `npm run db:import:variations`
 *
 * Behaviour:
 *  - Parses the WAPF field-group entries to find each product's choice list
 *    (label + pricing_amount).
 *  - Matches each WAPF group to an existing Tour by slug (with explicit
 *    overrides where the WP product name differs from the tour slug).
 *  - Replaces the matched tour's variations atomically and sets the tour's
 *    priceFrom to the cheapest variation so listings stay consistent.
 *  - Tours with no matching WAPF group are left untouched.
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
  "test/quadbiketourism.WordPress.2026-05-26 (2).xml",
);

// Product name (from WAPF rule_groups text) → existing tour slug.
// Anything not in this map falls back to slugify(productName).
const SLUG_OVERRIDES: Record<string, string> = {
  "KTM DESERT DIRT BIKE - 450CC": "ktm-dirt-bikes-450cc",
  "POLARIS RZR - 1000 CC 1 SEAT": "polaris-rzr-1000cc",
  "POLARIS RZR - 1000 CC 2 SEAT": "polaris-rzr-1000cc-2-seater",
  "POLARIS RZR - 1000 CC 4 Seat": "polaris-rzr-1000cc-4-seater",
  "POLARIS RZR TURBO - 1800CC 4 SEAT": "polaris-rzr-turbo-1800cc-4-seater",
  "CANAM MAVERICK 1700CC - 2 SEAT": "canam-maverick-1700cc-2-seater",
  "CANAM MAVERICK 1700CC - 4 SEAT": "canam-maverick-1700cc-4-seater",
  "CUSTOM POWER BUGGY 3800CC - 2 SEAT": "custom-power-buggy-3000cc-2-seater",
  "JET SKI YAMAHA - 2 SEAT": "yamaha-jet-ski",
  "JET CAR CORVETTE - 2 SEAT": "jet-car-corvette",
  "BANANA BOAT": "banana-boat",
  "FLYBOARD IN DUBAI": "flyboard-in-dubai",
  PARASAILING: "parasailing",
  "Evening Desert Safari": "evening-desert-safari",
};

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseDurationFromLabel(label: string): number | null {
  const minMatch = label.match(/(\d+)\s*minute/i);
  if (minMatch) return parseInt(minMatch[1], 10);
  const hrMatch = label.match(/(\d+)\s*hour/i);
  if (hrMatch) return parseInt(hrMatch[1], 10) * 60;
  return null;
}

type Variation = { label: string; price: number; durationMin: number | null };
type Group = { productName: string; variations: Variation[] };

function parseGroups(xml: string): Group[] {
  const items = xml.split("<item>").slice(1);
  const groups: Group[] = [];

  for (const raw of items) {
    if (!raw.includes("wapf_product")) continue;

    const ruleMatch = raw.match(
      /s:5:"value";a:1:\{i:0;a:2:\{s:2:"id";s:\d+:"\d+";s:4:"text";s:\d+:"([^"]+)"/,
    );
    if (!ruleMatch) continue;
    const productName = ruleMatch[1];

    const variations: Variation[] = [];
    const seen = new Set<string>();
    const choicePattern =
      /s:5:"label";s:\d+:"([^"]+)";s:8:"selected";b:[01];s:7:"options";a:0:\{\}s:12:"pricing_type";s:5:"fixed";s:14:"pricing_amount";d:([\d.]+)/g;
    let m: RegExpExecArray | null;
    while ((m = choicePattern.exec(raw)) !== null) {
      const label = m[1];
      const price = parseFloat(m[2]);
      const key = `${label}::${price}`;
      if (seen.has(key)) continue;
      seen.add(key);
      // Only keep duration-style tiers (X Minutes / X Hours). Numeric-only
      // labels like "1", "2", "3" come from rider-count groups which aren't
      // tour-level pricing variations.
      if (parseDurationFromLabel(label) === null) continue;
      if (price <= 0) continue;
      variations.push({
        label,
        price,
        durationMin: parseDurationFromLabel(label),
      });
    }

    if (variations.length === 0) continue;
    groups.push({ productName, variations });
  }

  return groups;
}

async function main() {
  if (!fs.existsSync(XML_PATH)) {
    throw new Error(`XML not found at ${XML_PATH}`);
  }
  const xml = fs.readFileSync(XML_PATH, "utf8");
  const groups = parseGroups(xml);

  console.log(`Parsed ${groups.length} WAPF groups with variations\n`);

  let matched = 0;
  let skipped = 0;
  const unmatched: string[] = [];

  for (const g of groups) {
    const slug = SLUG_OVERRIDES[g.productName] ?? slugify(g.productName);
    const tour = await prisma.tour.findUnique({ where: { slug } });
    if (!tour) {
      unmatched.push(`${g.productName}  →  ${slug}`);
      skipped++;
      continue;
    }

    await prisma.$transaction(async (tx) => {
      await tx.variation.deleteMany({ where: { tourId: tour.id } });
      for (const v of g.variations) {
        await tx.variation.create({
          data: {
            tourId: tour.id,
            label: v.label,
            price: v.price,
            durationMin: v.durationMin,
          },
        });
      }
      const minPrice = Math.min(...g.variations.map((v) => v.price));
      await tx.tour.update({
        where: { id: tour.id },
        data: { priceFrom: minPrice },
      });
    });

    const tiers = g.variations
      .map((v) => `${v.label}=${v.price}`)
      .join(", ");
    console.log(`✓ ${tour.slug.padEnd(40)} ${tiers}`);
    matched++;
  }

  console.log(`\nMatched ${matched} tours, skipped ${skipped}`);
  if (unmatched.length) {
    console.log("\nUnmatched groups (no tour with that slug):");
    for (const u of unmatched) console.log(`  - ${u}`);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
