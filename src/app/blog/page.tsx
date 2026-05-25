import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Stories, guides and tips from the dunes — quad biking, desert safari, dune buggy adventures and more from Quad Bike Tourism.",
  alternates: { canonical: "/blog/" },
};

export default function BlogPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="py-20">
          <div className="container-site max-w-[900px]">
            <h1 className="text-[34px] sm:text-[44px] font-extrabold leading-tight mb-3">
              Blog
            </h1>
            <p className="text-[18px] leading-[32px] text-black/70 mb-10">
              Stories, guides and travel tips from the dunes.
            </p>
            <p className="text-black/60">
              Articles coming soon — check back for desert safari tips, ride
              guides, and behind-the-scenes stories.
            </p>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
