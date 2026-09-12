import { defineField, defineType } from "sanity";

export const service = defineType({
  name: "service",
  title: "Service",
  type: "document",
  description: "A therapy focus area listed on the Home and About pages.",
  fields: [
    defineField({
      name: "title",
      title: "Name",
      type: "string",
      description: 'Example: "Trauma & PTSD"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Short description",
      type: "text",
      rows: 4,
      description: "A few sentences visitors will read under the name.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "order",
      title: "Display order",
      type: "number",
      description: "Lower numbers appear first (1, 2, 3…).",
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: "Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "title", order: "order" },
    prepare: ({ title, order }) => ({
      title,
      subtitle: order != null ? `Order ${order}` : undefined,
    }),
  },
});
