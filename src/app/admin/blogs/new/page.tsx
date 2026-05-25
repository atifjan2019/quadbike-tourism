import BlogForm from "@/components/admin/BlogForm";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function NewBlogPage() {
  const categories = await prisma.blogCategory.findMany({
    orderBy: [{ order: "asc" }, { name: "asc" }],
    select: { id: true, name: true },
  });
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">New Blog Post</h1>
      <BlogForm mode="create" categories={categories} />
    </div>
  );
}
