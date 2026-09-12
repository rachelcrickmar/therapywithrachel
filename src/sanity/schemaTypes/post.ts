import { defineField, defineType } from "sanity";

export const post = defineType({
  name: "post",
  title: "Blog post",
  type: "document",
  description: "Articles that appear on the Blog page.",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "The headline visitors will see.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Web address (slug)",
      type: "slug",
      description: 'Click "Generate" after typing the title. This becomes /blog/your-title.',
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Short summary",
      type: "text",
      rows: 3,
      description: "One or two sentences shown on the blog list page.",
    }),
    defineField({
      name: "publishedAt",
      title: "Publish date",
      type: "datetime",
      description: "When this post should appear as published.",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "coverImage",
      title: "Cover image (optional)",
      type: "image",
      options: { hotspot: true },
      description: "Optional image for the post.",
    }),
    defineField({
      name: "body",
      title: "Post content",
      type: "array",
      description: "Write your article here. Use the toolbar for headings and links.",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Heading", value: "h2" },
            { title: "Subheading", value: "h3" },
            { title: "Quote", value: "blockquote" },
          ],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  {
                    name: "href",
                    type: "url",
                    title: "URL",
                    validation: (rule) =>
                      rule.uri({
                        allowRelative: true,
                        scheme: ["http", "https", "mailto", "tel"],
                      }),
                  },
                ],
              },
            ],
          },
        },
      ],
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
