import { ButtonLink } from "@/components/ButtonLink";
import { ContactForm } from "@/components/ContactForm";
import { FadeIn } from "@/components/FadeIn";
import { ServicesBlock } from "@/components/ServicesBlock";
import { homeContent, modalities } from "@/lib/content";
import { getServices } from "@/lib/get-content";
import { siteConfig } from "@/lib/site";

export default async function HomePage() {
  const services = await getServices();

  return (
    <>
      <section className="relative isolate overflow-hidden atmosphere">
        <div className="paper-grain absolute inset-0" aria-hidden />
        <div className="animate-drift absolute -top-24 right-[-10%] h-[420px] w-[420px] rounded-full bg-sage-soft/20 blur-3xl" aria-hidden />
        <div className="mx-auto grid min-h-[88vh] max-w-6xl items-end gap-10 px-5 pb-16 pt-24 md:grid-cols-[1.15fr_0.85fr] md:items-center md:px-8 md:pb-24 md:pt-28">
          <div className="animate-fade-up max-w-xl">
            <p className="font-serif text-4xl leading-tight tracking-tight text-ink md:text-6xl md:leading-[1.05]">
              {homeContent.brand}
            </p>
            <h1 className="mt-6 max-w-lg text-xl leading-relaxed text-ink-muted md:text-2xl">
              {homeContent.headline}
            </h1>
            <p className="mt-4 max-w-md text-base leading-relaxed text-ink-muted">
              {homeContent.subhead}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/contact">Get in touch</ButtonLink>
              <ButtonLink href="/about" variant="secondary">
                About Rachel
              </ButtonLink>
            </div>
            <p className="mt-6 text-sm text-ink-muted">
              Free {siteConfig.consultLength} consultation ·{" "}
              <a href={siteConfig.phoneHref} className="text-sage-deep hover:underline">
                {siteConfig.phone}
              </a>
            </p>
          </div>

          <div className="animate-fade-up relative min-h-[320px] overflow-hidden rounded-sm md:min-h-[480px]" style={{ animationDelay: "120ms" }}>
            <div className="absolute inset-0 bg-gradient-to-br from-sage/30 via-mist-deep/60 to-accent/25" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
              <p className="font-serif text-2xl text-ink md:text-3xl">
                {siteConfig.therapistName}
              </p>
              <p className="mt-2 text-sm text-ink-muted">
                {siteConfig.credentials} · {siteConfig.location}
                <br />
                In-person &amp; online
              </p>
              <p className="mt-4 text-xs tracking-wide text-ink-muted uppercase">
                Photo placeholder — Rachel will supply
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-stone/40">
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
          <FadeIn>
            <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr]">
              <h2 className="font-serif text-3xl text-ink md:text-4xl">
                {homeContent.whoHeading}
              </h2>
              <p className="text-base leading-relaxed text-ink-muted md:text-lg">
                {homeContent.whoBody}
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      <ServicesBlock
        services={services}
        intro="Focused support for trauma, OCD, ADHD, and anxiety — with approaches chosen together."
      />

      <section className="bg-mist/50">
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
          <FadeIn>
            <div className="max-w-2xl">
              <h2 className="font-serif text-3xl text-ink md:text-4xl">
                {homeContent.approachHeading}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-ink-muted md:text-lg">
                {homeContent.approachBody}
              </p>
            </div>
          </FadeIn>
          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-sage-deep">
            {modalities.map((item) => (
              <li key={item} className="border-b border-sage/25 pb-1">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-12 px-5 py-20 md:grid-cols-2 md:px-8 md:py-28">
        <FadeIn>
          <div>
            <h2 className="font-serif text-3xl text-ink md:text-4xl">
              {homeContent.ctaHeading}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-muted md:text-lg">
              {homeContent.ctaBody}
            </p>
            <p className="mt-6 text-sm text-ink-muted">
              Prefer to call?{" "}
              <a href={siteConfig.phoneHref} className="text-sage-deep hover:underline">
                {siteConfig.phone}
              </a>
            </p>
          </div>
        </FadeIn>
        <FadeIn delayMs={100}>
          <ContactForm />
        </FadeIn>
      </section>
    </>
  );
}
