import type { SchemaTypeDefinition } from "sanity";
import { inquiry } from "./inquiry";
import { post } from "./post";
import { service } from "./service";
import { siteSettings } from "./siteSettings";

export const schemaTypes: SchemaTypeDefinition[] = [
  siteSettings,
  service,
  post,
  inquiry,
];
