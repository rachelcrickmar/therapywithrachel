import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: `Privacy information for the ${siteConfig.name} website contact form.`,
};

export default function PrivacyPage() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-20 md:px-8 md:py-28">
      <h1 className="font-serif text-4xl text-ink md:text-5xl">Privacy</h1>
      <div className="mt-8 space-y-5 text-base leading-relaxed text-ink-muted">
        <p>
          This page explains how the {siteConfig.name} website handles information
          you submit through the contact form.
        </p>
        <p>
          The contact form collects your name, email address, optional phone
          number, preferred contact method, and a short message. Please do not
          include clinical details, diagnoses, or other sensitive health
          information in the form. Clinical care is not provided through this
          website.
        </p>
        <p>
          Form submissions are stored in the practice&apos;s Sanity content
          workspace so they can be reviewed securely. If email notification is
          enabled, a copy of the inquiry may also be sent to the practice email
          address.
        </p>
        <p>
          This website is not monitored for emergencies. If you are in crisis,
          call or text 988, or call 911.
        </p>
        <p>
          Questions about this site?{" "}
          <Link href="/contact" className="text-sage-deep hover:underline">
            Get in touch
          </Link>{" "}
          or call{" "}
          <a href={siteConfig.phoneHref} className="text-sage-deep hover:underline">
            {siteConfig.phone}
          </a>
          .
        </p>
      </div>
    </section>
  );
}
