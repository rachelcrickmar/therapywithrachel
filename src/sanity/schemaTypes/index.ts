import { aboutPage } from "./aboutPage";
import { contactPage } from "./contactPage";
import { ctaBlock } from "./objects/ctaBlock";
import { endorsement } from "./objects/endorsement";
import { imageBlock } from "./objects/imageBlock";
import { faqItem, faqPage } from "./faqPage";
import { homePage } from "./homePage";
import { inquiry } from "./inquiry";
import { post } from "./post";
import { privacyPage } from "./privacyPage";
import { ratesPage } from "./ratesPage";
import { service } from "./service";
import { siteSettings } from "./siteSettings";

export const schemaTypes = [
  siteSettings,
  homePage,
  aboutPage,
  ratesPage,
  contactPage,
  privacyPage,
  faqPage,
  service,
  post,
  inquiry,
  imageBlock,
  ctaBlock,
  endorsement,
  faqItem,
];
