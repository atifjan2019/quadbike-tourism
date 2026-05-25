import Image from "next/image";

type Testimonial = {
  title: string;
  body: string;
  name: string;
  city: string;
  avatar: string;
};

const ITEMS: Testimonial[] = [
  {
    title: "Fantastic Services!",
    body:
      "The best part of my trip to Dubai was the desert safari! Everything was perfect, from the drive to the camp in the 4x4 for dune bashing to the captivating cultural shows. The henna art was a beautiful touch, and the BBQ meal was great. The staff went above and beyond to ensure our comfort and a memorable vacation. This is a must-do adventure rather than merely an activity.",
    name: "James Klark",
    city: "USA",
    avatar: "/images/avatar-1.svg",
  },
  {
    title: "Exceeded Expectations - A++ Service, Well done!",
    body:
      "It was an exciting quad-biking adventure! It was an absolute thrill to zoom over the golden dunes when the wind blew in my face. The quad bike tourism team made the experience even better by giving us a little training and making sure we were comfortable before we left. It was delightful to take a break from riding and watch the sunset over the desert. It was the ideal balance of activity and tranquillity, and I will most certainly return.",
    name: "Jenny Martins",
    city: "London",
    avatar: "/images/avatar-2.svg",
  },
  {
    title: "Quick and Professional!",
    body:
      "I'm hooked! These water sports are pure adrenaline rushes. The iconic views in the crystal-deep waters of Dubai are mesmerizing. I have never enjoyed my vacations this much. The team was also friendly and ensured our safety and comfort. I loved every moment of these water sports. If you are a thrill seeker looking for a perfect spot for vacations. Come to Dubai and experience the new heights of tourism with quad bike tourism.",
    name: "Karen Halbert",
    city: "Israel",
    avatar: "/images/avatar-3.svg",
  },
];

function QuoteGlyph() {
  return (
    <svg
      viewBox="0 0 48 36"
      className="w-12 h-9 text-brand-dark"
      fill="currentColor"
      aria-hidden
    >
      <path d="M0 36V20C0 8.954 8.954 0 20 0v8c-6.627 0-12 5.373-12 12h12v16H0zm28 0V20C28 8.954 36.954 0 48 0v8c-6.627 0-12 5.373-12 12h12v16H28z" />
    </svg>
  );
}

function DotGrid() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6 text-brand-dark/70" aria-hidden>
      {[0, 8, 16].map((y) =>
        [0, 8, 16].map((x) => (
          <circle key={`${x}-${y}`} cx={x + 4} cy={y + 4} r="1.5" fill="currentColor" />
        ))
      )}
    </svg>
  );
}

export default function Testimonials() {
  return (
    <section className="bg-brand-yellow py-24">
      <div className="container-site">
        <div className="text-center mb-16">
          <p className="text-[14px] uppercase tracking-[5px] text-brand-dark mb-5">
            SEE WHAT OTHERS HAVE TO SAY
          </p>
          <h2 className="font-display text-[44px] sm:text-[60px] lg:text-[72px] text-brand-dark leading-[1.05]">
            OUR CUSTOMERS LOVE US
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ITEMS.map((t) => (
            <article
              key={t.name}
              className="relative border-2 border-brand-dark/85 px-7 pt-16 pb-8 flex flex-col"
            >
              {/* Floating quote mark — sits above the top border, centered */}
              <div className="absolute left-1/2 -translate-x-1/2 -top-5 bg-brand-yellow px-3">
                <QuoteGlyph />
              </div>

              <h3 className="text-[22px] font-extrabold text-brand-dark leading-snug">
                {t.title}
              </h3>
              <p className="mt-4 text-[17px] leading-[30px] text-brand-dark flex-1">
                {t.body}
              </p>

              <div className="mt-8 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-brand-dark/10 shrink-0">
                    <Image
                      src={t.avatar}
                      alt={t.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-[15px] font-extrabold uppercase tracking-wide text-brand-dark leading-none">
                      {t.name}
                    </p>
                    <p className="text-[13px] text-brand-dark/80 mt-1">{t.city}</p>
                  </div>
                </div>
                <DotGrid />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
