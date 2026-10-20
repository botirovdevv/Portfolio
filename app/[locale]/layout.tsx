import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { SpotlightRoot } from "@/components/ui/spotlight-root";
import { profile, siteUrl } from "@/content/profile";
import { fontVariables } from "@/lib/fonts";
import { getDictionary, isLocale, locales } from "@/lib/i18n";
import { alternates, JsonLd, openGraph, personJsonLd } from "@/lib/seo";
import { themeScript } from "@/lib/theme-script";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#070b14" },
    { media: "(prefers-color-scheme: light)", color: "#f7f6f1" },
  ],
  colorScheme: "dark light",
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
    <html lang={locale} data-theme="dark" className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="alternate" type="application/rss+xml" title={`${profile.name} — Blog`} href="/feed.xml" />
        <JsonLd data={personJsonLd(locale)} />
      </head>
      <body className="min-h-dvh font-sans antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-accent-fill focus:px-4 focus:py-2 focus:text-[#070b14]"
        >
          Skip to content
        </a>
        <ScrollProgress />
        <SpotlightRoot />
        <Header locale={locale} nav={dict.nav} theme={dict.theme} menu={dict.menu} />
        <main id="main">{children}</main>
        <Footer dict={dict.footer} />
      </body>
    </html>
  );
}
