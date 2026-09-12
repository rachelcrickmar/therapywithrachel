import { defineField, defineType } from "sanity";

export const faqItem = defineType({
  name: "faqItem",
  title: "FAQ item",
  type: "object",
  fields: [
    defineField({
      name: "question",
      title: "Question",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "answer",
      title: "Answer",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "showOnHome",
      title: "Show on home page",
      type: "boolean",
      initialValue: false,
      description: "Turn on to feature this FAQ in the home page FAQ section.",
    }),
  ],
  preview: {
    select: { title: "question", showOnHome: "showOnHome" },
    prepare: ({ title, showOnHome }) => ({
      title: title || "FAQ",
      subtitle: showOnHome ? "Shown on home" : undefined,
    }),
  },
});

export const faqPage = defineType({
  name: "faqPage",
  title: "FAQ page",
  type: "document",
  groups: [
    { name: "intro", title: "1. Page intro", default: true },
    { name: "faqs", title: "2. Questions & answers" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Page title",
      type: "string",
      group: "intro",
      initialValue: "Frequently asked questions",
    }),
    defineField({
      name: "intro",
      title: "Intro paragraph",
      type: "text",
      rows: 3,
      group: "intro",
    }),
    defineField({
      name: "faqs",
      title: "FAQs",
      type: "array",
      group: "faqs",
      of: [{ type: "faqItem" }],
    }),
  ],
  preview: {
    prepare: () => ({ title: "FAQ page" }),
  },
});
