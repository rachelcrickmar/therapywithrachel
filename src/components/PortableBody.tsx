import { PortableText, type PortableTextComponents } from "@portabletext/react";

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
};

export function PortableBody({
  value,
}: {
  value: unknown;
}) {
  if (!value || !Array.isArray(value)) return null;
  return <PortableText value={value} components={components} />;
}
