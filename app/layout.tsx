import type { Metadata } from "next";
import {
  IBM_Plex_Sans_Arabic,
  Press_Start_2P,
  Silkscreen,
  VT323,
} from "next/font/google";
import "./globals.css";
import "../components/PixelBlast.css";
import InteractiveBackgroundLoader from "@/components/InteractiveBackgroundLoader";

const arabicFont = IBM_Plex_Sans_Arabic({
  weight: ["400", "500", "600", "700"],
  subsets: ["arabic", "latin"],
  variable: "--font-ibm-plex-sans-arabic",
});

const pressStartFont = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start",
});

const silkscreenFont = Silkscreen({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-silkscreen",
});

const terminalFont = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-vt323",
});

export const metadata: Metadata = {
  title: "FameX | حريفة الديجيتال وحلول الألعاب",
  description:
    "بنحوّل أفكارك لمنتجات وتجارب ديجيتال طلقة تخلّي بيزنسك يسبق الكل ويبيع صح.. من غير لف ولا دوران.",
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
      className={`${arabicFont.variable} ${pressStartFont.variable} ${silkscreenFont.variable} ${terminalFont.variable}`}
    >
      <body className="relative min-h-screen">
        <InteractiveBackgroundLoader />
        {children}
      </body>
    </html>
  );
}
