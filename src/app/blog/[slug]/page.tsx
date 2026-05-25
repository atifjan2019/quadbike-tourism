import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import SmartImage from "@/components/SmartImage";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

async function getPost(slug: string) {
  return prisma.blogPost.findFirst({
    where: { slug, status: "PUBLISHED" },
  });
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await getPost(slug);
  if (!post) return { title: "Not found" };
  return {
    title: post.seoTitle ?? post.title,
    description: post.seoDesc ?? post.excerpt ?? undefined,
    alternates: { canonical: `/blog/${post.slug}/` },
    openGraph: {
      title: post.seoTitle ?? post.title,
      description: post.seoDesc ?? post.excerpt ?? undefined,
      images: post.featuredImage ? [post.featuredImage] : undefined,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
    },
  };
}

export default async function BlogPostPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <>
      <Header />
      <main className="flex-1">
        <article className="py-16">
          <div className="container-site max-w-[820px]">
            <Link
              href="/blog/"
              className="text-sm text-black/60 hover:underline inline-block mb-6"
            >
              ← All posts
            </Link>

            {post.publishedAt && (
              <p className="text-xs uppercase tracking-[2px] text-black/60 mb-3">
                {format(post.publishedAt, "MMMM d, yyyy")}
                {post.author ? ` · ${post.author}` : ""}
              </p>
            )}
            <h1 className="text-[34px] sm:text-[48px] font-extrabold leading-tight">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="mt-4 text-[20px] leading-[32px] text-black/70">
                {post.excerpt}
              </p>
            )}

            {post.featuredImage && (
              <div className="relative w-full aspect-[16/9] mt-8 rounded-lg overflow-hidden bg-black/5">
                <SmartImage
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  sizes="(max-width: 820px) 100vw, 820px"
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {post.content && (
              <div
                className="prose prose-lg max-w-none mt-10 [&_h2]:font-extrabold [&_h3]:font-bold [&_a]:text-black [&_a]:underline"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            )}
          </div>
        </article>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
