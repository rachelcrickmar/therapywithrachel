import { groq } from "next-sanity";

const imageFields = `
  asset->{
    _id,
    url,
    metadata { lqip, dimensions }
  },
  hotspot,
  crop
`;

export const servicesQuery = groq`
  *[_type == "service"] | order(order asc) {
    title,
    description,
    order
  }
`;

export const postsQuery = groq`
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    coverImage { ${imageFields} },
    coverImageAlt
  }
`;

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    coverImage { ${imageFields} },
    coverImageAlt,
    body[] {
      ...,
      _type == "imageBlock" => {
        ...,
        image { ${imageFields} }
      }
    }
  }
`;

export const postSlugsQuery = groq`
  *[_type == "post" && defined(slug.current)][].slug.current
`;

export const homePageQuery = groq`
  *[_id == "homePage"][0] {
    brandName,
    headline,
    subhead,
    heroImage { ${imageFields} },
    heroImageAlt,
    heroCaptionName,
    heroCaptionDetail,
    primaryButtonLabel,
    secondaryButtonLabel,
    consultNote,
    whoHeading,
    whoBody,
    whoImage { ${imageFields} },
    whoImageAlt,
    servicesHeading,
    servicesIntro,
    approachHeading,
    approachBody,
    approachImage { ${imageFields} },
    approachImageAlt,
    modalities,
    ctaHeading,
    ctaBody,
    consultImage { ${imageFields} },
    consultImageAlt
  }
`;

export const aboutPageQuery = groq`
  *[_id == "aboutPage"][0] {
    title,
    intro,
    portrait { ${imageFields} },
    portraitAlt,
    story,
    qualificationsHeading,
    qualifications,
    approachesHeading,
    approaches,
    availability,
    sidebarButtonLabel,
    storyImage { ${imageFields} },
    storyImageAlt,
    storyQuote,
    servicesHeading,
    servicesIntro,
    endorsementsHeading,
    endorsements
  }
`;

export const contactPageQuery = groq`
  *[_id == "contactPage"][0] {
    eyebrow,
    title,
    intro,
    locationLabel,
    locationText,
    formHeading,
    formIntro,
    sidePhoto { ${imageFields} },
    sidePhotoAlt
  }
`;

export const ratesPageQuery = groq`
  *[_id == "ratesPage"][0] {
    title,
    intro,
    sidePhoto { ${imageFields} },
    sidePhotoAlt,
    feesHeading,
    sessionFee,
    sessionFeeLabel,
    feeNote,
    paymentMethodsHeading,
    paymentMethods,
    insuranceHeading,
    insuranceIntro,
    insuranceList,
    insuranceButtonLabel,
    thrizerHeading,
    thrizerNote,
    thrizerDisclaimer,
    thrizerImage { ${imageFields} },
    thrizerImageAlt,
    thrizerWidgetUrl
  }
`;

export const faqPageQuery = groq`
  *[_id == "faqPage"][0] {
    title,
    intro,
    faqs[] {
      question,
      answer,
      showOnHome
    }
  }
`;

export const privacyPageQuery = groq`
  *[_id == "privacyPage"][0] {
    title,
    body[] {
      ...,
      _type == "imageBlock" => {
        ...,
        image { ${imageFields} }
      }
    }
  }
`;

export const siteSettingsQuery = groq`
  *[_id == "siteSettings"][0] {
    practiceName,
    legalName,
    therapistName,
    credentials,
    license,
    email,
    location,
    navLinks[] { label, href },
    contactButtonLabel,
    contactButtonHref,
    footerTagline,
    footerLinks[] { label, href },
    crisisNote,
    psychologyTodayBadgeEnabled,
    psychologyTodayPlacements,
    psychologyTodayEmbed,
    psychologyTodayProfileId,
    psychologyTodayBadge,
    psychologyTodayCode,
    thrizerWidgetUrl,
    seoTitle,
    seoDescription
  }
`;
