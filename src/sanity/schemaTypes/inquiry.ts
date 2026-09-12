import { defineField, defineType } from "sanity";

export const inquiry = defineType({
  name: "inquiry",
  title: "Message",
  type: "document",
  description: "Someone reached out through the website contact form.",
  fields: [
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      description: "Mark as Read after you respond, or Archive when done.",
      options: {
        list: [
          { title: "New — needs reply", value: "new" },
          { title: "Read", value: "read" },
          { title: "Archived", value: "archived" },
        ],
        layout: "radio",
      },
      initialValue: "new",
    }),
    defineField({
      name: "name",
      title: "Their name",
      type: "string",
      validation: (rule) => rule.required(),
      readOnly: true,
    }),
    defineField({
      name: "email",
      title: "Their email",
      type: "string",
      validation: (rule) => rule.required().email(),
      readOnly: true,
    }),
    defineField({
      name: "phone",
      title: "Their phone",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "preferredContact",
      title: "They prefer to be contacted by",
      type: "string",
      options: {
        list: [
          { title: "Email", value: "email" },
          { title: "Phone", value: "phone" },
          { title: "Either", value: "either" },
        ],
      },
      readOnly: true,
    }),
    defineField({
      name: "message",
      title: "Their message",
      type: "text",
      rows: 6,
      readOnly: true,
    }),
    defineField({
      name: "createdAt",
      title: "Received",
      type: "datetime",
      readOnly: true,
    }),
  ],
  orderings: [
    {
      title: "Newest first",
      name: "createdAtDesc",
      by: [{ field: "createdAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "email",
      status: "status",
      createdAt: "createdAt",
    },
    prepare: ({ title, subtitle, status, createdAt }) => ({
      title: title || "Message",
      subtitle: [
        status === "new" ? "NEW" : status,
        subtitle,
        createdAt?.slice?.(0, 10),
      ]
        .filter(Boolean)
        .join(" · "),
    }),
  },
});
