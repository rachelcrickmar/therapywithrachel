"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/site";

export function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/studio")) {
    return null;
  }

  return (
    <footer className="mt-auto border-t border-line bg-stone-warm/50">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[1.4fr_1fr] md:px-8">
        <div className="space-y-4">
          <p className="font-serif text-2xl text-ink">{siteConfig.name}</p>
          <p className="max-w-md text-sm leading-relaxed text-ink-muted">
            {siteConfig.legalName} · {siteConfig.therapistName},{" "}
            {siteConfig.credentials}
            <br />
            {siteConfig.location} · In-person and online across North Carolina
          </p>
        </div>

        <div className="space-y-4 text-sm text-ink-muted">
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/about" className="hover:text-ink">
              About
            </Link>
            <Link href="/rates" className="hover:text-ink">
              Rates
            </Link>
            <Link href="/blog" className="hover:text-ink">
              Blog
            </Link>
            <Link href="/contact" className="hover:text-ink">
              Contact
            </Link>
            <Link href="/privacy" className="hover:text-ink">
              Privacy
            </Link>
          </div>
          <p className="max-w-sm leading-relaxed">
            This website is not for emergencies. If you are in crisis, call or
            text <strong className="font-medium text-ink">988</strong> (Suicide
            &amp; Crisis Lifeline), or call 911.
          </p>
          <p className="text-xs">
            {siteConfig.license}. Content © {new Date().getFullYear()}{" "}
            {siteConfig.legalName}.
          </p>
        </div>
      </div>
    </footer>
  );
}
