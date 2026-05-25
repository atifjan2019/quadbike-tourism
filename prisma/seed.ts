import { PrismaClient, Status } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import path from "node:path";
import dotenv from "dotenv";

// Load env from .env.local (Next.js convention) then .env
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config();

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("Seed needs DIRECT_URL or DATABASE_URL in .env.local");
}
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const CATEGORIES = [
  { slug: "quad-bikes", name: "Quad Bikes", order: 1, image: "/images/250000-scaled.webp" },
  { slug: "buggy-tours", name: "Buggy Tours", order: 2, image: "/images/Dune-Buggy.webp" },
  { slug: "city-tours", name: "City Tours", order: 3, image: "/images/City-Tours.webp" },
  { slug: "water-sports", name: "Water Sports", order: 4, image: "/images/Water-Sports.webp" },
  { slug: "desert-safari", name: "Desert Safari", order: 5, image: "/images/desert-safari.webp" },
];

const TOURS = [
  // Quad bikes
  { slug: "quad-90cc-30min", title: "90CC Quad — 30 Minutes", cat: "quad-bikes", price: 150, dur: 30 },
  { slug: "quad-250cc-1hr", title: "250CC Quad — 1 Hour", cat: "quad-bikes", price: 300, dur: 60 },
  { slug: "quad-450cc-2hr", title: "450CC Quad — 2 Hours", cat: "quad-bikes", price: 550, dur: 120 },
  // Buggies
  { slug: "polaris-rzr-1000-1hr", title: "Polaris RZR 1000 — 1 Hour", cat: "buggy-tours", price: 800, dur: 60 },
  { slug: "can-am-x3-2hr", title: "Can-Am Maverick X3 — 2 Hours", cat: "buggy-tours", price: 1400, dur: 120 },
  // City
  { slug: "dubai-city-tour", title: "Dubai City Half-Day Tour", cat: "city-tours", price: 250, dur: 240 },
  { slug: "burj-khalifa-tour", title: "Burj Khalifa Entry + City Tour", cat: "city-tours", price: 450, dur: 300 },
  // Water
  { slug: "jet-ski-30min", title: "Jet Ski — 30 Minutes", cat: "water-sports", price: 250, dur: 30 },
  { slug: "flyboard-15min", title: "Flyboard — 15 Minutes", cat: "water-sports", price: 350, dur: 15 },
  // Safari
  { slug: "evening-desert-safari", title: "Evening Desert Safari + BBQ", cat: "desert-safari", price: 200, dur: 360 },
];

const TESTIMONIALS = [
  { name: "James Klark", country: "USA", rating: 5, message: "The best part of my trip to Dubai was the desert safari! Everything was perfect, from the drive to the camp in the 4x4 for dune bashing to the captivating cultural shows. This is a must-do adventure rather than merely an activity." },
  { name: "Jenny Martins", country: "London", rating: 5, message: "It was an exciting quad-biking adventure! It was an absolute thrill to zoom over the golden dunes when the wind blew in my face. The quad bike tourism team made the experience even better — I will most certainly return." },
  { name: "Karen Halbert", country: "Israel", rating: 5, message: "I'm hooked! These water sports are pure adrenaline rushes. The iconic views in the crystal-deep waters of Dubai are mesmerizing. I have never enjoyed my vacations this much." },
];

const FAQS = [
  { question: "DOES RIDING A QUAD BIKE REQUIRE ANY PRIOR EXPERIENCE?", answer: "You don't need any prior experience! Our expert guides give a safety briefing and instructions before the trip to ensure your comfort and safety.", order: 1 },
  { question: "IS IT SAFE TO QUAD BIKE?", answer: "Yes — every ride begins with a safety briefing and we provide helmets, goggles and protective gear.", order: 2 },
  { question: "WHAT ATTIRE IS APPROPRIATE FOR QUAD BIKING?", answer: "Closed-toe shoes, comfortable clothing you don't mind getting dusty, and sunglasses. Helmets and goggles are provided.", order: 3 },
  { question: "ARE THERE ANY GROUP DISCOUNTS AVAILABLE?", answer: "Yes. Groups of 6+ receive 10% off automatically; groups of 12+ get 15% off plus a complimentary refreshment package.", order: 4 },
  { question: "WHICH PAYMENT METHODS ARE ACCEPTED?", answer: "All major credit cards (Visa, Mastercard, Amex), Apple Pay, Google Pay, and cash on arrival.", order: 5 },
  { question: "WHAT OCCURS IN THE EVENT OF POOR WEATHER?", answer: "Safety first — if conditions make the desert unsafe, we reschedule at no cost or refund in full.", order: 6 },
];

async function main() {
  console.log("Seeding categories…");
  for (const c of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: c,
      create: c,
    });
  }

  const catBySlug = Object.fromEntries(
    (await prisma.category.findMany()).map((c) => [c.slug, c.id])
  );

  console.log("Seeding tours…");
  for (const t of TOURS) {
    await prisma.tour.upsert({
      where: { slug: t.slug },
      update: {},
      create: {
        slug: t.slug,
        title: t.title,
        shortDesc: `Book ${t.title.toLowerCase()} with free pickup, free cancellation, and instant confirmation.`,
        description: `<p>${t.title} — fully guided, all safety gear included. Suitable for ages 12+. Free hotel pickup and drop-off across Dubai.</p>`,
        priceFrom: t.price,
        durationMin: t.dur,
        maxGuests: 6,
        includes: ["Free Cancellation", "Free Pickup & Drop-off", "Instant Booking", "Safety Briefing"],
        categoryId: catBySlug[t.cat],
        status: Status.PUBLISHED,
        featured: ["quad-90cc-30min", "polaris-rzr-1000-1hr", "evening-desert-safari"].includes(t.slug),
      },
    });
  }

  console.log("Seeding testimonials…");
  for (const t of TESTIMONIALS) {
    const existing = await prisma.testimonial.findFirst({ where: { name: t.name } });
    if (!existing) await prisma.testimonial.create({ data: t });
  }

  console.log("Seeding FAQs…");
  for (const f of FAQS) {
    const existing = await prisma.fAQ.findFirst({ where: { question: f.question } });
    if (!existing) await prisma.fAQ.create({ data: f });
  }

  console.log("Seeding settings…");
  for (const [key, value] of Object.entries({
    whatsapp: "971500000000",
    currency: "AED",
    contactEmail: "info@quadbiketourism.com",
    contactPhone: "+971 50 000 0000",
    siteName: "Quad Bike Tourism",
  })) {
    await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  console.log("✓ Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
