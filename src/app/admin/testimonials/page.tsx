import { prisma } from "@/lib/db";
import TestimonialsManager from "@/components/admin/TestimonialsManager";

export const dynamic = "force-dynamic";

export default async function TestimonialsPage() {
  const items = await prisma.testimonial.findMany({ orderBy: { order: "asc" } });
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">Testimonials</h1>
        <p className="text-black/60 text-sm">Customer reviews shown on the homepage.</p>
      </div>
      <TestimonialsManager
        initial={items.map((t) => ({
          id: t.id,
          name: t.name,
          country: t.country,
          message: t.message,
          rating: t.rating,
          avatar: t.avatar,
          order: t.order,
        }))}
      />
    </div>
  );
}
