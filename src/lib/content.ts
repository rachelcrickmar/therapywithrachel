export type Service = {
  title: string;
  description: string;
  order?: number;
};

export type Endorsement = {
  name: string;
  credentials?: string;
  quote: string;
};

export type FaqItem = {
  question: string;
  answer: string;
  showOnHome?: boolean;
};

export const homeContent = {
  brand: "Therapy With Rachel",
  headline: "Feel freer in daily life again.",
  subhead:
    "Trauma, OCD, and ADHD therapy with Rachel Crickmar — warm, clear, and paced to help you reduce triggers and intrusive thoughts.",
  whoHeading: "Who I work with",
  whoBody:
    "I enjoy working with people who want to reduce triggers and intrusive thoughts and begin to enjoy daily life again. People who have trauma that is hard to discuss, or who can't stop thinking or worrying, have a space with me. Most often, the clients I see are women who have tried their best to balance health, family, work, and self-care — and still feel drained and unsure what to do next.",
  approachHeading: "How I help",
  approachBody:
    "I help clients feel better at an effective pace using exposure-based interventions that support different diagnoses. Exposure therapy is one of the most proven ways to reduce anxiety and trauma responses. I am informational and will guide you every step of the way.",
  ctaHeading: "Free consultation",
  ctaBody:
    "Reach out for a free 15-minute consultation call. We'll figure out what next steps make the most sense for you.",
};

export const aboutContent = {
  title: "About Rachel",
  intro:
    "I'm Rachel Crickmar, a Clinical Social Worker (MSW, LCSWA) offering individual therapy in Wake Forest, NC and online across North Carolina.",
  story: [
    "I am a Clinical Social Worker, which means I bring a strong background in systems, cultural competency, and a strengths-based view of people. I draw from several evidence-based practices, and I believe it is important to look at the whole person before deciding on treatment — making an informed decision together about what is best for your healing.",
    "Some people find that EMDR is the best and only way to heal after trying everything; others are trying therapy for the first time and prefer an eclectic approach. Either way, I will meet you where you are.",
    "I help women and men who struggle to get out of their own heads and traumatic memories finally face them and let them go. Often people haven't been successful in past therapies due to a lack of understanding and nuance in neurodivergent psychological processing. Trust me — I get how frustrating that can be, and I am here to help you in the way you need.",
  ],
  qualifications: [
    "Clinical Social Work/Therapist, MSW, LCSWA",
    "Licensed by the State of North Carolina / P022493",
    "University of North Carolina at Chapel Hill, MSW",
    "Certificate from EMDR Consulting",
    "Certificate from International OCD Foundation",
  ],
  availability:
    "Available in-person and online. I work hard to get clients booked within a week of consult — I love to connect quickly and make sure you feel supported.",
};

export const ratesContent = {
  title: "Rates & insurance",
  intro:
    "Clear information about fees, insurance, and out-of-network benefits so you can decide what works for you.",
  feeNote:
    "Individual sessions are $150. Sliding scale available — apply if you may be eligible.",
  thrizerNote:
    "I use Thrizer for out-of-network benefits. You can check estimated benefits below when the widget is connected.",
  thrizerDisclaimer:
    "Widget results are estimates only. Your insurer determines final coverage, reimbursement, and claim outcomes.",
};

export const faqContent = {
  title: "Frequently asked questions",
  intro:
    "A few common questions about getting started, sessions, and insurance. If yours isn’t here, reach out — I’m happy to help.",
  faqs: [
    {
      question: "How do I get started?",
      answer:
        "Use the contact form to request a free 15-minute consultation. We’ll talk briefly about what you’re looking for and whether working together feels like a good fit.",
      showOnHome: true,
    },
    {
      question: "Do you offer virtual sessions?",
      answer:
        "Yes. I see clients in person in Wake Forest, NC and online across North Carolina.",
      showOnHome: true,
    },
    {
      question: "Is the consultation free?",
      answer:
        "Yes — the first consultation is a free 15-minute call so we can connect and talk about next steps.",
      showOnHome: true,
    },
    {
      question: "Do you accept insurance?",
      answer:
        "Yes. I accept several plans and can also help with out-of-network benefits through Thrizer. See the Rates & insurance page for details.",
      showOnHome: false,
    },
    {
      question: "How quickly can I get booked?",
      answer:
        "I work hard to get clients booked within a week of consult whenever possible.",
      showOnHome: true,
    },
    {
      question: "What should I put in the contact form?",
      answer:
        "Share your name, how to reach you, and a short note about scheduling. Please don’t include clinical details or sensitive health information — this form is only for getting in touch.",
      showOnHome: false,
    },
  ] satisfies FaqItem[],
};

export const modalities = [
  "EMDR",
  "Exposure Response Prevention (ERP)",
  "Prolonged Exposure Therapy",
  "Acceptance and Commitment (ACT)",
  "Attachment-based",
  "Trauma Focused",
];

export const paymentMethods = [
  "American Express",
  "Discover",
  "Mastercard",
  "Visa",
];

export const insuranceList = [
  "Aetna",
  "Cigna and Evernorth",
  "MedCost",
  "FSA",
  "HSA",
  "Out of Network (via Thrizer)",
];

export const defaultServices: Service[] = [
  {
    title: "Trauma & PTSD",
    description:
      "Process difficult memories at a pace that feels manageable, with approaches like EMDR and prolonged exposure when they fit.",
    order: 1,
  },
  {
    title: "OCD",
    description:
      "Exposure and Response Prevention (ERP) and related tools to reduce rituals and intrusive thoughts without fighting alone.",
    order: 2,
  },
  {
    title: "ADHD & anxiety",
    description:
      "Support for overwhelm, worry, and the mental load — practical and compassionate, tailored to how your mind works.",
    order: 3,
  },
];

export const endorsements: Endorsement[] = [
  {
    name: "Mary Wolinski",
    credentials: "Counselor, MS, LCMHCA",
    quote:
      "Rachel stands out for her strong clinical expertise and genuine compassion. Her collaborative, thoughtful style helps clients build insight, confidence, and lasting skills for meaningful change.",
  },
  {
    name: "Madison Clinger",
    credentials: "Clinical Social Work/Therapist, MSW, LCSW-A, PMH-C",
    quote:
      "Rachel is a compassionate therapist focused on supporting all her clients. She creates a warm and empathetic space for those who are opening up about trauma or adverse life experiences. Rachel is knowledgeable and makes therapy fun!",
  },
  {
    name: "Kristen Fowler",
    credentials: "Clinical Social Work/Therapist, MSW, LCSW-A",
    quote:
      "Rachel is a skilled therapist helping clients feel supported. She meets you where you're at whether experiencing trauma, living with ADHD, or navigating life changes. Her compassion and approach is a warm welcome!",
  },
  {
    name: "Julie Sams",
    credentials: "Licensed Professional Counselor, MA, LCMHCS, RYT",
    quote:
      "Rachel Crickmar has been with our practice for a year and is a joy to work with. EMDR-trained, upbeat, and energetic, she is exceptionally compassionate. She works wonderfully with adolescents and young adults.",
  },
];

export const samplePosts = [
  {
    _id: "sample-1",
    title: "What to expect from a first therapy consult",
    slug: "first-consult",
    excerpt:
      "A short look at how a free consultation works and what helps make the conversation useful.",
    publishedAt: "2025-11-12",
    body: [
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "A free consult is a short conversation to see whether working together feels like a good fit. You can share what you’re hoping for, ask about approach and logistics, and decide on next steps without committing to ongoing sessions yet.",
          },
        ],
      },
    ],
  },
  {
    _id: "sample-2",
    title: "ERP in plain language",
    slug: "erp-in-plain-language",
    excerpt:
      "Exposure and Response Prevention can sound intimidating. Here’s a gentle overview of what it actually involves.",
    publishedAt: "2025-12-03",
    body: [
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "ERP is a structured way to face feared thoughts or situations while learning not to rely on rituals or avoidance. It’s paced carefully, done together, and designed to help your nervous system learn that you can handle discomfort without the old safety behaviors.",
          },
        ],
      },
    ],
  },
];
