import { defineField, defineType } from "sanity";

export const contactPage = defineType({
  name: "contactPage",
  title: "Contact page",
  type: "document",
  groups: [
    { name: "content", title: "Page content", default: true },
    { name: "form", title: "Form labels" },
  ],
  fields: [
    defineField({
      name: "eyebrow",
      title: "Small label above title",
      type: "string",
      group: "content",
      initialValue: "Contact",
    }),
    defineField({
      name: "title",
      title: "Page title",
      type: "string",
      group: "content",
      initialValue: "Let's connect",
    }),
    defineField({
      name: "intro",
      title: "Intro text",
      type: "text",
      rows: 4,
      group: "content",
    }),
    defineField({
      name: "locationLabel",
      title: "Location label",
      type: "string",
      group: "content",
      initialValue: "Location",
    }),
    defineField({
      name: "locationText",
      title: "Location text",
      type: "string",
      group: "content",
      initialValue: "Wake Forest, NC · In-person and online across North Carolina",
    }),

    defineField({
      name: "formHeading",
      title: "Form heading",
      type: "string",
      group: "form",
      initialValue: "Get in touch",
    }),
    defineField({
      name: "formIntro",
      title: "Form privacy note",
      type: "text",
      rows: 3,
      group: "form",
      initialValue:
        "Request a free 15-minute consultation. Please do not include clinical details or sensitive health information — this form is only for scheduling.",
    }),
    defineField({
      name: "sidePhoto",
      title: "Photo beside the form",
      type: "image",
      group: "content",
      options: { hotspot: true },
      description:
        "Optional photo of you. If empty, the site uses your Home page hero photo.",
    }),
    defineField({
      name: "sidePhotoAlt",
      title: "Side photo description",
      type: "string",
      group: "content",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Contact page" }),
  },
});
