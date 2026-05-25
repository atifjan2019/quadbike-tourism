import { prisma } from "@/lib/db";
import BlogCategoriesManager from "@/components/admin/BlogCategoriesManager";

export const dynamic = "force-dynamic";

export default async function BlogCategoriesPage() {
  const cats = await prisma.blogCategory.findMany({
    orderBy: [{ order: "asc" }, { name: "asc" }],
    include: { _count: { select: { posts: true } } },
  });
  const initial = cats.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    order: c.order,
    postCount: c._count.posts,
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">Blog Categories</h1>
      <BlogCategoriesManager initial={initial} />
    </div>
  );
}
