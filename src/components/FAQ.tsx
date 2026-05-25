"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type QA = { q: string; a: string };

const ITEMS: QA[] = [
  {
    q: "Is quad biking safe for beginners?",
    a: "Yes. Every ride begins with a 10-minute safety briefing, and we provide helmets, goggles, and protective gear. Our 90cc and 150cc bikes are perfectly suited for first-time riders, and a certified guide always rides at the front and back of the convoy.",
  },
  {
    q: "What should I wear for a desert tour?",
    a: "We recommend closed-toe shoes, comfortable clothes you don't mind getting dusty, and sunglasses. We provide helmets and goggles. In winter (Nov–Feb) bring a light jacket — desert evenings get cool.",
  },
  {
    q: "Do you offer free pickup and drop-off?",
    a: "Yes, we include free hotel and residence pickup across Dubai, Sharjah, and Ajman. Pickup from Abu Dhabi or other emirates is available for an additional fee — just mention it at booking.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit cards (Visa, Mastercard, Amex), Apple Pay, Google Pay, and cash on arrival. A booking confirmation is sent instantly to your email.",
  },
  {
    q: "Can I cancel or reschedule my booking?",
    a: "Absolutely — every booking comes with free cancellation up to 24 hours before your tour. Rescheduling is free at any time, subject to availability.",
  },
  {
    q: "Are group discounts available?",
    a: "Yes. Groups of 6 or more get an automatic 10% discount, and groups of 12+ receive 15% off plus a complimentary refreshment package. Contact us for corporate or large-group rates.",
  },
  {
    q: "Can I customize my tour itinerary?",
    a: "Of course. Our VIP package is fully bespoke — pick your route, duration, vehicle, and add-ons like a private chef BBQ, falconry display, or sandboarding session.",
  },
  {
    q: "What happens if the weather turns bad?",
    a: "Safety always comes first. If high winds or sandstorms make the desert unsafe, we reschedule your tour at no cost or refund you in full — your choice.",
  },
  {
    q: "Do I need a driving license for the quad bikes?",
    a: "No driving license is required for our standard desert quad rides. Riders must be at least 16 years old for the 250cc+ bikes, and 8 years old (with an adult) for the 90cc bikes.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="py-24 bg-white">
      <div className="container-site max-w-[920px]">
        <h2 className="text-center text-[36px] sm:text-[48px] font-extrabold text-brand-dark leading-tight mb-12">
          Frequently asked questions
        </h2>
        <div className="divide-y divide-black/10 border-y border-black/10">
          {ITEMS.map((item, idx) => {
            const isOpen = open === idx;
            return (
              <div key={item.q}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between gap-6 py-6 text-left"
                >
                  <span className="text-[18px] sm:text-[20px] font-bold text-brand-dark">
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-brand-dark shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`grid transition-[grid-template-rows] duration-200 ease-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="pb-6 pr-8 text-[15px] sm:text-[16px] leading-[28px] text-brand-dark/85">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
