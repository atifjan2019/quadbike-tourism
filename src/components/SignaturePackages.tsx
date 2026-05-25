import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import Button from "./ui/Button";

type Feature = {
  title: string;
  image: string;
  body: string;
  bullets: string[];
  href: string;
};

const FEATURES: Feature[] = [
  {
    title: "Desert Quad Biking",
    image: "/images/package-quad.svg",
    body:
      "Tear across pristine red dunes on a fully-serviced quad. Choose 90cc for beginners or 450cc for adrenaline junkies — every rider gets a guided briefing and a certified safety guide leading the convoy.",
    bullets: [
      "Free Cancellation",
      "Free Pickup & Drop-off",
      "Instant Booking",
      "Starting From 30 Minutes",
    ],
    href: "/quad-bikes",
  },
  {
    title: "Desert Dune Buggy",
    image: "/images/package-buggy.svg",
    body:
      "Climb into a Polaris RZR or Can-Am Maverick and explore the dunes in air-conditioned comfort. Perfect for couples and families — two-seater and four-seater buggies available.",
    bullets: [
      "Free Cancellation",
      "Free Pickup & Drop-off",
      "Instant Booking",
      "Starting From 30 Minutes",
    ],
    href: "/buggy-tours",
  },
  {
    title: "Water Sports Adventures",
    image: "/images/package-water.svg",
    body:
      "From jet ski blasts past the Burj Al Arab to flyboarding above turquoise waters, our water sports menu turns the UAE coastline into your private playground.",
    bullets: [
      "Free Cancellation",
      "Free Pickup & Drop-off",
      "Instant Booking",
      "Starting From 15 Minutes",
    ],
    href: "/water-sports",
  },
];

export default function SignaturePackages() {
  return (
    <section className="py-24 bg-white">
      <div className="container-site">
        <div className="text-center mb-16">
          <p className="text-[14px] font-bold uppercase tracking-[3px] text-brand-dark/70 mb-3">
            Signature Packages
          </p>
          <h2 className="text-[34px] sm:text-[42px] font-extrabold text-brand-dark leading-tight">
            These Adventures are Stealing The Spotlight
          </h2>
        </div>

        <div className="flex flex-col gap-24">
          {FEATURES.map((f, i) => {
            const reverse = i % 2 === 1;
            return (
              <div
                key={f.title}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center ${
                  reverse ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div className="relative w-full h-[320px] sm:h-[420px] rounded-2xl overflow-hidden shadow-xl">
                  <Image
                    src={f.image}
                    alt={f.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-[26px] sm:text-[32px] font-extrabold text-brand-dark leading-tight">
                    {f.title}
                  </h3>
                  <p className="mt-4 text-[16px] leading-[28px] text-brand-dark/90 max-w-[560px]">
                    {f.body}
                  </p>
                  <ul className="mt-6 space-y-3">
                    {f.bullets.map((b) => (
                      <li
                        key={b}
                        className="flex items-center gap-3 text-[15px] text-brand-dark"
                      >
                        <CheckCircle2 className="w-5 h-5 text-brand-yellow shrink-0" />
                        <span className="font-medium">{b}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <Button href={f.href}>BOOK NOW</Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
