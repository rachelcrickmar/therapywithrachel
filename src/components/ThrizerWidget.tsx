export function ThrizerWidget({
  url,
  heading = "Check out-of-network benefits",
  note,
  disclaimer,
}: {
  url?: string | null;
  heading?: string;
  note: string;
  disclaimer: string;
}) {
  const widgetUrl = url || process.env.NEXT_PUBLIC_THRIZER_WIDGET_URL || "";

  return (
    <section className="rounded-lg border border-line bg-mist/40 p-6 md:p-8">
      <h2 className="font-serif text-2xl text-ink md:text-3xl">{heading}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-muted md:text-base">
        {note}
      </p>
      <p className="mt-2 text-xs text-ink-muted">{disclaimer}</p>

      {widgetUrl ? (
        <div className="mt-6 overflow-hidden rounded-md border border-line bg-paper">
          <iframe
            title="Thrizer out-of-network benefits checker"
            src={widgetUrl}
            className="h-[720px] w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      ) : (
        <div className="mt-6 rounded-md border border-dashed border-sage/40 bg-paper/70 px-5 py-10 text-center">
          <p className="font-serif text-xl text-ink">Thrizer widget coming soon</p>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-muted">
            Paste the shareable Benefits Widget link from Thrizer into Site
            settings or the Rates page in Admin.
          </p>
        </div>
      )}
    </section>
  );
}
