"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { dataset, projectId } from "./src/sanity/env";
import { schemaTypes } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";

const configuredProjectId = projectId || "placeholder";

const SINGLETONS = [
  "siteSettings",
  "homePage",
  "aboutPage",
  "ratesPage",
  "contactPage",
  "privacyPage",
  "faqPage",
  "inquiry",
];

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
        .filter((template) => !SINGLETONS.includes(template.schemaType))
        .map((template) => {
          if (template.schemaType === "post") {
            return {
              ...template,
              title: "Blog post",
              description: "A new article — add text, images, and book CTAs",
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
          (template) => !SINGLETONS.includes(template.templateId),
        );
      }
      return prev;
    },
  },
});
