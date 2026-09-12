import { defineField, defineType } from "sanity";
import { portableTextMembers } from "./objects/portableText";

export const privacyPage = defineType({
  name: "privacyPage",
  title: "Privacy page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Page title",
      type: "string",
      initialValue: "Privacy",
    }),
    defineField({
      name: "body",
      title: "Page content",
      type: "array",
      description: "Edit the privacy policy text here. You can also add images or a contact button.",
      of: portableTextMembers,
    }),
  ],
  preview: {
    prepare: () => ({ title: "Privacy page" }),
  },
});
