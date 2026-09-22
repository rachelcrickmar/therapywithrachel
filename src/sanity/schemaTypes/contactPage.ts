import { defineField, defineType } from "sanity";
import { photoFields } from "./objects/photoFields";

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
    ...photoFields({
      name: "sidePhoto",
      title: "Photo beside the form",
      altName: "sidePhotoAlt",
      group: "content",
      description:
        "Upload here to set/replace this photo. If empty, Home hero is used, then a stock photo.",
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
  ],
  preview: {
    prepare: () => ({ title: "Contact page" }),
  },
});
