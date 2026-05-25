import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import localFont from "next/font/local";
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
      <body className="min-h-full flex flex-col bg-white text-[rgba(10,10,10,0.85)]">
        {children}
      </body>
    </html>
  );
}
