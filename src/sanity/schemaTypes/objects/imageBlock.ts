import { defineField, defineType } from "sanity";

export const imageBlock = defineType({
  name: "imageBlock",
  title: "Image",
  type: "object",
  fields: [
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "alt",
      title: "Describe the image (for accessibility)",
      type: "string",
      description: "What is in the photo? Shown to screen readers.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "caption",
      title: "Caption (optional)",
      type: "string",
    }),
  ],
  preview: {
    select: { title: "alt", media: "image", caption: "caption" },
    prepare: ({ title, media, caption }) => ({
      title: title || "Image",
      subtitle: caption,
      media,
    }),
  },
});
