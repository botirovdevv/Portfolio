import type { Metadata } from "next";
import { profile, siteUrl } from "@/content/profile";
import { allSkills } from "@/content/skills";
import { locales, ogLocale, type Locale } from "./i18n";

/** Canonical + hreflang alternates for a path that exists in every locale (path without locale, e.g. "/blog"). */
export function alternates(locale: Locale, path = ""): Metadata["alternates"] {
  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = `${siteUrl}/${l}${path}`;
  languages["x-default"] = `${siteUrl}/en${path}`;
  return { canonical: `${siteUrl}/${locale}${path}`, languages };
}

export function openGraph(
  locale: Locale,
  data: { title: string; description: string; path?: string; type?: "website" | "article" | "profile" },
): Metadata["openGraph"] {
  return {
    type: data.type ?? "website",
    url: `${siteUrl}/${locale}${data.path ?? ""}`,
    siteName: profile.name,
    title: data.title,
    description: data.description,
    locale: ogLocale[locale],
    alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocale[l]),
  };
}

export function personJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${siteUrl}/#person`,
        name: profile.name,
        alternateName: "Mustafo Botirov",
        url: siteUrl,
        image: `${siteUrl}/${locale}/opengraph-image`,
        jobTitle: locale === "uz" ? "Frontend dasturchi" : "Frontend Developer",
        knowsAbout: allSkills.map((s) => s.name),
        alumniOf: { "@type": "CollegeOrUniversity", name: profile.university },
        address: { "@type": "PostalAddress", addressRegion: "Khorezm", addressCountry: "UZ" },
        sameAs: [profile.github, profile.telegram, profile.linkedin, profile.instagram].filter((u) => !u.includes("your_")),
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: profile.name,
        inLanguage: ["uz", "en"],
        publisher: { "@id": `${siteUrl}/#person` },
      },
    ],
  };
}

export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
