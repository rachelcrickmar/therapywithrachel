type BrandMarkProps = {
  size?: number;
  className?: string;
};

/** Therapy With Rachel orb mark — sized for header/footer wordmarks. */
export function BrandMark({ size = 32, className = "" }: BrandMarkProps) {
  return (
    <img
      src="/brand/twr-orb.svg"
      alt=""
      width={size}
      height={size}
      className={`shrink-0 ${className}`}
      aria-hidden
      decoding="async"
    />
  );
}
