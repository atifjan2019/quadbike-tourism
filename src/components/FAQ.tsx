"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

type QA = { q: string; a: string };

const ITEMS: QA[] = [
  {
    q: "DOES RIDING A QUAD BIKE REQUIRE ANY PRIOR EXPERIENCE?",
    a: "You don't need any prior experience! Our expert guides give a safety briefing and instructions before the trip to ensure your comfort and safety.",
  },
  {
    q: "IS IT SAFE TO QUAD BIKE?",
    a: "Yes — every ride begins with a safety briefing and we provide helmets, goggles and protective gear. A certified guide rides with every convoy.",
  },
  {
    q: "WHAT ATTIRE IS APPROPRIATE FOR QUAD BIKING?",
    a: "We recommend closed-toe shoes, comfortable clothing you don't mind getting dusty, and sunglasses. Helmets and goggles are provided. In winter, bring a light jacket — desert evenings get cool.",
  },
  {
    q: "ARE THERE ANY GROUP DISCOUNTS AVAILABLE?",
    a: "Yes. Groups of 6+ receive 10% off automatically, and groups of 12+ get 15% off plus a complimentary refreshment package. Contact us for corporate or large-group rates.",
  },
  {
    q: "WHICH PAYMENT METHODS ARE ACCEPTED?",
    a: "We accept all major credit cards (Visa, Mastercard, Amex), Apple Pay, Google Pay, and cash on arrival. A booking confirmation is emailed instantly.",
  },
  {
    q: "IS IT POSSIBLE TO PERSONALIZE MY TOUR?",
    a: "Absolutely — our VIP package is fully bespoke. Choose your route, duration, vehicle, and add-ons like a private chef BBQ, falconry display, or sandboarding session.",
  },
  {
    q: "WHEN IS THE IDEAL TIME OF DAY TO GO QUAD BIKING?",
    a: "Sunrise and sunset rides offer the most comfortable temperatures and the best photography light. Midday rides are available in winter; we avoid them in peak summer.",
  },
  {
    q: "WHAT OCCURS IN THE EVENT OF POOR WEATHER?",
    a: "Safety first — if high winds or sandstorms make the desert unsafe, we reschedule your tour at no cost or refund you in full. Your choice.",
  },
  {
    q: "CAN I ENGAGE IN OTHER ACTIVITIES WHILE QUAD-BIKING?",
    a: "Yes. Most of our packages bundle quad biking with sandboarding, camel rides, BBQ dinners, or cultural performances. Tell us what you'd like and we'll build a single combined itinerary.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="py-24">
      <div className="container-site max-w-[1100px]">
        <h2 className="text-center font-display text-[40px] sm:text-[60px] lg:text-[76px] leading-[1.05] text-black mb-14">
          FREQUENTLY ASKED QUESTIONS
        </h2>

        <div className="space-y-4">
          {ITEMS.map((item, idx) => {
            const isOpen = open === idx;
            return (
              <div
                key={item.q}
                className={
                  isOpen
                    ? "bg-black text-white"
                    : "bg-white text-black border border-black/20"
                }
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between gap-6 px-6 sm:px-8 py-5 text-left"
                >
                  <span
                    className={`text-[14px] sm:text-[15px] font-extrabold uppercase tracking-[1.5px] ${
                      isOpen ? "text-white" : "text-black"
                    }`}
                  >
                    {item.q}
                  </span>
                  {isOpen ? (
                    <X className="w-5 h-5 text-white shrink-0" strokeWidth={2.5} />
                  ) : (
                    <Plus className="w-5 h-5 text-black shrink-0" strokeWidth={2.5} />
                  )}
                </button>
                {isOpen && (
                  <div className="bg-white text-black">
                    <p className="px-6 sm:px-8 py-6 text-[17px] leading-[30px]">
                      {item.a}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
