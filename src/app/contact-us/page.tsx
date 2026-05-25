import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import ContactForm from "@/components/ContactForm";
import { Mail, MapPin, Phone } from "lucide-react";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Quad Bike Tourism — book a tour, plan a custom itinerary, or just say hi. We reply within an hour during operating hours.",
  alternates: { canonical: "/contact-us/" },
};

export default function ContactUsPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Full width map */}
        <section className="w-full">
          <iframe
            title="Quad Bike Tourism — United Arab Emirates"
            src="https://www.google.com/maps?q=United+Arab+Emirates&output=embed"
            width="100%"
            height="420"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="block w-full"
          />
        </section>

        {/* Content */}
        <section className="bg-brand-cream/60 py-16 sm:py-20">
          <div className="container-site max-w-[1100px]">
            <div className="flex items-start justify-between gap-6 border-b border-black/15 pb-4 mb-6">
              <h1 className="text-[28px] sm:text-[36px] font-extrabold leading-tight tracking-tight">
                GET IN TOUCH WITH US!
              </h1>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-full border border-black/20 hover:bg-black hover:text-white transition"
              >
                <InstagramIcon className="w-5 h-5" />
              </a>
            </div>

            <p className="text-[16px] sm:text-[17px] leading-[30px] text-black/80 mb-6">
              Are you having questions, suggestions or need our assistance?
              Contact us and our team will get in touch with you. Plan your
              tours with us and book your adventure now. Let&apos;s create
              unforgettable memories together!
            </p>

            <div className="border-t border-black/15 pt-8 mb-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <ContactInfo
                icon={<MapPin className="w-5 h-5 text-black" />}
                label="Address"
                value="United Arab Emirates"
              />
              <ContactInfo
                icon={<Mail className="w-5 h-5 text-black" />}
                label="Email"
                value={
                  <a
                    href="mailto:info@quadbiketourism.com"
                    className="hover:underline"
                  >
                    info@quadbiketourism.com
                  </a>
                }
              />
              <ContactInfo
                icon={<Phone className="w-5 h-5 text-black" />}
                label="Phone | WhatsApp"
                value={
                  <a
                    href="https://api.whatsapp.com/send?phone=923448959905"
                    className="hover:underline"
                  >
                    +923448959905
                  </a>
                }
              />
            </div>

            <ContactForm />
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}

function ContactInfo({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-brand-yellow flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <div className="font-extrabold text-[15px] leading-tight">{label}</div>
        <div className="text-[14px] text-black/75 mt-0.5">{value}</div>
      </div>
    </div>
  );
}
