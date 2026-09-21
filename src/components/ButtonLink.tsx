"use client";

import Link from "next/link";
import { trackContactClick } from "@/lib/analytics/client";

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  attention?: boolean;
  /** Analytics location id for Get in touch / contact conversions */
  trackLocation?: string;
};

const variants = {
  primary:
    "bg-sage-deep text-paper hover:bg-ink focus-visible:outline-sage-deep",
  secondary:
    "border border-line bg-transparent text-ink hover:border-sage hover:bg-mist/60 focus-visible:outline-sage",
  ghost:
    "text-sage-deep underline-offset-4 hover:underline focus-visible:outline-sage",
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
  attention,
  trackLocation,
}: ButtonProps) {
  const isContactCta =
    attention ?? (variant === "primary" && href === "/contact");
  const location =
    trackLocation || (isContactCta ? "contact_cta" : undefined);

  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded-md px-5 py-3 text-sm font-medium tracking-wide transition-[background-color,box-shadow,color,border-color] duration-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${variants[variant]} ${
        isContactCta ? "btn-cta-attention" : ""
      } ${className}`}
      onClick={() => {
        if (location && (href === "/contact" || href.startsWith("/contact?"))) {
          trackContactClick(location);
        }
      }}
    >
      {children}
    </Link>
  );
}
