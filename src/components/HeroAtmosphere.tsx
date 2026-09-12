"use client";

import { useEffect, useRef } from "react";

/**
 * Soft ambient hero background: slow drift always; subtle mouse parallax on desktop.
 */
export function HeroAtmosphere() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(pointer: fine)");

    let raf = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const apply = () => {
      root.style.setProperty("--parallax-x", `${currentX.toFixed(2)}px`);
      root.style.setProperty("--parallax-y", `${currentY.toFixed(2)}px`);
    };

    const tick = () => {
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;
      apply();
      raf = requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      if (reduceMotion.matches || !finePointer.matches) return;
      const rect = root.getBoundingClientRect();
      const nx = (event.clientX - rect.left) / rect.width - 0.5;
      const ny = (event.clientY - rect.top) / rect.height - 0.5;
      targetX = nx * 28;
      targetY = ny * 20;
    };

    const onLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    const section = root.closest("section");
    section?.addEventListener("pointermove", onMove);
    section?.addEventListener("pointerleave", onLeave);

    if (!reduceMotion.matches) {
      raf = requestAnimationFrame(tick);
    }

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
      <div className="hero-parallax-layer absolute inset-0">
        <div className="hero-orb hero-orb-a" />
        <div className="hero-orb hero-orb-b" />
        <div className="hero-orb hero-orb-c" />
      </div>
    </div>
  );
}
