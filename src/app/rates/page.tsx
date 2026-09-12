import type { Metadata } from "next";
import { ButtonLink } from "@/components/ButtonLink";
import { FadeIn } from "@/components/FadeIn";
import { ThrizerWidget } from "@/components/ThrizerWidget";
import { getRatesPage } from "@/lib/get-content";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Rates & insurance",
  description: `Session fees, insurance, and out-of-network benefits for ${siteConfig.name}.`,
};

export default async function RatesPage() {
  const page = await getRatesPage();

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
              {page.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
              {page.intro}
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <div className="grid gap-14 md:grid-cols-2">
          <FadeIn>
            <div>
              <h2 className="font-serif text-3xl text-ink">{page.feesHeading}</h2>
              <p className="mt-4 font-serif text-5xl text-sage-deep">
                {page.sessionFee}
              </p>
              <p className="mt-2 text-sm text-ink-muted">{page.sessionFeeLabel}</p>
              <p className="mt-6 text-base leading-relaxed text-ink-muted">
                {page.feeNote}
              </p>
              <div className="mt-8">
                <h3 className="text-sm font-medium tracking-wide text-ink uppercase">
                  {page.paymentMethodsHeading}
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-ink-muted">
                  {page.paymentMethods.map((method) => (
                    <li key={method}>{method}</li>
                  ))}
                </ul>
              </div>
            </div>
          </FadeIn>

          <FadeIn delayMs={80}>
            <div>
              <h2 className="font-serif text-3xl text-ink">
                {page.insuranceHeading}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-ink-muted">
                {page.insuranceIntro}
              </p>
              <ul className="mt-6 space-y-3 border-t border-line pt-6 text-base text-ink">
                {page.insuranceList.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sage" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <ButtonLink href="/contact">{page.insuranceButtonLabel}</ButtonLink>
              </div>
            </div>
          </FadeIn>
        </div>

        <div className="mt-16">
          <ThrizerWidget
            url={page.thrizerWidgetUrl}
            heading={page.thrizerHeading}
            note={page.thrizerNote}
            disclaimer={page.thrizerDisclaimer}
          />
        </div>
      </section>
    </>
  );
}
