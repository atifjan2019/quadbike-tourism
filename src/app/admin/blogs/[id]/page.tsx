import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import BlogForm from "@/components/admin/BlogForm";

export const dynamic = "force-dynamic";

export default async function EditBlogPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">Edit Blog Post</h1>
        <span className="text-xs text-black/50">ID: {post.id}</span>
      </div>
      <BlogForm
        mode="edit"
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
        }}
      />
    </div>
  );
}
