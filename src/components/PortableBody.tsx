"use client";

import Link from "next/link";
import {
  PortableText,
  type PortableTextComponents,
  type PortableTextBlock,
} from "@portabletext/react";
import { trackContactClick } from "@/lib/analytics/client";
import { SanityImage } from "./SanityImage";

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="mt-10 font-serif text-3xl text-ink">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 font-serif text-2xl text-ink">{children}</h3>
    ),
    normal: ({ children }) => (
      <p className="mt-4 text-base leading-relaxed text-ink-muted">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="mt-6 border-l-2 border-sage pl-5 font-serif text-xl text-ink">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mt-4 list-disc space-y-2 pl-5 text-ink-muted">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="mt-4 list-decimal space-y-2 pl-5 text-ink-muted">{children}</ol>
    ),
  },
  marks: {
    link: ({ children, value }) => (
      <a
        href={value?.href}
        className="text-sage-deep underline underline-offset-4"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
  },
  types: {
    imageBlock: ({ value }) => {
      if (!value?.image) return null;
      return (
        <figure className="my-10">
          <SanityImage
            value={value.image}
            alt={value.alt || ""}
            className="h-auto w-full rounded-sm object-cover"
            sizes="(min-width: 768px) 720px, 100vw"
          />
          {value.caption ? (
            <figcaption className="mt-3 text-center text-sm text-ink-muted">
              {value.caption}
            </figcaption>
          ) : null}
        </figure>
      );
    },
    ctaBlock: ({ value }) => {
      const href = value?.buttonLink || "/contact";
      const isInternal = href.startsWith("/");
      const label = value?.buttonLabel || "Get in touch";
      const isContact =
        href === "/contact" || href.startsWith("/contact?");

      return (
        <aside className="my-12 rounded-lg border border-line bg-mist/50 px-6 py-8 md:px-8">
          {value?.heading ? (
            <h3 className="font-serif text-2xl text-ink md:text-3xl">
              {value.heading}
            </h3>
          ) : null}
          {value?.body ? (
            <p className="mt-3 max-w-xl text-base leading-relaxed text-ink-muted">
              {value.body}
            </p>
          ) : null}
          <div className="mt-6">
            {isInternal ? (
              <Link
                href={href}
                className="inline-flex rounded-md bg-sage-deep px-5 py-3 text-sm font-medium text-paper transition hover:bg-ink"
                onClick={() => {
                  if (isContact) trackContactClick("blog_cta");
                }}
              >
                {label}
              </Link>
            ) : (
              <a
                href={href}
                className="inline-flex rounded-md bg-sage-deep px-5 py-3 text-sm font-medium text-paper transition hover:bg-ink"
                rel="noopener noreferrer"
                onClick={() => {
                  if (isContact) trackContactClick("blog_cta");
                }}
              >
                {label}
              </a>
            )}
          </div>
        </aside>
      );
    },
  },
};

export function PortableBody({ value }: { value: unknown }) {
  if (!value || !Array.isArray(value) || value.length === 0) return null;
  return (
    <PortableText
      value={value as PortableTextBlock[]}
      components={components}
    />
  );
}
