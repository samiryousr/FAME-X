import type { Metadata, Viewport } from "next";
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

export const viewport: Viewport = {
  themeColor: "#070d08",
  colorScheme: "dark",
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://famex.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "FameX | حريفة الديجيتال وحلول الألعاب",
    template: "%s | FameX",
  },
  description:
    "بنحوّل أفكارك لمنتجات وتجارب ديجيتال طلقة تخلّي بيزنسك يسبق الكل ويبيع صح.. من غير لف ولا دوران.",
  icons: {
    icon: [
      { url: "/famex-symbol.svg", type: "image/svg+xml" },
      { url: "/famex-symbol.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/famex-symbol.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "FameX | حريفة الديجيتال وحلول الألعاب",
    description:
      "بنحوّل أفكارك لمنتجات وتجارب ديجيتال طلقة تخلّي بيزنسك يسبق الكل ويبيع صح.. من غير لف ولا دوران.",
    siteName: "FameX",
    url: siteUrl,
    images: [
      {
        url: "/famex-symbol.png",
        width: 656,
        height: 360,
        alt: "FameX Digital Players",
      },
    ],
    locale: "ar_EG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FameX | حريفة الديجيتال وحلول الألعاب",
    description:
      "بنحوّل أفكارك لمنتجات وتجارب ديجيتال طلقة تخلّي بيزنسك يسبق الكل ويبيع صح.. من غير لف ولا دوران.",
    images: ["/famex-symbol.png"],
  },
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
