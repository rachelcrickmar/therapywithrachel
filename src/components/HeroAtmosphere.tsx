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
      background="#faf9f7"
      colors={[
        { color: "#d7e8df", x: 12, y: 8, size: 78 },
        { color: "#f3d0db", x: 88, y: 14, size: 72 },
        { color: "#b8d4c4", x: 62, y: 82, size: 70 },
        { color: "#e8c4d0", x: 28, y: 55, size: 55 },
      ]}
      animate={{ speed: 0.45 }}
      grain={0.07}
      blur={28}
      seed={7}
      className="absolute inset-0"
      style={{ pointerEvents: "none" }}
    />
  );
}
