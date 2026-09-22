import { defineField, defineType } from "sanity";
import { photoFields } from "./objects/photoFields";

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About page",
  type: "document",
  groups: [
    { name: "intro", title: "1. Page intro", default: true },
    { name: "story", title: "2. Your story" },
    { name: "sidebar", title: "3. Sidebar (credentials)" },
    { name: "mid", title: "4. Mid-page photo & quote" },
    { name: "services", title: "5. Services section" },
    { name: "endorsements", title: "6. Endorsements" },
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
    ...photoFields({
      name: "portrait",
      title: "Portrait photo (top of About)",
      altName: "portraitAlt",
      group: "intro",
      description:
        "Your photo at the top of About. Upload to replace. If empty, the site may reuse your Home hero photo.",
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

    ...photoFields({
      name: "storyImage",
      title: "Mid-page photo (beside quote)",
      altName: "storyImageAlt",
      group: "mid",
      description:
        "Wide photo in the middle of About. Upload to replace the stock couch/session photo.",
    }),
    defineField({
      name: "storyQuote",
      title: "Quote beside the mid-page photo",
      type: "text",
      rows: 4,
      group: "mid",
      initialValue:
        "A steady, collaborative space for women and teens navigating trauma, OCD, ADHD, and the weight of everyday life.",
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
