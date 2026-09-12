"use client";

import { useId, useState } from "react";

export type FaqItem = {
  question: string;
  answer: string;
};

export function FaqAccordion({
  items,
  className = "",
}: {
  items: FaqItem[];
  className?: string;
}) {
  const baseId = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!items.length) return null;

  return (
    <ul className={`divide-y divide-line border-y border-line ${className}`}>
      {items.map((item, index) => {
        const open = openIndex === index;
        const panelId = `${baseId}-panel-${index}`;
        const buttonId = `${baseId}-button-${index}`;

        return (
          <li key={`${item.question}-${index}`}>
            <button
              type="button"
              id={buttonId}
              aria-expanded={open}
              aria-controls={panelId}
              className="flex w-full items-start justify-between gap-4 py-5 text-left transition hover:text-sage-deep"
              onClick={() => setOpenIndex(open ? null : index)}
            >
              <span className="font-serif text-xl text-ink md:text-2xl">
                {item.question}
              </span>
              <span
                className={`mt-1 shrink-0 text-lg text-sage transition-transform duration-300 ${
                  open ? "rotate-45" : ""
                }`}
                aria-hidden
              >
                +
              </span>
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <p
                  className={`max-w-2xl pb-5 text-base leading-relaxed text-ink-muted transition-all duration-500 ${
                    open
                      ? "translate-y-0 opacity-100 delay-75"
                      : "-translate-y-1 opacity-0"
                  }`}
                >
                  {item.answer}
                </p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
