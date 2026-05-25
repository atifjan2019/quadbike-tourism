import type { Metadata } from "next";
import Link from "next/link";
import { format } from "date-fns";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import SmartImage from "@/components/SmartImage";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Stories, guides and tips from the dunes — quad biking, desert safari, dune buggy adventures and more from Quad Bike Tourism.",
  alternates: { canonical: "/blog/" },
};

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
  });

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="py-20">
          <div className="container-site max-w-[1100px]">
            <h1 className="text-[34px] sm:text-[44px] font-extrabold leading-tight mb-3">
              Blog
            </h1>
            <p className="text-[18px] leading-[32px] text-black/70 mb-10">
              Stories, guides and travel tips from the dunes.
            </p>

            {posts.length === 0 ? (
              <p className="text-black/60">No posts published yet — check back soon.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((p) => (
                  <article
                    key={p.id}
                    className="bg-white border border-black/10 rounded-lg overflow-hidden hover:shadow-lg transition"
                  >
                    {p.featuredImage && (
                      <Link href={`/blog/${p.slug}/`} className="block relative aspect-[16/10] bg-black/5">
                        <SmartImage
                          src={p.featuredImage}
                          alt={p.title}
                          fill
                          sizes="(max-width: 1024px) 100vw, 33vw"
                          className="object-cover"
                        />
                      </Link>
                    )}
                    <div className="p-5">
                      {p.publishedAt && (
                        <p className="text-xs uppercase tracking-wider text-black/50 mb-2">
                          {format(p.publishedAt, "MMMM d, yyyy")}
                        </p>
                      )}
                      <h2 className="text-[20px] font-extrabold leading-tight">
                        <Link href={`/blog/${p.slug}/`} className="hover:underline">
                          {p.title}
                        </Link>
                      </h2>
                      {p.excerpt && (
                        <p className="mt-3 text-[15px] leading-[24px] text-black/70 line-clamp-3">
                          {p.excerpt}
                        </p>
                      )}
                      <Link
                        href={`/blog/${p.slug}/`}
                        className="mt-4 inline-block text-sm font-extrabold uppercase tracking-wider hover:text-brand-yellow"
                      >
                        Read more →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
