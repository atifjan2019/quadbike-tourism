import Image from "next/image";
import Button from "./ui/Button";

export default function GoldenDunesSection() {
  return (
    <section className="py-24 bg-brand-cream/40">
      <div className="container-site grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="relative w-full h-[360px] sm:h-[460px] rounded-2xl overflow-hidden shadow-xl">
          <Image
            src="/images/dunes-collage.svg"
            alt="Golden desert dunes at sunset with bonfire"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div>
          <h2 className="text-[34px] sm:text-[42px] font-extrabold text-brand-dark leading-[1.1]">
            Golden Dunes are
            <br />
            Calling!
          </h2>
          <p className="mt-6 text-[16px] leading-[28px] text-brand-dark/90 max-w-[560px]">
            Escape the city skyline and chase the horizon across miles of warm,
            wind-sculpted sand. Our private desert experiences are designed for
            families, couples, and solo adventurers who want unforgettable
            sunset views, traditional Bedouin hospitality, and the freedom to
            ride at their own pace.
          </p>
          <p className="mt-4 text-[16px] leading-[28px] text-brand-dark/90 max-w-[560px]">
            From a 30-minute quad blast to an overnight stay under the stars,
            every booking includes free pickup, free cancellation, and a
            certified safety guide.
          </p>
          <div className="mt-8">
            <Button href="#booking">BOOK DESERT SAFARI NOW</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
