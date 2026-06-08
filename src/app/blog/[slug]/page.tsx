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
    where: {
      slug,
      status: "PUBLISHED",
      OR: [
        { publishedAt: null },
        { publishedAt: { lte: new Date() } },
      ],
    },
  });
}

function readingTimeMinutes(html: string | null): number {
  if (!html) return 1;
  const words = html.replace(/<[^>]+>/g, " ").trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
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

  const related = await prisma.blogPost.findMany({
    where: {
      status: "PUBLISHED",
      NOT: { id: post.id },
      OR: [
        { publishedAt: null },
        { publishedAt: { lte: new Date() } },
      ],
    },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    take: 3,
    select: {
      id: true,
      slug: true,
      title: true,
      featuredImage: true,
      publishedAt: true,
    },
  });

  const readMins = readingTimeMinutes(post.content);

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* ===== Cinematic hero ===== */}
        <section className="relative bg-brand-ink text-white overflow-hidden">
          {post.featuredImage && (
            <div className="absolute inset-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.featuredImage}
                alt={post.title}
                className="absolute inset-0 w-full h-full object-cover opacity-60"
                loading="eager"
                fetchPriority="high"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-ink via-brand-ink/70 to-brand-ink/20" />
            </div>
          )}

          <div className="relative container-site max-w-[900px] py-24 sm:py-32">
            <nav className="text-[12px] uppercase tracking-[2px] text-white/70 mb-6">
              <Link href="/" className="hover:text-brand-yellow">Home</Link>
              <span className="mx-2 text-white/40">/</span>
              <Link href="/blog/" className="hover:text-brand-yellow">Blog</Link>
            </nav>

            <h1 className="text-[34px] sm:text-[52px] font-extrabold leading-[1.1] tracking-tight">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="mt-6 text-[18px] sm:text-[20px] leading-[32px] text-white/85 max-w-[720px]">
                {post.excerpt}
              </p>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] uppercase tracking-[2px] text-white/70">
              {post.publishedAt && (
                <span>{format(post.publishedAt, "MMMM d, yyyy")}</span>
              )}
              {post.author && (
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow" />
                  {post.author}
                </span>
              )}
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow" />
                {readMins} min read
              </span>
            </div>
          </div>
        </section>

        {/* ===== Article body ===== */}
        <article className="bg-brand-cream/40">
          <div className="container-site max-w-[760px] py-16 sm:py-20">
            {post.content && (
              <div
                className="
                  text-[17px] leading-[30px] text-black/85
                  max-w-full overflow-hidden break-words [overflow-wrap:anywhere]
                  [&_*]:max-w-full
                  [&_img]:h-auto
                  [&_table]:block [&_table]:overflow-x-auto
                  [&_pre]:overflow-x-auto [&_pre]:whitespace-pre-wrap
                  [&_p]:mt-5
                  [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:text-[28px] sm:[&_h2]:text-[32px] [&_h2]:font-extrabold [&_h2]:leading-tight [&_h2]:tracking-tight
                  [&_h3]:mt-10 [&_h3]:mb-3 [&_h3]:text-[22px] [&_h3]:font-bold
                  [&_h4]:mt-8 [&_h4]:mb-2 [&_h4]:text-[18px] [&_h4]:font-bold
                  [&_a]:text-black [&_a]:underline [&_a]:decoration-brand-yellow [&_a]:decoration-2 [&_a]:underline-offset-4 hover:[&_a]:text-brand-orange
                  [&_strong]:font-bold [&_strong]:text-black
                  [&_ul]:mt-5 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2
                  [&_ol]:mt-5 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2
                  [&_li]:leading-[28px]
                  [&_blockquote]:my-8 [&_blockquote]:border-l-4 [&_blockquote]:border-brand-yellow [&_blockquote]:pl-5 [&_blockquote]:italic [&_blockquote]:text-black/75
                  [&_img]:my-8 [&_img]:rounded-lg
                  [&_table]:my-6 [&_table]:w-full [&_table]:border-collapse
                  [&_th]:border [&_th]:border-black/15 [&_th]:bg-black/5 [&_th]:p-3 [&_th]:text-left [&_th]:font-bold
                  [&_td]:border [&_td]:border-black/15 [&_td]:p-3
                "
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            )}

            {/* Foot of article */}
            <div className="mt-16 pt-8 border-t border-black/10 flex flex-wrap items-center justify-between gap-4">
              <Link
                href="/blog/"
                className="text-sm font-extrabold uppercase tracking-[2px] hover:text-brand-orange"
              >
                ← All posts
              </Link>
              <Link
                href="/#booking"
                className="inline-flex items-center gap-2 bg-brand-yellow text-brand-dark px-6 h-12 rounded-[5px] font-extrabold text-sm uppercase tracking-[2px] border-2 border-brand-dark hover:brightness-95"
              >
                Book Your Ride
              </Link>
            </div>
          </div>
        </article>

        {/* ===== Related posts ===== */}
        {related.length > 0 && (
          <section className="bg-white py-20 border-t border-black/10">
            <div className="container-site max-w-[1200px]">
              <div className="flex items-end justify-between mb-10">
                <div>
                  <p className="text-[12px] uppercase tracking-[3px] text-brand-orange font-bold mb-2">
                    Keep reading
                  </p>
                  <h2 className="text-[28px] sm:text-[36px] font-extrabold leading-tight">
                    More from the dunes
                  </h2>
                </div>
                <Link
                  href="/blog/"
                  className="hidden sm:inline text-sm font-extrabold uppercase tracking-[2px] hover:text-brand-orange"
                >
                  View all →
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {related.map((r) => (
                  <article
                    key={r.id}
                    className="group bg-white border border-black/10 rounded-lg overflow-hidden hover:shadow-xl hover:-translate-y-1 transition"
                  >
                    {r.featuredImage && (
                      <Link
                        href={`/blog/${r.slug}/`}
                        className="block relative aspect-[16/10] bg-black/5 overflow-hidden"
                      >
                        <SmartImage
                          src={r.featuredImage}
                          alt={r.title}
                          fill
                          sizes="(max-width: 1024px) 100vw, 33vw"
                          className="object-cover group-hover:scale-105 transition duration-500"
                        />
                      </Link>
                    )}
                    <div className="p-5">
                      {r.publishedAt && (
                        <p className="text-[11px] uppercase tracking-[2px] text-black/50 mb-2">
                          {format(r.publishedAt, "MMM d, yyyy")}
                        </p>
                      )}
                      <h3 className="text-[18px] font-extrabold leading-tight">
                        <Link href={`/blog/${r.slug}/`} className="hover:text-brand-orange">
                          {r.title}
                        </Link>
                      </h3>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
