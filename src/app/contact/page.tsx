import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { FadeIn } from "@/components/FadeIn";
import { PageImage } from "@/components/PageImage";
import { getContactPage } from "@/lib/get-content";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Get in touch",
  description: `Request a free ${siteConfig.consultLength} consultation with ${siteConfig.therapistName}.`,
};

export default async function ContactPage() {
  const page = await getContactPage();

  return (
    <section className="atmosphere relative overflow-hidden">
      <div className="paper-grain absolute inset-0" aria-hidden />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-5 py-20 md:grid-cols-[0.9fr_1.1fr] md:px-8 md:py-28">
        <FadeIn>
          <div className="space-y-8">
            <div>
              <p className="text-sm font-medium tracking-[0.14em] text-sage uppercase">
                {page.eyebrow}
              </p>
              <h1 className="mt-3 font-serif text-4xl text-ink md:text-5xl">
                {page.title}
              </h1>
              <p className="mt-6 text-base leading-relaxed text-ink-muted md:text-lg">
                {page.intro}
              </p>
              <dl className="mt-10 space-y-4 text-sm text-ink-muted">
                <div>
                  <dt className="font-medium text-ink">{page.locationLabel}</dt>
                  <dd>{page.locationText}</dd>
                </div>
              </dl>
            </div>
            <div className="relative aspect-[4/5] max-w-sm overflow-hidden rounded-2xl">
              <PageImage
                value={page.sidePhoto}
                alt={page.sidePhotoAlt || siteConfig.therapistName}
                fallbackSrc="/images/session-conversation.jpg"
                fallbackAlt="A calm therapy conversation in progress"
                className="object-cover object-[center_20%]"
                sizes="(min-width: 768px) 28vw, 90vw"
              />
            </div>
          </div>
        </FadeIn>
        <FadeIn delayMs={100}>
          <ContactForm heading={page.formHeading} intro={page.formIntro} />
        </FadeIn>
      </div>
    </section>
  );
}
