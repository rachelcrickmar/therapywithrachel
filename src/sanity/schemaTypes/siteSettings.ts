import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  description: "Practice-wide details used across the website.",
  fields: [
    defineField({
      name: "practiceName",
      title: "Practice name",
      type: "string",
      initialValue: "Therapy With Rachel",
      description: "Shown in the header and footer.",
    }),
    defineField({
      name: "email",
      title: "Practice email (optional)",
      type: "string",
      description: "For your records / future use. Not shown publicly unless you add it to a page.",
    }),
    defineField({
      name: "location",
      title: "Location line",
      type: "string",
      initialValue: "Wake Forest, NC",
      description: "Used in the footer and elsewhere.",
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
