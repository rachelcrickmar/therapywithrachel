import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  description: "Practice contact details and tools shown on the website.",
  fields: [
    defineField({
      name: "practiceName",
      title: "Practice name",
      type: "string",
      initialValue: "Therapy With Rachel",
      description: "Shown in the header and footer.",
    }),
    defineField({
      name: "phone",
      title: "Phone number",
      type: "string",
      description: "Example: (984) 300-4524",
    }),
    defineField({
      name: "email",
      title: "Practice email",
      type: "string",
      description: "Optional public email if you want it on the site later.",
    }),
    defineField({
      name: "thrizerWidgetUrl",
      title: "Thrizer benefits checker link",
      type: "url",
      description:
        "From Thrizer → Benefits → Widget settings → shareable link. Paste the full https://… URL here.",
    }),
    defineField({
      name: "seoTitle",
      title: "Google title (optional)",
      type: "string",
      description: "Overrides the default browser/search title if set.",
    }),
    defineField({
      name: "seoDescription",
      title: "Google description (optional)",
      type: "text",
      rows: 3,
      description: "Short blurb search engines may show under your site name.",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site settings" }),
  },
});
