import { BookIcon } from "@sanity/icons/Book";
import { CogIcon } from "@sanity/icons/Cog";
import { ComposeIcon } from "@sanity/icons/Compose";
import { DocumentIcon } from "@sanity/icons/Document";
import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { EarthGlobeIcon } from "@sanity/icons/EarthGlobe";
import { EnvelopeIcon } from "@sanity/icons/Envelope";
import { HomeIcon } from "@sanity/icons/Home";
import { UsersIcon } from "@sanity/icons/Users";
import type { ComponentType } from "react";
import type { StructureBuilder, StructureResolver } from "sanity/structure";
import { LiveSiteHelp } from "./components/LiveSiteHelp";

function singleton(
  S: StructureBuilder,
  type: string,
  title: string,
  icon: ComponentType,
) {
  return S.listItem()
    .title(title)
    .icon(icon)
    .child(S.document().schemaType(type).documentId(type).title(title));
}

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Your website")
    .items([
      S.listItem()
        .title("New messages")
        .icon(EnvelopeIcon)
        .child(
          S.documentList()
            .title("New messages")
            .filter('_type == "inquiry" && status == "new"')
            .defaultOrdering([{ field: "createdAt", direction: "desc" }]),
        ),
      S.listItem()
        .title("All messages")
        .icon(UsersIcon)
        .child(
          S.documentTypeList("inquiry")
            .title("All messages")
            .defaultOrdering([{ field: "createdAt", direction: "desc" }]),
        ),
      S.divider(),
      S.listItem()
        .title("Edit website pages")
        .icon(DocumentIcon)
        .child(
          S.list()
            .title("Website pages")
            .items([
              singleton(S, "homePage", "Home page", HomeIcon),
              singleton(S, "aboutPage", "About page", UsersIcon),
              singleton(S, "ratesPage", "Rates & insurance page", DocumentTextIcon),
              singleton(S, "contactPage", "Contact page", EnvelopeIcon),
              singleton(S, "privacyPage", "Privacy page", BookIcon),
            ]),
        ),
      S.listItem()
        .title("Services")
        .icon(DocumentTextIcon)
        .child(
          S.documentTypeList("service")
            .title("Services on the website")
            .defaultOrdering([{ field: "order", direction: "asc" }]),
        ),
      S.listItem()
        .title("Write a blog post")
        .icon(ComposeIcon)
        .child(
          S.documentTypeList("post")
            .title("Blog posts")
            .defaultOrdering([{ field: "publishedAt", direction: "desc" }]),
        ),
      S.divider(),
      singleton(S, "siteSettings", "Site settings", CogIcon),
      S.listItem()
        .title("How this editor works")
        .icon(EarthGlobeIcon)
        .child(
          S.component()
            .id("live-site-help")
            .title("How this editor works")
            .component(LiveSiteHelp),
        ),
    ]);
