import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  MapPin,
  Users,
  Sparkles,
  CalendarCheck,
  Phone,
  Compass,
  Award,
  Quote,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import SmartImage from "@/components/SmartImage";
import CounterStat from "@/components/CounterStat";
import Breadcrumb from "@/components/Breadcrumb";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Quad Bike Tourism is a premium UAE adventure operator offering private desert tours, quad biking, dune buggies, water sports, and city tours.",
  alternates: { canonical: "/about-us/" },
};

const WHY_BOOK = [
  {
    icon: ShieldCheck,
    title: "Trusted & Safe",
    body: "Certified guides, premium safety gear and bikes serviced before every ride.",
  },
  {
    icon: MapPin,
    title: "Hand-picked routes",
    body: "Private trails through the most photogenic dunes — no convoys, no waiting.",
  },
  {
    icon: Compass,
    title: "Tailored experiences",
    body: "30-minute blasts, sunset rides, multi-day desert adventures — we shape it to you.",
  },
  {
    icon: Award,
    title: "5-star service",
    body: "Hundreds of 5-star reviews. Free hotel pickup, free cancellation, instant booking.",
  },
];

const STEPS = [
  {
    icon: Compass,
    title: "Pick your adventure",
    body: "Browse quad bikes, dune buggies, water sports or desert safaris. Choose a tier and duration.",
  },
  {
    icon: CalendarCheck,
    title: "Book your slot",
    body: "Submit your date, time and guest count. We confirm availability instantly.",
  },
  {
    icon: Phone,
    title: "We pick you up",
    body: "Free pickup from your hotel or accommodation. Just be ready, bring sunscreen.",
  },
  {
    icon: Sparkles,
    title: "Ride the dunes",
    body: "Our expert guides walk you through the safety brief and lead you into the desert.",
  },
];

const TESTIMONIALS = [
  {
    name: "James Klark",
    quote:
      "Hands down the best desert tour I've done in the UAE. The guide was patient with first-timers and the route was incredible.",
    location: "United Kingdom",
  },
  {
    name: "Jenny Martins",
    quote:
      "Booked the family-friendly safari with my kids and we had a blast. Free pickup, photos included, very professional.",
    location: "Germany",
  },
  {
    name: "Karen Halbert",
    quote:
      "Did the Polaris RZR tour at sunset. The buggies are immaculate and the sunset over the dunes was unforgettable.",
    location: "Australia",
  },
];

export default function AboutUsPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-white">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "About Us" },
          ]}
        />

        {/* Hero */}
        <section className="relative bg-brand-ink text-white overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <SmartImage
              src="/images/buggy-hero.webp"
              alt=""
              aria-hidden
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-brand-ink/60 via-brand-ink/80 to-brand-ink" />
          <div className="relative container-site py-20 sm:py-28 text-center">
            <p className="text-[12px] sm:text-[13px] uppercase tracking-[4px] text-brand-yellow font-bold mb-4">
              Founded within the UAE
            </p>
            <h1 className="font-display text-[40px] sm:text-[58px] lg:text-[72px] leading-[1] tracking-[1px] text-brand-yellow uppercase">
              About Quad Bike Tourism
            </h1>
            <p className="mt-6 max-w-[720px] mx-auto text-[16px] sm:text-[18px] text-white/85 leading-[28px]">
              UAE-born adventure operator built for travellers who want to skip
              the crowds and ride the desert on their own terms. Premium
              machines, certified guides, and routes tailored to you.
            </p>
          </div>
        </section>

        {/* Why Book With Us */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="container-site">
            <div className="max-w-[680px] mx-auto text-center mb-12">
              <p className="text-[12px] uppercase tracking-[3px] text-brand-orange font-extrabold mb-3">
                Why book with us
              </p>
              <h2 className="text-[28px] sm:text-[36px] font-extrabold text-brand-dark leading-tight">
                Premium desert adventure, done right.
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {WHY_BOOK.map(({ icon: Icon, title, body }) => (
                <div
                  key={title}
                  className="bg-brand-cream/50 border border-black/10 rounded-lg p-6 text-center"
                >
                  <div className="w-14 h-14 mx-auto rounded-full bg-brand-yellow flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-brand-dark" />
                  </div>
                  <h3 className="text-[18px] font-extrabold text-brand-dark mb-2">
                    {title}
                  </h3>
                  <p className="text-[14px] leading-[22px] text-black/70">
                    {body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Counters */}
        <section className="bg-brand-ink text-white py-16 sm:py-20">
          <div className="container-site">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-6">
              <CounterStat end={12000} suffix="+" label="Customers Served" />
              <CounterStat end={25} suffix="+" label="Professional Guides" />
              <CounterStat end={10} suffix="+" label="Years in Business" />
            </div>
          </div>
        </section>

        {/* How to Book */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="container-site">
            <div className="max-w-[680px] mx-auto text-center mb-12">
              <p className="text-[12px] uppercase tracking-[3px] text-brand-orange font-extrabold mb-3">
                How it works
              </p>
              <h2 className="text-[28px] sm:text-[36px] font-extrabold text-brand-dark leading-tight">
                From booking to dunes in four simple steps.
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {STEPS.map(({ icon: Icon, title, body }, i) => (
                <div key={title} className="relative">
                  <div className="absolute -top-4 -left-2 text-[80px] font-extrabold text-brand-yellow/30 leading-none select-none pointer-events-none">
                    {(i + 1).toString().padStart(2, "0")}
                  </div>
                  <div className="relative bg-white border border-black/10 rounded-lg p-6 h-full">
                    <div className="w-12 h-12 rounded-md bg-brand-dark text-brand-yellow flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-[18px] font-extrabold text-brand-dark mb-2">
                      {title}
                    </h3>
                    <p className="text-[14px] leading-[22px] text-black/70">
                      {body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-brand-cream/50 py-16 sm:py-20">
          <div className="container-site">
            <div className="max-w-[680px] mx-auto text-center mb-12">
              <p className="text-[12px] uppercase tracking-[3px] text-brand-orange font-extrabold mb-3">
                Reviews from the dunes
              </p>
              <h2 className="text-[28px] sm:text-[36px] font-extrabold text-brand-dark leading-tight">
                What our guests are saying.
              </h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {TESTIMONIALS.map((t) => (
                <figure
                  key={t.name}
                  className="bg-white border border-black/10 rounded-lg p-6"
                >
                  <Quote className="w-7 h-7 text-brand-yellow mb-4" />
                  <blockquote className="text-[15px] leading-[26px] text-black/80">
                    {t.quote}
                  </blockquote>
                  <figcaption className="mt-5 pt-5 border-t border-black/10 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-dark text-brand-yellow flex items-center justify-center font-extrabold text-[14px]">
                      {t.name
                        .split(" ")
                        .map((w) => w[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <div>
                      <div className="text-[14px] font-extrabold text-brand-dark leading-tight">
                        {t.name}
                      </div>
                      <div className="text-[12px] text-black/60">
                        {t.location}
                      </div>
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-brand-ink text-white py-16 sm:py-20">
          <div className="container-site text-center max-w-[720px]">
            <h2 className="text-[28px] sm:text-[36px] font-extrabold leading-tight">
              Ready to ride?
            </h2>
            <p className="mt-4 text-[16px] text-white/80 leading-[28px]">
              Pick your adventure — quad bikes, dune buggies, water sports or
              the classic desert safari. We&apos;ll handle the rest.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/tours/"
                className="inline-flex items-center gap-2 bg-brand-yellow text-brand-dark px-7 h-12 rounded-md font-extrabold text-[14px] uppercase tracking-[2px] hover:brightness-95"
              >
                <Users className="w-4 h-4" />
                Browse Tours
              </Link>
              <Link
                href="/contact-us/"
                className="inline-flex items-center gap-2 border-2 border-white/30 text-white px-7 h-12 rounded-md font-extrabold text-[14px] uppercase tracking-[2px] hover:bg-white hover:text-brand-dark transition"
              >
                Contact Us
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
