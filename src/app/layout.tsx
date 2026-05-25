import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "Quad Bike Tourism — Premium Private Desert Tours in the UAE",
  description:
    "Book premium private desert tours, quad biking, dune buggies, and water sports across the UAE. Free cancellation and free pickup & drop-off.",
  other: {
    "p:domain_verify": "a9dfa325441e121ea3ad5bae7ca86e45",
  },
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
