import type { Metadata, Viewport } from "next";
import { Rubik } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";

const SITE_URL = "https://www.quadbiketourism.com";

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800", "900"],
  display: "swap",
});

const mandatory = localFont({
  src: "../../public/fonts/Mandatory.otf",
  variable: "--font-mandatory",
  display: "swap",
  weight: "400",
  style: "normal",
});

const brillante = localFont({
  src: "../../public/fonts/Brillante-St.ttf",
  variable: "--font-brillante",
  display: "swap",
  weight: "400",
  style: "normal",
});

const DEFAULT_TITLE =
  "Desert Quad Biking in Dubai – Book Your Adventure Today!";
const DEFAULT_DESCRIPTION =
  "Book premium private desert tours, quad biking, dune buggies, and water sports across the UAE. Free cancellation and free pickup & drop-off.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: "%s | Quad Bike Tourism",
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: "Quad Bike Tourism",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Quad Bike Tourism",
    url: SITE_URL,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: "/images/buggy-hero.webp",
        width: 1200,
        height: 630,
        alt: "Premium desert buggy ready for adventure",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: ["/images/buggy-hero.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  other: {
    "p:domain_verify": "a9dfa325441e121ea3ad5bae7ca86e45",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F7C83B",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${rubik.variable} ${mandatory.variable} ${brillante.variable} h-full antialiased`}
    >
      <body
        className="min-h-full flex flex-col text-black"
        style={{ background: "rgba(227, 227, 227, 0.5)" }}
      >
        <Script
          id="ld-organization"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "TravelAgency",
              "@id": `${SITE_URL}/#organization`,
              name: "Quad Bike Tourism",
              url: SITE_URL,
              // Real business contact number shown on /contact-us (Phone | WhatsApp).
              telephone: "+923448959905",
              logo: `${SITE_URL}/images/buggy-desert-1.png`,
              image: `${SITE_URL}/images/buggy-hero.webp`,
              description: DEFAULT_DESCRIPTION,
              areaServed: { "@type": "Country", name: "United Arab Emirates" },
              address: {
                "@type": "PostalAddress",
                addressCountry: "AE",
              },
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer service",
                email: "info@quadbiketourism.com",
                availableLanguage: ["English", "Arabic"],
              },
            }),
          }}
        />
        {children}

        {/* Google Ads gtag.js */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-16785246862"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-16785246862');
          `}
        </Script>

        {/* Smartlook recorder + record options */}
        <Script id="smartlook-init" strategy="afterInteractive">
          {`
            window.smartlook||(function(d) {
              var o=smartlook=function(){ o.api.push(arguments)},h=d.getElementsByTagName('head')[0];
              var c=d.createElement('script');o.api=new Array();c.async=true;c.type='text/javascript';
              c.charset='utf-8';c.src='https://web-sdk.smartlook.com/recorder.js';h.appendChild(c);
            })(document);
            smartlook('init', '17306e080984e8a12fa14393f8540a8e0df5164c', { region: 'eu' });
            smartlook('record', { ips: true });
            smartlook('record', { numbers: true });
            smartlook('record', { emails: true });
          `}
        </Script>
      </body>
    </html>
  );
}
