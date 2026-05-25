import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative bg-brand-ink text-white overflow-hidden">
      <div className="container-site grid grid-cols-1 lg:grid-cols-2 items-center min-h-[720px] py-16 lg:py-0 gap-10">
        {/* Left copy */}
        <div className="relative lg:pl-6 z-10">
          <p
            className="text-brand-yellow text-[32px] sm:text-[40px] leading-none mb-2"
            style={{ fontFamily: "var(--font-script)" }}
          >
            Welcome to
          </p>
          <h1 className="font-display text-brand-yellow text-[44px] sm:text-[56px] lg:text-[66px] leading-[1.05] mb-8">
            QUAD BIKE
            <br />
            TOURISM
          </h1>
          <p className="text-white text-[24px] sm:text-[30px] lg:text-[36px] font-normal leading-snug mb-3">
            Trusted Guaranteed, Free Cancellation
          </p>
          <p className="text-white text-[24px] sm:text-[30px] lg:text-[36px] font-extrabold leading-snug">
            Premium Private Desert Tours
          </p>

          {/* Hand-drawn arrow */}
          <svg
            className="hero-arrow mt-8"
            viewBox="0 0 220 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <path
              d="M5 40 C 60 5, 130 5, 195 35"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M180 18 L 200 35 L 178 50"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </div>

        {/* Right hero image */}
        <div className="relative w-full h-[360px] sm:h-[460px] lg:h-[640px]">
          <Image
            src="/images/hero-buggy.svg"
            alt="Premium desert buggy ready for adventure"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-contain object-right"
          />
        </div>
      </div>

      {/* Subtle radial accent */}
      <div className="pointer-events-none absolute -right-32 top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-brand-orange/10 blur-3xl" />
    </section>
  );
}
