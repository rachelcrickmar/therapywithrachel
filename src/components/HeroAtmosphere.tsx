/**
 * Soft ambient hero background — slow color drift only (no pointer tracking).
 */
export function HeroAtmosphere() {
  return (
    <div className="hero-atmosphere pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="paper-grain absolute inset-0 z-[1]" />
      <div className="hero-orb-layer absolute inset-[-20%]">
        <div className="hero-orb hero-orb-a" />
        <div className="hero-orb hero-orb-b" />
        <div className="hero-orb hero-orb-c" />
        <div className="hero-orb hero-orb-d" />
      </div>
    </div>
  );
}
