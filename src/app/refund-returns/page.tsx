import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

export const metadata: Metadata = {
  title: "Refund & Returns Policy",
  description:
    "How refunds, cancellations and reschedules work for Quad Bike Tourism bookings.",
  alternates: { canonical: "/refund-returns/" },
};

export default function RefundReturnsPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="py-20">
          <div className="container-site max-w-[900px]">
            <h1 className="text-[34px] sm:text-[44px] font-extrabold leading-tight mb-3">
              Refund &amp; Returns Policy
            </h1>
            <p className="text-sm text-black/60 mb-8">Last updated: 26 May 2026</p>

            <div className="space-y-6 text-[17px] leading-[30px] text-black/90">
              <h2 className="text-2xl font-extrabold">Free cancellation</h2>
              <p>
                Every Quad Bike Tourism booking includes free cancellation up to
                24 hours before your scheduled start time. Cancel via the
                confirmation email, WhatsApp, or by replying to{" "}
                <a className="underline" href="mailto:info@quadbiketourism.com">
                  info@quadbiketourism.com
                </a>{" "}
                — your full payment is refunded to the original payment method
                within 5–10 business days.
              </p>

              <h2 className="text-2xl font-extrabold">Inside 24 hours</h2>
              <p>
                Cancellations made less than 24 hours before the tour are
                non-refundable, but we&apos;ll happily reschedule to a different
                date free of charge (subject to availability).
              </p>

              <h2 className="text-2xl font-extrabold">Weather &amp; safety</h2>
              <p>
                If we cancel a tour due to weather, sandstorms, or any other
                safety issue, you get a full refund or a free reschedule —
                your choice.
              </p>

              <h2 className="text-2xl font-extrabold">No-shows</h2>
              <p>
                No-shows are non-refundable. If you&apos;re running late, message
                us on WhatsApp and we&apos;ll do our best to accommodate you.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
