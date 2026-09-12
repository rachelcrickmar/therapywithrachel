"use client";

import { Gradient } from "modgrad";

/**
 * Subtle animated mesh gradient for the hero.
 * Adapted from https://github.com/M4cs/modgrad (MIT) with brand colors.
 */
export function HeroAtmosphere() {
  return (
    <Gradient
      theme="light"
      background="#ffffff"
      colors={[
        { color: "#eef6f1", x: 12, y: 8, size: 78 },
        { color: "#faf0f3", x: 88, y: 14, size: 72 },
        { color: "#e8f2ec", x: 62, y: 82, size: 70 },
        { color: "#f7eef1", x: 28, y: 55, size: 55 },
        { color: "#ffffff", x: 48, y: 42, size: 90 },
      ]}
      animate={{ speed: 0.9 }}
      grain={0.05}
      blur={32}
      seed={7}
      className="absolute inset-0"
      style={{ pointerEvents: "none" }}
    />
  );
}
