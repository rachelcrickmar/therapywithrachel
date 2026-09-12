import { defineField, defineType } from "sanity";

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About page",
  type: "document",
  groups: [
    { name: "intro", title: "1. Page intro", default: true },
    { name: "story", title: "2. Your story" },
    { name: "sidebar", title: "3. Sidebar (credentials)" },
    { name: "services", title: "4. Services section" },
    { name: "endorsements", title: "5. Endorsements" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Page title",
      type: "string",
      group: "intro",
      initialValue: "About Rachel",
    }),
    defineField({
      name: "intro",
      title: "Intro paragraph",
      type: "text",
      rows: 4,
      group: "intro",
    }),
    defineField({
      name: "portrait",
      title: "Portrait photo (optional)",
      type: "image",
      group: "intro",
      options: { hotspot: true },
    }),
    defineField({
      name: "portraitAlt",
      title: "Portrait description",
      type: "string",
      group: "intro",
    }),

    defineField({
      name: "story",
      title: "Your story (paragraphs)",
      type: "array",
      group: "story",
      of: [{ type: "text", rows: 4 }],
      description: "Each item is one paragraph on the page.",
    }),

    defineField({
      name: "qualificationsHeading",
      title: "Qualifications heading",
      type: "string",
      group: "sidebar",
      initialValue: "Qualifications",
    }),
    defineField({
      name: "qualifications",
      title: "Qualifications list",
      type: "array",
      group: "sidebar",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "approachesHeading",
      title: "Approaches heading",
      type: "string",
      group: "sidebar",
      initialValue: "Approaches",
    }),
    defineField({
      name: "approaches",
      title: "Approaches list",
      type: "array",
      group: "sidebar",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "availability",
      title: "Availability note",
      type: "text",
      rows: 3,
      group: "sidebar",
    }),
    defineField({
      name: "sidebarButtonLabel",
      title: "Sidebar button text",
      type: "string",
      group: "sidebar",
      initialValue: "Request a consult",
    }),

    defineField({
      name: "servicesHeading",
      title: "Services heading",
      type: "string",
      group: "services",
      initialValue: "Services",
    }),
    defineField({
      name: "servicesIntro",
      title: "Services intro",
      type: "text",
      rows: 2,
      group: "services",
    }),

    defineField({
      name: "endorsementsHeading",
      title: "Endorsements heading",
      type: "string",
      group: "endorsements",
      initialValue: "Colleague endorsements",
    }),
    defineField({
      name: "endorsements",
      title: "Endorsements",
      type: "array",
      group: "endorsements",
      of: [{ type: "endorsement" }],
    }),
  ],
  preview: {
    prepare: () => ({ title: "About page" }),
  },
});
