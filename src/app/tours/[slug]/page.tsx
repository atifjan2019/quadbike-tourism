import { notFound, permanentRedirect } from "next/navigation";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

// Legacy URL shape: /tours/<slug>/  →  /<category>/<slug>/
// Kept around so inbound links and old bookmarks resolve to the canonical URL.
export default async function LegacyTourRedirect(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const tour = await prisma.tour.findFirst({
    where: { slug, status: "PUBLISHED" },
    select: { slug: true, category: { select: { slug: true } } },
  });
  if (!tour) notFound();
  permanentRedirect(`/${tour.category.slug}/${tour.slug}/`);
}
