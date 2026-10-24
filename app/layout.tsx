import type { Metadata } from "next";
import { Changa, Press_Start_2P, Silkscreen, VT323 } from "next/font/google";
import "./globals.css";
import "../components/PixelBlast.css";
import InteractiveBackground from "@/components/InteractiveBackground";

const changaFont = Changa({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["arabic", "latin"],
  variable: "--font-changa",
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
      className={`${changaFont.variable} ${pressStartFont.variable} ${silkscreenFont.variable} ${terminalFont.variable}`}
    >
      <body className="relative min-h-screen">
        <InteractiveBackground />
        {children}
      </body>
    </html>
  );
}

