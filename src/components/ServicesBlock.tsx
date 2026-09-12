import type { Service } from "@/lib/content";
import { FadeIn } from "./FadeIn";

export function ServicesBlock({
  services,
  heading = "How we can work together",
  intro,
}: {
  services: Service[];
  heading?: string;
  intro?: string;
}) {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
      <FadeIn>
        <div className="max-w-2xl">
          <p className="text-sm font-medium tracking-[0.14em] text-sage uppercase">
            Services
          </p>
          <h2 className="mt-3 font-serif text-3xl text-ink md:text-4xl">
            {heading}
          </h2>
          {intro ? (
            <p className="mt-4 text-base leading-relaxed text-ink-muted md:text-lg">
              {intro}
            </p>
          ) : null}
        </div>
      </FadeIn>

      <div className="mt-12 grid gap-10 md:grid-cols-2">
        {services.map((service, index) => (
          <FadeIn key={service.title} delayMs={index * 80}>
            <article className="border-t border-line pt-6">
              <h3 className="font-serif text-2xl text-ink">{service.title}</h3>
              <p className="mt-3 text-base leading-relaxed text-ink-muted">
                {service.description}
              </p>
            </article>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
