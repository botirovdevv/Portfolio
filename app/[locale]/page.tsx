import { notFound } from "next/navigation";
import { About } from "@/components/sections/about";
import { BlogPreview } from "@/components/sections/blog-preview";
import { Contact } from "@/components/sections/contact";
import { Domains } from "@/components/sections/domains";
import { Experience } from "@/components/sections/experience";
import { Hero } from "@/components/sections/hero";
import { Projects } from "@/components/sections/projects";
import { Skills } from "@/components/sections/skills";
import { getDictionary, isLocale } from "@/lib/i18n";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <>
      <Hero dict={dict.hero} locale={locale} />
      <Domains dict={dict.domains} />
      <About dict={dict.about} />
      <Skills dict={dict.skills} />
      <Experience dict={dict.experience} locale={locale} />
      <Projects dict={dict.projects} locale={locale} />
      <BlogPreview dict={dict.blog} locale={locale} />
      <Contact dict={dict.contact} />
    </>
  );
}
