import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import TourForm from "@/components/admin/TourForm";

export const dynamic = "force-dynamic";

export default async function EditTourPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const [tour, categories] = await Promise.all([
    prisma.tour.findUnique({
      where: { id },
      include: { variations: { orderBy: { price: "asc" } } },
    }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
  ]);
  if (!tour) notFound();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">Edit Tour</h1>
        <span className="text-xs text-black/50">ID: {tour.id}</span>
      </div>
      <TourForm
        mode="edit"
        categories={categories.map((c) => ({ id: c.id, name: c.name }))}
        initial={{
          id: tour.id,
          title: tour.title,
          slug: tour.slug,
          categoryId: tour.categoryId,
          shortDesc: tour.shortDesc ?? "",
          description: tour.description ?? "",
          featuredImage: tour.featuredImage ?? "",
          gallery: tour.gallery,
          priceFrom: Number(tour.priceFrom),
          durationMin: tour.durationMin ?? null,
          maxGuests: tour.maxGuests ?? null,
          includes: tour.includes,
          status: tour.status,
          featured: tour.featured,
          seoTitle: tour.seoTitle ?? "",
          seoDesc: tour.seoDesc ?? "",
          variations: tour.variations.map((v) => ({
            id: v.id,
            label: v.label,
            price: Number(v.price),
            durationMin: v.durationMin ?? null,
            maxGuests: v.maxGuests ?? null,
          })),
        }}
      />
    </div>
  );
}
