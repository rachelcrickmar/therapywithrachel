"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BrandMark } from "@/components/BrandMark";
import type { SiteLink } from "@/lib/site";

type HeaderProps = {
  practiceName: string;
  navLinks: SiteLink[];
  contactButtonLabel: string;
  contactButtonHref: string;
};

export function Header({
  practiceName,
  navLinks,
  contactButtonLabel,
  contactButtonHref,
}: HeaderProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (pathname?.startsWith("/admin") || pathname?.startsWith("/studio")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-paper/90 backdrop-blur-md supports-[backdrop-filter]:bg-paper/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 md:px-8">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-serif text-xl tracking-tight text-ink transition hover:text-sage-deep md:gap-3 md:text-2xl"
        >
          <BrandMark size={34} className="h-[1.85rem] w-[1.85rem] md:h-9 md:w-9" />
          <span>{practiceName}</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {navLinks.map((link) => (
            <Link
              key={`${link.href}-${link.label}`}
              href={link.href}
              className={`text-sm tracking-wide transition ${
                pathname === link.href
                  ? "text-sage-deep"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={contactButtonHref}
            className="btn-cta-attention rounded-md bg-sage-deep px-4 py-2 text-sm font-medium text-paper transition hover:bg-ink"
          >
            {contactButtonLabel}
          </Link>
        </nav>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md border border-line px-3 py-2 text-sm text-ink md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open ? (
        <nav
          id="mobile-nav"
          className="border-t border-line bg-paper/95 px-5 py-4 md:hidden"
          aria-label="Mobile"
        >
          <ul className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <li key={`${link.href}-${link.label}`}>
                <Link
                  href={link.href}
                  className="block py-1 text-ink-muted"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={contactButtonHref}
                className="btn-cta-attention mt-2 inline-flex rounded-md bg-sage-deep px-4 py-2 text-sm font-medium text-paper"
                onClick={() => setOpen(false)}
              >
                {contactButtonLabel}
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
