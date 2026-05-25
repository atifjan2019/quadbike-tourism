import Image from "next/image";
import Button from "./ui/Button";

export default function GoldenDunesSection() {
  return (
    <section className="py-24">
      <div className="container-site grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="relative w-full rounded-2xl overflow-hidden shadow-xl bg-black/5">
          <Image
            src="/images/fire-show.jpg"
            alt="Traditional fire show under the desert stars"
            width={1000}
            height={1000}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="w-full h-auto"
          />
        </div>
        <div>
          <h2 className="text-[34px] sm:text-[42px] font-extrabold text-brand-dark leading-[1.1]">
            Golden Dunes are
            <br />
            Calling!
          </h2>
          <p className="mt-6 text-[20px] leading-[32px] text-brand-dark/90 max-w-[640px]">
            Attention adventure seekers! Dubai Desert safari tours are calling
            you for a thrilling experience. Unleash the magic of sand with an
            unforgettable adventure in our perfect morning and evening desert
            safari packages. Expect dune bashing, camel riding, sandboarding,
            and quad biking in the Desert Safari Dubai with traditional
            entertainment and lavish Arabian cuisine under the stars.
          </p>
          <p className="mt-5 text-[20px] leading-[32px] text-brand-dark/90 max-w-[640px]">
            Explore what else we offer for families, couples, and solo
            travellers. Book your desert safari now at Quad Bike Tourism.
          </p>
          <div className="mt-8">
            <Button href="#booking">BOOK DESERT SAFARI NOW</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
