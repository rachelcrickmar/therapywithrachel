import Image from "next/image";
import { hasSanityImage, SanityImage } from "@/components/SanityImage";

type PageImageProps = {
  value: unknown;
  alt: string;
  fallbackSrc?: string;
  fallbackAlt?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  objectPosition?: string;
};

/**
 * Prefers a Sanity CMS image; otherwise a local stock fallback.
 * Used so every visible photo has an Admin upload field.
 */
export function PageImage({
  value,
  alt,
  fallbackSrc,
  fallbackAlt,
  className = "object-cover object-center",
  sizes = "(min-width: 768px) 40vw, 100vw",
  priority = false,
  objectPosition,
}: PageImageProps) {
  if (hasSanityImage(value as never)) {
    return (
      <SanityImage
        value={value as never}
        alt={alt}
        className={className}
        fill
        sizes={sizes}
        priority={priority}
      />
    );
  }

  if (fallbackSrc) {
    return (
      <Image
        src={fallbackSrc}
        alt={fallbackAlt || alt}
        fill
        className={className}
        style={objectPosition ? { objectPosition } : undefined}
        sizes={sizes}
        priority={priority}
      />
    );
  }

  return (
    <div
      className="absolute inset-0 bg-gradient-to-br from-sage/30 via-mist-deep/50 to-blush/25"
      aria-hidden
    />
  );
}
