import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Feature = {
  title: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  body: string;
  bullets: string[];
  cta: string;
  href: string;
};

const FEATURES: Feature[] = [
  {
    title: "Desert Quad Biking",
    image: "/images/COBRA-400-CC-SPORT-2-e1731747470595.jpg",
    imageWidth: 563,
    imageHeight: 563,
    body:
      "Conquer the golden sand with our Desert quad biking. A perfectly blended ride of fun and thrill awaits off the road in Dubai's deserts. Let's navigate the terrain with quad bikes.",
    bullets: [
      "Free Cancellation",
      "Free Pickup & Drop off",
      "Instant Booking",
      "Starting From 30 Minutes",
    ],
    cta: "BOOK QUAD BIKING NOW",
    href: "/quad-bikes",
  },
  {
    title: "Desert Dune Buggy",
    image: "/images/Dune-Buggy.webp",
    imageWidth: 720,
    imageHeight: 720,
    body:
      "Unleash the thrilling Desert Dune Buggy ride in the mesmerizing golden dunes of Dubai. Experience exciting and unforgettable moments by steering through the heart of Dubai's deserts.",
    bullets: [
      "Free Cancellation",
      "Free Pickup & Drop off",
      "Instant Booking",
      "Starting From 30 Minutes",
    ],
    cta: "BOOK DUNE BUGGY NOW",
    href: "/buggy-tours",
  },
  {
    title: "Water Sports Adventures",
    image: "/images/Water-Sports.webp",
    imageWidth: 736,
    imageHeight: 736,
    body:
      "Dive into the splashes of Dubai's deep waters and enjoy Water Sports Adventures from jet skiing to parasailing. Make memories with stunning views and thrilling activities.",
    bullets: [
      "Free Cancellation",
      "Free Pickup & Drop off",
      "Instant Booking",
      "Starting From 15 Minutes",
    ],
    cta: "BOOK WATER SPORTS NOW",
    href: "/water-sports",
  },
];

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-3 text-[18px] text-brand-dark">
      <span className="w-7 h-7 rounded-full bg-brand-yellow inline-flex items-center justify-center shrink-0">
        <ArrowRight className="w-4 h-4 text-brand-dark" strokeWidth={3} />
      </span>
      <span className="font-bold">{children}</span>
    </li>
  );
}

export default function SignaturePackages() {
  return (
    <section className="py-24">
      <div className="container-site">
        <div className="text-center mb-20">
          <p className="text-[14px] font-bold uppercase tracking-[3px] text-brand-dark/70 mb-3">
            SIGNATURE PACKAGES
          </p>
          <h2 className="text-[34px] sm:text-[44px] lg:text-[52px] font-extrabold text-brand-dark leading-tight">
            These Adventures are Stealing The Spotlight.
          </h2>
        </div>

        <div className="flex flex-col gap-24">
          {FEATURES.map((f, i) => {
            const reverse = i % 2 === 1;
            const num = String(i + 1).padStart(2, "0");
            return (
              <div
                key={f.title}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center ${
                  reverse ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >
                {/* Text column with big background number */}
                <div className="relative">
                  <span
                    aria-hidden
                    className="pointer-events-none select-none absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-[260px] lg:text-[320px] leading-none font-extrabold text-black/[0.05] z-0"
                  >
                    {num}
                  </span>
                  <div className="relative z-10">
                    <h3 className="text-[28px] sm:text-[34px] font-extrabold text-brand-dark leading-tight">
                      {f.title}
                    </h3>
                    <p className="mt-5 text-[20px] leading-[32px] text-brand-dark/90 max-w-[560px]">
                      {f.body}
                    </p>
                    <ul className="mt-7 space-y-4">
                      {f.bullets.map((b) => (
                        <Bullet key={b}>{b}</Bullet>
                      ))}
                    </ul>
                    <Link
                      href={f.href}
                      className="mt-8 w-full sm:max-w-[560px] inline-flex items-center justify-center bg-brand-yellow text-brand-dark font-extrabold uppercase tracking-[2px] text-[18px] px-6 py-5 rounded-md hover:brightness-95 transition"
                    >
                      {f.cta}
                    </Link>
                  </div>
                </div>

                {/* Image column — natural aspect, no crop */}
                <div className="relative w-full rounded-2xl overflow-hidden shadow-xl bg-black/5">
                  <Image
                    src={f.image}
                    alt={f.title}
                    width={f.imageWidth}
                    height={f.imageHeight}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
