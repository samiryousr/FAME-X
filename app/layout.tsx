import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Famex",
  description: "نقدم خدمات وحلولًا تناسب احتياجاتك.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
