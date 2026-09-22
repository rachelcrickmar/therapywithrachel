import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ButtonLink";
import { ContactForm } from "@/components/ContactForm";
import { FadeIn } from "@/components/FadeIn";
import { FaqAccordion } from "@/components/FaqAccordion";
import { HeroAtmosphere } from "@/components/HeroAtmosphere";
import {
  EcoIcon,
  PsychologyIcon,
  SelfImprovementIcon,
  VolunteerIcon,
} from "@/components/MaterialIcons";
import { PsychologyTodayBadge } from "@/components/PsychologyTodayBadge";
import { hasSanityImage, SanityImage } from "@/components/SanityImage";
import { ServicesBlock } from "@/components/ServicesBlock";
import {
  getFaqPage,
  getHomePage,
  getServices,
  getSiteSettings,
} from "@/lib/get-content";
import { showPsychologyTodayBadge } from "@/lib/psychology-today";

export const revalidate = 30;

const focusPoints = [
  {
    label: "Trauma-informed care",
    Icon: VolunteerIcon,
  },
  {
    label: "Evidence-based approaches",
    Icon: PsychologyIcon,
  },
  {
    label: "Steady, collaborative pace",
    Icon: SelfImprovementIcon,
  },
  {
    label: "Grounded in presence",
    Icon: EcoIcon,
  },
];

export default async function HomePage() {
  const [services, page, faq, settings] = await Promise.all([
    getServices(),
    getHomePage(),
    getFaqPage(),
    getSiteSettings(),
  ]);
  const showHeroPhoto = hasSanityImage(page.heroImage as never);
  const consultPhoto = hasSanityImage(page.consultImage as never)
    ? page.consultImage
    : page.heroImage;
  const showConsultPhoto = hasSanityImage(consultPhoto as never);
  const homeFaqs = faq.homeFaqs;
  const showPtBadge = showPsychologyTodayBadge(
    settings.psychologyToday,
    "homeHero",
  );

  return (
    <>
      <section className="relative isolate overflow-hidden">
        <HeroAtmosphere />
        <div className="relative mx-auto grid min-h-[88vh] max-w-6xl items-end gap-10 px-5 pb-16 pt-24 md:grid-cols-[1.1fr_0.9fr] md:items-center md:px-8 md:pb-24 md:pt-28">
          <div className="animate-fade-up max-w-xl">
            <p className="font-serif text-4xl leading-tight tracking-tight text-ink md:text-6xl md:leading-[1.05]">
              {page.brandName}
            </p>
            <h1 className="mt-6 max-w-lg text-xl leading-relaxed text-ink-muted md:text-2xl">
              {page.headline}
            </h1>
            <p className="mt-4 max-w-md text-base leading-relaxed text-ink-muted">
              {page.subhead}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/contact" trackLocation="home_hero">
                {page.primaryButtonLabel}
              </ButtonLink>
              <ButtonLink href="/about" variant="secondary">
                {page.secondaryButtonLabel}
              </ButtonLink>
            </div>
            {showPtBadge ? (
              <PsychologyTodayBadge
                profileId={settings.psychologyToday.profileId}
                badge={settings.psychologyToday.badge}
                code={settings.psychologyToday.code}
                className="mt-6"
              />
            ) : null}
            {page.consultNote ? (
              <p className="mt-6 text-sm text-ink-muted">{page.consultNote}</p>
            ) : null}
          </div>

          <div
            className="hero-portrait-card animate-fade-up"
            style={{ animationDelay: "120ms" }}
          >
            <div className="hero-portrait-card__shimmer" aria-hidden />
            <div className="hero-portrait-card__sparkles" aria-hidden />
            <div className="hero-portrait-card__inner">
              <div className="relative aspect-[4/5] w-full overflow-hidden md:aspect-[5/6]">
                {showHeroPhoto ? (
                  <SanityImage
                    value={page.heroImage as never}
                    alt={page.heroImageAlt || page.heroCaptionName}
                    className="object-cover object-[center_18%]"
                    fill
                    priority
                    sizes="(min-width: 768px) 42vw, 100vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-sage/35 via-mist-deep/60 to-blush/30" />
                )}
                <div className="hero-fade-soft absolute inset-x-0 bottom-0 h-16 md:h-20" />
              </div>
              <div className="border-t border-line/60 bg-paper px-6 py-5 md:px-8 md:py-6">
                <p className="font-serif text-2xl text-ink md:text-3xl">
                  {page.heroCaptionName}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  {page.heroCaptionDetail}
                  <br />
                  In-person &amp; online
                </p>
                {!showHeroPhoto ? (
                  <p className="mt-4 text-xs tracking-wide text-ink-muted uppercase">
                    Add a hero photo in Admin → Home page
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-stone/50">
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
          <div className="grid items-center gap-12 md:grid-cols-[1.05fr_0.95fr]">
            <FadeIn>
              <div>
                <p className="text-sm font-medium tracking-[0.14em] text-blush-deep uppercase">
                  Connection
                </p>
                <h2 className="mt-3 font-serif text-3xl text-ink md:text-4xl">
                  {page.whoHeading}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-ink-muted md:text-lg">
                  {page.whoBody}
                </p>
                <ul className="mt-8 grid gap-4 sm:grid-cols-2">
                  {focusPoints.map(({ label, Icon }) => (
                    <li
                      key={label}
                      className="flex items-start gap-3 text-sm text-ink-muted"
                    >
                      <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blush-soft/70 text-blush-deep">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="pt-1.5 leading-snug">{label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
            <FadeIn delayMs={100}>
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl md:aspect-[5/6]">
                <Image
                  src="/images/session-conversation.jpg"
                  alt="Two women talking together in a calm therapy session"
                  fill
                  className="object-cover object-center"
                  sizes="(min-width: 768px) 40vw, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-sage-deep/25 to-transparent" />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <ServicesBlock
        services={services}
        heading={page.servicesHeading}
        intro={page.servicesIntro}
      />

      <section className="relative overflow-hidden bg-mist/60">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 md:grid-cols-2 md:px-8 md:py-28">
          <FadeIn>
            <div className="relative aspect-[16/11] overflow-hidden rounded-2xl">
              <Image
                src="/images/session-listening.jpg"
                alt="Therapist and client talking during a counseling session"
                fill
                className="object-cover object-center"
                sizes="(min-width: 768px) 45vw, 100vw"
              />
            </div>
          </FadeIn>
          <FadeIn delayMs={80}>
            <div>
              <p className="text-sm font-medium tracking-[0.14em] text-sage uppercase">
                Approach
              </p>
              <h2 className="mt-3 font-serif text-3xl text-ink md:text-4xl">
                {page.approachHeading}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-ink-muted md:text-lg">
                {page.approachBody}
              </p>
              <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-sm text-sage-deep">
                {page.modalities.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-sage/25 bg-paper/70 px-3 py-1.5"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        </div>
      </section>

      {homeFaqs.length ? (
        <section className="border-y border-line bg-stone/40">
          <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
            <FadeIn>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-medium tracking-[0.14em] text-blush-deep uppercase">
                    FAQ
                  </p>
                  <h2 className="mt-3 font-serif text-3xl text-ink md:text-4xl">
                    Common questions
                  </h2>
                </div>
                <Link
                  href="/faq"
                  className="text-sm font-medium text-sage-deep transition hover:text-ink"
                >
                  View all FAQs
                </Link>
              </div>
            </FadeIn>
            <FadeIn delayMs={80}>
              <div className="mt-10">
                <FaqAccordion items={homeFaqs} />
              </div>
            </FadeIn>
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <div className="grid items-start gap-10 md:grid-cols-[0.85fr_1.15fr]">
          <FadeIn>
            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium tracking-[0.14em] text-blush-deep uppercase">
                  Next step
                </p>
                <h2 className="mt-3 font-serif text-3xl text-ink md:text-4xl">
                  {page.ctaHeading}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-ink-muted md:text-lg">
                  {page.ctaBody}
                </p>
              </div>
              <div className="relative aspect-[4/5] max-w-md overflow-hidden rounded-2xl">
                {showConsultPhoto ? (
                  <SanityImage
                    value={consultPhoto as never}
                    alt={
                      page.consultImageAlt ||
                      page.heroImageAlt ||
                      page.heroCaptionName
                    }
                    className="object-cover object-[center_20%]"
                    fill
                    sizes="(min-width: 768px) 30vw, 90vw"
                  />
                ) : (
                  <Image
                    src="/images/session-support.jpg"
                    alt="Supportive conversation during a therapy session"
                    fill
                    className="object-cover object-center"
                    sizes="(min-width: 768px) 30vw, 90vw"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-sage-deep/20 to-transparent" />
              </div>
            </div>
          </FadeIn>
          <FadeIn delayMs={100}>
            <ContactForm trackLocation="home_cta" />
          </FadeIn>
        </div>
      </section>
    </>
  );
}
