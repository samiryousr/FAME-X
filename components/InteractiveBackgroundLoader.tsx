"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const InteractiveBackground = dynamic(
  () => import("@/components/InteractiveBackground"),
  { ssr: false },
);

export default function InteractiveBackgroundLoader() {
  const pathname = usePathname();

  // Admin pages have a dedicated light dashboard theme and don't need the heavy public canvas loop
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return <InteractiveBackground />;
}
