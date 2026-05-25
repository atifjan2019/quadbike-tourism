import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative bg-brand-ink text-white overflow-hidden">
      <div className="container-site grid grid-cols-1 lg:grid-cols-2 items-center min-h-[640px] py-16 lg:py-0 gap-10">
        {/* Left copy */}
        <div className="relative lg:pl-2 z-10">
          <p className="font-display text-white text-[32px] sm:text-[40px] lg:text-[44px] leading-none tracking-[1px] mb-3">
            WELCOME TO
          </p>
          <h1 className="font-display text-brand-yellow text-[52px] sm:text-[68px] lg:text-[84px] leading-[1] tracking-[1px] mb-7">
            QUAD BIKE
            <br />
            TOURISM
          </h1>
          <p className="text-white text-[22px] sm:text-[28px] lg:text-[32px] font-normal leading-snug mb-2">
            Trusted Guranteed, Free Cancellation
          </p>
          <div className="relative inline-block">
            <p className="text-white text-[22px] sm:text-[28px] lg:text-[34px] font-extrabold leading-snug">
              Premium Private Desert Tours
            </p>
            {/* Hand-drawn yellow arrow accent — floats to the right of the headline */}
            <Image
              src="/images/yellow-arrow.png"
              alt=""
              width={180}
              height={120}
              sizes="180px"
              className="absolute -right-[120px] -bottom-[80px] select-none pointer-events-none hidden sm:block"
              style={{ width: "160px", height: "auto" }}
              priority
            />
          </div>
        </div>

        {/* Right hero image */}
        <div className="relative w-full h-[360px] sm:h-[460px] lg:h-[640px]">
          <Image
            src="/images/buggy-hero.webp"
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
