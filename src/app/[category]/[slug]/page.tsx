import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  Truck,
  ShieldCheck,
  RotateCcw,
  Headphones,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import SmartImage from "@/components/SmartImage";
import TourGallery from "@/components/TourGallery";
import BookingPanel, { type BookingVariation } from "@/components/BookingPanel";
import Breadcrumb from "@/components/Breadcrumb";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

async function getTour(slug: string) {
  return prisma.tour.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: {
      category: true,
      variations: { orderBy: { price: "asc" } },
    },
  });
}

async function getWhatsappNumber(): Promise<string | undefined> {
  const row = await prisma.setting.findUnique({ where: { key: "whatsapp" } });
  if (!row) return undefined;
  return typeof row.value === "string" ? row.value : undefined;
}

export async function generateMetadata(props: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const tour = await getTour(slug);
  if (!tour) return { title: "Tour not found" };
  return {
    title: tour.seoTitle ?? `${tour.title} | Quad Bike Tourism`,
    description: tour.seoDesc ?? tour.shortDesc ?? undefined,
    alternates: { canonical: `/${tour.category.slug}/${tour.slug}/` },
    openGraph: {
      title: tour.seoTitle ?? tour.title,
      description: tour.seoDesc ?? tour.shortDesc ?? undefined,
      images: tour.featuredImage ? [tour.featuredImage] : undefined,
      type: "website",
    },
  };
}

const FEATURES = [
  { icon: Truck, label: "Free Pickup & Drop Off" },
  { icon: ShieldCheck, label: "Secure Payment" },
  { icon: RotateCcw, label: "Free Cancellations" },
  { icon: Headphones, label: "24/7 Support" },
];

export default async function TourDetailPage(props: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await props.params;
  const tour = await getTour(slug);
  if (!tour) notFound();

  // If the URL's category segment doesn't match the tour's actual category,
  // redirect to the canonical URL so old/mistyped links still resolve.
  if (tour.category.slug !== category) {
    redirect(`/${tour.category.slug}/${tour.slug}/`);
  }

  const whatsapp = await getWhatsappNumber();

  const related = await prisma.tour.findMany({
    where: {
      status: "PUBLISHED",
      categoryId: tour.categoryId,
      NOT: { id: tour.id },
    },
    orderBy: [{ featured: "desc" }, { priceFrom: "asc" }],
    take: 4,
    select: {
      id: true,
      title: true,
      slug: true,
      featuredImage: true,
      priceFrom: true,
    },
  });

  const priceFrom = Number(tour.priceFrom);

  const variations: BookingVariation[] = tour.variations.length
    ? tour.variations.map((v) => ({
        id: v.id,
        label: v.label,
        price: Number(v.price),
        durationMin: v.durationMin ?? null,
        maxGuests: v.maxGuests ?? null,
      }))
    : [];

  const galleryImages = [
    ...(tour.featuredImage ? [tour.featuredImage] : []),
    ...tour.gallery,
  ].filter((src, i, arr) => arr.indexOf(src) === i);

  return (
    <>
      <Header />
      <main className="flex-1 bg-white">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: tour.category.name, href: `/${tour.category.slug}/` },
            { label: tour.title },
          ]}
        />
        {/* Hero title band */}
        <section className="bg-brand-cream/60 border-b border-black/5">
          <div className="container-site py-14 sm:py-20 text-center">
            <h1 className="text-[32px] sm:text-[44px] lg:text-[50px] font-extrabold tracking-tight uppercase text-[#3B3B3B] leading-[1.2] sm:leading-[60px]">
              {tour.title}
            </h1>
          </div>
        </section>

        {/* Features bar */}
        <section className="container-site -mt-6 sm:-mt-8 relative z-10">
          <div className="bg-white border border-black/10 rounded-md shadow-sm overflow-hidden">
            {/* Mobile / tablet: infinite auto-scrolling marquee */}
            <div className="lg:hidden marquee-mask overflow-hidden">
              <div className="marquee-track">
                {[...FEATURES, ...FEATURES].map(({ icon: Icon, label }, i) => (
                  <div
                    key={`${label}-${i}`}
                    className="flex items-center gap-3 px-6 py-4 justify-center shrink-0 whitespace-nowrap"
                  >
                    <Icon className="w-5 h-5 text-brand-dark shrink-0" />
                    <span className="text-[12px] sm:text-[13px] uppercase tracking-[1.5px] font-bold text-brand-dark">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            {/* Desktop: static 4-column grid */}
            <div className="hidden lg:grid lg:grid-cols-4 lg:divide-x divide-black/10">
              {FEATURES.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 px-5 py-4 justify-center"
                >
                  <Icon className="w-5 h-5 text-brand-dark shrink-0" />
                  <span className="text-[13px] uppercase tracking-[1.5px] font-bold text-brand-dark">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Main product section */}
        <section className="container-site py-10 sm:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-8 lg:gap-12 items-start">
            <div>
              <TourGallery title={tour.title} images={galleryImages} />
            </div>

            <aside className="lg:sticky lg:top-[120px]" id="book">
              <BookingPanel
                tourSlug={tour.slug}
                tourTitle={tour.title}
                priceFrom={priceFrom}
                variations={variations}
                whatsapp={whatsapp}
              />
            </aside>
          </div>
        </section>

        {/* Description */}
        {(tour.description || variations.length > 0 || tour.includes.length > 0) && (
          <section className="container-site pb-14">
            <div className="border-b border-black/10 mb-6">
              <span className="inline-block py-3 text-[14px] font-extrabold uppercase tracking-[2px] text-brand-dark border-b-2 border-brand-yellow -mb-px">
                Description
              </span>
            </div>

            {tour.description && (
              <article
                className="tour-prose"
                dangerouslySetInnerHTML={{ __html: tour.description }}
              />
            )}

            {variations.length > 0 && (
              <div className="mt-10">
                <h2 className="text-[20px] sm:text-[24px] font-extrabold text-brand-dark mb-4">
                  Pricing &amp; options
                </h2>
                <div className="overflow-x-auto border border-black/10 rounded-md">
                  <table className="w-full text-left text-[14px]">
                    <thead className="bg-brand-cream/60 border-b border-black/10">
                      <tr className="text-[12px] uppercase tracking-[1.5px] text-brand-dark/70 font-bold">
                        <th className="px-4 py-3">Option</th>
                        <th className="px-4 py-3">Duration</th>
                        <th className="px-4 py-3">Guests</th>
                        <th className="px-4 py-3 text-right">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {variations.map((v) => (
                        <tr
                          key={v.id}
                          className="border-b border-black/5 last:border-b-0"
                        >
                          <td className="px-4 py-3 font-bold text-brand-dark">
                            {v.label}
                          </td>
                          <td className="px-4 py-3 text-black/70">
                            {v.durationMin
                              ? v.durationMin >= 60
                                ? `${Math.floor(v.durationMin / 60)} hr${v.durationMin % 60 ? ` ${v.durationMin % 60} min` : ""}`
                                : `${v.durationMin} min`
                              : "—"}
                          </td>
                          <td className="px-4 py-3 text-black/70">
                            {v.maxGuests ? `Up to ${v.maxGuests}` : "—"}
                          </td>
                          <td className="px-4 py-3 text-right font-extrabold text-brand-dark">
                            AED {v.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {tour.includes.length > 0 && (
              <div className="mt-10">
                <h2 className="text-[20px] sm:text-[24px] font-extrabold text-brand-dark mb-4">
                  What&apos;s included
                </h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {tour.includes.map((it) => (
                    <li
                      key={it}
                      className="flex items-start gap-2 bg-brand-cream/50 border border-black/10 rounded-md px-4 py-3"
                    >
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-brand-orange shrink-0" />
                      <span className="text-[14px] font-semibold text-brand-dark">
                        {it}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        {/* Related products */}
        {related.length > 0 && (
          <section className="bg-brand-cream/40 py-14 sm:py-20">
            <div className="container-site">
              <h2 className="text-[24px] sm:text-[32px] font-extrabold text-brand-dark mb-8">
                Related products
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
                {related.map((r) => (
                  <div
                    key={r.id}
                    className="bg-white border border-black/10 rounded-md overflow-hidden flex flex-col group hover:shadow-lg transition"
                  >
                    <Link
                      href={`/${tour.category.slug}/${r.slug}/`}
                      className="block relative aspect-[4/3] bg-black/5 overflow-hidden"
                    >
                      {r.featuredImage ? (
                        <SmartImage
                          src={r.featuredImage}
                          alt={r.title}
                          fill
                          sizes="(max-width: 640px) 50vw, 25vw"
                          className="object-cover group-hover:scale-105 transition duration-500"
                        />
                      ) : null}
                    </Link>
                    <div className="p-4 flex-1 flex flex-col text-center">
                      <h3 className="text-[14px] sm:text-[15px] font-extrabold uppercase tracking-wide text-brand-dark leading-tight">
                        <Link
                          href={`/${tour.category.slug}/${r.slug}/`}
                          className="hover:text-brand-orange"
                        >
                          {r.title}
                        </Link>
                      </h3>
                      <p className="mt-2 text-[12px] uppercase tracking-[1.5px] text-black/55 font-bold">
                        From{" "}
                        <span className="text-brand-dark text-[14px]">
                          AED {Number(r.priceFrom).toLocaleString()}
                        </span>
                      </p>
                      <Link
                        href={`/${tour.category.slug}/${r.slug}/`}
                        className="mt-3 inline-flex items-center justify-center h-10 bg-brand-yellow text-brand-dark font-extrabold uppercase tracking-[2px] text-[12px] rounded-md hover:brightness-95"
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>
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
