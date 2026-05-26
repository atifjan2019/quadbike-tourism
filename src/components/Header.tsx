import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { prisma } from "@/lib/db";
import MobileNav, { type MobileNavItem } from "./MobileNav";

type NavItem = MobileNavItem;

export default async function Header() {
  // Fetch live category + published tour list for the dropdown.
  const categories = await prisma.category.findMany({
    orderBy: [{ order: "asc" }, { name: "asc" }],
    include: {
      tours: {
        where: { status: "PUBLISHED" },
        orderBy: [{ featured: "desc" }, { priceFrom: "asc" }],
        select: { title: true, slug: true },
      },
    },
  });

  const nav: NavItem[] = [
    { label: "Home", href: "/", active: true },
    ...categories.map((c) => ({
      label: c.name,
      href: `/tours/#${c.slug}`,
      children: c.tours.map((t) => ({
        label: t.title,
        href: `/tours/${t.slug}/`,
      })),
    })),
    { label: "Blogs", href: "/blog/" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-black/5 shadow-[0_2px_18px_rgba(0,0,0,0.04)]">
      <div className="container-site relative flex items-center justify-between gap-4 h-[96px]">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center shrink-0"
          aria-label="Quad Bike Tourism — Home"
        >
          <Image
            src="/images/buggy-desert-1.png"
            alt="Quad Bike Tourism"
            width={200}
            height={90}
            sizes="200px"
            priority
            className="h-[80px] w-auto object-contain"
            style={{ width: "auto", height: "80px" }}
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {nav.map((item) => (
            <div key={item.label} className="relative group">
              <Link
                href={item.href}
                className={`inline-flex items-center gap-1 px-[18px] py-[10px] rounded-[5px] text-[16px] font-bold uppercase tracking-wide transition-colors ${
                  item.active
                    ? "bg-brand-yellow text-brand-dark"
                    : "text-brand-dark hover:text-brand-yellow"
                }`}
              >
                {item.label}
                {item.children && item.children.length > 0 && (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Link>
              {item.children && item.children.length > 0 && (
                <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                  <div className="min-w-[280px] bg-brand-yellow rounded-md shadow-lg overflow-hidden">
                    {item.children.map((c) => (
                      <Link
                        key={c.label}
                        href={c.href}
                        className="block px-5 py-3 text-[15px] font-semibold text-brand-dark border-b border-black/10 last:border-b-0 hover:bg-brand-dark hover:text-brand-yellow transition-colors"
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Right actions */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <Link
            href="/tours/"
            className="inline-flex items-center gap-2 bg-brand-dark text-white px-4 py-2 rounded-[5px] text-[14px] font-bold uppercase tracking-wide hover:bg-black"
          >
            Book Now
          </Link>
        </div>

        {/* Mobile actions */}
        <div className="lg:hidden flex items-center gap-2">
          <Link
            href="/tours/"
            className="inline-flex items-center bg-brand-dark text-white px-3 h-10 rounded-[5px] text-[12px] font-bold uppercase tracking-wide hover:bg-black"
          >
            Book Now
          </Link>
          <MobileNav items={nav} />
        </div>
      </div>
    </header>
  );
}
