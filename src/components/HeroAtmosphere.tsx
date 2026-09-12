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
        { color: "#cfe3d8", x: 12, y: 8, size: 78 },
        { color: "#f0d6e0", x: 88, y: 14, size: 72 },
        { color: "#b5d0c0", x: 62, y: 82, size: 70 },
        { color: "#e5c0cd", x: 28, y: 55, size: 58 },
        { color: "#e8f0eb", x: 48, y: 40, size: 85 },
      ]}
      animate={{ speed: 0.9 }}
      grain={0.06}
      blur={30}
      seed={7}
      className="absolute inset-0"
      style={{ pointerEvents: "none" }}
    />
  );
}
