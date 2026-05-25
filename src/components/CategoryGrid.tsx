import Image from "next/image";
import Button from "./ui/Button";

type Category = {
  image: string;
  subtitle: string;
  label: string;
  href: string;
};

const CATEGORIES: Category[] = [
  {
    image: "/images/cat-quad.svg",
    subtitle: "Desert Quad Biking",
    label: "Quad Bikes",
    href: "/quad-bikes",
  },
  {
    image: "/images/cat-buggy.svg",
    subtitle: "Luxury VIP Desert Safari",
    label: "Desert Buggy",
    href: "/buggy-tours",
  },
  {
    image: "/images/cat-tour.svg",
    subtitle: "City & Cultural Adventures",
    label: "Tours",
    href: "/city-tours",
  },
  {
    image: "/images/cat-safari.svg",
    subtitle: "Evening BBQ Dune Safari",
    label: "Desert Safari",
    href: "/desert-safari",
  },
  {
    image: "/images/cat-water.svg",
    subtitle: "Jet Ski & Flyboarding",
    label: "Water Sports",
    href: "/water-sports",
  },
];

export default function CategoryGrid() {
  return (
    <section className="py-24 bg-white">
      <div className="container-site">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {CATEGORIES.map((c) => (
            <article
              key={c.label}
              className="flex flex-col items-center text-center"
            >
              <div className="relative w-[220px] h-[220px] xl:w-[260px] xl:h-[260px] rounded-full overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.12)] ring-4 ring-white">
                <Image
                  src={c.image}
                  alt={c.label}
                  fill
                  sizes="260px"
                  className="object-cover"
                />
              </div>
              <p className="mt-6 text-[22px] xl:text-[26px] text-brand-dark font-normal leading-tight">
                {c.subtitle}
              </p>
              <p className="mt-2 text-[14px] xl:text-[16px] font-bold uppercase tracking-wider text-brand-dark">
                {c.label}
              </p>
              <Button href={c.href} className="mt-5 text-[16px] xl:text-[18px]">
                EXPLORE MORE
              </Button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
