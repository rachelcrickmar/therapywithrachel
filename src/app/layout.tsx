import type { Metadata } from "next";
import { Newsreader, Plus_Jakarta_Sans } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { SiteAnalytics } from "@/components/SiteAnalytics";
import { getSiteSettings } from "@/lib/get-content";
import { getSiteUrl, siteConfig } from "@/lib/site";
import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const title =
    settings.seoTitle ||
    `${settings.practiceName} | ${settings.therapistName}, ${settings.credentials}`;
  const description = settings.seoDescription || siteConfig.description;

  return {
    metadataBase: new URL(getSiteUrl()),
    title: {
      default: title,
      template: `%s | ${settings.practiceName}`,
    },
    description,
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: settings.practiceName,
      title: settings.practiceName,
      description,
    },
    icons: {
      icon: [{ url: "/favicon.png", type: "image/png" }],
      apple: [{ url: "/favicon.png", type: "image/png" }],
    },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const settings = await getSiteSettings();

  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${plusJakarta.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <JsonLd />
        <SiteAnalytics />
        <Header
          practiceName={settings.practiceName}
          navLinks={settings.navLinks}
          contactButtonLabel={settings.contactButtonLabel}
          contactButtonHref={settings.contactButtonHref}
        />
        <main className="flex-1">{children}</main>
        <Footer
          practiceName={settings.practiceName}
          legalName={settings.legalName}
          license={settings.license}
          footerTagline={settings.footerTagline}
          footerLinks={settings.footerLinks}
          crisisNote={settings.crisisNote}
        />
      </body>
    </html>
  );
}
