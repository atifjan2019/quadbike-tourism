import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { Mail, MapPin, Phone, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Quad Bike Tourism — WhatsApp, phone or email. We reply within an hour during operating hours.",
  alternates: { canonical: "/contact-us/" },
};

export default function ContactUsPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="py-20">
          <div className="container-site max-w-[900px]">
            <h1 className="text-[34px] sm:text-[44px] font-extrabold leading-tight mb-3">
              Contact Us
            </h1>
            <p className="text-[18px] leading-[32px] text-black/70 mb-10">
              Questions about a booking, group rates, or custom itineraries?
              We reply within an hour during operating hours.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white border border-black/10 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <MessageCircle className="w-6 h-6 text-[#25D366]" />
                  <h2 className="text-xl font-extrabold">WhatsApp</h2>
                </div>
                <a
                  href="https://api.whatsapp.com/send?phone=971500000000"
                  className="text-[17px] text-black hover:underline"
                >
                  +971 50 000 0000
                </a>
                <p className="text-sm text-black/60 mt-1">Fastest response</p>
              </div>

              <div className="bg-white border border-black/10 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Phone className="w-6 h-6 text-brand-yellow" />
                  <h2 className="text-xl font-extrabold">Phone</h2>
                </div>
                <a href="tel:+971500000000" className="text-[17px] text-black hover:underline">
                  +971 50 000 0000
                </a>
                <p className="text-sm text-black/60 mt-1">9am — 9pm GST</p>
              </div>

              <div className="bg-white border border-black/10 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Mail className="w-6 h-6 text-brand-yellow" />
                  <h2 className="text-xl font-extrabold">Email</h2>
                </div>
                <a
                  href="mailto:info@quadbiketourism.com"
                  className="text-[17px] text-black hover:underline"
                >
                  info@quadbiketourism.com
                </a>
                <p className="text-sm text-black/60 mt-1">Reply within 1 hour</p>
              </div>

              <div className="bg-white border border-black/10 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <MapPin className="w-6 h-6 text-brand-yellow" />
                  <h2 className="text-xl font-extrabold">Location</h2>
                </div>
                <p className="text-[17px] text-black">United Arab Emirates</p>
                <p className="text-sm text-black/60 mt-1">Dubai, Sharjah & Ajman pickup</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
