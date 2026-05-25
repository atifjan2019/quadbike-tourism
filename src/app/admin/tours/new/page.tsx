import { prisma } from "@/lib/db";
import TourForm from "@/components/admin/TourForm";

export const dynamic = "force-dynamic";

export default async function NewTourPage() {
  const categories = await prisma.category.findMany({ orderBy: { order: "asc" } });
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">New Tour</h1>
      <TourForm
        categories={categories.map((c) => ({ id: c.id, name: c.name }))}
        mode="create"
      />
    </div>
  );
}
