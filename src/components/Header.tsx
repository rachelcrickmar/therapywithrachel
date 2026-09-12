"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { siteConfig } from "@/lib/site";

const links = [
  { href: "/about", label: "About" },
  { href: "/rates", label: "Rates & insurance" },
  { href: "/blog", label: "Blog" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (pathname?.startsWith("/admin") || pathname?.startsWith("/studio")) {
    return null;
  }

  return (
    <header className="relative z-40 border-b border-line/70 bg-paper/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 md:px-8">
        <Link
          href="/"
          className="font-serif text-xl tracking-tight text-ink transition hover:text-sage-deep md:text-2xl"
        >
          {siteConfig.name}
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {links.map((link) => (
            <Link
              key={link.href}
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
            href="/contact"
            className="rounded-md bg-sage-deep px-4 py-2 text-sm font-medium text-paper transition hover:bg-ink"
          >
            Get in touch
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
          className="border-t border-line px-5 py-4 md:hidden"
          aria-label="Mobile"
        >
          <ul className="flex flex-col gap-3">
            {links.map((link) => (
              <li key={link.href}>
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
                href="/contact"
                className="mt-2 inline-flex rounded-md bg-sage-deep px-4 py-2 text-sm font-medium text-paper"
                onClick={() => setOpen(false)}
              >
                Get in touch
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
