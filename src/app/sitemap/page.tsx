import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Compass, FileText, Map, Newspaper, Scale } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import Breadcrumb from "@/components/Breadcrumb";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sitemap",
  description:
    "Explore every page on Quad Bike Tourism — all tour categories, individual tours, blog posts, and company pages in one place.",
  alternates: { canonical: "/sitemap/" },
};

const MAIN_PAGES = [
  { href: "/", label: "Home" },
  { href: "/tours/", label: "All Tours" },
  { href: "/about-us/", label: "About Us" },
  { href: "/contact-us/", label: "Contact Us" },
  { href: "/blog/", label: "Blog" },
];

const LEGAL_PAGES = [
  { href: "/privacy-policy/", label: "Privacy Policy" },
  { href: "/refund-returns/", label: "Refund & Returns" },
  { href: "/terms-conditions/", label: "Terms & Conditions" },
];

export default async function SitemapPage() {
  const now = new Date();

  const [categories, posts] = await Promise.all([
    prisma.category.findMany({
      orderBy: [{ order: "asc" }, { name: "asc" }],
      include: {
        tours: {
          where: { status: "PUBLISHED" },
          orderBy: [{ featured: "desc" }, { title: "asc" }],
          select: { title: true, slug: true },
        },
      },
    }),
    prisma.blogPost.findMany({
      where: { status: "PUBLISHED", publishedAt: { not: null, lte: now } },
      orderBy: { publishedAt: "desc" },
      take: 20,
      select: { title: true, slug: true },
    }),
  ]).catch(() => [[], []] as const);

  const totalTours = categories.reduce((acc, c) => acc + c.tours.length, 0);

  return (
    <>
      <Header />
      <main className="flex-1 bg-white">
        <Breadcrumb
          items={[{ label: "Home", href: "/" }, { label: "Sitemap" }]}
        />

        {/* Hero */}
        <section className="relative bg-brand-ink text-white overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-ink/95 via-brand-ink to-brand-ink" />
          <div className="relative container-site py-16 sm:py-20 text-center">
            <p className="text-[12px] sm:text-[13px] uppercase tracking-[4px] text-brand-yellow font-bold mb-3">
              Site Index
            </p>
            <h1 className="font-display text-[36px] sm:text-[52px] lg:text-[64px] leading-[1.05] tracking-[1px] text-brand-yellow uppercase">
              Sitemap
            </h1>
            <p className="mt-5 max-w-[640px] mx-auto text-[15px] sm:text-[17px] text-white/85 leading-[28px]">
              Every page on Quad Bike Tourism, organised in one place. Browse
              our {totalTours} tours across {categories.length} categories, or
              jump straight to the section you need.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-14 sm:py-20">
          <div className="container-site grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main pages */}
            <Column icon={Compass} title="Main Pages">
              {MAIN_PAGES.map((p) => (
                <LinkRow key={p.href} href={p.href} label={p.label} />
              ))}
            </Column>

            {/* Legal */}
            <Column icon={Scale} title="Legal">
              {LEGAL_PAGES.map((p) => (
                <LinkRow key={p.href} href={p.href} label={p.label} />
              ))}
              <LinkRow href="/sitemap.xml" label="XML Sitemap (for search engines)" external />
            </Column>

            {/* Blog */}
            <Column icon={Newspaper} title="Recent Blog Posts">
              <LinkRow href="/blog/" label="All Articles" />
              {posts.length === 0 ? (
                <p className="text-[14px] text-black/50 italic">
                  No posts published yet.
                </p>
              ) : (
                posts.map((p) => (
                  <LinkRow
                    key={p.slug}
                    href={`/blog/${p.slug}/`}
                    label={p.title}
                  />
                ))
              )}
            </Column>
          </div>
        </section>

        {/* Tour categories */}
        <section className="bg-brand-cream/40 py-14 sm:py-20">
          <div className="container-site">
            <div className="flex items-center gap-3 mb-10">
              <span className="inline-flex w-10 h-10 rounded-md bg-brand-yellow text-brand-dark items-center justify-center">
                <Map className="w-5 h-5" />
              </span>
              <h2 className="text-[24px] sm:text-[30px] font-extrabold text-brand-dark leading-tight">
                Tours by Category
              </h2>
            </div>

            {categories.length === 0 ? (
              <p className="text-[15px] text-black/60">
                No categories are published right now.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="bg-white border border-black/10 rounded-lg p-6 flex flex-col"
                  >
                    <Link
                      href={`/${cat.slug}/`}
                      className="group flex items-center justify-between gap-3 pb-4 border-b border-black/10"
                    >
                      <h3 className="text-[18px] font-extrabold text-brand-dark uppercase tracking-wide group-hover:text-brand-orange transition">
                        {cat.name}
                      </h3>
                      <span className="text-[11px] uppercase tracking-[2px] text-black/50 font-bold whitespace-nowrap">
                        {cat.tours.length}{" "}
                        {cat.tours.length === 1 ? "tour" : "tours"}
                      </span>
                    </Link>
                    <ul className="mt-4 space-y-2">
                      {cat.tours.length === 0 ? (
                        <li className="text-[14px] text-black/50 italic">
                          No tours yet
                        </li>
                      ) : (
                        cat.tours.map((t) => (
                          <li key={t.slug}>
                            <Link
                              href={`/${cat.slug}/${t.slug}/`}
                              className="group inline-flex items-start gap-2 text-[14px] leading-snug text-black/75 hover:text-brand-dark"
                            >
                              <ChevronRight className="w-3.5 h-3.5 mt-1 shrink-0 text-brand-yellow group-hover:text-brand-orange" />
                              <span>{t.title}</span>
                            </Link>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-brand-ink text-white py-14 sm:py-20">
          <div className="container-site text-center max-w-[640px]">
            <FileText className="w-10 h-10 mx-auto text-brand-yellow mb-4" />
            <h2 className="text-[26px] sm:text-[32px] font-extrabold leading-tight">
              Can&apos;t find what you&apos;re looking for?
            </h2>
            <p className="mt-4 text-[15px] text-white/80 leading-[26px]">
              Reach out and our team will point you to the right page or help
              you plan a custom adventure.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/contact-us/"
                className="inline-flex items-center gap-2 bg-brand-yellow text-brand-dark px-6 h-12 rounded-md font-extrabold text-[13px] uppercase tracking-[2px] hover:brightness-95"
              >
                Contact Us
              </Link>
              <Link
                href="/tours/"
                className="inline-flex items-center gap-2 border-2 border-white/30 text-white px-6 h-12 rounded-md font-extrabold text-[13px] uppercase tracking-[2px] hover:bg-white hover:text-brand-dark transition"
              >
                Browse Tours
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}

function Column({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Compass;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-black/10 rounded-lg p-6 sm:p-7">
      <div className="flex items-center gap-3 pb-4 mb-4 border-b border-black/10">
        <span className="inline-flex w-10 h-10 rounded-md bg-brand-yellow text-brand-dark items-center justify-center">
          <Icon className="w-5 h-5" />
        </span>
        <h2 className="text-[18px] font-extrabold uppercase tracking-wide text-brand-dark">
          {title}
        </h2>
      </div>
      <ul className="space-y-2.5">{children}</ul>
    </div>
  );
}

function LinkRow({
  href,
  label,
  external = false,
}: {
  href: string;
  label: string;
  external?: boolean;
}) {
  const cls =
    "group inline-flex items-start gap-2 text-[15px] leading-snug text-black/80 hover:text-brand-dark";
  const inner = (
    <>
      <ChevronRight className="w-4 h-4 mt-0.5 shrink-0 text-brand-yellow group-hover:text-brand-orange" />
      <span>{label}</span>
    </>
  );
  return (
    <li>
      {external ? (
        <a href={href} className={cls}>
          {inner}
        </a>
      ) : (
        <Link href={href} className={cls}>
          {inner}
        </Link>
      )}
    </li>
  );
}
