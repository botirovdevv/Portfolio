import Link from "next/link";
import type { Dictionary, Locale } from "@/lib/i18n";
import type { Post } from "@/lib/posts";
import { readingMinutes } from "@/lib/slug";
import { ArrowUpRight, Telegram } from "./ui/icons";

export function formatDate(ms: number, locale: Locale) {
  const d = new Date(ms);
  if (locale === "en") {
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  }
  const months = ["yan", "fev", "mar", "apr", "may", "iyn", "iyl", "avg", "sen", "okt", "noy", "dek"];
  return `${d.getUTCDate()}-${months[d.getUTCMonth()]}, ${d.getUTCFullYear()}`;
}

export function PostCard({ post, locale, dict }: { post: Post; locale: Locale; dict: Dictionary["blog"] }) {
  return (
    <article className="spotlight group relative flex h-full flex-col rounded-3xl border border-line bg-elev p-7 transition duration-300 hover:-translate-y-1 hover:border-accent/60">
      <div className="flex items-center gap-3 font-mono text-xs text-muted">
        <time dateTime={new Date(post.createdAt).toISOString()}>{formatDate(post.createdAt, locale)}</time>
        <span aria-hidden>·</span>
        <span>
          {readingMinutes(post.content)} {dict.minRead}
        </span>
        {post.source === "telegram" && <Telegram className="ml-auto size-4 text-accent" aria-label="Telegram" />}
      </div>
      <h3 className="mt-4 font-display text-xl font-bold leading-snug text-balance">
        <Link href={`/${locale}/blog/${post.slug}`} className="after:absolute after:inset-0">
          {post.title}
        </Link>
      </h3>
      <p className="mt-3 line-clamp-3 text-muted">{post.excerpt}</p>
      <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold text-accent">
        {dict.read}
        <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </span>
    </article>
  );
}
