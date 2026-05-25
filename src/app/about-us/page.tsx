import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Quad Bike Tourism is a premium UAE adventure operator offering private desert tours, quad biking, dune buggies, water sports, and city tours.",
  alternates: { canonical: "/about-us/" },
};

export default function AboutUsPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="py-20">
          <div className="container-site max-w-[900px]">
            <h1 className="text-[34px] sm:text-[44px] font-extrabold leading-tight mb-6">
              About Quad Bike Tourism
            </h1>
            <div className="space-y-5 text-[18px] leading-[32px] text-black/90">
              <p>
                Quad Bike Tourism is a UAE-based adventure operator built for
                travellers who want to skip the crowds and ride the desert on
                their own terms. Since our first sunrise tour, we&apos;ve guided
                guests from 80+ countries through private dune trails, sunset
                rides, family-friendly safaris and adrenaline-charged dune
                buggy convoys.
              </p>
              <p>
                Every booking includes free hotel pickup, free cancellation up
                to 24 hours ahead, and a certified safety guide on every ride.
                Whether you&apos;re after a 30-minute quad blast or a multi-day
                desert experience, we&apos;ll tailor it.
              </p>
              <h2 className="text-[26px] font-extrabold mt-10">Why ride with us</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Premium machines: 90cc to 450cc quads, Polaris RZRs, Can-Am Mavericks</li>
                <li>Private routes through the most photogenic parts of the desert</li>
                <li>Multilingual guides (English, Arabic, Russian, Hindi, Urdu)</li>
                <li>Full safety gear included — helmets, goggles, gloves</li>
                <li>Hotel pickup across Dubai, Sharjah and Ajman</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
