import { prisma } from "@/lib/db";
import { cache } from "react";

export type ImageMeta = {
  url: string;
  alt: string | null;
  title: string | null;
  caption: string | null;
  description: string | null;
};

/**
 * Look up metadata for a single image URL. Returns sensible defaults when no
 * Media row exists yet. Server-only — call from a Server Component or route handler.
 *
 * Cached per request so multiple <SmartImage> calls on the same page hit the DB once.
 */
export const getImageMeta = cache(async (url: string): Promise<ImageMeta> => {
  const row = await prisma.media.findUnique({ where: { url } });
  return {
    url,
    alt: row?.alt ?? null,
    title: row?.title ?? null,
    caption: row?.caption ?? null,
    description: row?.description ?? null,
  };
});

/**
 * Bulk fetch — pass an array of URLs, get back a Map for O(1) lookup.
 * Useful for components that render many images (Category grid, etc).
 */
export async function getImageMetaMap(urls: string[]): Promise<Map<string, ImageMeta>> {
  const rows = await prisma.media.findMany({ where: { url: { in: urls } } });
  const map = new Map<string, ImageMeta>();
  for (const u of urls) {
    const row = rows.find((r) => r.url === u);
    map.set(u, {
      url: u,
      alt: row?.alt ?? null,
      title: row?.title ?? null,
      caption: row?.caption ?? null,
      description: row?.description ?? null,
    });
  }
  return map;
}
