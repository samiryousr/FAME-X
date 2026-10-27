"use client";

import dynamic from "next/dynamic";

const InteractiveBackground = dynamic(
  () => import("@/components/InteractiveBackground"),
  { ssr: false },
);

export default function InteractiveBackgroundLoader() {
  return <InteractiveBackground />;
}
