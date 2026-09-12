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
        maxWidth: "32rem",
        fontFamily:
          "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
        lineHeight: 1.55,
        color: "#1c2a26",
      }}
    >
      <h2 style={{ fontSize: "1.5rem", margin: "0 0 0.75rem" }}>
        Your public website
      </h2>
      <p style={{ margin: "0 0 1rem", color: "#4a5a54" }}>
        Changes you publish here show up on the live site after a short refresh
        (usually under a minute).
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
        <li>
          <strong>New messages</strong> — people who filled out Get in touch
        </li>
        <li>
          <strong>Write a blog post</strong> — add or edit articles
        </li>
        <li>
          <strong>Services</strong> — the therapy areas listed on the site
        </li>
        <li>
          <strong>Site settings</strong> — phone, email, Thrizer link
        </li>
      </ol>
    </div>
  );
}
