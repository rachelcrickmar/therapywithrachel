import { defineField, defineType } from "sanity";
import { portableTextMembers } from "./objects/portableText";

export const post = defineType({
  name: "post",
  title: "Blog post",
  type: "document",
  description: "Articles that appear on the Blog page.",
  groups: [
    { name: "basics", title: "1. Title & summary", default: true },
    { name: "content", title: "2. Post content" },
    { name: "media", title: "3. Cover image" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "basics",
      description: "The headline visitors will see.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Web address (slug)",
      type: "slug",
      group: "basics",
      description: 'Click "Generate" after typing the title. This becomes /blog/your-title.',
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Short summary",
      type: "text",
      rows: 3,
      group: "basics",
      description: "One or two sentences shown on the blog list page.",
    }),
    defineField({
      name: "publishedAt",
      title: "Publish date",
      type: "datetime",
      group: "basics",
      description: "When this post should appear as published.",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "body",
      title: "Post content",
      type: "array",
      group: "content",
      description:
        "Write your article here. Use + to add images or a “Call to action (book / contact)” button block.",
      of: portableTextMembers,
    }),
    defineField({
      name: "coverImage",
      title: "Cover image (optional)",
      type: "image",
      group: "media",
      options: { hotspot: true },
      description: "Optional image at the top of the post and on the blog list.",
    }),
    defineField({
      name: "coverImageAlt",
      title: "Cover image description",
      type: "string",
      group: "media",
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "coverImage",
      subtitle: "publishedAt",
    },
  },
});
