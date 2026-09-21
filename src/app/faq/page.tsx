import type { Metadata } from "next";
import { ButtonLink } from "@/components/ButtonLink";
import { FadeIn } from "@/components/FadeIn";
import { FaqAccordion } from "@/components/FaqAccordion";
import { getFaqPage } from "@/lib/get-content";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "FAQ",
  description: `Common questions about therapy with ${siteConfig.therapistName} in ${siteConfig.location}.`,
};

export default async function FaqPage() {
  const page = await getFaqPage();

  return (
    <section className="atmosphere relative overflow-hidden">
      <div className="paper-grain absolute inset-0" aria-hidden />
      <div className="relative mx-auto max-w-3xl px-5 py-20 md:px-8 md:py-28">
        <FadeIn>
          <p className="text-sm font-medium tracking-[0.14em] text-blush-deep uppercase">
            FAQ
          </p>
          <h1 className="mt-3 font-serif text-4xl text-ink md:text-5xl">
            {page.title}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-ink-muted">
            {page.intro}
          </p>
        </FadeIn>

        <FadeIn delayMs={100}>
          <div className="mt-12">
            <FaqAccordion items={page.faqs} />
          </div>
        </FadeIn>

        <FadeIn delayMs={120}>
          <div className="mt-14 flex flex-wrap items-center gap-4 border-t border-line pt-10">
            <p className="text-base text-ink-muted">
              Still have a question? Reach out for a free consultation.
            </p>
            <ButtonLink href="/contact" trackLocation="faq_cta">
              Get in touch
            </ButtonLink>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
