import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, Clock, Users, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import SmartImage from "@/components/SmartImage";
import TourBookingForm from "@/components/TourBookingForm";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

async function getTour(slug: string) {
  return prisma.tour.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: { category: true, variations: true },
  });
}

async function getWhatsappNumber(): Promise<string | undefined> {
  const row = await prisma.setting.findUnique({ where: { key: "whatsapp" } });
  if (!row) return undefined;
  return typeof row.value === "string" ? row.value : undefined;
}

function formatDuration(min: number | null | undefined): string | null {
  if (!min) return null;
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const rem = min % 60;
  return rem === 0 ? `${h} hr` : `${h}h ${rem}m`;
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const tour = await getTour(slug);
  if (!tour) return { title: "Tour not found" };
  return {
    title: tour.seoTitle ?? `${tour.title} | Quad Bike Tourism`,
    description: tour.seoDesc ?? tour.shortDesc ?? undefined,
    alternates: { canonical: `/tours/${tour.slug}/` },
    openGraph: {
      title: tour.seoTitle ?? tour.title,
      description: tour.seoDesc ?? tour.shortDesc ?? undefined,
      images: tour.featuredImage ? [tour.featuredImage] : undefined,
      type: "website",
    },
  };
}

export default async function TourDetailPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const tour = await getTour(slug);
  if (!tour) notFound();

  const whatsapp = await getWhatsappNumber();

  const related = await prisma.tour.findMany({
    where: {
      status: "PUBLISHED",
      categoryId: tour.categoryId,
      NOT: { id: tour.id },
    },
    orderBy: [{ featured: "desc" }, { priceFrom: "asc" }],
    take: 3,
    select: {
      id: true,
      title: true,
      slug: true,
      shortDesc: true,
      featuredImage: true,
      priceFrom: true,
    },
  });

  const duration = formatDuration(tour.durationMin);
  const priceFrom = Number(tour.priceFrom);

  return (
    <>
      <Header />
      <main className="flex-1 bg-white">
        {/* Breadcrumb */}
        <div className="bg-brand-cream/40 border-b border-black/5">
          <div className="container-site py-4 text-[12px] sm:text-[13px] uppercase tracking-[2px] text-black/60 font-bold flex items-center gap-2 flex-wrap">
            <Link href="/" className="hover:text-brand-dark">Home</Link>
            <ChevronRight className="w-3 h-3 opacity-50" />
            <Link href="/tours/" className="hover:text-brand-dark">Tours</Link>
            <ChevronRight className="w-3 h-3 opacity-50" />
            <Link href={`/tours/#${tour.category.slug}`} className="hover:text-brand-dark">
              {tour.category.name}
            </Link>
            <ChevronRight className="w-3 h-3 opacity-50" />
            <span className="text-brand-dark">{tour.title}</span>
          </div>
        </div>

        {/* Hero */}
        <section className="container-site py-10 sm:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8 lg:gap-12 items-start">
            {/* Left: Gallery + meta + description */}
            <div>
              {/* Featured image */}
              <div className="relative aspect-[16/10] rounded-lg overflow-hidden bg-black/5 border border-black/10">
                {tour.featuredImage ? (
                  <SmartImage
                    src={tour.featuredImage}
                    alt={tour.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-black/30 text-sm uppercase tracking-[3px]">
                    No image
                  </div>
                )}
                {tour.featured && (
                  <span className="absolute top-4 left-4 bg-brand-yellow text-brand-dark text-[11px] font-extrabold uppercase tracking-[2px] px-3 py-1 rounded-sm">
                    Featured
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {tour.gallery.length > 0 && (
                <div className="mt-3 grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {tour.gallery.slice(0, 12).map((src, i) => (
                    <div
                      key={`${src}-${i}`}
                      className="relative aspect-square rounded-md overflow-hidden bg-black/5 border border-black/10"
                    >
                      <SmartImage
                        src={src}
                        alt={`${tour.title} — image ${i + 2}`}
                        fill
                        sizes="100px"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Title + meta block */}
              <div className="mt-8">
                <p className="text-[12px] uppercase tracking-[3px] text-brand-orange font-extrabold">
                  {tour.category.name}
                </p>
                <h1 className="mt-2 text-[32px] sm:text-[44px] font-extrabold leading-[1.1] text-brand-dark">
                  {tour.title}
                </h1>
                {tour.shortDesc && (
                  <p className="mt-3 text-[16px] leading-[26px] text-black/75 max-w-[680px]">
                    {tour.shortDesc}
                  </p>
                )}

                <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] uppercase tracking-[1.5px] text-black/60 font-bold">
                  {duration && (
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {duration}
                    </span>
                  )}
                  {tour.maxGuests && (
                    <span className="inline-flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      Up to {tour.maxGuests} guests
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              {tour.description && (
                <article
                  className="prose prose-neutral max-w-none mt-8
                    prose-headings:font-extrabold prose-headings:text-brand-dark
                    prose-h2:text-[26px] prose-h2:mt-8 prose-h2:mb-3
                    prose-h3:text-[20px] prose-h3:mt-6 prose-h3:mb-2
                    prose-p:text-[15px] prose-p:leading-[26px] prose-p:text-black/80
                    prose-ul:my-3 prose-li:my-1 prose-li:text-black/80
                    prose-strong:text-brand-dark"
                  dangerouslySetInnerHTML={{ __html: tour.description }}
                />
              )}

              {/* Includes */}
              {tour.includes.length > 0 && (
                <div className="mt-10">
                  <h2 className="text-[22px] sm:text-[26px] font-extrabold text-brand-dark mb-4">
                    What&apos;s included
                  </h2>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {tour.includes.map((it) => (
                      <li
                        key={it}
                        className="flex items-start gap-2 bg-brand-cream/50 border border-black/10 rounded-md px-4 py-3"
                      >
                        <Check className="w-4 h-4 text-brand-orange mt-1 shrink-0" />
                        <span className="text-[14px] font-semibold text-brand-dark">{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right: sticky booking form */}
            <aside className="lg:sticky lg:top-[120px]" id="book">
              <TourBookingForm
                tourSlug={tour.slug}
                tourTitle={tour.title}
                priceFrom={priceFrom}
                whatsapp={whatsapp}
              />

              {whatsapp && (
                <a
                  href={`https://api.whatsapp.com/send?phone=${whatsapp}&text=Hi%2C+I%27m+interested+in+${encodeURIComponent(
                    tour.title,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 w-full inline-flex items-center justify-center gap-2 border-2 border-brand-dark text-brand-dark px-4 h-12 rounded-md font-extrabold text-[13px] uppercase tracking-[2px] hover:bg-brand-dark hover:text-white transition"
                >
                  Ask on WhatsApp
                </a>
              )}
            </aside>
          </div>
        </section>

        {/* Related */}
        {related.length > 0 && (
          <section className="bg-brand-cream/40 py-14 sm:py-20">
            <div className="container-site">
              <div className="flex items-end justify-between gap-4 mb-8">
                <div>
                  <p className="text-[12px] uppercase tracking-[3px] text-brand-orange font-extrabold">
                    Also in {tour.category.name}
                  </p>
                  <h2 className="text-[26px] sm:text-[34px] font-extrabold text-brand-dark">
                    More you might like
                  </h2>
                </div>
                <Link
                  href={`/tours/#${tour.category.slug}`}
                  className="hidden sm:inline-flex items-center gap-2 text-[12px] uppercase tracking-[2px] font-extrabold text-brand-dark hover:text-brand-orange"
                >
                  View all
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map((r) => (
                  <Link
                    key={r.id}
                    href={`/tours/${r.slug}/`}
                    className="group bg-white border border-black/10 rounded-lg overflow-hidden hover:shadow-xl hover:-translate-y-1 transition"
                  >
                    <div className="relative aspect-[16/11] bg-black/5">
                      {r.featuredImage ? (
                        <SmartImage
                          src={r.featuredImage}
                          alt={r.title}
                          fill
                          sizes="(max-width: 640px) 100vw, 33vw"
                          className="object-cover group-hover:scale-105 transition duration-500"
                        />
                      ) : null}
                    </div>
                    <div className="p-5">
                      <h3 className="text-[18px] font-extrabold text-brand-dark leading-tight group-hover:text-brand-orange">
                        {r.title}
                      </h3>
                      {r.shortDesc && (
                        <p className="mt-2 text-[14px] text-black/65 line-clamp-2">
                          {r.shortDesc}
                        </p>
                      )}
                      <p className="mt-4 text-[11px] uppercase tracking-[2px] text-black/55 font-bold">
                        From
                      </p>
                      <p className="text-[20px] font-extrabold leading-none text-brand-dark">
                        AED {Number(r.priceFrom).toLocaleString()}
                      </p>
                    </div>
                  </Link>
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
