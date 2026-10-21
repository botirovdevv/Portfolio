import { Rss, Send } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/page-hero";
import { PostRow } from "@/components/post-card";
import { EmptyPosts } from "@/components/sections/blog-preview";
import { Reveal } from "@/components/ui/reveal";
import { profile } from "@/content/profile";
import { getDictionary, isLocale } from "@/lib/i18n";
import { getPublishedPosts } from "@/lib/posts";
import { alternates, openGraph } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/blog">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale).blog;
  return {
    title: t.pageTitle,
    description: t.pageDescription,
    alternates: alternates(locale, "/blog"),
    openGraph: openGraph(locale, { title: t.pageTitle, description: t.pageDescription, path: "/blog" }),
  };
}

export default async function BlogPage({ params }: PageProps<"/[locale]/blog">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale).blog;
  const posts = await getPublishedPosts();

  return (
    <PageShell>
      <Reveal className="mb-14 max-w-[44rem]">
        <p className="eyebrow">{dict.kicker}</p>
        <h1 className="mt-5 font-display text-[clamp(2.6rem,1.4rem+5vw,4.8rem)] font-extrabold leading-[0.98] tracking-[-0.055em]">
          {dict.pageTitle}
        </h1>
        <p className="mt-6 text-[17px] leading-relaxed text-muted">{dict.pageSubtitle}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={profile.telegramChannel} target="_blank" rel="noopener noreferrer" className="btn-amber">
            <Send size={16} />
            {dict.telegram}
          </a>
          <a href="/feed.xml" className="btn-ghost">
            <Rss size={16} className="text-amber" />
            RSS
          </a>
        </div>
      </Reveal>

      {posts.length === 0 ? (
        <EmptyPosts text={dict.empty} />
      ) : (
        <ul className="-mx-5 divide-y divide-line-soft border-t border-line-soft sm:-mx-6">
          {posts.map((post, i) => (
            <Reveal as="li" key={post.id} delay={Math.min(i, 5) * 60}>
              <PostRow post={post} locale={locale} dict={dict} />
            </Reveal>
          ))}
        </ul>
      )}
    </PageShell>
  );
}
