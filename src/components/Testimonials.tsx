import Image from "next/image";
import { Star } from "lucide-react";

type Testimonial = {
  title: string;
  body: string;
  name: string;
  city: string;
  avatar: string;
};

const ITEMS: Testimonial[] = [
  {
    title: "The Best Day in Dubai!",
    body:
      "Booking was effortless, pickup was on time, and the desert sunset on the dunes was unreal. Our guide made sure the kids felt confident on the 90cc quads.",
    name: "Hannah Becker",
    city: "Munich, Germany",
    avatar: "/images/avatar-1.svg",
  },
  {
    title: "Adrenaline + Comfort",
    body:
      "The Polaris RZR is a beast. We did the 2-hour dune trail and ended at a private camp for BBQ. Worth every dirham — would book again next trip.",
    name: "Yusuf Khan",
    city: "London, UK",
    avatar: "/images/avatar-2.svg",
  },
  {
    title: "Felt Like a VIP",
    body:
      "Free hotel pickup, top-of-the-line gear, and a guide who knew exactly where the prettiest dunes were at golden hour. Highly recommend the VIP safari.",
    name: "Priya Nair",
    city: "Bengaluru, India",
    avatar: "/images/avatar-3.svg",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-brand-cream/40">
      <div className="container-site">
        <div className="text-center mb-14">
          <p className="text-[14px] uppercase tracking-[3px] text-brand-dark/70 mb-3">
            see what others have to say
          </p>
          <h2 className="text-[34px] sm:text-[42px] font-extrabold text-brand-dark leading-tight">
            OUR CUSTOMERS LOVE US
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ITEMS.map((t) => (
            <article
              key={t.name}
              className="bg-white rounded-[10px] shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-8 flex flex-col"
            >
              <h3 className="text-[20px] sm:text-[22px] font-bold text-brand-dark leading-snug">
                {t.title}
              </h3>
              <div className="flex items-center gap-1 mt-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-brand-yellow text-brand-yellow"
                  />
                ))}
              </div>
              <p className="mt-4 text-[15px] leading-[26px] text-brand-dark/85 flex-1">
                {t.body}
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-brand-cream shrink-0">
                  <Image
                    src={t.avatar}
                    alt={t.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-[15px] font-bold uppercase tracking-wide text-brand-dark leading-none">
                    {t.name}
                  </p>
                  <p className="text-[13px] text-brand-dark/70 mt-1">
                    {t.city}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
