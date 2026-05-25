"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  active?: boolean;
  children?: { label: string; href: string }[];
};

const NAV: NavItem[] = [
  { label: "Home", href: "/", active: true },
  {
    label: "Quad Bikes",
    href: "/quad-bikes",
    children: [
      { label: "90CC Quad", href: "/quad-bikes/90cc" },
      { label: "150CC Quad", href: "/quad-bikes/150cc" },
      { label: "250CC Quad", href: "/quad-bikes/250cc" },
      { label: "450CC Quad", href: "/quad-bikes/450cc" },
      { label: "KTM Dirt Bike 450CC", href: "/quad-bikes/ktm-450" },
    ],
  },
  {
    label: "Buggy Tours",
    href: "/buggy-tours",
    children: [
      { label: "Polaris RZR 1000cc", href: "/buggy-tours/rzr-1000" },
      { label: "Can-Am Maverick X3", href: "/buggy-tours/can-am-x3" },
      { label: "Family Buggy 4 Seater", href: "/buggy-tours/family-4-seat" },
    ],
  },
  {
    label: "City Tours",
    href: "/city-tours",
    children: [
      { label: "Dubai City Tour", href: "/city-tours/dubai" },
      { label: "Abu Dhabi City Tour", href: "/city-tours/abu-dhabi" },
      { label: "Burj Khalifa Tour", href: "/city-tours/burj-khalifa" },
    ],
  },
  {
    label: "Water Sports",
    href: "/water-sports",
    children: [
      { label: "Jet Ski", href: "/water-sports/jet-ski" },
      { label: "Flyboard", href: "/water-sports/flyboard" },
      { label: "Parasailing", href: "/water-sports/parasailing" },
      { label: "Yacht Charter", href: "/water-sports/yacht" },
    ],
  },
  {
    label: "Desert Safari",
    href: "/desert-safari",
    children: [
      { label: "Evening Safari", href: "/desert-safari/evening" },
      { label: "Overnight Safari", href: "/desert-safari/overnight" },
      { label: "VIP Private Safari", href: "/desert-safari/vip" },
    ],
  },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-black/5 shadow-[0_2px_18px_rgba(0,0,0,0.04)]">
      <div className="container-site flex items-center justify-between gap-4 h-[96px]">
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0" aria-label="Quad Bike Tourism — Home">
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
          {NAV.map((item) => (
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
                {item.children && <ChevronDown className="w-4 h-4" />}
              </Link>
              {item.children && (
                <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                  <div className="min-w-[230px] bg-white border border-black/5 rounded-md shadow-xl py-2">
                    {item.children.map((c) => (
                      <Link
                        key={c.label}
                        href={c.href}
                        className="block px-4 py-2 text-[14px] font-medium text-brand-dark hover:bg-brand-cream hover:text-brand-yellow"
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
          <button
            className="inline-flex items-center justify-center w-11 h-11 rounded-md text-brand-dark"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-black/5 bg-white">
          <div className="container-site py-4 flex flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-3 rounded-[5px] text-[15px] font-bold uppercase tracking-wide ${
                  item.active
                    ? "bg-brand-yellow text-brand-dark"
                    : "text-brand-dark hover:bg-brand-cream"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/tours/"
              onClick={() => setMobileOpen(false)}
              className="mt-2 inline-flex items-center justify-center bg-brand-dark text-white px-4 py-3 rounded-[5px] text-[14px] font-bold uppercase tracking-wide"
            >
              Book Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
