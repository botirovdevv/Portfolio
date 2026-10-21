import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { profile, siteUrl } from "@/content/profile";
import { fontVariables } from "@/lib/fonts";
import { getDictionary, isLocale, locales } from "@/lib/i18n";
import { alternates, JsonLd, openGraph, personJsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: "#0b0c0e",
  colorScheme: "dark",
  viewportFit: "cover",
};

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale).meta;
  return {
    metadataBase: new URL(siteUrl),
    title: { default: t.title, template: `%s — ${profile.name}` },
    description: t.description,
    applicationName: profile.name,
    authors: [{ name: profile.name, url: siteUrl }],
    creator: profile.name,
    keywords: [
      "Mustafo Botirov",
      "frontend developer",
      "frontend dasturchi",
      "React developer",
      "Next.js developer",
      "TypeScript",
      "web developer Uzbekistan",
      "dasturchi Xorazm",
      "portfolio",
    ],
    alternates: alternates(locale),
    openGraph: openGraph(locale, { title: t.title, description: t.description, type: "profile" }),
    twitter: { card: "summary_large_image", title: t.title, description: t.description },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      yandex: process.env.YANDEX_VERIFICATION,
    },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <html lang={locale} className={fontVariables}>
      <head>
        <link rel="alternate" type="application/rss+xml" title={`${profile.name} — Blog`} href="/feed.xml" />
        <JsonLd data={personJsonLd(locale)} />
      </head>
      <body className="min-h-dvh font-sans antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-amber focus:px-4 focus:py-2 focus:text-amber-ink"
        >
          Skip to content
        </a>
        <ScrollProgress />
        <CardSpotlight />
        <Header locale={locale} nav={dict.nav} menu={dict.menu} ticker={dict.ticker} />
        <main id="main">{children}</main>
        <Footer dict={dict.footer} homeHref={`/${locale}`} />
      </body>
    </html>
  );
}
