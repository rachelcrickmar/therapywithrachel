import type { Metadata } from "next";
import Link from "next/link";
import { PortableBody } from "@/components/PortableBody";
import { getPrivacyPage } from "@/lib/get-content";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: `Privacy information for the ${siteConfig.name} website contact form.`,
};

const fallbackBody = [
  {
    _type: "block",
    style: "normal",
    children: [
      {
        _type: "span",
        text: `This page explains how the ${siteConfig.name} website handles information you submit through the contact form.`,
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
        text: "Form submissions are stored in the practice's Sanity content workspace so they can be reviewed securely. If email notification is enabled, a copy of the inquiry may also be sent to the practice email address.",
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
];

export default async function PrivacyPage() {
  const page = await getPrivacyPage();

  return (
    <section className="mx-auto max-w-3xl px-5 py-20 md:px-8 md:py-28">
      <h1 className="font-serif text-4xl text-ink md:text-5xl">{page.title}</h1>
      <div className="mt-8">
        <PortableBody value={page.body || fallbackBody} />
      </div>
      {!page.body ? (
        <p className="mt-6 text-base leading-relaxed text-ink-muted">
          Questions about this site?{" "}
          <Link href="/contact" className="text-sage-deep hover:underline">
            Get in touch
          </Link>
          .
        </p>
      ) : null}
    </section>
  );
}
