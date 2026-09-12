import { defineArrayMember, defineField } from "sanity";

/** Shared rich text used on pages and blog posts */
export const portableTextMembers = [
  defineArrayMember({
    type: "block",
    styles: [
      { title: "Normal", value: "normal" },
      { title: "Heading", value: "h2" },
      { title: "Subheading", value: "h3" },
      { title: "Quote", value: "blockquote" },
    ],
    lists: [
      { title: "Bullet", value: "bullet" },
      { title: "Numbered", value: "number" },
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
            defineField({
              name: "href",
              type: "url",
              title: "URL",
              validation: (rule) =>
                rule.uri({
                  allowRelative: true,
                  scheme: ["http", "https", "mailto", "tel"],
                }),
            }),
          ],
        },
      ],
    },
  }),
  defineArrayMember({
    type: "imageBlock",
  }),
  defineArrayMember({
    type: "ctaBlock",
  }),
];

export const simplePortableText = defineField({
  name: "body",
  title: "Content",
  type: "array",
  of: portableTextMembers,
});
