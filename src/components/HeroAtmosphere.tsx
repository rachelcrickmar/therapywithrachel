"use client";

import { useEffect, useRef } from "react";

/**
 * Soft ambient hero background: continuous slow drift + desktop mouse parallax.
 */
export function HeroAtmosphere() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(pointer: fine)");

    let raf = 0;
    let start = performance.now();
    let mouseX = 0;
    let mouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const apply = (ax: number, ay: number, mx: number, my: number) => {
      root.style.setProperty("--drift-x", `${ax.toFixed(2)}px`);
      root.style.setProperty("--drift-y", `${ay.toFixed(2)}px`);
      root.style.setProperty("--parallax-x", `${mx.toFixed(2)}px`);
      root.style.setProperty("--parallax-y", `${my.toFixed(2)}px`);
      root.style.setProperty(
        "--glow-shift",
        `${(50 + Math.sin(ax / 30) * 12).toFixed(1)}%`,
      );
    };

    const tick = (now: number) => {
      const t = (now - start) / 1000;

      if (reduceMotion.matches) {
        apply(0, 0, 0, 0);
        return;
      }

      const ambientX = Math.sin(t * 0.28) * 36 + Math.sin(t * 0.11) * 14;
      const ambientY = Math.cos(t * 0.22) * 28 + Math.cos(t * 0.09) * 10;

      currentMouseX += (mouseX - currentMouseX) * 0.07;
      currentMouseY += (mouseY - currentMouseY) * 0.07;

      apply(ambientX, ambientY, currentMouseX, currentMouseY);
      raf = requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      if (reduceMotion.matches || !finePointer.matches) return;
      const rect = root.getBoundingClientRect();
      const nx = (event.clientX - rect.left) / rect.width - 0.5;
      const ny = (event.clientY - rect.top) / rect.height - 0.5;
      mouseX = nx * 42;
      mouseY = ny * 30;
    };

    const onLeave = () => {
      mouseX = 0;
      mouseY = 0;
    };

    const section = root.closest("section");
    section?.addEventListener("pointermove", onMove);
    section?.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      section?.removeEventListener("pointermove", onMove);
      section?.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="hero-atmosphere pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      <div className="paper-grain absolute inset-0 z-[1]" />
      <div className="hero-parallax-layer absolute inset-[-12%]">
        <div className="hero-orb hero-orb-a" />
        <div className="hero-orb hero-orb-b" />
        <div className="hero-orb hero-orb-c" />
        <div className="hero-orb hero-orb-d" />
      </div>
    </div>
  );
}
