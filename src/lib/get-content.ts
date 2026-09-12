import {
  aboutContent,
  defaultServices,
  endorsements,
  faqContent,
  homeContent,
  insuranceList,
  modalities,
  paymentMethods,
  ratesContent,
  type Endorsement,
  type FaqItem,
  type Service,
} from "@/lib/content";
import { siteConfig, type SiteLink } from "@/lib/site";
import { sanityFetch } from "@/sanity/lib/client";
import {
  aboutPageQuery,
  contactPageQuery,
  faqPageQuery,
  homePageQuery,
  privacyPageQuery,
  ratesPageQuery,
  servicesQuery,
  siteSettingsQuery,
} from "@/sanity/lib/queries";

export async function getServices(): Promise<Service[]> {
  const fromCms = await sanityFetch<Service[]>({
    query: servicesQuery,
    tags: ["service"],
  });
  if (fromCms && fromCms.length > 0) return fromCms;
  return defaultServices;
}

export type { SiteLink } from "@/lib/site";

export type SiteChrome = {
  practiceName: string;
  legalName: string;
  therapistName: string;
  credentials: string;
  license: string;
  location: string;
  navLinks: SiteLink[];
  contactButtonLabel: string;
  contactButtonHref: string;
  footerTagline: string;
  footerLinks: SiteLink[];
  crisisNote: string;
  thrizerWidgetUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
};

const defaultNavLinks: SiteLink[] = [
  { label: "About", href: "/about" },
  { label: "Rates & insurance", href: "/rates" },
  { label: "FAQ", href: "/faq" },
  { label: "Blog", href: "/blog" },
];

const defaultFooterLinks: SiteLink[] = [
  { label: "About", href: "/about" },
  { label: "Rates", href: "/rates" },
  { label: "FAQ", href: "/faq" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy", href: "/privacy" },
];

function normalizeLinks(
  links: { label?: string; href?: string }[] | null | undefined,
  fallback: SiteLink[],
): SiteLink[] {
  const cleaned =
    links
      ?.map((link) => ({
        label: link.label?.trim() || "",
        href: link.href?.trim() || "",
      }))
      .filter((link) => link.label && link.href) || [];
  return cleaned.length ? cleaned : fallback;
}

export async function getSiteSettings(): Promise<SiteChrome> {
  const page =
    (await sanityFetch<{
      practiceName?: string;
      legalName?: string;
      therapistName?: string;
      credentials?: string;
      license?: string;
      location?: string;
      navLinks?: { label?: string; href?: string }[];
      contactButtonLabel?: string;
      contactButtonHref?: string;
      footerTagline?: string;
      footerLinks?: { label?: string; href?: string }[];
      crisisNote?: string;
      thrizerWidgetUrl?: string;
      seoTitle?: string;
      seoDescription?: string;
    }>({ query: siteSettingsQuery, tags: ["siteSettings"] })) || {};

  return {
    practiceName: page.practiceName || siteConfig.name,
    legalName: page.legalName || siteConfig.legalName,
    therapistName: page.therapistName || siteConfig.therapistName,
    credentials: page.credentials || siteConfig.credentials,
    license: page.license || siteConfig.license,
    location: page.location || siteConfig.location,
    navLinks: normalizeLinks(page.navLinks, defaultNavLinks),
    contactButtonLabel: page.contactButtonLabel || "Get in touch",
    contactButtonHref: page.contactButtonHref || "/contact",
    footerTagline:
      page.footerTagline ||
      `${siteConfig.legalName} · ${siteConfig.therapistName}, ${siteConfig.credentials}\n${siteConfig.location} · In-person and online across North Carolina`,
    footerLinks: normalizeLinks(page.footerLinks, defaultFooterLinks),
    crisisNote:
      page.crisisNote ||
      "This website is not for emergencies. If you are in crisis, call or text 988 (Suicide & Crisis Lifeline), or call 911.",
    thrizerWidgetUrl: page.thrizerWidgetUrl,
    seoTitle: page.seoTitle,
    seoDescription: page.seoDescription,
  };
}

export async function getHomePage() {
  const page = await sanityFetch<Record<string, unknown>>({
    query: homePageQuery,
    tags: ["homePage"],
    revalidate: 30,
  });

  return {
    brandName: (page?.brandName as string) || homeContent.brand,
    headline: (page?.headline as string) || homeContent.headline,
    subhead: (page?.subhead as string) || homeContent.subhead,
    heroImage: page?.heroImage,
    heroImageAlt: (page?.heroImageAlt as string) || "",
    heroCaptionName: (page?.heroCaptionName as string) || siteConfig.therapistName,
    heroCaptionDetail:
      (page?.heroCaptionDetail as string) ||
      `${siteConfig.credentials} · ${siteConfig.location}`,
    primaryButtonLabel: (page?.primaryButtonLabel as string) || "Get in touch",
    secondaryButtonLabel: (page?.secondaryButtonLabel as string) || "About Rachel",
    consultNote:
      (page?.consultNote as string) ||
      `Free ${siteConfig.consultLength} consultation`,
    whoHeading: (page?.whoHeading as string) || homeContent.whoHeading,
    whoBody: (page?.whoBody as string) || homeContent.whoBody,
    servicesHeading:
      (page?.servicesHeading as string) || "How we can work together",
    servicesIntro:
      (page?.servicesIntro as string) ||
      "Focused support for trauma, OCD, ADHD, and anxiety — with approaches chosen together.",
    approachHeading:
      (page?.approachHeading as string) || homeContent.approachHeading,
    approachBody: (page?.approachBody as string) || homeContent.approachBody,
    modalities:
      (page?.modalities as string[])?.length
        ? (page?.modalities as string[])
        : [...modalities],
    ctaHeading: (page?.ctaHeading as string) || homeContent.ctaHeading,
    ctaBody: (page?.ctaBody as string) || homeContent.ctaBody,
    consultImage: page?.consultImage || page?.heroImage,
    consultImageAlt:
      (page?.consultImageAlt as string) ||
      (page?.heroImageAlt as string) ||
      "",
  };
}

export async function getAboutPage() {
  const [page, home] = await Promise.all([
    sanityFetch<Record<string, unknown>>({
      query: aboutPageQuery,
      tags: ["aboutPage"],
    }),
    getHomePage(),
  ]);

  return {
    title: (page?.title as string) || aboutContent.title,
    intro: (page?.intro as string) || aboutContent.intro,
    portrait: page?.portrait || home.heroImage,
    portraitAlt:
      (page?.portraitAlt as string) ||
      home.heroImageAlt ||
      home.heroCaptionName,
    story:
      (page?.story as string[])?.length
        ? (page?.story as string[])
        : aboutContent.story,
    qualificationsHeading:
      (page?.qualificationsHeading as string) || "Qualifications",
    qualifications:
      (page?.qualifications as string[])?.length
        ? (page?.qualifications as string[])
        : aboutContent.qualifications,
    approachesHeading: (page?.approachesHeading as string) || "Approaches",
    approaches:
      (page?.approaches as string[])?.length
        ? (page?.approaches as string[])
        : [...modalities],
    availability: (page?.availability as string) || aboutContent.availability,
    sidebarButtonLabel:
      (page?.sidebarButtonLabel as string) || "Request a consult",
    servicesHeading: (page?.servicesHeading as string) || "Services",
    servicesIntro:
      (page?.servicesIntro as string) ||
      "The same focused areas of care you'll see throughout this site — offered one-to-one.",
    endorsementsHeading:
      (page?.endorsementsHeading as string) || "Colleague endorsements",
    endorsements:
      (page?.endorsements as Endorsement[])?.length
        ? (page?.endorsements as Endorsement[])
        : endorsements,
  };
}

export async function getRatesPage() {
  const [page, home] = await Promise.all([
    sanityFetch<Record<string, unknown>>({
      query: ratesPageQuery,
      tags: ["ratesPage"],
    }),
    getHomePage(),
  ]);
  const settings = await getSiteSettings();

  return {
    title: (page?.title as string) || ratesContent.title,
    intro: (page?.intro as string) || ratesContent.intro,
    sidePhoto: page?.sidePhoto || home.heroImage,
    sidePhotoAlt:
      (page?.sidePhotoAlt as string) ||
      home.heroImageAlt ||
      home.heroCaptionName,
    feesHeading: (page?.feesHeading as string) || "Fees",
    sessionFee: (page?.sessionFee as string) || siteConfig.sessionFee,
    sessionFeeLabel: (page?.sessionFeeLabel as string) || "per individual session",
    feeNote: (page?.feeNote as string) || ratesContent.feeNote,
    paymentMethodsHeading:
      (page?.paymentMethodsHeading as string) || "Payment methods",
    paymentMethods:
      (page?.paymentMethods as string[])?.length
        ? (page?.paymentMethods as string[])
        : [...paymentMethods],
    insuranceHeading: (page?.insuranceHeading as string) || "Insurance",
    insuranceIntro:
      (page?.insuranceIntro as string) ||
      "I accept insurance and can also work with out-of-network benefits through Thrizer.",
    insuranceList:
      (page?.insuranceList as string[])?.length
        ? (page?.insuranceList as string[])
        : [...insuranceList],
    insuranceButtonLabel:
      (page?.insuranceButtonLabel as string) || "Ask about availability",
    thrizerHeading:
      (page?.thrizerHeading as string) || "Check out-of-network benefits",
    thrizerNote: (page?.thrizerNote as string) || ratesContent.thrizerNote,
    thrizerDisclaimer:
      (page?.thrizerDisclaimer as string) || ratesContent.thrizerDisclaimer,
    thrizerWidgetUrl:
      (page?.thrizerWidgetUrl as string) ||
      settings.thrizerWidgetUrl ||
      process.env.NEXT_PUBLIC_THRIZER_WIDGET_URL ||
      "",
  };
}

export async function getContactPage() {
  const [page, home] = await Promise.all([
    sanityFetch<Record<string, unknown>>({
      query: contactPageQuery,
      tags: ["contactPage"],
    }),
    getHomePage(),
  ]);

  return {
    eyebrow: (page?.eyebrow as string) || "Contact",
    title: (page?.title as string) || "Let's connect",
    intro:
      (page?.intro as string) ||
      `Share a short note to request a free ${siteConfig.consultLength} consultation. I work hard to get clients booked within a week of consult.`,
    locationLabel: (page?.locationLabel as string) || "Location",
    locationText:
      (page?.locationText as string) ||
      `${siteConfig.location} · In-person and online across North Carolina`,
    formHeading: (page?.formHeading as string) || "Get in touch",
    formIntro:
      (page?.formIntro as string) ||
      "Request a free 15-minute consultation. Please do not include clinical details or sensitive health information — this form is only for scheduling.",
    sidePhoto: page?.sidePhoto || home.heroImage,
    sidePhotoAlt:
      (page?.sidePhotoAlt as string) ||
      home.heroImageAlt ||
      home.heroCaptionName,
  };
}

export async function getFaqPage() {
  const page = await sanityFetch<{
    title?: string;
    intro?: string;
    faqs?: FaqItem[];
  }>({
    query: faqPageQuery,
    tags: ["faqPage"],
  });

  const faqs =
    page?.faqs?.filter((item) => item?.question && item?.answer)?.length
      ? (page.faqs as FaqItem[])
      : faqContent.faqs;

  return {
    title: page?.title || faqContent.title,
    intro: page?.intro || faqContent.intro,
    faqs,
    homeFaqs: faqs.filter((item) => item.showOnHome).slice(0, 4),
  };
}

export async function getPrivacyPage() {
  const page = await sanityFetch<{ title?: string; body?: unknown }>({
    query: privacyPageQuery,
    tags: ["privacyPage"],
  });

  return {
    title: page?.title || "Privacy",
    body: page?.body || null,
  };
}
