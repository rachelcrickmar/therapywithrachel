import { defineField, defineType } from "sanity";

export const blogPage = defineType({
  name: "blogPage",
  title: "Blog page",
  type: "document",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Small label above the title",
      type: "string",
      initialValue: "Blog",
      description: "Shown in small caps above the heading. Example: Blog",
    }),
    defineField({
      name: "title",
      title: "Page heading",
      type: "string",
      initialValue: "Writing",
    }),
    defineField({
      name: "intro",
      title: "Intro paragraph",
      type: "text",
      rows: 4,
      initialValue:
        "Short pieces for prospective and current clients — notes on therapy, getting started, and finding steadier ground.",
    }),
    defineField({
      name: "backLinkLabel",
      title: "“Back to all posts” link",
      type: "string",
      initialValue: "← All posts",
      description: "Shown at the top of each individual blog post.",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Blog page" }),
  },
});
