import { defineField, defineType } from "sanity";

export const ctaBlock = defineType({
  name: "ctaBlock",
  title: "Call to action (book / contact)",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      initialValue: "Ready to take the next step?",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Supporting text",
      type: "text",
      rows: 3,
      initialValue:
        "Reach out for a free consultation and we can figure out what makes sense for you.",
    }),
    defineField({
      name: "buttonLabel",
      title: "Button text",
      type: "string",
      initialValue: "Get in touch",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "buttonLink",
      title: "Button goes to",
      type: "string",
      description: "Usually /contact. You can also paste a full https:// link.",
      initialValue: "/contact",
      options: {
        list: [
          { title: "Contact / get in touch page", value: "/contact" },
          { title: "Home page", value: "/" },
          { title: "Rates page", value: "/rates" },
        ],
      },
    }),
  ],
  preview: {
    select: { title: "heading", subtitle: "buttonLabel" },
    prepare: ({ title, subtitle }) => ({
      title: title || "Call to action",
      subtitle: subtitle ? `Button: ${subtitle}` : "CTA",
    }),
  },
});
