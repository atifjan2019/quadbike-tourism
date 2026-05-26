/**
 * One-shot importer that pulls the 24 WooCommerce products from the
 * WordPress 2026-05-26 export and creates corresponding Tour records for the
 * booking system. Idempotent — re-running upserts by slug.
 *
 * Run with:  npx tsx prisma/import-woocommerce.ts
 */
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import path from "node:path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config();

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
if (!connectionString) throw new Error("DIRECT_URL or DATABASE_URL not set");
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

const UPLOADS = "https://quadbiketourism.com/wp-content/uploads/2024/11";
const UPLOADS12 = "https://quadbiketourism.com/wp-content/uploads/2024/12";

type WCProduct = {
  slug: string;
  title: string;
  priceFrom: number;
  categorySlug: "quad-bikes" | "buggy-tours" | "city-tours" | "water-sports" | "desert-safari";
  shortDesc: string;
  description: string; // HTML
  featuredImage: string;
  gallery: string[];
  seoTitle: string;
  seoDesc: string;
};

const PRODUCTS: WCProduct[] = [
  {
    slug: "desert-quad-bike-90cc",
    title: "Desert Quad Bike 90CC",
    priceFrom: 150,
    categorySlug: "quad-bikes",
    shortDesc:
      "Ride the golden dunes of Dubai on a beginner-friendly 90cc quad bike — easy controls, real desert thrill.",
    description: `<h2>Ride In the Dunes</h2><p>There is nothing like exploring the deserts in Dubai. Desert trips are unforgettable because of the wide golden sands, the excitement of navigating terrains, and the sense of freedom accompanying the riders in the middle of deserts. The desert quad bike 90CC is an ideal partner for such adventures. This quad bike is made for adventurers of all skill levels and provides unparalleled performance with easy-to-use features.</p><p>The Desert Quad Bike 90cc brings an exciting trip across the magnificent Dubai desert. Whether you're looking for quad biking near me, planning a thrilling quad bike safari in Dubai, or a beginner or an experienced rider ready to discover the beauty of the Dubai desert, this 90cc quad bike is a complete package of fun, safety, adventure, and thrill.</p><h3>Key Performance Features</h3><ul><li><strong>90cc engine</strong> — makes every ride thrilling.</li><li><strong>Fuel-efficient</strong> — guarantees hours of riding.</li><li><strong>Durable suspension</strong> — ensures a smooth ride.</li><li><strong>Bumpy tires</strong> — exceptional grip in soft sand.</li></ul><h3>Safety Features</h3><ul><li><strong>Speed limiter</strong> — perfect for family adventures.</li><li><strong>Dual disc brakes</strong> — reliable braking, ride fearlessly.</li><li><strong>Protective frame</strong> — safety during impacts.</li><li><strong>LED lights</strong> — effective in low visibility and evening rides.</li></ul><h3>Comforting Features</h3><ul><li>Automatic transmission — easy for beginners.</li><li>Wide wheelbase — stable, planted handling.</li><li>Comfortable seating for extended rides.</li></ul>`,
    featuredImage: `${UPLOADS}/90c-scaled.jpg`,
    gallery: [`${UPLOADS}/90-cc-e1732121098466.jpg`, `${UPLOADS}/90-ccc-2048x1365-1.jpg`],
    seoTitle: "Desert Quad Bike 90cc - Unleash Adventure in the Sand Dunes",
    seoDesc:
      "Explore the thrill of desert rides with our Desert quad bike 90cc. Perfect for adventure seekers, offering power, stability, and unforgettable experiences in the dunes.",
  },
  {
    slug: "desert-quad-bike-150cc",
    title: "Desert Quad Bike 150CC",
    priceFrom: 170,
    categorySlug: "quad-bikes",
    shortDesc:
      "Step up to a 150cc quad — more power, smoother dune climbs, ideal for confident first-timers and groups.",
    description: `<h2>Explore the 150cc Quad Bike Ride</h2><p>Get ready for the Desert quad biking Dubai adventure. Riding a Desert Quad Bike 150CC across Dubai's magnificent sands is an experience everyone should have, regardless of their preference for adventure or the outdoors. Quad biking is one of the most liked activities in Dubai, bringing a perfect combination of excitement, beautiful scenery, and unforgettable memories.</p><h3>What we bring for you</h3><p>The vast desert of Dubai provides the ideal setting for an exciting quad bike ride. This ride is worth every moment because of the excitement of navigating between dunes and the stunning scenery of the desert.</p><h3>Excitation &amp; Adventure</h3><p>The 150cc quad bike is designed to be as safe and enjoyable as possible for riders of all skill levels. The strong engine makes it easy to navigate the dunes with a supreme sense of freedom and thrill.</p><h3>Highlights</h3><ul><li><strong>Exhilarating dune rides</strong> — durable ATV through tall dunes.</li><li><strong>Safety first</strong> — skilled guides, full safety gear.</li><li><strong>Flexible options</strong> — short bursts or longer desert adventures.</li><li><strong>Latest fleet</strong> — perfect balance of power, control, and comfort.</li></ul>`,
    featuredImage: `${UPLOADS}/150-CC-Main.webp`,
    gallery: [
      `${UPLOADS}/150-CC-1.webp`,
      `${UPLOADS}/150-CC-2.webp`,
      `${UPLOADS}/150-CC-3.webp`,
    ],
    seoTitle: "Desert Quad Bike 150CC — Adventure on Four Wheels!",
    seoDesc:
      "Conquer the dunes with a Desert Quad Bike 150CC! Feel the thrill of speed, explore breathtaking desert landscapes, and enjoy an unforgettable ride.",
  },
  {
    slug: "desert-quad-bike-250cc",
    title: "Desert Quad Bike 250CC",
    priceFrom: 230,
    categorySlug: "quad-bikes",
    shortDesc:
      "Power, stability, and serious dune-climbing performance — the 250cc is built for adventurous riders.",
    description: `<h2>Unleash the Adventure</h2><p>The Desert Quad Bike 250cc is the best option for thrill-seekers in Dubai. With its strong engine, stylish design, and unmatched performance, this quad bike lets you experience Dubai's golden dunes like never before. Whether you're a beginner or expert rider, the 250cc delivers the ideal balance of excitement and fun.</p><h3>Why Choose the Desert Quad Bike 250cc?</h3><ul><li><strong>Strength &amp; efficiency</strong> — handle the toughest dunes with smooth control.</li><li><strong>Comfort design</strong> — advanced suspension, ergonomic seating, easy controls.</li><li><strong>Adventure meets power</strong> — strong torque for an unparalleled desert experience.</li><li><strong>Flexible packages</strong> — short rides to full-day expeditions.</li></ul><h3>Key Features</h3><ul><li>Strong 250cc engine for difficult landscapes.</li><li>Advanced suspension for smooth rough-terrain riding.</li><li>Modern safety equipment throughout.</li><li>Ergonomic design ideal for lengthy rides.</li></ul>`,
    featuredImage: `${UPLOADS}/Quad-Bike-250CC.webp`,
    gallery: [
      `${UPLOADS}/250-CC-2.webp`,
      `${UPLOADS}/250-CC-1.webp`,
      `${UPLOADS}/250-CC-3.webp`,
    ],
    seoTitle: "Desert Quad Bike 250CC — Power Through the Dunes!",
    seoDesc:
      "Unleash the power of a Desert Quad Bike 250CC! Ride through rugged dunes, feel the adrenaline rush, and explore the breathtaking desert scenery in style.",
  },
  {
    slug: "desert-quad-bike-450cc",
    title: "Desert Quad Bike 450CC",
    priceFrom: 330,
    categorySlug: "quad-bikes",
    shortDesc:
      "Top-tier 450cc beast — built for fast, fearless dune bashing across Dubai's iconic golden desert.",
    description: `<h2>Dominate the Golden Dunes of Dubai</h2><p>The Desert Quad Bike 450cc is the best option for adventurers and thrill-seekers who want to elevate their desert ride experience. Designed to tackle the most challenging rides in the dunes of Dubai's vast desert, it's an exhilarating experience for every level of rider.</p><h3>Why Choose Us?</h3><ul><li>Durable 450cc engine for riders who love power and speed.</li><li>Glides over rough terrain and steep dunes with confidence.</li><li>Complete package of excitement and comfort.</li><li>Ideal for dune bashing and exploring the deserts.</li></ul><h3>What Makes 450cc Stand Out</h3><ul><li><strong>Engine power</strong> — remarkable torque and speed for extreme dune bashing.</li><li><strong>Easy to handle</strong> — advanced suspension and handling tech.</li><li><strong>Durability</strong> — built to withstand harsh desert landscapes.</li></ul>`,
    featuredImage: `${UPLOADS}/450CC-1.webp`,
    gallery: [
      `${UPLOADS}/450CC-2.webp`,
      `${UPLOADS}/450CC-3.webp`,
      `${UPLOADS}/450CC-4.webp`,
    ],
    seoTitle: "Desert Quad Bike 450CC — Conquer the Dunes with Power!",
    seoDesc:
      "Experience the ultimate thrill with a Desert Quad Bike 450CC! Tackle tough dunes, enjoy high-speed adventures, and explore the desert like never before.",
  },
  {
    slug: "ktm-dirt-bikes-450cc",
    title: "KTM Dirt Bikes 450CC",
    priceFrom: 750,
    categorySlug: "quad-bikes",
    shortDesc:
      "Championship-grade KTM 450cc — agile, lightweight, and built for serious desert single-track riders.",
    description: `<p>KTM Dirt Bikes 450CC is built for off-road enthusiasts wanting to unleash their inner spirit. This powerful dirt bike ensures an exhilarating ride for racing through Dubai's golden dunes or crossing difficult desert trails. The KTM dirt bike 450cc is a combination of power, agility, and the latest technology, setting the bar for off-road experiences.</p><h3>Why Choose a KTM Dirt Bike 450cc?</h3><ul><li><strong>High performance</strong> — durable 450cc engine for sand and dirt.</li><li><strong>Classy design</strong> — ergonomic frame and excellent suspension.</li><li><strong>Adventure ready</strong> — adapts from peaceful cruises to adrenaline-rushing dune rides.</li></ul><h3>Key Features</h3><ul><li>Strong engine with great torque.</li><li>Lightweight design — optimal control and agility.</li><li>Advanced braking — superior stopping power.</li><li>Ergonomic seating for long rides.</li></ul>`,
    featuredImage: `${UPLOADS}/shipton-4-desert-turn.jpg`,
    gallery: [`${UPLOADS}/KTM-Dirt-Bike-3.webp`, `${UPLOADS}/KTM-Dirt-Bike-2.webp`],
    seoTitle: "Experience the Thrill with KTM Dirt Bikes 450CC",
    seoDesc:
      "Discover the power and performance of KTM Dirt Bikes 450CC. Perfect for adrenaline-filled off-road adventures, these bikes deliver unmatched durability and speed.",
  },
  {
    slug: "polaris-rzr-1000cc",
    title: "Polaris RZR 1000CC — 1 Seater",
    priceFrom: 550,
    categorySlug: "buggy-tours",
    shortDesc:
      "Solo Polaris RZR 1000cc dune buggy — premium safety, raw power, and total command of the dunes.",
    description: `<p>The Polaris RZR 1000cc is a premium quad buggy that combines comfort, safety, and excitement to lift your desert trip. Whether you're a beginner or an experienced rider, this ride promises an amazing quad bike adventure across Dubai's glorious dunes.</p><h3>Features</h3><ul><li>Powerful 1000cc engine — beast that easily rides in the dunes.</li><li>Advanced steering and suspension for seamless navigation.</li><li>Top-notch safety equipment and powerful brakes.</li><li>Ergonomic design with spacious seating for long desert travels.</li><li>Performs across soft, smooth and rough trails.</li></ul><h3>Why Choose the Polaris RZR 1000cc?</h3><ul><li><strong>Power &amp; performance</strong> — handles the most difficult dunes.</li><li><strong>Made for all adventurers</strong> — beginners and thrill-seekers alike.</li><li><strong>The ultimate experience</strong> — smooth blend of power and control.</li></ul>`,
    featuredImage: `${UPLOADS}/Polaris-1-Seat-1-3.webp`,
    gallery: [
      `${UPLOADS}/Polaris-1-Seat-1-4.webp`,
      `${UPLOADS}/Polaris-1-Seat-1-5.webp`,
      `${UPLOADS}/Polaris-1-Seat-1-1.webp`,
      `${UPLOADS}/Polaris-1-Seat-1-2.webp`,
    ],
    seoTitle: "Conquer the Terrain with Polaris RZR 1000CC",
    seoDesc:
      "Unleash adventure with the Polaris RZR 1000CC. Designed for rugged off-road performance, this powerful vehicle delivers exceptional speed, control, and durability.",
  },
  {
    slug: "polaris-rzr-1000cc-2-seater",
    title: "Polaris RZR 1000CC 2-Seater",
    priceFrom: 600,
    categorySlug: "buggy-tours",
    shortDesc:
      "Two-seater Polaris RZR 1000cc — share the thrill with a partner across Dubai's golden dunes.",
    description: `<p>Are you ready to feel the exhilaration of Dubai's famous desert like never before? The Polaris RZR 1000cc 2-seater is designed for high performance, power, and precision. This buggy ride will create memorable moments and an unforgettable adventurous off-road experience.</p><h3>Key Features</h3><ul><li><strong>High-performance engine</strong> — easily navigates the hardest dunes.</li><li><strong>Dual seating</strong> — ideal for taking a friend or loved one along.</li><li><strong>Durability</strong> — designed to resist extreme desert atmospheres.</li><li><strong>Safety guaranteed</strong> — seat belts, roll cages, advanced braking.</li></ul><h3>What to Expect</h3><ul><li>Thrilling rides with unmatched power and precision.</li><li>Beautiful panoramic desert views.</li><li>Expert guidance for beginners and experienced drivers.</li></ul>`,
    featuredImage: `${UPLOADS}/rzr-2-seater.webp`,
    gallery: [`${UPLOADS}/rzr-2-seats.webp`, `${UPLOADS}/rzr-2-seats-1.webp`, `${UPLOADS}/rzr-2-seats-2.webp`],
    seoTitle: "Polaris RZR 1000CC 2-Seater: Compact Off-Road Adventure",
    seoDesc:
      "Experience the thrill of off-road exploration with the Polaris RZR 1000CC 2-Seater. Designed for power, agility, and comfort, perfect for duo adventures.",
  },
  {
    slug: "polaris-rzr-1000cc-4-seater",
    title: "Polaris RZR 1000CC 4-Seater",
    priceFrom: 650,
    categorySlug: "buggy-tours",
    shortDesc:
      "Four-seater Polaris RZR — group dune buggy adventure for friends, families and corporate outings.",
    description: `<p>Dubai is well known for its rich landscapes, high towers, and busy lifestyle, yet its deserts' golden sands have a whole different kind of appeal. Take a ride on our Desert Dune Buggy to have an exciting adventure that blends the serene beauty of the desert with thrills. Make precious memories with your loved ones by riding our Polaris RZR 1000CC 4-Seater.</p><h3>Features of Polaris RZR 1000CC 4-Seat</h3><ul><li><strong>Strength &amp; efficiency</strong> — designed to be both comfortable and thrilling.</li><li><strong>Spacious</strong> — comfortably accommodates four people.</li><li><strong>Easy to control</strong> — full briefing and safety advice provided.</li></ul><h3>What to Expect</h3><ul><li>Warm welcome and full safety walk-through.</li><li>Expert-guided desert exploration with the best routes.</li><li>Exciting dune-bashing across steep points and valleys.</li><li>Plenty of stops for photos in spectacular scenery.</li></ul>`,
    featuredImage: `${UPLOADS}/Polaris-Rzr-4-Seats-4.webp`,
    gallery: [
      `${UPLOADS}/Polaris-Rzr-4-Seats-2.webp`,
      `${UPLOADS}/Polaris-Rzr-4-Seats-5.webp`,
      `${UPLOADS}/Polaris-Rzr-4-Seats-3.webp`,
      `${UPLOADS}/Polaris-Rzr-4-Seats-1.webp`,
    ],
    seoTitle: "Polaris RZR 1000CC 4-Seater: Ultimate Off-Road for Groups",
    seoDesc:
      "Take your adventures further with the Polaris RZR 1000CC 4-Seater. Perfect for group rides, this powerful off-road vehicle combines performance, space, and durability.",
  },
  {
    slug: "polaris-rzr-turbo-1800cc-4-seater",
    title: "Polaris RZR Turbo 1800cc 4-Seater",
    priceFrom: 850,
    categorySlug: "buggy-tours",
    shortDesc:
      "Turbocharged 1800cc Polaris RZR — top-tier 4-seater power for the ultimate desert thrill.",
    description: `<p>The Polaris RZR Turbo 1800cc 4-Seat Dune Buggy provides the ultimate off-road experience by combining comfort, safety, and power for the desert adventure. This dune buggy guarantees a memorable trip across the golden dunes — Dubai's breathtaking desert scenery.</p><h3>Power &amp; Performance</h3><p>The amazing turbo engine smoothly navigates the dunes. Its durable structure and detailed engineering let it easily ride in rough landscapes and steep inclinations.</p><h3>Comfort &amp; Safety</h3><p>4-seater dune buggy fits families and friends. Advanced safety belts, roll cages and ergonomic seats keep every rider safe. The excellent suspension absorbs shocks on the roughest terrain.</p><h3>Why It Stands Out</h3><ul><li><strong>Turbocharged</strong> — power and speed designed for the toughest dunes.</li><li><strong>Versatile design</strong> — relaxed cruise or thrilling speed ride.</li><li><strong>Explore confidently</strong> — precise handling and stability.</li></ul>`,
    featuredImage: `${UPLOADS}/Polaris-RZR-Turbo-2.webp`,
    gallery: [`${UPLOADS}/Polaris-RZR-Turbo-1.webp`],
    seoTitle: "Polaris RZR Turbo 1800CC 4-Seater: Power-Packed Off-Road Adventure",
    seoDesc:
      "Experience unmatched performance with the Polaris RZR Turbo 1800CC 4-Seater. Built for thrilling group adventures, incredible speed, control, and comfort.",
  },
  {
    slug: "canam-maverick-1700cc-2-seater",
    title: "Canam Maverick 1700CC 2-Seater",
    priceFrom: 850,
    categorySlug: "buggy-tours",
    shortDesc:
      "Premium Canam Maverick 1700cc 2-seater — turbo power, precision handling, perfect for couples.",
    description: `<p>Use the Canam Maverick 1700cc 2-Seater Dune Buggy to experience the excitement of Dubai's wide desert environment. Expertly designed for speed, comfort, and safety, it provides adventurers with an exhilarating ride.</p><h3>The Ultimate Adventure</h3><p>The powerful Canam Maverick 1700cc was created for the harsh deserts of Dubai. Unrivaled power from its turbocharged 1700cc engine lets you easily navigate difficult terrain. The two-seat arrangement provides a private yet thrilling experience for couples, friends, or any adventurous pair.</p><h3>Highlights</h3><ul><li>Desert dune buggy rides through Dubai's golden sands.</li><li>Speed and control for all skill levels.</li><li>Ideal for couples or close-friend duos.</li><li>Expert-guided tours along the best desert routes.</li><li>Superior safety features for peace of mind.</li></ul>`,
    featuredImage: `${UPLOADS}/Canam-2-Seats.webp`,
    gallery: [`${UPLOADS}/Canam-2.webp`],
    seoTitle: "Canam Maverick 1700CC 2-Seater: Thrilling Off-Road Performance",
    seoDesc:
      "Unleash the power of the Canam Maverick 1700CC 2-Seater for an exhilarating off-road experience. Built for speed and agility, ultimate desert adventure.",
  },
  {
    slug: "canam-maverick-1700cc-4-seater",
    title: "Canam Maverick 1700cc 4-Seater",
    priceFrom: 950,
    categorySlug: "buggy-tours",
    shortDesc:
      "Four-seater Canam Maverick 1700cc — premium turbo buggy built for unforgettable group desert trips.",
    description: `<p>The Canam Maverick 1700cc 4-Seater Dune Buggy is the best choice for an amazing desert experience. Made for thrill-seekers and families alike, its powerful 1700cc turbocharged engine delivers exceptional power for the rough deserts of Dubai.</p><p>This buggy's four seats make it a great vehicle for get-togethers with friends, family, or corporate team-building events. Experience the thrill of navigating the golden dunes and make enduring memories.</p><h3>Highlights</h3><ul><li><strong>Desert Safari Dune Buggy Dubai</strong> — explore stunning beauty and undiscovered paths.</li><li><strong>Sand dune buggy adventure</strong> — perfect blend of breathtaking and exhilarating rides.</li><li><strong>4-seater for groups</strong> — quad biking in Dubai with friends or family.</li></ul><h3>What to Expect</h3><ul><li>Comprehensive safety instruction before the ride.</li><li>Customized routes — relaxed touring or fast-paced.</li><li>Smooth, enjoyable experience from arrival to wrap-up.</li></ul>`,
    featuredImage: `${UPLOADS}/Canam-4.webp`,
    gallery: [`${UPLOADS}/canam-4-Seats.webp`, `${UPLOADS}/canam.webp`],
    seoTitle: "Experience the Power of Canam Maverick 1700cc 4-Seater",
    seoDesc:
      "Explore the Canam Maverick 1700cc 4-Seater, the ultimate ride for adventure and thrill seekers, built for rugged trails and family fun.",
  },
  {
    slug: "custom-power-buggy-3000cc-2-seater",
    title: "Custom Power Buggy 3000cc 2-Seater",
    priceFrom: 1850,
    categorySlug: "buggy-tours",
    shortDesc:
      "Top-tier 3000cc custom dune buggy — extreme power, premium comfort, and elite off-road performance.",
    description: `<p>Experience the exhilaration of Dubai's breathtaking desert scenery with the Custom Power Buggy 3000cc 2-seater. This two-seat beast redefines adventure with its unmatched power and precision, providing a memorable ride across the rolling dunes.</p><p>This specially designed buggy's enormous 3000cc engine provides enough power to easily navigate the roughest terrain and the steepest dunes. The Custom Power Buggy guarantees a worry-free and safe journey through Dubai's famous desert terrain with its strong roll cage, advanced braking system, and safe harnesses.</p><h3>Why It Stands Out</h3><ul><li>Engineered for desert adventure — unmatched power.</li><li>Eco-conscious — minimizes carbon footprint.</li><li>Designed for both thrill rides and serene scenery tours.</li></ul>`,
    featuredImage: `${UPLOADS}/DCB-3.webp`,
    gallery: [`${UPLOADS}/DCB-2.webp`, `${UPLOADS}/DCB-1.webp`],
    seoTitle: "Custom Power Buggy 3000cc 2-Seater: Pure Adventure!",
    seoDesc:
      "Experience the thrill of the Custom Power Buggy 3000cc 2-Seater, designed for ultimate speed, power, and off-road fun. Perfect for adventure seekers!",
  },
  {
    slug: "abu-dhabi-city-tour",
    title: "Abu Dhabi City Tour",
    priceFrom: 700,
    categorySlug: "city-tours",
    shortDesc:
      "Full guided tour of Abu Dhabi — Sheikh Zayed Mosque, Qasr Al Watan, Louvre, Corniche and more.",
    description: `<p>The special Abu Dhabi City Tour is an incredible adventure to Abu Dhabi, the splendid capital of the United Arab Emirates. This comprehensive tour offers a memorable exploration of the rich history and luxury of this wonderful city by combining culture, architectural wonders, and luxurious gatherings.</p><h3>Highlights</h3><ul><li><strong>Sheikh Zayed Grand Mosque</strong> — one of the biggest and most beautiful mosques in the world.</li><li><strong>Qasr Al Watan</strong> — the Presidential Palace, a profound look into UAE heritage.</li><li><strong>Louvre Abu Dhabi</strong> — landmark museum bridging Eastern and Western art.</li><li><strong>Corniche</strong> — gorgeous waterfront promenade with city skyline views.</li></ul><h3>What to Expect</h3><ul><li>Expert guided commentary on each landmark.</li><li>Comfortable air-conditioned transport, hotel pickup &amp; drop-off.</li><li>Plenty of photo stops at the best viewpoints.</li><li>Tailorable to architecture, culture, or lifestyle interests.</li></ul>`,
    featuredImage: `${UPLOADS}/cultural-village-abu-dhabi.jpg`,
    gallery: [
      `${UPLOADS}/sheikh-zayed-mosque.webp`,
      `${UPLOADS}/qasar-al-watal.jpg`,
      `${UPLOADS}/marina-mall-abu-dhabi.jpg`,
      `${UPLOADS}/louvre-museum-abu-dhabi.jpg`,
      `${UPLOADS}/heritage-village-abu-dhabi.jpg`,
      `${UPLOADS}/presenditial-palace.jpg`,
      `${UPLOADS}/ferrari-world-abu-dhabi.jpg`,
    ],
    seoTitle: "Abu Dhabi City Tour — Explore the Heart of the UAE!",
    seoDesc:
      "Embark on an unforgettable Abu Dhabi City Tour! Visit iconic landmarks, experience rich culture, and discover the city's blend of tradition and modernity.",
  },
  {
    slug: "dubai-city-tour",
    title: "Dubai City Tour",
    priceFrom: 500,
    categorySlug: "city-tours",
    shortDesc:
      "Comprehensive guided Dubai city tour — Burj Khalifa, Marina, Palm Jumeirah, Old Souks and more.",
    description: `<p>Dubai is a captivating city that combines cultural heritage, modern innovation, and luxurious experiences. With the help of our Dubai City Tour, you can explore this remarkable city's most famous sites, undiscovered treasures, and lively way of life.</p><h3>Discover the Best Sites</h3><ul><li><strong>Burj Khalifa</strong> — world's tallest building and skyline icon.</li><li><strong>Dubai Marina</strong> — luxury yachts, waterfront dining, glittering towers.</li><li><strong>Palm Jumeirah</strong> — palm-tree-shaped island, home to Atlantis.</li><li><strong>Dubai Mall</strong> — Dubai Aquarium, fountain show, world-class shopping.</li><li><strong>Al Fahidi &amp; Dubai Museum</strong> — historic Dubai and old wind towers.</li><li><strong>Gold &amp; Spice Souks</strong> — atmospheric traditional markets.</li><li><strong>Jumeirah Mosque, Dubai Frame &amp; Dubai Fountain</strong>.</li></ul><h3>Tour Highlights</h3><ul><li>Expert guides explain each landmark's history and significance.</li><li>Air-conditioned vehicles, seamless pickup/drop-off.</li><li>Flexible schedule to match historical or modern interests.</li><li>Plenty of photo opportunities.</li></ul>`,
    featuredImage: `${UPLOADS}/museum-of-the-future.jpeg`,
    gallery: [
      `${UPLOADS}/spice-market.jpg`,
      `${UPLOADS}/spice-market-2.jpg`,
      `${UPLOADS}/global-village.jpg`,
      `${UPLOADS}/gld-souq.jpg`,
      `${UPLOADS}/atlantis-the-palm.jpg`,
      `${UPLOADS}/gold-souq.jpg`,
      `${UPLOADS}/royal-atlantis.jpg`,
      `${UPLOADS}/dubai-mall.jpg`,
      `${UPLOADS}/burj-al-arab.jpg`,
      `${UPLOADS}/burj-khalifa.jpg`,
      `${UPLOADS}/dubai-frame.jpg`,
      `${UPLOADS}/Museum-of-future.jpg`,
    ],
    seoTitle: "Dubai City Tour — Discover the City of Wonders",
    seoDesc:
      "Explore Dubai's most iconic landmarks on a guided city tour — Burj Khalifa, Marina, Palm Jumeirah, the souks and more. Free hotel pickup and drop-off.",
  },
  {
    slug: "hatta-mountain-tour",
    title: "Hatta Mountain Tour",
    priceFrom: 600,
    categorySlug: "city-tours",
    shortDesc:
      "Escape to the Hajar Mountains — Hatta Dam kayaking, heritage village, and mountain trail adventure.",
    description: `<p>Hatta provides a welcoming relief from the busy city of Dubai, tucked away amid the rocky and pure beauty of the Hajar Mountains. With breathtaking scenery, rich history, and cultural heritage, Hatta is a paradise for adventurers, history admirers, and nature lovers.</p><h3>Highlights</h3><ul><li><strong>The Hatta Dam</strong> — blue waters surrounded by rocky peaks; kayaking and paddle boating.</li><li><strong>Hatta Heritage Village</strong> — 16th-century watchtowers, mosque and stone homes.</li><li><strong>Mountain biking, hiking and rock climbing</strong> — for every adventure level.</li><li><strong>Traditional Emirati cuisine</strong> — luqaimat, harees and machboos in scenic outdoor settings.</li></ul><h3>What to Expect</h3><ul><li>Air-conditioned drive across desert and mountainous landscapes.</li><li>Guided tours with optional adventure activities.</li><li>Family-friendly itinerary suitable for all ages.</li></ul>`,
    featuredImage: `${UPLOADS}/hatta.jpg`,
    gallery: [
      `${UPLOADS}/Hatta-Mountain.jpg`,
      `${UPLOADS}/hatta-lake-qvnp74367q7pa2afxlziaugmupkm1cwi5xb63x85cw.jpg`,
      `${UPLOADS}/hatta-dam-qvnp77uiz2cuki4zbnm0ktih8922w5bfifx4112ko0.jpg`,
      `${UPLOADS}/al-wadi-park-hatta-quqctik88c20qyg9zsmo75amkxw9rswx6h29cogilc.jpg`,
      `${UPLOADS}/park-quqctrym4oevz22mgwoxw2x8islxwry8jrl45g2kv4.jpg`,
      `${UPLOADS}/hatta-quqctn9f6i8gd09g8cnt1m3xjv93uafkv4bor29jq8.jpg`,
      `${UPLOADS}/hattta-quqctq2xr0cbbu5crvvor3ebc0v7hdqrvia56w5d7k.jpg`,
    ],
    seoTitle: "Hatta Mountain Tour — Explore Scenic Peaks and Valleys!",
    seoDesc:
      "Discover the beauty of Hatta on a guided mountain tour. Enjoy breathtaking views, adventurous hikes, and unforgettable experiences in the heart of nature.",
  },
  {
    slug: "parks-gardens-tour",
    title: "Parks & Gardens Tour",
    priceFrom: 600,
    categorySlug: "city-tours",
    shortDesc:
      "Discover Dubai's green havens — Miracle Garden, Garden Glow, Zabeel Park and Al Barsha Pond.",
    description: `<p>The Parks &amp; Gardens Tour invites you to explore Dubai's green sanctuaries, where nature and creativity blend to create overwhelming places. Whether you're a nature lover, a photography enthusiast, or just looking for a peaceful trip, this tour gives an unforgettable experience.</p><h3>Highlights</h3><ul><li><strong>Dubai Miracle Garden</strong> — world's largest natural flower garden with 50M+ flowers.</li><li><strong>Dubai Garden Glow</strong> — themed light, art and ice sculpture wonderland.</li><li><strong>Zabeel Park</strong> — home of the Dubai Frame, lake, cycling paths and mini-golf.</li><li><strong>Al Barsha Pond Park</strong> — circular fitness tracks and tranquil central pond.</li></ul><h3>What's Included</h3><ul><li>Guided tour with photographer-friendly stops.</li><li>Comfortable transport with smooth pickup and drop-off.</li><li>Family-friendly with kids' play areas.</li></ul>`,
    featuredImage: `${UPLOADS}/quranic-park.jpg`,
    gallery: [
      `${UPLOADS}/Parks-.jpg`,
      `${UPLOADS}/wadi-park.jpg`,
      `${UPLOADS}/quranic-park.jpg`,
      `${UPLOADS}/quranic-prk.jpg`,
      `${UPLOADS}/imgworldadventure.jpg`,
      `${UPLOADS}/dubai-dolphin.jpg`,
      `${UPLOADS}/iiimmmmgggworld-qvnp8iuggs56p08pp7xd1hniximfl0i0cwje0v4w0w.jpg`,
    ],
    seoTitle: "Parks & Gardens Tour — Relax in Nature's Beauty!",
    seoDesc:
      "Escape to serenity with a Parks & Gardens Tour! Stroll through lush greenery, enjoy vibrant flowers, and connect with nature in peaceful surroundings.",
  },
  {
    slug: "yamaha-jet-ski",
    title: "Yamaha Jet Ski — 2 Seater",
    priceFrom: 400,
    categorySlug: "water-sports",
    shortDesc:
      "Twin-seat Yamaha jet ski tour of Dubai Marina — Burj Al Arab, Palm Jumeirah views, certified guides.",
    description: `<p>The Yamaha 2-seater Jet Ski experience in Dubai is the best choice for water sports lovers looking for the ultimate adventure. This high-performance jet ski brings speed, control, and enjoyment in an exciting ride on the Arabian Gulf's open waters. Regardless of your experience level, it ensures a thrilling and unforgettable day.</p><h3>Features</h3><ul><li><strong>Power &amp; performance</strong> — silky design cuts through waves.</li><li><strong>Safety &amp; comfort</strong> — stable for tandem rides; great for beginners.</li><li><strong>Eco-friendly design</strong> — supports Dubai's sustainable tourism.</li></ul><h3>What to Expect</h3><ul><li>Full safety briefing and life jackets supplied.</li><li>Cruise past Palm Jumeirah, Burj Al Arab and Atlantis.</li><li>20–30 minute sessions, easy to extend.</li></ul>`,
    featuredImage: `${UPLOADS}/jetskiii-1356x1536-1.webp`,
    gallery: [`${UPLOADS}/jetski-2048x1302-1.webp`, `${UPLOADS}/jetski-1152x1536-1.webp`],
    seoTitle: "Yamaha Jet Ski Boat Ride — Speed and Adventure Await!",
    seoDesc:
      "Ride the waves with a Yamaha Jet Ski! Enjoy the thrill of speed, power, and fun as you explore the waters and make unforgettable memories.",
  },
  {
    slug: "jet-car-corvette",
    title: "Jet Car Corvette — 2 Seater",
    priceFrom: 800,
    categorySlug: "water-sports",
    shortDesc:
      "Jet-powered Corvette-style watercraft — luxury supercar styling meets thrilling sea-level speed.",
    description: `<p>Experience the Jet Car Corvette 2-seater, a development in water sports. This advanced watercraft blends the exhilarating thrill of water sports adventures with the elegant styling of a luxury sports car. The Jet Car Corvette ensures an unforgettable trip across Dubai's stunning coastline.</p><h3>Features</h3><ul><li><strong>Design</strong> — jet boat fused with luxury sports car styling.</li><li><strong>Superior performance</strong> — speed and agility for true hydro adventure.</li><li><strong>Comfort for two</strong> — ergonomic seating at high speeds.</li><li><strong>Stability &amp; safety</strong> — advanced construction with safety features.</li><li><strong>Sustainable engineering</strong> — eco-friendly design.</li></ul><h3>A Day on Jet Car Corvette</h3><ul><li>Safety training and walkthrough of controls.</li><li>Coastline tour with views of Burj Khalifa, Palm Jumeirah and Atlantis.</li><li>Combine with other hydro activities for a full day.</li></ul>`,
    featuredImage: `${UPLOADS}/IMG-20240825-WA0007.webp`,
    gallery: [
      `${UPLOADS}/IMG-20240825-WA0010.webp`,
      `${UPLOADS}/IMG-20240825-WA0015.webp`,
      `${UPLOADS}/IMG-20240825-WA0011.webp`,
      `${UPLOADS}/IMG-20240825-WA0012.webp`,
    ],
    seoTitle: "Jet Car Corvette — Drive the Future on Water!",
    seoDesc:
      "Experience the thrill of a Jet Car Corvette ride! Glide over the water with style, speed, and the ultimate adrenaline rush in a supercar-like watercraft.",
  },
  {
    slug: "banana-boat",
    title: "Banana Boat Ride",
    priceFrom: 500,
    categorySlug: "water-sports",
    shortDesc:
      "Classic group banana boat ride — high-speed bumps, splashes and laughter on Dubai's coast.",
    description: `<p>The banana boat trip is the ideal water sport for people who enjoy adrenaline rush, teamwork, and a little laughter. Families, friends, and fun seekers will love this exhilarating ride, which delivers a memorable experience on Dubai's crystal-clear waters.</p><h3>What to Expect</h3><ul><li>Up to six riders per banana boat — perfect for groups.</li><li>Towed by a powerful speedboat past iconic landmarks.</li><li>Suitable for all ages with full safety briefing.</li></ul><h3>Why You'll Love It</h3><ul><li>Combines speed, teamwork, and non-stop laughter.</li><li>Stunning coastal views of Palm Jumeirah and Burj Al Arab.</li><li>Quick, easy and affordable group activity.</li></ul>`,
    featuredImage: `${UPLOADS}/Banana-Boat-Main-1-jpg.webp`,
    gallery: [`${UPLOADS}/Banana-Boat-3-1-jpg.webp`, `${UPLOADS}/Banana-Boat-4-1-jpg.webp`],
    seoTitle: "Banana Boat Ride — Fun-Filled Water Adventure Awaits!",
    seoDesc:
      "Enjoy a thrilling banana boat ride with friends or family! Glide across the water, feel the waves, and experience nonstop laughter and excitement in Dubai.",
  },
  {
    slug: "flyboard-in-dubai",
    title: "Flyboard in Dubai",
    priceFrom: 400,
    categorySlug: "water-sports",
    shortDesc:
      "Defy gravity — strap into a flyboard and soar above Dubai's coastal waters like a superhero.",
    description: `<p>Experience the ultimate thrill in water sports in Dubai — flyboarding. Flyboarding combines the latest technology with thrills to let you glide above the water like a superhero. One of the most popular extreme water activities in Dubai, it offers an unparalleled chance to experience flight while taking in breathtaking Arabian Gulf views.</p><h3>What to Expect</h3><ul><li>Safety briefing and gear-up before launch.</li><li>Tandem-tethered to a jet ski for water-powered propulsion.</li><li>20–30 minute sessions, suitable for first-timers.</li><li>Optional acrobatics — spins, dives and flips as you advance.</li></ul><h3>Why Flyboarding</h3><ul><li>Unlike any other water sport — water meets flight.</li><li>Certified instructors for safe, smooth progression.</li><li>Perfect for birthdays, anniversaries and bucket-list adventures.</li></ul>`,
    featuredImage: `${UPLOADS}/Flyboard-Main-jpg.webp`,
    gallery: [
      `${UPLOADS}/Flyboard-5-jpg.webp`,
      `${UPLOADS}/Flyboard-4-jpg.webp`,
      `${UPLOADS}/Flyboard-3-jpg.webp`,
      `${UPLOADS}/Flyboard-2-jpg.webp`,
    ],
    seoTitle: "Flyboard in Dubai — Elevate Your Adventure Today!",
    seoDesc:
      "Defy gravity with flyboarding in Dubai! Glide, soar, and dive above crystal-clear waters while enjoying the stunning skyline for an unforgettable experience.",
  },
  {
    slug: "parasailing",
    title: "Parasailing",
    priceFrom: 450,
    categorySlug: "water-sports",
    shortDesc:
      "Fly above the Arabian Gulf — parasailing with breathtaking views of Dubai's iconic skyline.",
    description: `<p>Fly far over the Arabian Gulf and enjoy the breathtaking views of Dubai's famous skyline with parasailing. One of the most well-liked water sports in the city, it provides a unique fusion of excitement and peace, ideal for thrill-seekers and those who want to unwind while taking in stunning surroundings.</p><h3>What to Expect</h3><ul><li>Full safety briefing and pre-flight setup.</li><li>Gentle lift as the speedboat accelerates.</li><li>Float above the water for 10–15 minutes.</li><li>Soft landing on the boat or splash-down into the water.</li></ul><h3>Why You'll Love It</h3><ul><li>A calm, scenic adventure with adrenaline as a bonus.</li><li>Solo or tandem flights available.</li><li>Perfect photo opportunity above Dubai's coastline.</li></ul>`,
    featuredImage: `${UPLOADS}/IMG-20240916-WA0037-quqcucn2b1772h8l45mqexpdl9s0m48bylxspj7x28.webp`,
    gallery: [
      `${UPLOADS}/IMG-20240916-WA0039-qvnp3ulchfquyt13zp755640ljnqb6y21rrh4c2cyo.webp`,
      `${UPLOADS}/IMG-20240916-WA0040.webp`,
    ],
    seoTitle: "Parasailing in Dubai — Soar Above Stunning Views!",
    seoDesc:
      "Experience the thrill of parasailing in Dubai. Fly high over breathtaking waters and enjoy stunning skyline views for an unforgettable adventure.",
  },
  {
    slug: "evening-desert-safari",
    title: "Evening Desert Safari",
    priceFrom: 150,
    categorySlug: "desert-safari",
    shortDesc:
      "Sunset desert safari with dune bashing, camel ride, BBQ dinner and traditional Emirati entertainment.",
    description: `<p>The evening desert safari is one of the best ways to experience the Arabian Desert's enchantment. This exhilarating trip is a must-try for tourists looking to combine excitement and calmness, blending the finest characteristics of Dubai desert safari tours with attractive views of the golden dunes.</p><h3>The Tour</h3><ul><li>Comfortable 4x4 pickup from your destination.</li><li>Thrilling dune-bashing through rolling dunes.</li><li>Photo stops at golden-hour sunset.</li><li>Traditional Bedouin-style desert camp.</li></ul><h3>Cultural Highlights</h3><ul><li>Arabian welcome with coffee and dates.</li><li>Camel rides, henna painting, traditional Emirati clothing.</li><li>BBQ dinner under the stars.</li><li>Live cultural shows.</li></ul><h3>Why Choose the Evening Safari</h3><ul><li>Cooler temperatures, romantic atmosphere.</li><li>Stunning sunsets and candlelit dinners.</li><li>Family-friendly with diverse activity options.</li></ul>`,
    featuredImage: `${UPLOADS12}/WhatsApp-Image-2024-07-15-at-13.22.43_c1144bb3.jpg`,
    gallery: [
      `${UPLOADS12}/buffet-dinner.jpg`,
      `${UPLOADS12}/camel-riding.jpg`,
      `${UPLOADS12}/belly-dancing.jpg`,
    ],
    seoTitle: "Experience Evening Desert Safari with Quad Bike Tourism",
    seoDesc:
      "Enjoy an unforgettable evening desert safari with thrilling rides, stunning sunset views, and a dose of adventure. Book your journey with Quad Bike Tourism!",
  },
  {
    slug: "morning-desert-safari",
    title: "Morning Desert Safari",
    priceFrom: 750,
    categorySlug: "desert-safari",
    shortDesc:
      "Crisp early-morning desert escape — dune bashing, camel riding, sandboarding and panoramic photo stops.",
    description: `<p>A morning desert safari is ideal for exploring the Arabian Desert's matchless charm. This exhilarating journey provides the perfect balance of activities, stunning landscapes, and peaceful moments, resulting in lifetime memories.</p><h3>Thrills on the Golden Dunes</h3><ul><li>Dune bashing in a 4x4 with a professional guide.</li><li>Optional quad biking or sandboarding.</li><li>Cool morning temperatures for outdoor comfort.</li></ul><h3>Beauty &amp; Tradition</h3><ul><li>Golden sunrise tones — ideal for photography.</li><li>Camel ride — Bedouin-style desert transport.</li><li>Henna painting and falconry experiences at some camps.</li></ul><h3>Refreshments</h3><ul><li>Light breakfast or refreshments in the middle of the desert.</li><li>Traditional Arabic tea and coffee.</li></ul>`,
    featuredImage: `${UPLOADS12}/WhatsApp-Image-2024-07-15-at-13.04.55_fa0d3050.jpg`,
    gallery: [
      `${UPLOADS12}/buffet-dinner.jpg`,
      `${UPLOADS12}/camel-riding.jpg`,
      `${UPLOADS12}/belly-dancing.jpg`,
      `${UPLOADS12}/WhatsApp-Image-2024-07-15-at-13.22.43_c1144bb3.jpg`,
    ],
    seoTitle: "Unforgettable Morning Desert Safari Tour — Adventure Awaits!",
    seoDesc:
      "Experience a thrilling Morning Desert Safari tour with dune bashing, camel rides, and more. Start your day with an unforgettable adventure!",
  },
  {
    slug: "afternoon-desert-safari",
    title: "Afternoon Desert Safari",
    priceFrom: 750,
    categorySlug: "desert-safari",
    shortDesc:
      "Golden-afternoon safari with dune bashing, camel rides, sandboarding and a stunning sunset finale.",
    description: `<p>The afternoon desert safari blends the finest characteristics of Dubai desert safari tours with the attractive views of the golden dunes. Under the gentle afternoon sun, the stretch of golden sand is a welcoming sight that sets the mood for the thrill ahead.</p><h3>Highlights</h3><ul><li><strong>Dune bashing</strong> — exhilarating 4x4 ride over rolling dunes.</li><li><strong>Quad biking and sandboarding</strong> — optional extras.</li><li><strong>Golden hour photography</strong> — perfect dune lighting.</li></ul><h3>Emirati Culture</h3><ul><li>Traditional Bedouin-style desert camp.</li><li>Welcome with Arabic coffee, sweet dates.</li><li>Camel rides, henna art, dress in traditional Emirati clothing.</li></ul>`,
    featuredImage: `${UPLOADS12}/buffet-dinner.jpg`,
    gallery: [`${UPLOADS12}/WhatsApp-Image-2024-07-15-at-13.22.43_c1144bb3.jpg`],
    seoTitle: "Experience the Thrill of an Afternoon Desert Safari Today!",
    seoDesc:
      "Embark on an unforgettable afternoon desert safari. Enjoy dune bashing, camel rides, and breathtaking sunset views. Book your adventure now!",
  },
];

const DEFAULT_INCLUDES = [
  "Free Cancellation",
  "Free Pickup & Drop-off",
  "Instant Booking",
  "Safety Gear Included",
];

async function main() {
  console.log(`Importing ${PRODUCTS.length} WooCommerce products as Tours…`);

  // Resolve category IDs upfront
  const categorySlugs = Array.from(new Set(PRODUCTS.map((p) => p.categorySlug)));
  const categoryMap = new Map<string, string>();
  for (const slug of categorySlugs) {
    const cat = await prisma.category.findUnique({ where: { slug } });
    if (!cat) {
      throw new Error(
        `Category '${slug}' not found. Run \`npm run db:seed\` first to create base categories.`,
      );
    }
    categoryMap.set(slug, cat.id);
  }

  let created = 0;
  let updated = 0;

  for (const p of PRODUCTS) {
    const categoryId = categoryMap.get(p.categorySlug)!;
    const data = {
      title: p.title,
      slug: p.slug,
      shortDesc: p.shortDesc,
      description: p.description,
      featuredImage: p.featuredImage,
      gallery: p.gallery,
      priceFrom: p.priceFrom,
      durationMin: null,
      maxGuests: null,
      includes: DEFAULT_INCLUDES,
      categoryId,
      status: "PUBLISHED" as const,
      featured: false,
      seoTitle: p.seoTitle,
      seoDesc: p.seoDesc,
    };

    const existing = await prisma.tour.findUnique({ where: { slug: p.slug } });
    if (existing) {
      await prisma.tour.update({ where: { slug: p.slug }, data });
      updated++;
      console.log(`  ↻ updated  ${p.slug}`);
    } else {
      await prisma.tour.create({ data });
      created++;
      console.log(`  ✓ created  ${p.slug}`);
    }
  }

  console.log(`Done. Created: ${created}, Updated: ${updated}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
