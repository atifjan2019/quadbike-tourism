import { prisma } from "@/lib/db";
import CategoriesManager from "@/components/admin/CategoriesManager";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { tours: true } } },
    orderBy: { order: "asc" },
  });
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">Categories</h1>
        <p className="text-black/60 text-sm">Top-level groupings used in the homepage cards and menu.</p>
      </div>
      <CategoriesManager
        initial={categories.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          image: c.image,
          order: c.order,
          tourCount: c._count.tours,
        }))}
      />
    </div>
  );
}
