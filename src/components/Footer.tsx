"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandMark } from "@/components/BrandMark";
import type { SiteLink } from "@/lib/site";

type FooterProps = {
  practiceName: string;
  legalName: string;
  license: string;
  footerTagline: string;
  footerLinks: SiteLink[];
  crisisNote: string;
};

function formatCrisisNote(note: string) {
  const parts = note.split(/(988)/g);
  return parts.map((part, index) =>
    part === "988" ? (
      <strong key={index} className="font-medium text-ink">
        988
      </strong>
    ) : (
      <span key={index}>{part}</span>
    ),
  );
}

export function Footer({
  practiceName,
  legalName,
  license,
  footerTagline,
  footerLinks,
  crisisNote,
}: FooterProps) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/studio")) {
    return null;
  }

  return (
    <footer className="mt-auto border-t border-line bg-stone-warm/50">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[1.4fr_1fr] md:px-8">
        <div className="space-y-4">
          <p className="flex items-center gap-3 font-serif text-2xl text-ink">
            <BrandMark size={40} className="h-10 w-10" />
            <span>{practiceName}</span>
          </p>
          <p className="max-w-md whitespace-pre-line text-sm leading-relaxed text-ink-muted">
            {footerTagline}
          </p>
        </div>

        <div className="space-y-4 text-sm text-ink-muted">
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {footerLinks.map((link) => (
              <Link
                key={`${link.href}-${link.label}`}
                href={link.href}
                className="hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <p className="max-w-sm leading-relaxed">
            {formatCrisisNote(crisisNote)}
          </p>
          <p className="text-xs">
            {license}. Content © {new Date().getFullYear()} {legalName}.
          </p>
        </div>
      </div>
    </footer>
  );
}
