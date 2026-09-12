import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { FadeIn } from "@/components/FadeIn";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Get in touch",
  description: `Request a free ${siteConfig.consultLength} consultation with ${siteConfig.therapistName}.`,
};

export default function ContactPage() {
  return (
    <section className="atmosphere relative overflow-hidden">
      <div className="paper-grain absolute inset-0" aria-hidden />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-5 py-20 md:grid-cols-[0.9fr_1.1fr] md:px-8 md:py-28">
        <FadeIn>
          <div>
            <p className="text-sm font-medium tracking-[0.14em] text-sage uppercase">
              Contact
            </p>
            <h1 className="mt-3 font-serif text-4xl text-ink md:text-5xl">
              Let&apos;s connect
            </h1>
            <p className="mt-6 text-base leading-relaxed text-ink-muted md:text-lg">
              Share a short note to request a free {siteConfig.consultLength}{" "}
              consultation. I work hard to get clients booked within a week of
              consult.
            </p>
            <dl className="mt-10 space-y-4 text-sm text-ink-muted">
              <div>
                <dt className="font-medium text-ink">Phone</dt>
                <dd>
                  <a href={siteConfig.phoneHref} className="hover:text-sage-deep">
                    {siteConfig.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-medium text-ink">Location</dt>
                <dd>
                  {siteConfig.location} · In-person and online across North
                  Carolina
                </dd>
              </div>
            </dl>
          </div>
        </FadeIn>
        <FadeIn delayMs={100}>
          <ContactForm />
        </FadeIn>
      </div>
    </section>
  );
}
