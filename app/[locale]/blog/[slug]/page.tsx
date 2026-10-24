import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate } from "@/components/post-card";
import { ArrowLeft, CalendarDays, Clock3, Hash, Send } from "lucide-react";
import { PageShell } from "@/components/page-hero";
import { BrandIcon, type BrandName } from "@/components/ui/brand-icon";
import { profile, siteUrl } from "@/content/profile";
import { getDictionary, isLocale, ogLocale } from "@/lib/i18n";
import { renderMarkdown } from "@/lib/markdown";
import { getPostBySlug, getPublishedPosts } from "@/lib/posts";
import { alternates, JsonLd } from "@/lib/seo";
import { readingMinutes } from "@/lib/slug";

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  // Cache Components needs at least one param to validate the route at build time.
  return posts.length ? posts.map((p) => ({ slug: p.slug })) : [{ slug: "hello" }];
}

export async function generateMetadata({ params }: PageProps<"/[locale]/blog/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const post = await getPostBySlug(slug);
  if (!post) return {};
  const image = post.cover ? (post.cover.startsWith("/") ? `${siteUrl}${post.cover}` : post.cover) : undefined;
  return {
    title: post.title,
    description: post.excerpt,
    alternates: alternates(locale, `/blog/${post.slug}`),
    openGraph: {
      type: "article",
      url: `${siteUrl}/${locale}/blog/${post.slug}`,
      title: post.title,
      description: post.excerpt,
      locale: ogLocale[locale],
      publishedTime: new Date(post.createdAt).toISOString(),
      modifiedTime: new Date(post.updatedAt).toISOString(),
      authors: [profile.name],
      tags: post.tags,
      ...(image && { images: [{ url: image }] }),
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.excerpt },
  };
}

export default async function PostPage({ params }: PageProps<"/[locale]/blog/[slug]">) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const post = await getPostBySlug(slug);
  if (!post) notFound();
  const dict = getDictionary(locale).blog;
  const url = `${siteUrl}/${locale}/blog/${post.slug}`;
  // Where readers can reach the author, shown under every post next to the DM button.
  const contacts: { href: string; label: string; icon: BrandName }[] = [
    { href: profile.telegramChannel, label: dict.telegram, icon: "telegram" },
    { href: profile.instagram, label: "Instagram", icon: "instagram" },
    { href: profile.github, label: "GitHub", icon: "github" },
    { href: profile.linkedin, label: "LinkedIn", icon: "linkedin" },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt,
        datePublished: new Date(post.createdAt).toISOString(),
        dateModified: new Date(post.updatedAt).toISOString(),
        author: { "@id": `${siteUrl}/#person`, "@type": "Person", name: profile.name, url: siteUrl },
        mainEntityOfPage: url,
        url,
        keywords: post.tags.join(", "),
        image: post.cover ? (post.cover.startsWith("/") ? `${siteUrl}${post.cover}` : post.cover) : `${url}/opengraph-image`,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: profile.name, item: `${siteUrl}/${locale}` },
          { "@type": "ListItem", position: 2, name: dict.pageTitle, item: `${siteUrl}/${locale}/blog` },
          { "@type": "ListItem", position: 3, name: post.title, item: url },
        ],
      },
    ],
  };

  return (
    <PageShell narrow>
      <article>
        <JsonLd data={jsonLd} />

        <nav aria-label="Breadcrumb">
          <Link
            href={`/${locale}/blog`}
            className="group inline-flex items-center gap-2 font-mono text-[13px] text-muted transition-colors hover:text-amber"
          >
            <ArrowLeft size={15} className="transition-transform duration-300 group-hover:-translate-x-1" />
            {dict.back}
          </Link>
        </nav>

        <header className="mt-10 border-b border-line-soft pb-10">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[12.5px] text-muted-2">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays size={13} className="text-amber" />
              <time dateTime={new Date(post.createdAt).toISOString()}>{formatDate(post.createdAt, locale)}</time>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock3 size={13} className="text-amber" />
              {readingMinutes(post.content)} {dict.minRead}
            </span>
          </div>
          <h1 className="mt-5 font-display text-[clamp(1.9rem,1.2rem+3vw,3.2rem)] font-extrabold leading-[1.05] tracking-[-0.05em] text-balance">
            {post.title}
          </h1>
          {post.tags.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-2">
              {post.tags.map((t) => (
                <li key={t} className="tag-pill">
                  <Hash size={12} className="text-amber" />
                  {t}
                </li>
              ))}
            </ul>
          )}
        </header>

        {post.cover && (
          // Covers come from arbitrary hosts (incl. Telegram proxy), so a plain img is used.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.cover} alt="" className="mt-10 w-full rounded-[20px] border border-white/10" />
        )}

        <div className="prose-post mt-10" dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }} />

        <footer className="card-surface mt-16 rounded-[20px] p-6">
          <div className="flex items-center gap-4">
            <span className="grid size-12 place-items-center rounded-xl border border-amber/40 bg-amber/10 font-display text-sm font-extrabold text-amber">
              {profile.initials}
            </span>
            <div>
              <p className="font-display font-bold tracking-tight">{profile.name}</p>
              <p className="text-sm text-muted">{getDictionary(locale).hero.role}</p>
            </div>
          </div>
          <p className="mt-6 border-t border-line-soft pt-5 text-sm text-muted">{dict.contactTitle}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a href={profile.telegram} target="_blank" rel="noopener noreferrer" className="btn-amber">
              <Send size={16} />
              {dict.dm}
            </a>
            {contacts.map(({ href, label, icon }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer me" className="btn-ghost">
                <BrandIcon name={icon} />
                {label}
              </a>
            ))}
          </div>
        </footer>
      </article>
    </PageShell>
  );
}
