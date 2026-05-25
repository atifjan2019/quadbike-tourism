import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Quad Bike Tourism collects, uses, and protects your personal data.",
  alternates: { canonical: "/privacy-policy/" },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="py-20">
          <div className="container-site max-w-[900px] prose prose-lg max-w-none">
            <h1 className="text-[34px] sm:text-[44px] font-extrabold leading-tight mb-3">
              Privacy Policy
            </h1>
            <p className="text-sm text-black/60 mb-8">
              Last updated: 26 May 2026
            </p>

            <div className="space-y-6 text-[17px] leading-[30px] text-black/90">
              <p>
                Quad Bike Tourism (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) respects your privacy and is
                committed to protecting your personal data. This policy explains
                what we collect, how we use it, and your rights.
              </p>

              <h2 className="text-2xl font-extrabold mt-8">What we collect</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Contact details you give us when booking (name, email, phone)</li>
                <li>Booking details (selected tour, date, time, party size)</li>
                <li>Anonymous analytics (pages visited, referrer, device type)</li>
              </ul>

              <h2 className="text-2xl font-extrabold mt-8">How we use it</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>To confirm and deliver your booking</li>
                <li>To send booking-related emails and reminders</li>
                <li>To improve our website and tours</li>
              </ul>

              <h2 className="text-2xl font-extrabold mt-8">Your rights</h2>
              <p>
                You can request a copy of your data, ask us to correct it, or
                ask us to delete it at any time. Email{" "}
                <a className="underline" href="mailto:info@quadbiketourism.com">
                  info@quadbiketourism.com
                </a>
                .
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
