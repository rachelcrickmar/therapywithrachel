import type { Metadata } from "next";
import Image from "next/image";
import { ButtonLink } from "@/components/ButtonLink";
import { FadeIn } from "@/components/FadeIn";
import { hasSanityImage, SanityImage } from "@/components/SanityImage";
import { ServicesBlock } from "@/components/ServicesBlock";
import { getAboutPage, getServices } from "@/lib/get-content";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `Meet ${siteConfig.therapistName}, ${siteConfig.credentials} — trauma, OCD, and ADHD therapy in ${siteConfig.location}.`,
};

export default async function AboutPage() {
  const [services, page] = await Promise.all([getServices(), getAboutPage()]);
  const showPortrait = hasSanityImage(page.portrait as never);

  return (
    <>
      <section className="atmosphere relative overflow-hidden border-b border-line">
        <div className="paper-grain absolute inset-0" aria-hidden />
        <div className="relative mx-auto grid max-w-6xl items-end gap-10 px-5 py-20 md:grid-cols-[1.15fr_0.85fr] md:px-8 md:py-28">
          <FadeIn>
            <p className="text-sm font-medium tracking-[0.14em] text-blush-deep uppercase">
              About
            </p>
            <h1 className="mt-3 max-w-2xl font-serif text-4xl text-ink md:text-5xl">
              {page.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
              {page.intro}
            </p>
          </FadeIn>
          {showPortrait ? (
            <FadeIn delayMs={80}>
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                <SanityImage
                  value={page.portrait as never}
                  alt={page.portraitAlt || siteConfig.therapistName}
                  className="object-cover object-[center_20%]"
                  fill
                  sizes="(min-width: 768px) 35vw, 100vw"
                />
              </div>
            </FadeIn>
          ) : null}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-12 px-5 py-20 md:grid-cols-[1.2fr_0.8fr] md:px-8 md:py-28">
        <FadeIn>
          <div className="space-y-5">
            {page.story.map((paragraph) => (
              <p
                key={paragraph.slice(0, 40)}
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
              <h2 className="font-serif text-2xl text-ink">
                {page.qualificationsHeading}
              </h2>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-ink-muted">
                {page.qualifications.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-serif text-2xl text-ink">
                {page.approachesHeading}
              </h2>
              <ul className="mt-4 space-y-2 text-sm text-ink-muted">
                {page.approaches.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <p className="text-sm leading-relaxed text-ink-muted">
              {page.availability}
            </p>
            <ButtonLink href="/contact" trackLocation="about_sidebar">
              {page.sidebarButtonLabel}
            </ButtonLink>
          </aside>
        </FadeIn>
      </section>

      <section className="border-y border-line bg-mist/50">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-2 md:px-8 md:py-20">
          <FadeIn>
            <div className="relative aspect-[16/11] overflow-hidden rounded-2xl">
              <Image
                src="/images/session-couch.jpg"
                alt="Therapist and client in conversation on a couch"
                fill
                className="object-cover"
                sizes="(min-width: 768px) 45vw, 100vw"
              />
            </div>
          </FadeIn>
          <FadeIn delayMs={80}>
            <p className="font-serif text-2xl leading-relaxed text-ink md:text-3xl">
              A steady, collaborative space for women and teens navigating
              trauma, OCD, ADHD, and the weight of everyday life.
            </p>
          </FadeIn>
        </div>
      </section>

      <ServicesBlock
        services={services}
        heading={page.servicesHeading}
        intro={page.servicesIntro}
      />

      <section className="border-t border-line bg-stone/30">
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
          <FadeIn>
            <h2 className="font-serif text-3xl text-ink md:text-4xl">
              {page.endorsementsHeading}
            </h2>
          </FadeIn>
          <div className="mt-12 grid gap-10 md:grid-cols-2">
            {page.endorsements.map((item, index) => (
              <FadeIn key={item.name} delayMs={index * 60}>
                <blockquote className="border-t border-line pt-6">
                  <p className="font-serif text-xl leading-relaxed text-ink">
                    “{item.quote}”
                  </p>
                  <footer className="mt-4 text-sm text-ink-muted">
                    <cite className="not-italic font-medium text-ink">
                      {item.name}
                    </cite>
                    {item.credentials ? (
                      <span className="block">{item.credentials}</span>
                    ) : null}
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
