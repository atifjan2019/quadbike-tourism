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

const PAGE_SIZE = 20;

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const requested = Number.parseInt(page ?? "1", 10);
  const currentPage = Number.isFinite(requested) && requested >= 1 ? requested : 1;

  const where = { status: "PUBLISHED" as const };
  const total = await prisma.blogPost.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);

  const posts = await prisma.blogPost.findMany({
    where,
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    skip: (safePage - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });

  const pageHref = (n: number) => (n === 1 ? "/blog/" : `/blog/?page=${n}`);

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

            {totalPages > 1 && (
              <nav
                aria-label="Blog pagination"
                className="mt-12 flex flex-wrap items-center justify-center gap-2"
              >
                {safePage > 1 && (
                  <Link
                    href={pageHref(safePage - 1)}
                    className="px-4 py-2 border border-black/15 rounded font-bold text-sm hover:bg-black hover:text-white transition"
                  >
                    ← Previous
                  </Link>
                )}

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => {
                  const active = n === safePage;
                  return (
                    <Link
                      key={n}
                      href={pageHref(n)}
                      aria-current={active ? "page" : undefined}
                      className={
                        "min-w-[40px] text-center px-3 py-2 border rounded font-bold text-sm transition " +
                        (active
                          ? "bg-black text-white border-black"
                          : "border-black/15 hover:bg-black hover:text-white")
                      }
                    >
                      {n}
                    </Link>
                  );
                })}

                {safePage < totalPages && (
                  <Link
                    href={pageHref(safePage + 1)}
                    className="px-4 py-2 border border-black/15 rounded font-bold text-sm hover:bg-black hover:text-white transition"
                  >
                    Next →
                  </Link>
                )}
              </nav>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
