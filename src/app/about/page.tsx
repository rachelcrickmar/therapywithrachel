import type { Metadata } from "next";
import { ButtonLink } from "@/components/ButtonLink";
import { FadeIn } from "@/components/FadeIn";
import { ServicesBlock } from "@/components/ServicesBlock";
import { aboutContent, endorsements, modalities } from "@/lib/content";
import { getServices } from "@/lib/get-content";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `Meet ${siteConfig.therapistName}, ${siteConfig.credentials} — trauma, OCD, and ADHD therapy in ${siteConfig.location}.`,
};

export default async function AboutPage() {
  const services = await getServices();

  return (
    <>
      <section className="atmosphere relative overflow-hidden border-b border-line">
        <div className="paper-grain absolute inset-0" aria-hidden />
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
          <FadeIn>
            <p className="text-sm font-medium tracking-[0.14em] text-sage uppercase">
              About
            </p>
            <h1 className="mt-3 max-w-2xl font-serif text-4xl text-ink md:text-5xl">
              {aboutContent.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
              {aboutContent.intro}
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-12 px-5 py-20 md:grid-cols-[1.2fr_0.8fr] md:px-8 md:py-28">
        <FadeIn>
          <div className="space-y-5">
            {aboutContent.story.map((paragraph) => (
              <p
                key={paragraph.slice(0, 32)}
                className="text-base leading-relaxed text-ink-muted md:text-lg"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </FadeIn>
        <FadeIn delayMs={100}>
          <aside className="space-y-6 border-t border-line pt-6 md:border-t-0 md:border-l md:pt-0 md:pl-8">
            <div>
              <h2 className="font-serif text-2xl text-ink">Qualifications</h2>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-ink-muted">
                {aboutContent.qualifications.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-serif text-2xl text-ink">Approaches</h2>
              <ul className="mt-4 space-y-2 text-sm text-ink-muted">
                {modalities.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <p className="text-sm leading-relaxed text-ink-muted">
              {aboutContent.availability}
            </p>
            <ButtonLink href="/contact">Request a consult</ButtonLink>
          </aside>
        </FadeIn>
      </section>

      <ServicesBlock
        services={services}
        heading="Services"
        intro="The same focused areas of care you'll see throughout this site — offered one-to-one."
      />

      <section className="border-t border-line bg-stone/30">
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
          <FadeIn>
            <h2 className="font-serif text-3xl text-ink md:text-4xl">
              Colleague endorsements
            </h2>
          </FadeIn>
          <div className="mt-12 grid gap-10 md:grid-cols-2">
            {endorsements.map((item, index) => (
              <FadeIn key={item.name} delayMs={index * 60}>
                <blockquote className="border-t border-line pt-6">
                  <p className="font-serif text-xl leading-relaxed text-ink">
                    “{item.quote}”
                  </p>
                  <footer className="mt-4 text-sm text-ink-muted">
                    <cite className="not-italic font-medium text-ink">
                      {item.name}
                    </cite>
                    <span className="block">{item.credentials}</span>
                  </footer>
                </blockquote>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
