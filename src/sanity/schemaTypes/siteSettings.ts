import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "practiceName",
      title: "Practice name",
      type: "string",
      initialValue: "Therapy With Rachel",
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
    }),
    defineField({
      name: "email",
      title: "Practice email",
      type: "string",
    }),
    defineField({
      name: "thrizerWidgetUrl",
      title: "Thrizer widget URL",
      type: "url",
      description:
        "Paste the shareable Benefits Widget link from Thrizer Clinician Portal.",
    }),
    defineField({
      name: "seoTitle",
      title: "Default SEO title",
      type: "string",
    }),
    defineField({
      name: "seoDescription",
      title: "Default SEO description",
      type: "text",
      rows: 3,
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site Settings" }),
  },
});
