import {
  aboutContent,
  defaultServices,
  endorsements,
  homeContent,
  insuranceList,
  modalities,
  paymentMethods,
  ratesContent,
  type Endorsement,
  type Service,
} from "@/lib/content";
import { siteConfig } from "@/lib/site";
import { sanityFetch } from "@/sanity/lib/client";
import {
  aboutPageQuery,
  contactPageQuery,
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

export async function getSiteSettings() {
  return (
    (await sanityFetch<{
      practiceName?: string;
      location?: string;
      thrizerWidgetUrl?: string;
      seoTitle?: string;
      seoDescription?: string;
    }>({ query: siteSettingsQuery, tags: ["siteSettings"] })) || {}
  );
}

export async function getHomePage() {
  const page = await sanityFetch<Record<string, unknown>>({
    query: homePageQuery,
    tags: ["homePage"],
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
  };
}

export async function getAboutPage() {
  const page = await sanityFetch<Record<string, unknown>>({
    query: aboutPageQuery,
    tags: ["aboutPage"],
  });

  return {
    title: (page?.title as string) || aboutContent.title,
    intro: (page?.intro as string) || aboutContent.intro,
    portrait: page?.portrait,
    portraitAlt: (page?.portraitAlt as string) || "",
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
  const page = await sanityFetch<Record<string, unknown>>({
    query: ratesPageQuery,
    tags: ["ratesPage"],
  });
  const settings = await getSiteSettings();

  return {
    title: (page?.title as string) || ratesContent.title,
    intro: (page?.intro as string) || ratesContent.intro,
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
  const page = await sanityFetch<Record<string, unknown>>({
    query: contactPageQuery,
    tags: ["contactPage"],
  });

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
