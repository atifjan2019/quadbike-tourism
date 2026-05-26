import SmartImage from "@/components/SmartImage";

export default function Hero() {
  return (
    <section className="relative bg-black text-white">
      <div className="container-site grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] items-center min-h-[520px] py-8 lg:py-4 gap-10">
        {/* Left copy */}
        <div className="relative lg:pl-2 z-10 text-center lg:text-left">
          <p className="font-display text-white text-[20px] sm:text-[28px] lg:text-[40px] leading-none tracking-[2px] mb-2 sm:mb-3">
            WELCOME TO
          </p>
          <h1 className="font-display text-brand-yellow text-[44px] sm:text-[60px] lg:text-[84px] leading-[1] tracking-[1px] mb-5 sm:mb-7">
            QUAD BIKE
            <br />
            TOURISM
          </h1>
          <p className="text-white text-[15px] sm:text-[18px] lg:text-[22px] font-normal leading-snug mb-1 sm:mb-2">
            Trusted Guranteed, Free Cancellation
          </p>
          <div className="relative inline-block mx-auto lg:mx-0">
            <p className="text-white text-[17px] sm:text-[22px] lg:text-[28px] font-extrabold leading-snug">
              Premium Private Desert Tours
            </p>
            {/* Hand-drawn yellow arrow accent */}
            <SmartImage
              src="/images/yellow-arrow.png"
              alt=""
              width={180}
              height={120}
              sizes="180px"
              className="absolute -right-8 sm:-right-16 md:-right-24 lg:-right-[160px] -bottom-[120px] sm:-bottom-[150px] lg:-bottom-[190px] select-none pointer-events-none hidden sm:block"
              style={{ width: "160px", height: "auto" }}
              priority
            />
          </div>
        </div>

        {/* Right hero image */}
        <div className="relative w-full h-[280px] sm:h-[400px] lg:h-[560px] -mt-[100px] sm:mt-0 lg:-mr-12 xl:-mr-24">
          <SmartImage
            src="/images/buggy-hero.webp"
            alt="Premium desert buggy ready for adventure"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-contain object-top lg:object-right scale-[0.95] lg:scale-[1.08] origin-center lg:origin-right"
          />
        </div>
      </div>

      {/* Yellow arrow straddles bottom edge on mobile (50% on black, 50% below) */}
      <div className="absolute left-1/2 bottom-0 translate-y-[40%] ml-6 sm:hidden pointer-events-none z-20">
        <SmartImage
          src="/images/yellow-arrow.png"
          alt=""
          width={220}
          height={140}
          sizes="220px"
          className="select-none"
          style={{ width: "180px", height: "auto" }}
        />
      </div>
    </section>
  );
}
