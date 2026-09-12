import { Resend } from "resend";
import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { siteConfig } from "@/lib/site";
import { hasSanityConfig } from "@/sanity/env";
import { getWriteClient } from "@/sanity/lib/write-client";

type ContactBody = {
  name?: string;
  email?: string;
  phone?: string;
  preferredContact?: string;
  message?: string;
  company?: string;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const limited = rateLimit(`contact:${ip}`);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      {
        status: 429,
        headers: { "Retry-After": String(limited.retryAfterSec) },
      },
    );
  }

  let body: ContactBody;
  try {
    body = (await request.json()) as ContactBody;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot
  if (body.company) {
    return NextResponse.json({ ok: true });
  }

  const name = body.name?.trim() || "";
  const email = body.email?.trim() || "";
  const phone = body.phone?.trim() || "";
  const preferredContact = body.preferredContact?.trim() || "either";
  const message = body.message?.trim() || "";

  if (!name || name.length > 120) {
    return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
  }
  if (!email || !isValidEmail(email) || email.length > 200) {
    return NextResponse.json(
      { error: "Please enter a valid email." },
      { status: 400 },
    );
  }
  if (!message || message.length > 2000) {
    return NextResponse.json(
      { error: "Please enter a short message (max 2000 characters)." },
      { status: 400 },
    );
  }

  if (!hasSanityConfig || !process.env.SANITY_API_WRITE_TOKEN) {
    return NextResponse.json(
      {
        error:
          "The contact form is not fully configured yet. Please call or email using the details on this site.",
      },
      { status: 503 },
    );
  }

  try {
    const client = getWriteClient();
    await client.create({
      _type: "inquiry",
      name,
      email,
      phone: phone || undefined,
      preferredContact,
      message,
      status: "new",
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to save inquiry:", error);
    return NextResponse.json(
      { error: "Could not save your message. Please try again later." },
      { status: 500 },
    );
  }

  const resendKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL;
  if (resendKey && toEmail) {
    try {
      const resend = new Resend(resendKey);
      await resend.emails.send({
        from:
          process.env.CONTACT_FROM_EMAIL ||
          "Therapy With Rachel <onboarding@resend.dev>",
        to: toEmail,
        replyTo: email,
        subject: `New inquiry from ${name}`,
        text: [
          `New website inquiry for ${siteConfig.name}`,
          "",
          `Name: ${name}`,
          `Email: ${email}`,
          `Phone: ${phone || "(not provided)"}`,
          `Preferred contact: ${preferredContact}`,
          "",
          message,
          "",
          "View and manage inquiries in Sanity Studio → Inquiries.",
        ].join("\n"),
      });
    } catch (error) {
      // Inquiry already saved — do not fail the request if email fails
      console.error("Resend email failed:", error);
    }
  }

  return NextResponse.json({ ok: true });
}
