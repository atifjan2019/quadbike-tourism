import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

const SITE_URL = "https://www.quadbiketourism.com";

const STATIC_PATHS: { path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }[] = [
  { path: "/", changeFrequency: "weekly", priority: 1.0 },
  { path: "/tours/", changeFrequency: "weekly", priority: 0.9 },
  { path: "/about-us/", changeFrequency: "monthly", priority: 0.6 },
  { path: "/contact-us/", changeFrequency: "monthly", priority: 0.6 },
  { path: "/blog/", changeFrequency: "weekly", priority: 0.7 },
  { path: "/privacy-policy/", changeFrequency: "yearly", priority: 0.2 },
  { path: "/refund-returns/", changeFrequency: "yearly", priority: 0.2 },
  { path: "/terms-conditions/", changeFrequency: "yearly", priority: 0.2 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((p) => ({
    url: `${SITE_URL}${p.path}`,
    lastModified: now,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));

  let categoryEntries: MetadataRoute.Sitemap = [];
  let tourEntries: MetadataRoute.Sitemap = [];
  let postEntries: MetadataRoute.Sitemap = [];

  try {
    const categories = await prisma.category.findMany({
      select: {
        slug: true,
        updatedAt: true,
        tours: {
          where: { status: "PUBLISHED" },
          select: { slug: true, updatedAt: true },
        },
      },
    });

    categoryEntries = categories.map((c) => ({
      url: `${SITE_URL}/${c.slug}/`,
      lastModified: c.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    tourEntries = categories.flatMap((c) =>
      c.tours.map((t) => ({
        url: `${SITE_URL}/${c.slug}/${t.slug}/`,
        lastModified: t.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
    );

    const posts = await prisma.blogPost.findMany({
      where: { status: "PUBLISHED", publishedAt: { not: null, lte: now } },
      select: { slug: true, updatedAt: true },
    });

    postEntries = posts.map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}/`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch {
    // DB unavailable at build/runtime — fall back to static-only sitemap.
  }

  return [...staticEntries, ...categoryEntries, ...tourEntries, ...postEntries];
}
