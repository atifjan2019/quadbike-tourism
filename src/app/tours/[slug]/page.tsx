import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
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

const FEATURES = [
  { icon: Truck, label: "Free Pickup & Drop Off" },
  { icon: ShieldCheck, label: "Secure Payment" },
  { icon: RotateCcw, label: "Free Cancellations" },
  { icon: Headphones, label: "24/7 Support" },
];

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
        {/* Hero title band */}
        <section className="bg-brand-cream/60 border-b border-black/5">
          <div className="container-site py-10 sm:py-14 text-center">
            <p className="text-[12px] uppercase tracking-[3px] text-brand-orange font-extrabold mb-3">
              {tour.category.name}
            </p>
            <h1 className="text-[28px] sm:text-[42px] lg:text-[48px] font-extrabold tracking-tight text-brand-dark uppercase leading-[1.1]">
              {tour.title}
            </h1>
          </div>
        </section>

        {/* Features bar */}
        <section className="container-site -mt-6 sm:-mt-8 relative z-10">
          <div className="bg-white border border-black/10 rounded-md shadow-sm grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-black/10">
            {FEATURES.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 px-5 py-4 justify-center"
              >
                <Icon className="w-5 h-5 text-brand-dark" />
                <span className="text-[12px] sm:text-[13px] uppercase tracking-[1.5px] font-bold text-brand-dark">
                  {label}
                </span>
              </div>
            ))}
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
        {tour.description && (
          <section className="container-site pb-14">
            <div className="border-b border-black/10 mb-6">
              <span className="inline-block py-3 text-[14px] font-extrabold uppercase tracking-[2px] text-brand-dark border-b-2 border-brand-yellow -mb-px">
                Description
              </span>
            </div>

            <article
              className="prose prose-neutral max-w-none
                prose-headings:font-extrabold prose-headings:text-brand-dark
                prose-h2:text-[24px] prose-h2:mt-8 prose-h2:mb-3
                prose-h3:text-[18px] prose-h3:mt-6 prose-h3:mb-2
                prose-p:text-[15px] prose-p:leading-[26px] prose-p:text-black/80
                prose-ul:my-3 prose-li:my-1 prose-li:text-black/80
                prose-a:text-brand-orange prose-a:no-underline hover:prose-a:underline
                prose-strong:text-brand-dark"
              dangerouslySetInnerHTML={{ __html: tour.description }}
            />

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
                      href={`/tours/${r.slug}/`}
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
                          href={`/tours/${r.slug}/`}
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
                        href={`/tours/${r.slug}/`}
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
