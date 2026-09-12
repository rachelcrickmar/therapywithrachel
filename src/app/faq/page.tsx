import type { Metadata } from "next";
import Image from "next/image";
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
      <div className="relative mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <div className="grid items-end gap-10 md:grid-cols-[1.2fr_0.8fr]">
          <FadeIn>
            <p className="text-sm font-medium tracking-[0.14em] text-blush-deep uppercase">
              FAQ
            </p>
            <h1 className="mt-3 max-w-2xl font-serif text-4xl text-ink md:text-5xl">
              {page.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
              {page.intro}
            </p>
          </FadeIn>
          <FadeIn delayMs={80}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
              <Image
                src="/images/teen-woman-outdoors.jpg"
                alt="Teen woman outdoors in soft daylight"
                fill
                className="object-cover object-center"
                sizes="(min-width: 768px) 30vw, 100vw"
              />
            </div>
          </FadeIn>
        </div>

        <FadeIn delayMs={100}>
          <div className="mt-14">
            <FaqAccordion items={page.faqs} />
          </div>
        </FadeIn>

        <FadeIn delayMs={120}>
          <div className="mt-14 flex flex-wrap items-center gap-4 border-t border-line pt-10">
            <p className="text-base text-ink-muted">
              Still have a question? Reach out for a free consultation.
            </p>
            <ButtonLink href="/contact">Get in touch</ButtonLink>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
