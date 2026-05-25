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
          <div className="container-site max-w-[900px]">
            <h1 className="text-[34px] sm:text-[44px] font-extrabold leading-tight mb-3">
              Privacy Policy
            </h1>
            <p className="text-sm text-black/60 mb-8">Last updated: 26 May 2026</p>

            <div className="space-y-6 text-[17px] leading-[30px] text-black/90">
              <p>
                At Quad Bike Tourism, we value your privacy and are committed
                to protecting your personal data. This privacy policy outlines
                how we collect, use, and safeguard your information when you
                use our services.
              </p>

              <h2 className="text-2xl font-extrabold pt-2">
                Information We Collect
              </h2>
              <p>We may collect personal information including, but not limited to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Your name, email address, and contact details.</li>
                <li>Payment details for booking transactions.</li>
                <li>
                  Information about your preferences and interests to enhance
                  your experience.
                </li>
              </ul>

              <h2 className="text-2xl font-extrabold pt-2">
                How We Use Your Information
              </h2>
              <p>The information collected by Quad Bike Tourism is used to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Process your bookings and payments.</li>
                <li>
                  Provide you with updates, promotions, and offers related to
                  our services.
                </li>
                <li>
                  Improve our website functionality and your overall
                  experience.
                </li>
              </ul>

              <h2 className="text-2xl font-extrabold pt-2">Cancellation Policy</h2>
              <p>
                We offer free cancellations up to 12 hours before your booked
                time. Cancellations made less than 12 hours before the booking
                time will not be eligible for a refund. Please ensure to review
                and adhere to this policy when making your bookings.
              </p>

              <h2 className="text-2xl font-extrabold pt-2">
                Additional Activities and Charges
              </h2>
              <p>
                Some of our services, such as quad biking, buggies, and water
                sports, may include optional add-ons or additional activities.
                These activities may incur separate charges, which will be
                clearly outlined during the booking process. Please review all
                charges carefully before confirming your booking.
              </p>

              <h2 className="text-2xl font-extrabold pt-2">Data Protection</h2>
              <p>
                We ensure that your personal data is secure and protected from
                unauthorized access. We use advanced security measures and
                maintain strict confidentiality.
              </p>

              <h2 className="text-2xl font-extrabold pt-2">
                Sharing of Information
              </h2>
              <p>
                Quad Bike Tourism does not sell, trade, or share your personal
                data with third parties unless required to provide the services
                you have requested or comply with legal obligations.
              </p>

              <h2 className="text-2xl font-extrabold pt-2">Cookies</h2>
              <p>
                Our website uses cookies to personalize your experience and
                gather analytics data. By using our website, you consent to the
                use of cookies as described in this policy.
              </p>

              <h2 className="text-2xl font-extrabold pt-2">Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access, update, or delete your personal information.</li>
                <li>Withdraw consent for any data processing activities.</li>
                <li>Lodge a complaint with relevant data protection authorities.</li>
              </ul>

              <h2 className="text-2xl font-extrabold pt-2">
                Changes to This Privacy Policy
              </h2>
              <p>
                Quad Bike Tourism reserves the right to update or modify this
                policy at any time. Changes will be effective immediately upon
                posting to this page.
              </p>

              <h2 className="text-2xl font-extrabold pt-2">Contact Us</h2>
              <p>
                If you have any questions or concerns about our privacy
                practices, please contact us at:
              </p>
              <p>
                Quad Bike Tourism
                <br />
                <a className="underline" href="mailto:info@quadbiketourism.com">
                  info@quadbiketourism.com
                </a>
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
