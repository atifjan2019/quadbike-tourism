import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Users, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import SmartImage from "@/components/SmartImage";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "All Tours & Adventures",
  description:
    "Browse all our desert quad biking, dune buggy, water sports and city tour adventures across the UAE. Book your premium private tour with free pickup and cancellation.",
  alternates: { canonical: "/tours/" },
};

function formatPrice(value: unknown): string {
  const n = typeof value === "number" ? value : Number(value);
  if (!isFinite(n)) return "—";
  return n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function formatDuration(min: number | null | undefined): string | null {
  if (!min) return null;
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const rem = min % 60;
  return rem === 0 ? `${h} hr` : `${h}h ${rem}m`;
}

export default async function ToursPage() {
  const categories = await prisma.category.findMany({
    orderBy: [{ order: "asc" }, { name: "asc" }],
    include: {
      tours: {
        where: { status: "PUBLISHED" },
        orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
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

  const visibleCategories = categories.filter((c) => c.tours.length > 0);
  const totalTours = visibleCategories.reduce((acc, c) => acc + c.tours.length, 0);

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
          <div className="relative container-site py-20 sm:py-28 text-center">
            <p className="text-[12px] sm:text-[13px] uppercase tracking-[4px] text-brand-yellow font-bold mb-4">
              Adventures &amp; Tours
            </p>
            <h1 className="font-display text-[42px] sm:text-[64px] lg:text-[80px] leading-[1] tracking-[1px] text-brand-yellow">
              ALL TOURS
            </h1>
            <p className="mt-6 max-w-[680px] mx-auto text-[16px] sm:text-[18px] text-white/85 leading-[28px]">
              From dune-shredding quad rides to luxury yacht charters — every
              adventure we offer, in one place. Free pickup &amp; drop-off,
              instant confirmation, free cancellation.
            </p>
            <div className="mt-8 inline-flex items-center gap-3 text-[13px] uppercase tracking-[3px] text-white/70">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow" />
              {totalTours} tours
              <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow" />
              {visibleCategories.length} categories
            </div>
          </div>
        </section>

        {/* Tour sections by category */}
        {visibleCategories.length === 0 ? (
          <section className="container-site py-24 text-center">
            <p className="text-[18px] text-black/70">
              No tours are available right now. Please check back soon.
            </p>
          </section>
        ) : (
          visibleCategories.map((cat, idx) => (
            <section
              key={cat.id}
              id={cat.slug}
              className={idx % 2 === 0 ? "bg-white py-16 sm:py-20" : "bg-brand-cream/40 py-16 sm:py-20"}
            >
              <div className="container-site">
                <div className="flex items-end justify-between gap-6 mb-10">
                  <div>
                    <p className="text-[12px] uppercase tracking-[3px] text-brand-orange font-bold mb-2">
                      Category
                    </p>
                    <h2 className="text-[28px] sm:text-[40px] font-extrabold leading-tight tracking-tight text-brand-dark">
                      {cat.name}
                    </h2>
                  </div>
                  <span className="text-[13px] uppercase tracking-[2px] text-black/60 font-bold whitespace-nowrap">
                    {cat.tours.length} {cat.tours.length === 1 ? "tour" : "tours"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {cat.tours.map((t) => {
                    const duration = formatDuration(t.durationMin);
                    return (
                      <article
                        key={t.id}
                        className="group relative bg-white border border-black/10 rounded-lg overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-1 transition duration-300"
                      >
                        <Link
                          href="/#booking"
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
                              href="/#booking"
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
                                AED {formatPrice(t.priceFrom)}
                              </p>
                            </div>
                            <Link
                              href="/#booking"
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
              </div>
            </section>
          ))
        )}

        {/* Bottom CTA */}
        <section className="bg-brand-ink text-white py-16 sm:py-20">
          <div className="container-site text-center max-w-[760px]">
            <h2 className="text-[28px] sm:text-[36px] font-extrabold leading-tight">
              Can&apos;t decide? Let us plan it for you.
            </h2>
            <p className="mt-4 text-[16px] text-white/80 leading-[28px]">
              Tell us your dates and group size — our team will recommend the
              perfect combination of tours for an unforgettable UAE adventure.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/contact-us/"
                className="inline-flex items-center gap-2 bg-brand-yellow text-brand-dark px-7 h-12 rounded-md font-extrabold text-[14px] uppercase tracking-[2px] hover:brightness-95"
              >
                Plan My Trip
              </Link>
              <a
                href="https://api.whatsapp.com/send?phone=923448959905"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border-2 border-white/30 text-white px-7 h-12 rounded-md font-extrabold text-[14px] uppercase tracking-[2px] hover:bg-white hover:text-brand-dark transition"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
