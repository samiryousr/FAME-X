import React from "react";

interface PixelIconProps {
  className?: string;
  size?: number;
}

/**
 * Pixel WhatsApp Icon
 * Accurate pixel-art rendition of the official WhatsApp speech bubble with phone handset.
 */
export function PixelWhatsApp({ className, size = 16 }: PixelIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      {/* Speech bubble outline */}
      <path d="M7 2h10v1h2v1h1v2h1v1h1v7h-1v2h-1v1h-2v1h-1v1h-2v1h-1v2H9v-2H6v-1H4v-1H3v-2H2V6h1V4h2V3h2V2zm0 2H5v2H3v8h1v2h2v1h3v2h2v-2h4v-1h2v-1h1v-1h1V6h-1V5h-1V4h-2V3H7v1z" />
      {/* Telephone handset */}
      <path d="M8 8h3v2H9v1h1v1h1v1h2v1h1v-1h1v-1h2v3h-2v-1h-1v1h-2v-1h-1v-1h-1v-1H9v-1H8v-1H7V8h1z" />
    </svg>
  );
}

/**
 * Pixel Instagram Icon
 * Accurate pixel-art rendition of the official Instagram camera contour, center lens, and flash dot.
 */
export function PixelInstagram({ className, size = 16 }: PixelIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      {/* Outer rounded-rect frame */}
      <path d="M6 2h12v1h2v1h1v2h1v12h-1v2h-1v1h-2v1H6v-1H4v-1H3v-2H2V6h1V4h1V3h2V2zm0 2H4v2H3v12h1v2h2v1h12v-1h2v-2h1V6h-1V4h-2V3H6v1z" />
      {/* Center camera lens */}
      <path d="M9 7h6v1h2v1h1v6h-1v1h-2v1H9v-1H7v-1H6V9h1V8h2V7zm0 2H8v6h1v1h6v-1h1V9h-1V8H9v1z" />
      {/* Inner lens center */}
      <path d="M11 11h2v2h-2z" />
      {/* Flash dot top-right */}
      <path d="M17 5h2v2h-2z" />
    </svg>
  );
}

/**
 * Pixel Email Icon
 * Accurate pixel-art rendition of an official envelope with sharp pixel fold.
 */
export function PixelEmail({ className, size = 16 }: PixelIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      {/* Envelope outer border */}
      <path d="M2 4h20v16H2V4zm2 2v12h16V6H4z" />
      {/* Envelope fold V-shape */}
      <path d="M4 6h2v2h2v2h2v2h4v-2h2v-2h2V6h2v2h-2v2h-2v2h-2v2h-4v-2H8v-2H6v-2H4V6z" />
    </svg>
  );
}

/**
 * Pixel Gamepad Icon
 * Professional retro arcade controller icon to replace raw emojis.
 */
export function PixelGamepad({ className, size = 16 }: PixelIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      {/* Controller body contour */}
      <path d="M5 6h14v1h2v1h1v8h-1v2h-1v1h-3v-1h-1v-2h-1v-1H9v1H8v2H7v1H4v-1H3v-2H2V8h1V7h2V6zm0 2H4v8h2v-1h1v-2h2v-1h6v1h2v2h1v1h2V8h-1V7H5v1z" />
      {/* D-Pad cross */}
      <path d="M6 11h1v-1h1v1h1v1H8v1H7v-1H6v-1z" />
      {/* Action buttons (B / A) */}
      <path d="M15 12h2v2h-2zm2-2h2v2h-2z" />
    </svg>
  );
}
