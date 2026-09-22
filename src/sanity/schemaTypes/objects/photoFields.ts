import { defineField } from "sanity";

/** Shared CMS image + alt fields so Rachel can replace any photo from Admin. */
export function photoFields({
  name,
  title,
  altName,
  altTitle,
  group,
  description,
}: {
  name: string;
  title: string;
  altName: string;
  altTitle?: string;
  group?: string;
  description?: string;
}) {
  return [
    defineField({
      name,
      title,
      type: "image",
      group,
      options: { hotspot: true },
      description:
        description ||
        "Click the image → Edit, or drop a new file on top to replace it. Publish when done.",
    }),
    defineField({
      name: altName,
      title: altTitle || `${title} — description (alt text)`,
      type: "string",
      group,
      description:
        "Short description for accessibility and SEO. Example: “Rachel in the therapy office.”",
    }),
  ];
}
