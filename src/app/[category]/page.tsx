import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Users, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import SmartImage from "@/components/SmartImage";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

async function getCategory(slug: string) {
  return prisma.category.findUnique({
    where: { slug },
    include: {
      tours: {
        where: { status: "PUBLISHED" },
        orderBy: [{ featured: "desc" }, { priceFrom: "asc" }],
        select: {
          id: true,
          title: true,
          slug: true,
          shortDesc: true,
          featuredImage: true,
          priceFrom: true,
          durationMin: true,
          maxGuests: true,
          featured: true,
        },
      },
    },
  });
}

function formatDuration(min: number | null | undefined): string | null {
  if (!min) return null;
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const rem = min % 60;
  return rem === 0 ? `${h} hr` : `${h}h ${rem}m`;
}

export async function generateMetadata(props: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await props.params;
  const cat = await prisma.category.findUnique({ where: { slug: category } });
  if (!cat) return { title: "Not found" };
  return {
    title: `${cat.name} | Quad Bike Tourism`,
    description: `Browse all ${cat.name.toLowerCase()} tours in the UAE — private bookings, free pickup & drop-off, instant confirmation.`,
    alternates: { canonical: `/${cat.slug}/` },
  };
}

export default async function CategoryPage(props: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await props.params;
  const cat = await getCategory(category);
  if (!cat) notFound();

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative bg-brand-ink text-white overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <SmartImage
              src="/images/buggy-hero.webp"
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-brand-ink/60 via-brand-ink/80 to-brand-ink" />
          <div className="relative container-site py-20 sm:py-24 text-center">
            <p className="text-[12px] sm:text-[13px] uppercase tracking-[4px] text-brand-yellow font-bold mb-4">
              Category
            </p>
            <h1 className="font-display text-[40px] sm:text-[58px] lg:text-[72px] leading-[1] tracking-[1px] text-brand-yellow uppercase">
              {cat.name}
            </h1>
            <div className="mt-8 inline-flex items-center gap-3 text-[13px] uppercase tracking-[3px] text-white/70">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow" />
              {cat.tours.length}{" "}
              {cat.tours.length === 1 ? "tour" : "tours"}
            </div>
          </div>
        </section>

        {/* Tours grid */}
        <section className="bg-white py-14 sm:py-20">
          <div className="container-site">
            {cat.tours.length === 0 ? (
              <p className="text-center text-[18px] text-black/60">
                No tours are published in this category yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {cat.tours.map((t) => {
                  const duration = formatDuration(t.durationMin);
                  return (
                    <article
                      key={t.id}
                      className="group relative bg-white border border-black/10 rounded-lg overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-1 transition duration-300"
                    >
                      <Link
                        href={`/${cat.slug}/${t.slug}/`}
                        className="block relative aspect-[16/11] bg-black/5 overflow-hidden"
                      >
                        {t.featuredImage ? (
                          <SmartImage
                            src={t.featuredImage}
                            alt={t.title}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover group-hover:scale-105 transition duration-500"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-black/30 text-sm uppercase tracking-[3px]">
                            No image
                          </div>
                        )}
                        {t.featured && (
                          <span className="absolute top-3 left-3 bg-brand-yellow text-brand-dark text-[11px] font-extrabold uppercase tracking-[2px] px-3 py-1 rounded-sm">
                            Featured
                          </span>
                        )}
                      </Link>

                      <div className="p-5 flex flex-col flex-1">
                        <h3 className="text-[20px] font-extrabold leading-tight text-brand-dark">
                          <Link
                            href={`/${cat.slug}/${t.slug}/`}
                            className="hover:text-brand-orange"
                          >
                            {t.title}
                          </Link>
                        </h3>

                        {t.shortDesc && (
                          <p className="mt-3 text-[14px] leading-[22px] text-black/70 line-clamp-3">
                            {t.shortDesc}
                          </p>
                        )}

                        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] uppercase tracking-[1.5px] text-black/60 font-bold">
                          {duration && (
                            <span className="inline-flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5" />
                              {duration}
                            </span>
                          )}
                          {t.maxGuests && (
                            <span className="inline-flex items-center gap-1.5">
                              <Users className="w-3.5 h-3.5" />
                              Up to {t.maxGuests}
                            </span>
                          )}
                        </div>

                        <div className="mt-5 pt-5 border-t border-black/10 flex items-center justify-between gap-3">
                          <div>
                            <p className="text-[11px] uppercase tracking-[2px] text-black/50">
                              From
                            </p>
                            <p className="text-[22px] font-extrabold leading-none text-brand-dark">
                              AED {Number(t.priceFrom).toLocaleString()}
                            </p>
                          </div>
                          <Link
                            href={`/${cat.slug}/${t.slug}/`}
                            className="inline-flex items-center gap-2 bg-brand-yellow text-brand-dark font-extrabold uppercase tracking-[2px] text-[12px] px-4 h-11 rounded-md border-2 border-brand-dark hover:brightness-95"
                          >
                            Book Now
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
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
