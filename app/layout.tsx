import type { Metadata } from "next";
import { Press_Start_2P, Tajawal, VT323 } from "next/font/google";
import "./globals.css";
import "../components/PixelBlast.css";
import InteractiveBackground from "@/components/InteractiveBackground";

const pressStartFont = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start",
});

const terminalFont = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-vt323",
});

const arabicFont = Tajawal({
  weight: ["400", "500", "700", "800"],
  subsets: ["arabic", "latin"],
  variable: "--font-tajawal",
});

export const metadata: Metadata = {
  title: "Famex | حلول رقمية تنمّي أعمالك",
  description:
    "نحوّل أفكارك إلى تجارب رقمية واضحة وعصرية تساعد مشروعك على النمو.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${pressStartFont.variable} ${terminalFont.variable} ${arabicFont.variable}`}
    >
      <body className="relative min-h-screen">
        <InteractiveBackground />
        {children}
      </body>
    </html>
  );
}
