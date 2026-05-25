import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CategoryGrid from "@/components/CategoryGrid";
import GoldenDunesSection from "@/components/GoldenDunesSection";
import SignaturePackages from "@/components/SignaturePackages";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import BookingCTA from "@/components/BookingCTA";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <CategoryGrid />
        <GoldenDunesSection />
        <SignaturePackages />
        <Testimonials />
        <FAQ />
        <BookingCTA />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
