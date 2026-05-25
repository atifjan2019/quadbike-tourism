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
              <p>
                At Quad Bike Tourism, we strive to provide exceptional
                experiences for our customers. Please review the following
                policies regarding cancellations and refunds:
              </p>

              <h2 className="text-2xl font-extrabold pt-2">Cancellation Policy</h2>
              <p>
                We understand that plans may change. To accommodate this,
                cancellations can be made up to <strong>12 hours before the
                booked time</strong> free of charge. Unfortunately,
                cancellations made less than 12 hours prior to the scheduled
                booking will not be eligible for a refund.
              </p>

              <h2 className="text-2xl font-extrabold pt-2">Refund Policy</h2>
              <p>Refunds are available under the following conditions:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  If an activity or experience is canceled by Quad Bike Tourism
                  due to unforeseen circumstances, such as weather or safety
                  concerns, a full refund will be issued.
                </li>
                <li>
                  If an error occurs on our end during the booking process, we
                  will work with you to provide a refund or reschedule your
                  booking.
                </li>
              </ul>
              <p>
                <strong>Please note:</strong> For optional add-on activities
                such as quad bikes, buggies, or water sports, separate charges
                apply. These are non-refundable if canceled less than 12 hours
                before the activity.
              </p>

              <h2 className="text-2xl font-extrabold pt-2">Exclusions to Refunds</h2>
              <p>Certain services are non-refundable, including:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Personalized or customized packages that have been
                  specifically arranged to meet individual preferences.
                </li>
                <li>
                  Add-on activities or accessories that have already been used
                  or activated.
                </li>
              </ul>

              <h2 className="text-2xl font-extrabold pt-2">
                Cancelling Booked Activities
              </h2>
              <p>
                If you need to cancel your activity, please contact us
                immediately. While refunds may not be available for late
                cancellations, we will do our best to assist you in rescheduling
                your booking.
              </p>

              <h2 className="text-2xl font-extrabold pt-2">
                How to Request a Refund or Reschedule
              </h2>
              <p>
                If you require a refund or need to reschedule your booking,
                please{" "}
                <a className="underline" href="/contact-us/">
                  contact us
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
