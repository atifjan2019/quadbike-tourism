import BlogForm from "@/components/admin/BlogForm";

export const dynamic = "force-dynamic";

export default function NewBlogPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">New Blog Post</h1>
      <BlogForm mode="create" />
    </div>
  );
}
