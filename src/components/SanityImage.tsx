import Image from "next/image";
import type { SanityImageSource } from "@sanity/image-url";
import { urlFor } from "@/sanity/lib/image";

type SanityImageValue = SanityImageSource & {
  asset?: { metadata?: { lqip?: string; dimensions?: { width: number; height: number } } };
};

export function SanityImage({
  value,
  alt,
  className = "",
  priority = false,
  sizes = "(min-width: 768px) 50vw, 100vw",
}: {
  value: SanityImageValue | null | undefined;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  if (!value) return null;
  const builder = urlFor(value);
  if (!builder) return null;

  const width = value.asset?.metadata?.dimensions?.width || 1600;
  const height = value.asset?.metadata?.dimensions?.height || 1200;
  const src = builder.width(1600).quality(80).url();

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      sizes={sizes}
      priority={priority}
      placeholder={value.asset?.metadata?.lqip ? "blur" : "empty"}
      blurDataURL={value.asset?.metadata?.lqip}
    />
  );
}
