import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FameX | حريفة الديجيتال وحلول الألعاب",
    short_name: "FameX",
    description: "بنحوّل أفكارك لمنتجات وتجارب ديجيتال طلقة تخلّي بيزنسك يسبق الكل ويبيع صح..",
    start_url: "/",
    display: "standalone",
    background_color: "#070d08",
    theme_color: "#070d08",
    icons: [
      {
        src: "/famex-symbol.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/famex-symbol.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/famex-symbol.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
