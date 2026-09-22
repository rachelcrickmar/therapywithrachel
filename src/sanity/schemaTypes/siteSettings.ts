import { defineArrayMember, defineField, defineType } from "sanity";

const navLinkFields = [
  defineField({
    name: "label",
    title: "Link title",
    type: "string",
    validation: (rule) => rule.required(),
  }),
  defineField({
    name: "href",
    title: "Page path",
    type: "string",
    description: 'Example: /about  or  /rates  or  /contact',
    validation: (rule) => rule.required(),
  }),
];

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  description: "Header, footer, and practice-wide details.",
  groups: [
    { name: "brand", title: "1. Practice name & details", default: true },
    { name: "nav", title: "2. Navbar" },
    { name: "footer", title: "3. Footer" },
    { name: "badges", title: "4. Badges" },
    { name: "seo", title: "5. Search & Thrizer" },
  ],
  fields: [
    defineField({
      name: "practiceName",
      title: "Practice name (logo text)",
      type: "string",
      group: "brand",
      initialValue: "Therapy With Rachel",
      description: "Shown in the top-left of the navbar and in the footer.",
    }),
    defineField({
      name: "legalName",
      title: "Legal business name",
      type: "string",
      group: "brand",
      initialValue: "Therapy With Rachel, PLLC",
      description: "Used in the footer copyright line.",
    }),
    defineField({
      name: "therapistName",
      title: "Therapist name",
      type: "string",
      group: "brand",
      initialValue: "Rachel Crickmar",
    }),
    defineField({
      name: "credentials",
      title: "Credentials",
      type: "string",
      group: "brand",
      initialValue: "MSW, LCSWA",
    }),
    defineField({
      name: "license",
      title: "License line",
      type: "string",
      group: "brand",
      initialValue: "Licensed by the State of North Carolina / P022493",
      description: "Shown near the bottom of the footer.",
    }),
    defineField({
      name: "location",
      title: "Location line",
      type: "string",
      group: "brand",
      initialValue: "Wake Forest, NC",
    }),
    defineField({
      name: "email",
      title: "Practice email (optional)",
      type: "string",
      group: "brand",
      description:
        "For your records / future use. Not shown publicly unless you add it to a page.",
    }),

    defineField({
      name: "navLinks",
      title: "Navbar links",
      type: "array",
      group: "nav",
      description:
        "Links shown in the top menu (desktop and mobile). Drag to reorder.",
      of: [
        defineArrayMember({
          type: "object",
          name: "navLink",
          title: "Nav link",
          fields: navLinkFields,
          preview: {
            select: { title: "label", subtitle: "href" },
          },
        }),
      ],
      initialValue: [
        { _type: "navLink", _key: "about", label: "About", href: "/about" },
        {
          _type: "navLink",
          _key: "rates",
          label: "Rates & insurance",
          href: "/rates",
        },
        { _type: "navLink", _key: "faq", label: "FAQ", href: "/faq" },
        { _type: "navLink", _key: "blog", label: "Blog", href: "/blog" },
      ],
    }),
    defineField({
      name: "contactButtonLabel",
      title: "Get in touch button text",
      type: "string",
      group: "nav",
      initialValue: "Get in touch",
      description: "The green button in the navbar.",
    }),
    defineField({
      name: "contactButtonHref",
      title: "Get in touch button link",
      type: "string",
      group: "nav",
      initialValue: "/contact",
    }),

    defineField({
      name: "footerTagline",
      title: "Footer details under the practice name",
      type: "text",
      rows: 3,
      group: "footer",
      description:
        "Usually legal name, credentials, and location. Use a new line if you want.",
      initialValue:
        "Therapy With Rachel, PLLC · Rachel Crickmar, MSW, LCSWA\nWake Forest, NC · In-person and online across North Carolina",
    }),
    defineField({
      name: "footerLinks",
      title: "Footer links",
      type: "array",
      group: "footer",
      description: "Links in the footer. Drag to reorder.",
      of: [
        defineArrayMember({
          type: "object",
          name: "footerLink",
          title: "Footer link",
          fields: navLinkFields,
          preview: {
            select: { title: "label", subtitle: "href" },
          },
        }),
      ],
      initialValue: [
        { _type: "footerLink", _key: "about", label: "About", href: "/about" },
        { _type: "footerLink", _key: "rates", label: "Rates", href: "/rates" },
        { _type: "footerLink", _key: "faq", label: "FAQ", href: "/faq" },
        { _type: "footerLink", _key: "blog", label: "Blog", href: "/blog" },
        {
          _type: "footerLink",
          _key: "contact",
          label: "Contact",
          href: "/contact",
        },
        {
          _type: "footerLink",
          _key: "privacy",
          label: "Privacy",
          href: "/privacy",
        },
      ],
    }),
    defineField({
      name: "crisisNote",
      title: "Crisis / emergency note",
      type: "text",
      rows: 3,
      group: "footer",
      initialValue:
        "This website is not for emergencies. If you are in crisis, call or text 988 (Suicide & Crisis Lifeline), or call 911.",
    }),

    defineField({
      name: "psychologyTodayBadgeEnabled",
      title: "Show Psychology Today verified badge",
      type: "boolean",
      group: "badges",
      initialValue: true,
      description:
        "Official verified seal from Psychology Today. Turn on, then choose where it appears.",
    }),
    defineField({
      name: "psychologyTodayPlacements",
      title: "Where to show the badge",
      type: "array",
      group: "badges",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Footer (all pages)", value: "footer" },
          { title: "Home — under the Get in touch buttons", value: "homeHero" },
          { title: "About — sidebar", value: "about" },
        ],
        layout: "grid",
      },
      initialValue: ["footer"],
      hidden: ({ parent }) => !parent?.psychologyTodayBadgeEnabled,
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as
            | { psychologyTodayBadgeEnabled?: boolean }
            | undefined;
          if (!parent?.psychologyTodayBadgeEnabled) return true;
          if (!value || value.length === 0) {
            return "Pick at least one place to show the badge.";
          }
          return true;
        }),
    }),
    defineField({
      name: "psychologyTodayEmbed",
      title: "Psychology Today embed code",
      type: "text",
      rows: 6,
      group: "badges",
      initialValue: `<script type="text/javascript" src="https://member.psychologytoday.com/verified-seal.js" data-badge="13" data-id="1608263" data-code="aHR0cHM6Ly93d3cucHN5Y2hvbG9neXRvZGF5LmNvbS9hcGkvdmVyaWZpZWQtc2VhbC9zZWFscy8xMy9wcm9maWxlLzE2MDgyNjM/Y2FsbGJhY2s9c3hjYWxsYmFjaw=="></script>`,
      description:
        "Paste the Psychology Today embed here (the <script …> line is enough). If your editor turns --> into an arrow, that’s fine — we only need data-id, data-badge, and data-code. Publish after saving.",
      hidden: ({ parent }) => !parent?.psychologyTodayBadgeEnabled,
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as
            | {
                psychologyTodayBadgeEnabled?: boolean;
                psychologyTodayProfileId?: string;
                psychologyTodayCode?: string;
              }
            | undefined;
          if (!parent?.psychologyTodayBadgeEnabled) return true;
          if (
            parent.psychologyTodayProfileId?.trim() &&
            parent.psychologyTodayCode?.trim()
          ) {
            return true;
          }
          if (!value?.trim()) {
            return "Paste your Psychology Today embed, or fill in the advanced fields below.";
          }
          // Lazy require via dynamic pattern — keep validation in sync with parser
          const cleaned = value
            .replace(/→/g, "-->")
            .replace(/←/g, "<!--")
            .replace(/<!—/g, "<!--")
            .replace(/<!–/g, "<!--")
            .replace(/—>/g, "-->")
            .replace(/–>/g, "-->")
            .replace(/[“”]/g, '"')
            .replace(/[‘’]/g, "'");
          const hasId =
            /data-id\s*=\s*["']?\d+/i.test(cleaned) ||
            /psychologytoday\.com\/(?:us\/)?profile\/\d+/i.test(cleaned);
          const hasCode = /data-code\s*=\s*["']?[A-Za-z0-9+/=]{20,}/i.test(
            cleaned,
          );
          if (!hasId || !hasCode) {
            return "Couldn’t find data-id and data-code. Paste the <script> line from Psychology Today (comments optional).";
          }
          return true;
        }),
    }),
    defineField({
      name: "psychologyTodayProfileId",
      title: "Profile ID (advanced)",
      type: "string",
      group: "badges",
      description:
        "Optional override. Usually left blank — taken from the embed above.",
      hidden: ({ parent }) => !parent?.psychologyTodayBadgeEnabled,
    }),
    defineField({
      name: "psychologyTodayBadge",
      title: "Badge style number (advanced)",
      type: "string",
      group: "badges",
      description:
        "Optional override for data-badge. Different PT badge designs use different numbers.",
      hidden: ({ parent }) => !parent?.psychologyTodayBadgeEnabled,
    }),
    defineField({
      name: "psychologyTodayCode",
      title: "Verification code (advanced)",
      type: "text",
      rows: 2,
      group: "badges",
      description:
        "Optional override for data-code. Prefer pasting a new full embed above when Psychology Today sends an update.",
      hidden: ({ parent }) => !parent?.psychologyTodayBadgeEnabled,
    }),

    defineField({
      name: "thrizerWidgetUrl",
      title: "Thrizer benefits checker link",
      type: "url",
      group: "seo",
      description:
        "From Thrizer → Benefits → Widget settings → shareable link. Paste the full https://… URL here.",
    }),
    defineField({
      name: "seoTitle",
      title: "Google title (optional)",
      type: "string",
      group: "seo",
      description: "Overrides the default browser/search title if set.",
    }),
    defineField({
      name: "seoDescription",
      title: "Google description (optional)",
      type: "text",
      rows: 3,
      group: "seo",
      description: "Short blurb search engines may show under your site name.",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site settings" }),
  },
});
