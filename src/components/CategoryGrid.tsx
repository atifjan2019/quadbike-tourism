import Image from "next/image";
import Link from "next/link";

type Category = {
  image: string;
  subtitle: string;
  label: string;
  href: string;
  fit?: "cover" | "contain";
};

const ROW_TOP: Category[] = [
  {
    image: "/images/250000-scaled.webp",
    subtitle: "Desert Quad Biking",
    label: "Quad Bikes",
    href: "/quad-bikes",
  },
  {
    image: "/images/Dune-Buggy.webp",
    subtitle: "Desert Dune Buggy",
    label: "Desert Buggy",
    href: "/buggy-tours",
    fit: "contain" as const,
  },
  {
    image: "/images/City-Tours.webp",
    subtitle: "Premium City Tours",
    label: "Tours",
    href: "/city-tours",
    fit: "contain" as const,
  },
];

const ROW_BOTTOM: Category[] = [
  {
    image: "/images/desert-safari.webp",
    subtitle: "Luxury VIP Desert Safari",
    label: "Desert Safari",
    href: "/desert-safari",
    fit: "contain" as const,
  },
  {
    image: "/images/Water-Sports.webp",
    subtitle: "Luxury Sports Adventures",
    label: "Water Sports",
    href: "/water-sports",
    fit: "contain" as const,
  },
];

function Card({ c }: { c: Category }) {
  return (
    <article className="bg-white border border-black/10 rounded-md p-6 flex flex-col items-center text-center transition-shadow hover:shadow-lg">
      <div className="relative w-[220px] h-[220px] lg:w-[240px] lg:h-[240px] rounded-full overflow-hidden">
        <Image
          src={c.image}
          alt={c.label}
          fill
          sizes="240px"
          className={c.fit === "contain" ? "object-contain" : "object-cover"}
        />
      </div>
      <p className="mt-6 text-[18px] lg:text-[20px] text-brand-dark font-normal leading-tight">
        {c.subtitle}
      </p>
      <p className="mt-2 text-[22px] lg:text-[26px] font-extrabold uppercase tracking-wide text-brand-dark">
        {c.label}
      </p>
      <Link
        href={c.href}
        className="mt-5 inline-flex items-center justify-center bg-brand-yellow text-brand-dark font-extrabold uppercase tracking-[2px] text-[14px] px-8 py-3 rounded-md hover:brightness-95 transition"
      >
        EXPLORE MORE
      </Link>
    </article>
  );
}

export default function CategoryGrid() {
  return (
    <section className="py-20 bg-white">
      <div className="container-site">
        {/* Top row: 3 cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ROW_TOP.map((c) => (
            <Card key={c.label} c={c} />
          ))}
        </div>
        {/* Bottom row: 2 cards aligned with the outer columns of the 3-col grid */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card c={ROW_BOTTOM[0]} />
          <div className="hidden md:block" />
          <Card c={ROW_BOTTOM[1]} />
        </div>
      </div>
    </section>
  );
}
