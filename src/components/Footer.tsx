import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-brand-ink text-white/80 mt-auto">
      <div className="container-site py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="font-display text-2xl text-brand-yellow leading-none">
              QB
            </span>
            <span className="text-white font-extrabold tracking-wide leading-tight">
              QUAD BIKE
              <br />
              <span className="text-brand-yellow">TOURISM</span>
            </span>
          </Link>
          <p className="mt-5 text-[14px] leading-[26px] text-white/70 max-w-[280px]">
            Premium private desert tours, quad biking, dune buggies, and water
            sports across the United Arab Emirates. Trusted by adventurers
            from 80+ countries.
          </p>
        </div>

        <div>
          <h4 className="text-brand-yellow text-[14px] font-bold uppercase tracking-[2px] mb-5">
            Pages
          </h4>
          <ul className="space-y-3 text-[15px]">
            <li>
              <Link href="/" className="hover:text-brand-yellow">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about-us/" className="hover:text-brand-yellow">
                About
              </Link>
            </li>
            <li>
              <Link href="/#booking" className="hover:text-brand-yellow">
                Booking
              </Link>
            </li>
            <li>
              <Link href="/contact-us/" className="hover:text-brand-yellow">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/blog/" className="hover:text-brand-yellow">
                Blog
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-brand-yellow text-[14px] font-bold uppercase tracking-[2px] mb-5">
            Legal
          </h4>
          <ul className="space-y-3 text-[15px]">
            <li>
              <Link href="/privacy-policy/" className="hover:text-brand-yellow">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/refund-returns/" className="hover:text-brand-yellow">
                Return
              </Link>
            </li>
            <li>
              <Link href="/terms-conditions/" className="hover:text-brand-yellow">
                Terms
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-brand-yellow text-[14px] font-bold uppercase tracking-[2px] mb-5">
            Contact
          </h4>
          <ul className="space-y-4 text-[15px]">
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-brand-yellow shrink-0 mt-0.5" />
              <span>
                Quad Bike Tourism
                <br />
                United Arab Emirates
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-brand-yellow shrink-0 mt-0.5" />
              <a
                href="mailto:info@quadbiketourism.com"
                className="hover:text-brand-yellow"
              >
                info@quadbiketourism.com
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-brand-yellow shrink-0 mt-0.5" />
              <a href="tel:+971500000000" className="hover:text-brand-yellow">
                +971 50 000 0000
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-site py-5 text-center text-[13px] text-white/60 tracking-[2px] uppercase">
          ©Copyright Quad Bike Tourism {new Date().getFullYear()} - Made with{" "}
          <span className="text-red-500" aria-label="love">❤</span> in the UAE by{" "}
          <a
            href="http://webspires.com.pk/?utm_source=quadbike"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-brand-yellow"
          >
            Webspires
          </a>
        </div>
      </div>
    </footer>
  );
}
