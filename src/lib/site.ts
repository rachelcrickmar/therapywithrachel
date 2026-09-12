export const siteConfig = {
  name: "Therapy With Rachel",
  legalName: "Therapy With Rachel, PLLC",
  therapistName: "Rachel Crickmar",
  credentials: "MSW, LCSWA",
  license: "Licensed by the State of North Carolina / P022493",
  location: "Wake Forest, NC",
  zip: "27587",
  sessionFee: "$150",
  consultLength: "15-minute",
  description:
    "Trauma, OCD, and ADHD therapy with Rachel Crickmar, MSW, LCSWA — in-person in Wake Forest, NC and online across North Carolina.",
  nearby: ["Raleigh, NC", "Wake Forest, NC", "Youngsville, NC"],
} as const;

export type SiteLink = {
  label: string;
  href: string;
};

export function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3000"
  );
}
