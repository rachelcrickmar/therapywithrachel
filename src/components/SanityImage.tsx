import Image from "next/image";
import type { SanityImageSource } from "@sanity/image-url";
import { urlFor } from "@/sanity/lib/image";

type SanityImageValue = SanityImageSource & {
  asset?: {
    _id?: string;
    _ref?: string;
    url?: string;
    metadata?: { lqip?: string; dimensions?: { width: number; height: number } };
  } | null;
};

export function hasSanityImage(
  value: SanityImageValue | null | undefined,
): value is SanityImageValue {
  if (!value || typeof value !== "object") return false;
  const asset = value.asset;
  if (!asset) return false;
  return Boolean(
    ("_ref" in asset && asset._ref) ||
      ("_id" in asset && asset._id) ||
      ("url" in asset && asset.url),
  );
}

export function SanityImage({
  value,
  alt,
  className = "",
  priority = false,
  sizes = "(min-width: 768px) 50vw, 100vw",
  fill = false,
}: {
  value: SanityImageValue | null | undefined;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  fill?: boolean;
}) {
  if (!hasSanityImage(value)) return null;

  const builder = urlFor(value);
  if (!builder) return null;

  const width = value.asset?.metadata?.dimensions?.width || 1600;
  const height = value.asset?.metadata?.dimensions?.height || 1200;
  const src = builder.width(1600).quality(80).url();
  const lqip = value.asset?.metadata?.lqip;

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={className}
        sizes={sizes}
        priority={priority}
        placeholder={lqip ? "blur" : "empty"}
        blurDataURL={lqip}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      sizes={sizes}
      priority={priority}
      placeholder={lqip ? "blur" : "empty"}
      blurDataURL={lqip}
    />
  );
}
