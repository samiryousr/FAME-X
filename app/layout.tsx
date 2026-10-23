import type { Metadata } from "next";
import "./globals.css";
import "../components/PixelBlast.css";
import InteractiveBackground from "@/components/InteractiveBackground";

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
    <html lang="ar" dir="rtl">
      <body className="relative min-h-screen">
        <InteractiveBackground />
        {children}
      </body>
    </html>
  );
}
