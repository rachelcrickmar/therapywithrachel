"use client";

export function LiveSiteHelp() {
  const siteUrl =
    (typeof process !== "undefined" &&
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "")) ||
    "http://localhost:3000";

  return (
    <div
      style={{
        padding: "2.5rem",
        maxWidth: "36rem",
        fontFamily:
          "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
        lineHeight: 1.55,
        color: "#1c2a26",
      }}
    >
      <h2 style={{ fontSize: "1.5rem", margin: "0 0 0.75rem" }}>
        How to edit your website
      </h2>
      <p style={{ margin: "0 0 1rem", color: "#4a5a54" }}>
        Everything important lives in the left menu. Publish when you&apos;re
        done — the live site updates shortly after.
      </p>
      <p style={{ margin: "0 0 1.25rem" }}>
        <a
          href={siteUrl}
          target="_blank"
          rel="noreferrer"
          style={{ color: "#3f564c", fontWeight: 600 }}
        >
          Open website →
        </a>
      </p>
      <ol style={{ margin: 0, paddingLeft: "1.25rem", color: "#4a5a54" }}>
        <li style={{ marginBottom: "0.5rem" }}>
          <strong>New messages</strong> — people who filled out Get in touch
        </li>
        <li style={{ marginBottom: "0.5rem" }}>
          <strong>Edit website pages</strong> — Home, About, Rates, Contact,
          Privacy (each section is clearly labeled)
        </li>
        <li style={{ marginBottom: "0.5rem" }}>
          <strong>Services</strong> — therapy areas listed on Home &amp; About
        </li>
        <li style={{ marginBottom: "0.5rem" }}>
          <strong>Write a blog post</strong> — add text, images, and a “book /
          contact” button block with the + menu
        </li>
        <li>
          <strong>Site settings</strong> — practice name, location, Thrizer link
        </li>
      </ol>
    </div>
  );
}
