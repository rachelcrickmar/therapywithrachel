import { defineField, defineType } from "sanity";

export const ratesPage = defineType({
  name: "ratesPage",
  title: "Rates & insurance page",
  type: "document",
  groups: [
    { name: "intro", title: "1. Page intro", default: true },
    { name: "fees", title: "2. Fees" },
    { name: "insurance", title: "3. Insurance" },
    { name: "thrizer", title: "4. Thrizer benefits widget" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Page title",
      type: "string",
      group: "intro",
      initialValue: "Rates & insurance",
    }),
    defineField({
      name: "intro",
      title: "Intro paragraph",
      type: "text",
      rows: 3,
      group: "intro",
    }),
    defineField({
      name: "sidePhoto",
      title: "Photo in the intro section",
      type: "image",
      group: "intro",
      options: { hotspot: true },
      description:
        "Optional photo of you. If empty, the site uses your Home page hero photo.",
    }),
    defineField({
      name: "sidePhotoAlt",
      title: "Photo description",
      type: "string",
      group: "intro",
    }),

    defineField({
      name: "feesHeading",
      title: "Fees heading",
      type: "string",
      group: "fees",
      initialValue: "Fees",
    }),
    defineField({
      name: "sessionFee",
      title: "Session fee (display)",
      type: "string",
      group: "fees",
      description: 'Example: "$150"',
      initialValue: "$150",
    }),
    defineField({
      name: "sessionFeeLabel",
      title: "Under the fee",
      type: "string",
      group: "fees",
      initialValue: "per individual session",
    }),
    defineField({
      name: "feeNote",
      title: "Fee details",
      type: "text",
      rows: 3,
      group: "fees",
    }),
    defineField({
      name: "paymentMethodsHeading",
      title: "Payment methods heading",
      type: "string",
      group: "fees",
      initialValue: "Payment methods",
    }),
    defineField({
      name: "paymentMethods",
      title: "Payment methods",
      type: "array",
      group: "fees",
      of: [{ type: "string" }],
    }),

    defineField({
      name: "insuranceHeading",
      title: "Insurance heading",
      type: "string",
      group: "insurance",
      initialValue: "Insurance",
    }),
    defineField({
      name: "insuranceIntro",
      title: "Insurance intro",
      type: "text",
      rows: 3,
      group: "insurance",
    }),
    defineField({
      name: "insuranceList",
      title: "Accepted insurance / payment options",
      type: "array",
      group: "insurance",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "insuranceButtonLabel",
      title: "Button under insurance",
      type: "string",
      group: "insurance",
      initialValue: "Ask about availability",
    }),

    defineField({
      name: "thrizerHeading",
      title: "Thrizer section heading",
      type: "string",
      group: "thrizer",
      initialValue: "Check out-of-network benefits",
    }),
    defineField({
      name: "thrizerNote",
      title: "Thrizer explanation",
      type: "text",
      rows: 3,
      group: "thrizer",
    }),
    defineField({
      name: "thrizerDisclaimer",
      title: "Disclaimer under Thrizer",
      type: "text",
      rows: 2,
      group: "thrizer",
    }),
    defineField({
      name: "thrizerWidgetUrl",
      title: "Thrizer widget URL (optional override)",
      type: "url",
      group: "thrizer",
      description:
        "If set, used on this page. Otherwise Site settings → Thrizer link is used.",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Rates & insurance page" }),
  },
});
