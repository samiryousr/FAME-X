import React from "react";

export interface PixelIconProps {
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
      <path d="M7 2h10v1h2v1h1v2h1v1h1v7h-1v2h-1v1h-2v1h-1v1h-2v1h-1v2H9v-2H6v-1H4v-1H3v-2H2V6h1V4h2V3h2V2zm0 2H5v2H3v8h1v2h2v1h3v2h2v-2h4v-1h2v-1h1v-1h1V6h-1V5h-1V4h-2V3H7v1z" />
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
      <path d="M6 2h12v1h2v1h1v2h1v12h-1v2h-1v1h-2v1H6v-1H4v-1H3v-2H2V6h1V4h1V3h2V2zm0 2H4v2H3v12h1v2h2v1h12v-1h2v-2h1V6h-1V4h-2V3H6v1z" />
      <path d="M9 7h6v1h2v1h1v6h-1v1h-2v1H9v-1H7v-1H6V9h1V8h2V7zm0 2H8v6h1v1h6v-1h1V9h-1V8H9v1z" />
      <path d="M11 11h2v2h-2z" />
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
      <path d="M2 4h20v16H2V4zm2 2v12h16V6H4z" />
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
      <path d="M5 6h14v1h2v1h1v8h-1v2h-1v1h-3v-1h-1v-2h-1v-1H9v1H8v2H7v1H4v-1H3v-2H2V8h1V7h2V6zm0 2H4v8h2v-1h1v-2h2v-1h6v1h2v2h1v1h2V8h-1V7H5v1z" />
      <path d="M6 11h1v-1h1v1h1v1H8v1H7v-1H6v-1z" />
      <path d="M15 12h2v2h-2zm2-2h2v2h-2z" />
    </svg>
  );
}

/**
 * Pixel Joystick Icon
 * Authentic retro arcade stick icon.
 */
export function PixelJoystick({ className, size = 16 }: PixelIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M9 3h6v2h2v4h-2v2h-2v4h5v2h1v3H5v-3h1v-2h5v-4H9V9H7V5h2V3zm2 4h2V5h-2v2zM7 19v1h10v-1H7z" />
    </svg>
  );
}

/**
 * Pixel Retro Sparkle / Star Icon
 * Authentic 8-bit arcade sparkle star (replaces generic modern AI sparkle icons).
 */
export function PixelRetroSparkle({ className, size = 16 }: PixelIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M11 2h2v4h-2zM11 18h2v4h-2zM2 11h4v2H2zM18 11h4v2h-4zM9 9h6v6H9zM7 7h2v2H7zM15 7h2v2h-2zM7 15h2v2H7zM15 15h2v2h-2z" />
    </svg>
  );
}

/**
 * Pixel Terminal Icon
 * Authentic retro 8-bit command line terminal icon.
 */
export function PixelTerminal({ className, size = 16 }: PixelIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M2 3h20v18H2V3zm2 2v14h16V5H4zm3 3h2v2H7V8zm2 2h2v2H9v-2zm-2 2h2v2H7v-2zm7 2h6v2h-6v-2z" />
    </svg>
  );
}

/**
 * Pixel Palette Icon
 * Authentic 8-bit digital art palette icon.
 */
export function PixelPalette({ className, size = 16 }: PixelIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M8 2h8v1h3v2h2v4h1v7h-1v2h-2v2h-2v1h-3v1H8v-1H5v-2H3v-2H2V9h1V5h2V3h3V2zm0 2H5v2H4v5h1v2h1v2h2v1h2v1h3v-1h2v-1h2v-2h1v-3h-1V9h-1V7h-2V5h-2V4H8zm-1 3h2v2H7V7zm6 0h2v2h-2V7zm4 4h2v2h-2v-2zm-8 2h2v2H9v-2z" />
    </svg>
  );
}

/**
 * Pixel Camera Icon
 * Authentic 8-bit vintage camera icon.
 */
export function PixelCamera({ className, size = 16 }: PixelIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M8 4h8v2h3v2h3v12H2V8h3V6h3V4zm0 2H5v2H4v10h16V8h-1V6h-3V5H8v1zm4 3h4v1h2v6h-2v1h-4v-1h-2V9h2zm0 2h-1v4h1v1h2v-1h1v-4h-1v-1h-2v1z" />
    </svg>
  );
}
