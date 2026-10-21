import { getDictionary, isLocale } from "@/lib/i18n";
import { ogSize, renderOg } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Mustafo Botirov — Frontend Developer";

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = getDictionary(isLocale(locale) ? locale : "uz");
  return renderOg({ kicker: "Portfolio", title: "Mustafo Botirov", subtitle: `${t.hero.role} · React · Next.js · TypeScript` });
}
