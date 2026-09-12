import { getSiteUrl, siteConfig } from "@/lib/site";

export function JsonLd() {
  const url = getSiteUrl();

  const data = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: siteConfig.legalName,
    alternateName: siteConfig.name,
    description: siteConfig.description,
    url,
    areaServed: [
      {
        "@type": "City",
        name: "Wake Forest",
        containedInPlace: { "@type": "State", name: "North Carolina" },
      },
      { "@type": "State", name: "North Carolina" },
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Wake Forest",
      addressRegion: "NC",
      postalCode: siteConfig.zip,
      addressCountry: "US",
    },
    priceRange: siteConfig.sessionFee,
    founder: {
      "@type": "Person",
      name: siteConfig.therapistName,
      jobTitle: "Clinical Social Work/Therapist",
      honorificSuffix: siteConfig.credentials,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
