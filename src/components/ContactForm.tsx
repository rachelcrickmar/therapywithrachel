"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm({ compact = false }: { compact?: boolean }) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setError(null);

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          preferredContact: formData.get("preferredContact"),
          message: formData.get("message"),
          company: formData.get("company"),
        }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className={`space-y-5 ${compact ? "" : "rounded-lg border border-line bg-paper/70 p-6 md:p-8"}`}
      noValidate
    >
      <div className="space-y-2">
        <h2 className="font-serif text-2xl text-ink md:text-3xl">
          Get in touch
        </h2>
        <p className="text-sm leading-relaxed text-ink-muted">
          Request a free 15-minute consultation. Please do not include clinical
          details or sensitive health information — this form is only for
          scheduling.
        </p>
      </div>

      {/* Honeypot */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div className="grid gap-5 md:grid-cols-2">
        <label className="block text-sm text-ink">
          Name
          <input
            required
            name="name"
            type="text"
            autoComplete="name"
            className="mt-2 w-full rounded-md border border-line bg-paper px-3 py-2.5 text-base text-ink outline-none transition focus:border-sage"
          />
        </label>
        <label className="block text-sm text-ink">
          Email
          <input
            required
            name="email"
            type="email"
            autoComplete="email"
            className="mt-2 w-full rounded-md border border-line bg-paper px-3 py-2.5 text-base text-ink outline-none transition focus:border-sage"
          />
        </label>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="block text-sm text-ink">
          Phone <span className="text-ink-muted">(optional)</span>
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            className="mt-2 w-full rounded-md border border-line bg-paper px-3 py-2.5 text-base text-ink outline-none transition focus:border-sage"
          />
        </label>
        <label className="block text-sm text-ink">
          Preferred contact
          <select
            name="preferredContact"
            defaultValue="either"
            className="mt-2 w-full rounded-md border border-line bg-paper px-3 py-2.5 text-base text-ink outline-none transition focus:border-sage"
          >
            <option value="either">Either</option>
            <option value="email">Email</option>
            <option value="phone">Phone</option>
          </select>
        </label>
      </div>

      <label className="block text-sm text-ink">
        Message
        <textarea
          required
          name="message"
          rows={5}
          maxLength={2000}
          placeholder="A brief note about what you're looking for (no clinical details)."
          className="mt-2 w-full rounded-md border border-line bg-paper px-3 py-2.5 text-base text-ink outline-none transition focus:border-sage"
        />
      </label>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex items-center justify-center rounded-md bg-sage-deep px-5 py-3 text-sm font-medium text-paper transition hover:bg-ink disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : "Send message"}
      </button>

      {status === "success" ? (
        <p className="text-sm text-sage-deep" role="status">
          Thank you — your message was received. Rachel will be in touch soon.
        </p>
      ) : null}
      {status === "error" && error ? (
        <p className="text-sm text-red-800" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}
