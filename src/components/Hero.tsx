import SmartImage from "@/components/SmartImage";

export default function Hero() {
  return (
    <section className="relative bg-black text-white overflow-hidden">
      <div className="container-site grid grid-cols-1 lg:grid-cols-2 items-center min-h-[640px] py-16 lg:py-0 gap-10">
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
              className="absolute -right-[120px] -bottom-[80px] select-none pointer-events-none hidden sm:block"
              style={{ width: "160px", height: "auto" }}
              priority
            />
          </div>
        </div>

        {/* Right hero image */}
        <div className="relative w-full">
          <div className="relative w-full h-[300px] sm:h-[420px] lg:h-[640px]">
            <SmartImage
              src="/images/buggy-hero.webp"
              alt="Premium desert buggy ready for adventure"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain object-top lg:object-right"
            />
          </div>
          {/* Yellow arrow below buggy on mobile */}
          <div className="flex justify-center lg:hidden -mt-2">
            <SmartImage
              src="/images/yellow-arrow.png"
              alt=""
              width={220}
              height={140}
              sizes="220px"
              className="select-none pointer-events-none"
              style={{ width: "180px", height: "auto" }}
            />
          </div>
        </div>
      </div>

    </section>
  );
}
