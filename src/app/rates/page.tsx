import type { Metadata } from "next";
import { ButtonLink } from "@/components/ButtonLink";
import { FadeIn } from "@/components/FadeIn";
import { ThrizerWidget } from "@/components/ThrizerWidget";
import {
  insuranceList,
  paymentMethods,
  ratesContent,
} from "@/lib/content";
import { siteConfig } from "@/lib/site";
import { sanityFetch } from "@/sanity/lib/client";
import { siteSettingsQuery } from "@/sanity/lib/queries";

export const metadata: Metadata = {
  title: "Rates & insurance",
  description: `Session fees, insurance, and out-of-network benefits for ${siteConfig.name}.`,
};

type SiteSettings = {
  thrizerWidgetUrl?: string;
};

export default async function RatesPage() {
  const settings = await sanityFetch<SiteSettings>({
    query: siteSettingsQuery,
    tags: ["siteSettings"],
  });

  return (
    <>
      <section className="atmosphere relative overflow-hidden border-b border-line">
        <div className="paper-grain absolute inset-0" aria-hidden />
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
          <FadeIn>
            <p className="text-sm font-medium tracking-[0.14em] text-sage uppercase">
              Finances
            </p>
            <h1 className="mt-3 max-w-2xl font-serif text-4xl text-ink md:text-5xl">
              {ratesContent.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
              {ratesContent.intro}
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <div className="grid gap-14 md:grid-cols-2">
          <FadeIn>
            <div>
              <h2 className="font-serif text-3xl text-ink">Fees</h2>
              <p className="mt-4 font-serif text-5xl text-sage-deep">
                {siteConfig.sessionFee}
              </p>
              <p className="mt-2 text-sm text-ink-muted">per individual session</p>
              <p className="mt-6 text-base leading-relaxed text-ink-muted">
                {ratesContent.feeNote}
              </p>
              <div className="mt-8">
                <h3 className="text-sm font-medium tracking-wide text-ink uppercase">
                  Payment methods
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-ink-muted">
                  {paymentMethods.map((method) => (
                    <li key={method}>{method}</li>
                  ))}
                </ul>
              </div>
            </div>
          </FadeIn>

          <FadeIn delayMs={80}>
            <div>
              <h2 className="font-serif text-3xl text-ink">Insurance</h2>
              <p className="mt-4 text-base leading-relaxed text-ink-muted">
                I accept insurance and can also work with out-of-network benefits
                through Thrizer.
              </p>
              <ul className="mt-6 space-y-3 border-t border-line pt-6 text-base text-ink">
                {insuranceList.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sage" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <ButtonLink href="/contact">Ask about availability</ButtonLink>
              </div>
            </div>
          </FadeIn>
        </div>

        <div className="mt-16">
          <ThrizerWidget url={settings?.thrizerWidgetUrl} />
        </div>
      </section>
    </>
  );
}
