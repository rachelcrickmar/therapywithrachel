export type Service = {
  title: string;
  description: string;
  order: number;
};

export type Endorsement = {
  name: string;
  credentials: string;
  quote: string;
};

export const defaultServices: Service[] = [
  {
    title: "Trauma & PTSD",
    description:
      "A steady space for trauma that is hard to discuss, recurring triggers, and memories that keep looping. EMDR and other exposure-based approaches help your nervous system let go of what is weighing you down.",
    order: 1,
  },
  {
    title: "OCD & Intrusive Thoughts",
    description:
      "Exposure and Response Prevention (ERP) for compulsions, phobias, and intrusive thoughts that steal your day. Practical, paced work so you can feel freer again.",
    order: 2,
  },
  {
    title: "ADHD & Neurodivergence",
    description:
      "Therapy that respects how neurodivergent minds process. If past therapy felt too one-size-fits-all, we build something that actually fits how you think and live.",
    order: 3,
  },
  {
    title: "Anxiety & Women's Issues",
    description:
      "For people — especially women balancing health, family, work, and self-care — who feel drained and unsure what to do next. Clear guidance, evidence-based tools, and a collaborative pace.",
    order: 4,
  },
];

export const modalities = [
  "EMDR",
  "Exposure Response Prevention (ERP)",
  "Prolonged Exposure Therapy",
  "Acceptance and Commitment (ACT)",
  "Attachment-based",
  "Trauma Focused",
] as const;

export const insuranceList = [
  "Aetna",
  "Cigna and Evernorth",
  "MedCost",
  "FSA",
  "HSA",
  "Out of Network (via Thrizer)",
] as const;

export const paymentMethods = [
  "American Express",
  "Discover",
  "Mastercard",
  "Visa",
] as const;

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
  feeNote: "Individual sessions are $150. Sliding scale available — apply if you may be eligible.",
  thrizerNote:
    "I use Thrizer for out-of-network benefits. You can check estimated benefits below when the widget is connected.",
  thrizerDisclaimer:
    "Widget results are estimates only. Your insurer determines final coverage, reimbursement, and claim outcomes.",
};

export const samplePosts = [
  {
    _id: "sample-1",
    title: "What to expect from a first consultation call",
    slug: "what-to-expect-from-a-consultation",
    excerpt:
      "A short look at how a free 15-minute consult works, what we'll talk about, and how to prepare.",
    publishedAt: "2026-03-01T12:00:00.000Z",
    body: [
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "Reaching out for therapy can feel like a big step. A free consultation call is simply a chance for us to see whether we might be a good fit — no pressure, no clinical deep-dive.",
          },
        ],
      },
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "We'll talk briefly about what brought you here, the kinds of approaches I use (like EMDR and ERP when they fit), and practical next steps. Please keep clinical details off web forms; save those for our call or session.",
          },
        ],
      },
    ],
  },
] as const;
