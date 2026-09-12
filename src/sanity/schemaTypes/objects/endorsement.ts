import { defineField, defineType } from "sanity";

export const endorsement = defineType({
  name: "endorsement",
  title: "Endorsement",
  type: "object",
  fields: [
    defineField({
      name: "name",
      title: "Colleague name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "credentials",
      title: "Credentials / title",
      type: "string",
    }),
    defineField({
      name: "quote",
      title: "Quote",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "quote" },
  },
});
