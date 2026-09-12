"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { dataset, projectId } from "./src/sanity/env";
import { schemaTypes } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";

const configuredProjectId = projectId || "placeholder";

export default defineConfig({
  name: "therapy-with-rachel",
  title: "Therapy With Rachel — Admin",
  basePath: "/admin",
  projectId: configuredProjectId,
  dataset,
  schema: {
    types: schemaTypes,
    templates: (prev) =>
      prev
        .filter((template) => template.schemaType !== "inquiry")
        .filter((template) => template.schemaType !== "siteSettings")
        .map((template) => {
          if (template.schemaType === "post") {
            return {
              ...template,
              title: "Blog post",
              description: "A new article for the Blog page",
            };
          }
          if (template.schemaType === "service") {
            return {
              ...template,
              title: "Service",
              description: "A therapy focus area shown on the site",
            };
          }
          return template;
        }),
  },
  plugins: [
    structureTool({
      title: "Editor",
      structure,
    }),
  ],
  document: {
    newDocumentOptions: (prev, { creationContext }) => {
      if (creationContext.type === "global") {
        return prev.filter(
          (template) =>
            template.templateId !== "inquiry" &&
            template.templateId !== "siteSettings",
        );
      }
      return prev;
    },
  },
});
