import { createClient } from "@sanity/client";
import { readFileSync } from "fs";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split(/\r?\n/)
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => {
      const i = line.indexOf("=");
      return [line.slice(0, i), line.slice(i + 1)];
    }),
);

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-01-01",
  token: env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

const docs = [
  {
    _id: "homePage",
    _type: "homePage",
    brandName: "Therapy With Rachel",
    headline: "Feel freer in daily life again.",
    subhead:
      "Trauma, OCD, and ADHD therapy with Rachel Crickmar — warm, clear, and paced to help you reduce triggers and intrusive thoughts.",
    heroCaptionName: "Rachel Crickmar",
    heroCaptionDetail: "MSW, LCSWA · Wake Forest, NC",
    primaryButtonLabel: "Get in touch",
    secondaryButtonLabel: "About Rachel",
    consultNote: "Free 15-minute consultation",
    whoHeading: "Who I work with",
    whoBody:
      "I enjoy working with people who want to reduce triggers and intrusive thoughts and begin to enjoy daily life again. People who have trauma that is hard to discuss, or who can't stop thinking or worrying, have a space with me. Most often, the clients I see are women who have tried their best to balance health, family, work, and self-care — and still feel drained and unsure what to do next.",
    servicesHeading: "How we can work together",
    servicesIntro:
      "Focused support for trauma, OCD, ADHD, and anxiety — with approaches chosen together.",
    approachHeading: "How I help",
    approachBody:
      "I help clients feel better at an effective pace using exposure-based interventions that support different diagnoses. Exposure therapy is one of the most proven ways to reduce anxiety and trauma responses. I am informational and will guide you every step of the way.",
    modalities: [
      "EMDR",
      "Exposure Response Prevention (ERP)",
      "Prolonged Exposure Therapy",
      "Acceptance and Commitment (ACT)",
      "Attachment-based",
      "Trauma Focused",
    ],
    ctaHeading: "Free consultation",
    ctaBody:
      "Reach out for a free 15-minute consultation call. We'll figure out what next steps make the most sense for you.",
  },
  {
    _id: "aboutPage",
    _type: "aboutPage",
    title: "About Rachel",
    intro:
      "I'm Rachel Crickmar, a Clinical Social Worker (MSW, LCSWA) offering individual therapy in Wake Forest, NC and online across North Carolina.",
    story: [
      "I am a Clinical Social Worker, which means I bring a strong background in systems, cultural competency, and a strengths-based view of people. I draw from several evidence-based practices, and I believe it is important to look at the whole person before deciding on treatment — making an informed decision together about what is best for your healing.",
      "Some people find that EMDR is the best and only way to heal after trying everything; others are trying therapy for the first time and prefer an eclectic approach. Either way, I will meet you where you are.",
      "I help women and men who struggle to get out of their own heads and traumatic memories finally face them and let them go. Often people haven't been successful in past therapies due to a lack of understanding and nuance in neurodivergent psychological processing. Trust me — I get how frustrating that can be, and I am here to help you in the way you need.",
    ],
    qualificationsHeading: "Qualifications",
    qualifications: [
      "Clinical Social Work/Therapist, MSW, LCSWA",
      "Licensed by the State of North Carolina / P022493",
      "University of North Carolina at Chapel Hill, MSW",
      "Certificate from EMDR Consulting",
      "Certificate from International OCD Foundation",
    ],
    approachesHeading: "Approaches",
    approaches: [
      "EMDR",
      "Exposure Response Prevention (ERP)",
      "Prolonged Exposure Therapy",
      "Acceptance and Commitment (ACT)",
      "Attachment-based",
      "Trauma Focused",
    ],
    availability:
      "Available in-person and online. I work hard to get clients booked within a week of consult — I love to connect quickly and make sure you feel supported.",
    sidebarButtonLabel: "Request a consult",
    servicesHeading: "Services",
    servicesIntro:
      "The same focused areas of care you'll see throughout this site — offered one-to-one.",
    endorsementsHeading: "Colleague endorsements",
    endorsements: [
      {
        _type: "endorsement",
        _key: "e1",
        name: "Mary Wolinski",
        credentials: "Counselor, MS, LCMHCA",
        quote:
          "Rachel stands out for her strong clinical expertise and genuine compassion. Her collaborative, thoughtful style helps clients build insight, confidence, and lasting skills for meaningful change.",
      },
      {
        _type: "endorsement",
        _key: "e2",
        name: "Madison Clinger",
        credentials: "Clinical Social Work/Therapist, MSW, LCSW-A, PMH-C",
        quote:
          "Rachel is a compassionate therapist focused on supporting all her clients. She creates a warm and empathetic space for those who are opening up about trauma or adverse life experiences. Rachel is knowledgeable and makes therapy fun!",
      },
      {
        _type: "endorsement",
        _key: "e3",
        name: "Kristen Fowler",
        credentials: "Clinical Social Work/Therapist, MSW, LCSW-A",
        quote:
          "Rachel is a skilled therapist helping clients feel supported. She meets you where you're at whether experiencing trauma, living with ADHD, or navigating life changes. Her compassion and approach is a warm welcome!",
      },
      {
        _type: "endorsement",
        _key: "e4",
        name: "Julie Sams",
        credentials: "Licensed Professional Counselor, MA, LCMHCS, RYT",
        quote:
          "Rachel Crickmar has been with our practice for a year and is a joy to work with. EMDR-trained, upbeat, and energetic, she is exceptionally compassionate. She works wonderfully with adolescents and young adults.",
      },
    ],
  },
  {
    _id: "ratesPage",
    _type: "ratesPage",
    title: "Rates & insurance",
    intro:
      "Clear information about fees, insurance, and out-of-network benefits so you can decide what works for you.",
    feesHeading: "Fees",
    sessionFee: "$150",
    sessionFeeLabel: "per individual session",
    feeNote:
      "Individual sessions are $150. Sliding scale available — apply if you may be eligible.",
    paymentMethodsHeading: "Payment methods",
    paymentMethods: ["American Express", "Discover", "Mastercard", "Visa"],
    insuranceHeading: "Insurance",
    insuranceIntro:
      "I accept insurance and can also work with out-of-network benefits through Thrizer.",
    insuranceList: [
      "Aetna",
      "Cigna and Evernorth",
      "MedCost",
      "FSA",
      "HSA",
      "Out of Network (via Thrizer)",
    ],
    insuranceButtonLabel: "Ask about availability",
    thrizerHeading: "Check out-of-network benefits",
    thrizerNote:
      "I use Thrizer for out-of-network benefits. You can check estimated benefits below when the widget is connected.",
    thrizerDisclaimer:
      "Widget results are estimates only. Your insurer determines final coverage, reimbursement, and claim outcomes.",
  },
  {
    _id: "contactPage",
    _type: "contactPage",
    eyebrow: "Contact",
    title: "Let's connect",
    intro:
      "Share a short note to request a free 15-minute consultation. I work hard to get clients booked within a week of consult.",
    locationLabel: "Location",
    locationText:
      "Wake Forest, NC · In-person and online across North Carolina",
    formHeading: "Get in touch",
    formIntro:
      "Request a free 15-minute consultation. Please do not include clinical details or sensitive health information — this form is only for scheduling.",
  },
  {
    _id: "privacyPage",
    _type: "privacyPage",
    title: "Privacy",
    body: [
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "This page explains how the Therapy With Rachel website handles information you submit through the contact form.",
          },
        ],
      },
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "The contact form collects your name, email address, optional phone number, preferred contact method, and a short message. Please do not include clinical details, diagnoses, or other sensitive health information in the form. Clinical care is not provided through this website.",
          },
        ],
      },
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "Form submissions are stored in the practice content workspace so they can be reviewed securely.",
          },
        ],
      },
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "This website is not monitored for emergencies. If you are in crisis, call or text 988, or call 911.",
          },
        ],
      },
      {
        _type: "ctaBlock",
        _key: "privacyCta",
        heading: "Questions about this site?",
        body: "Reach out through the contact form and Rachel will get back to you.",
        buttonLabel: "Get in touch",
        buttonLink: "/contact",
      },
    ],
  },
  {
    _id: "siteSettings",
    _type: "siteSettings",
    practiceName: "Therapy With Rachel",
    location: "Wake Forest, NC",
  },
];

for (const doc of docs) {
  await client.createOrReplace(doc);
  console.log("seeded", doc._id);
}
