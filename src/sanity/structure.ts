import { CogIcon } from "@sanity/icons/Cog";
import { ComposeIcon } from "@sanity/icons/Compose";
import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { EarthGlobeIcon } from "@sanity/icons/EarthGlobe";
import { EnvelopeIcon } from "@sanity/icons/Envelope";
import { UsersIcon } from "@sanity/icons/Users";
import type { StructureResolver } from "sanity/structure";
import { LiveSiteHelp } from "./components/LiveSiteHelp";

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
        .title("Write a blog post")
        .icon(ComposeIcon)
        .child(
          S.documentTypeList("post")
            .title("Blog posts")
            .defaultOrdering([{ field: "publishedAt", direction: "desc" }]),
        ),
      S.listItem()
        .title("Services")
        .icon(DocumentTextIcon)
        .child(
          S.documentTypeList("service")
            .title("Services on the website")
            .defaultOrdering([{ field: "order", direction: "asc" }]),
        ),
      S.divider(),
      S.listItem()
        .title("Site settings")
        .icon(CogIcon)
        .child(
          S.document()
            .schemaType("siteSettings")
            .documentId("siteSettings")
            .title("Site settings"),
        ),
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
