import { defineField, defineType } from "sanity";
import { photoFields } from "./objects/photoFields";

export const homePage = defineType({
  name: "homePage",
  title: "Home page",
  type: "document",
  groups: [
    { name: "hero", title: "1. Top of page (hero)", default: true },
    { name: "who", title: "2. Who I work with" },
    { name: "services", title: "3. Services section" },
    { name: "approach", title: "4. How I help" },
    { name: "cta", title: "5. Bottom call to action" },
  ],
  fields: [
    defineField({
      name: "brandName",
      title: "Brand name (large text)",
      type: "string",
      group: "hero",
      description: "Usually “Therapy With Rachel”.",
      initialValue: "Therapy With Rachel",
    }),
    defineField({
      name: "headline",
      title: "Headline under the brand name",
      type: "string",
      group: "hero",
      initialValue: "Feel freer in daily life again.",
    }),
    defineField({
      name: "subhead",
      title: "Supporting sentence",
      type: "text",
      rows: 3,
      group: "hero",
    }),
    defineField({
      name: "heroMedia",
      title: "Show a video or a photo beside your name?",
      type: "string",
      group: "hero",
      options: {
        list: [
          { title: "Video (plays silently, visitors tap to hear)", value: "video" },
          { title: "Photo", value: "photo" },
        ],
        layout: "radio",
      },
      initialValue: "video",
      description: "Video is the default. Pick Photo to show the hero photo below instead.",
    }),
    defineField({
      name: "heroVideo",
      title: "Hero video (optional replacement)",
      type: "file",
      group: "hero",
      options: { accept: "video/mp4,video/webm" },
      hidden: ({ parent }) => parent?.heroMedia === "photo",
      description:
        "Leave empty to use your current intro video (already compressed for fast loading). To replace it, upload an MP4 — ideally under 10 MB and under 30 seconds, since large files make the home page slow on phones.",
    }),
    defineField({
      name: "heroVideoUnmuteLabel",
      title: "Unmute prompt text",
      type: "string",
      group: "hero",
      hidden: ({ parent }) => parent?.heroMedia === "photo",
      description: "Shown on the video while it plays silently.",
      initialValue: "Tap to unmute",
    }),
    ...photoFields({
      name: "heroImage",
      title: "Hero photo (top of home page)",
      altName: "heroImageAlt",
      group: "hero",
      description:
        "Shown beside your name when “Photo” is selected above. Also used as the default photo on the Contact, Rates, and About pages. Click → Edit or drop a new file to replace.",
    }),
    defineField({
      name: "heroCaptionName",
      title: "Name on the photo",
      type: "string",
      group: "hero",
      initialValue: "Rachel Crickmar",
    }),
    defineField({
      name: "heroCaptionDetail",
      title: "Line under the name on the photo",
      type: "string",
      group: "hero",
      initialValue: "MSW, LCSWA · Wake Forest, NC",
    }),
    defineField({
      name: "primaryButtonLabel",
      title: "Primary button text",
      type: "string",
      group: "hero",
      initialValue: "Get in touch",
    }),
    defineField({
      name: "secondaryButtonLabel",
      title: "Secondary button text",
      type: "string",
      group: "hero",
      initialValue: "About Rachel",
    }),
    defineField({
      name: "consultNote",
      title: "Small note under the buttons",
      type: "string",
      group: "hero",
      description: "Example: Free 15-minute consultation",
      initialValue: "Free 15-minute consultation",
    }),

    defineField({
      name: "whoHeading",
      title: "Section heading",
      type: "string",
      group: "who",
      initialValue: "Who I work with",
    }),
    defineField({
      name: "whoBody",
      title: "Section text",
      type: "text",
      rows: 6,
      group: "who",
    }),
    ...photoFields({
      name: "whoImage",
      title: "Photo in “Who I work with”",
      altName: "whoImageAlt",
      group: "who",
      description:
        "Large photo beside this section. Replace the stock session photo by uploading here.",
    }),

    defineField({
      name: "servicesHeading",
      title: "Services heading",
      type: "string",
      group: "services",
      initialValue: "How we can work together",
    }),
    defineField({
      name: "servicesIntro",
      title: "Services intro sentence",
      type: "text",
      rows: 2,
      group: "services",
      initialValue:
        "Focused support for trauma, OCD, ADHD, and anxiety — with approaches chosen together.",
    }),

    defineField({
      name: "approachHeading",
      title: "Section heading",
      type: "string",
      group: "approach",
      initialValue: "How I help",
    }),
    defineField({
      name: "approachBody",
      title: "Section text",
      type: "text",
      rows: 5,
      group: "approach",
    }),
    defineField({
      name: "modalities",
      title: "Therapy approaches listed",
      type: "array",
      group: "approach",
      of: [{ type: "string" }],
      description: "Add one approach per line (EMDR, ERP, etc.).",
    }),
    ...photoFields({
      name: "approachImage",
      title: "Photo in “How I help”",
      altName: "approachImageAlt",
      group: "approach",
      description:
        "Wide photo beside this section. Upload to replace the stock image.",
    }),

    defineField({
      name: "ctaHeading",
      title: "Heading",
      type: "string",
      group: "cta",
      initialValue: "Free consultation",
    }),
    defineField({
      name: "ctaBody",
      title: "Text next to the form",
      type: "text",
      rows: 4,
      group: "cta",
    }),
    ...photoFields({
      name: "consultImage",
      title: "Photo beside the consultation form",
      altName: "consultImageAlt",
      group: "cta",
      description:
        "Upload to set this photo. If empty, the site reuses your hero photo (or a stock photo).",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Home page" }),
  },
});
