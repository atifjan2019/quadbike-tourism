import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import BlogForm from "@/components/admin/BlogForm";

export const dynamic = "force-dynamic";

export default async function EditBlogPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const [post, categories] = await Promise.all([
    prisma.blogPost.findUnique({ where: { id } }),
    prisma.blogCategory.findMany({
      orderBy: [{ order: "asc" }, { name: "asc" }],
      select: { id: true, name: true },
    }),
  ]);
  if (!post) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">Edit Blog Post</h1>
        <span className="text-xs text-black/50">ID: {post.id}</span>
      </div>
      <BlogForm
        mode="edit"
        categories={categories}
        initial={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt ?? "",
          content: post.content ?? "",
          featuredImage: post.featuredImage ?? "",
          author: post.author ?? "",
          status: post.status,
          publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
          seoTitle: post.seoTitle ?? "",
          seoDesc: post.seoDesc ?? "",
          categoryId: post.categoryId,
        }}
      />
    </div>
  );
}
