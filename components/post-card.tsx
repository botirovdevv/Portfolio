import { ArrowUpRight, Clock3, Send } from "lucide-react";
import Link from "next/link";
import type { Dictionary, Locale } from "@/lib/i18n";
import type { Post } from "@/lib/posts";
import { readingMinutes } from "@/lib/slug";

export function formatDate(ms: number, locale: Locale) {
  const d = new Date(ms);
  if (locale === "en") {
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "Asia/Tashkent" });
  }
  const months = ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr"];
  return `${d.getUTCDate()}-${months[d.getUTCMonth()]}, ${d.getUTCFullYear()}`;
}

/** Row-style post entry used on the home page and the blog index. */
export function PostRow({ post, locale, dict }: { post: Post; locale: Locale; dict: Dictionary["blog"] }) {
  return (
    <article className="group relative grid gap-3 rounded-[18px] border border-transparent px-5 py-6 transition-colors duration-300 hover:border-white/10 hover:bg-white/[0.025] sm:grid-cols-[1fr_auto] sm:gap-10 sm:px-6">
      <div className="min-w-0">
        <h3 className="font-display text-lg font-bold leading-snug tracking-[-0.035em] text-balance sm:text-[1.35rem]">
          <Link href={`/${locale}/blog/${post.slug}`} className="after:absolute after:inset-0">
            {post.title}
          </Link>
        </h3>
        <p className="mt-2.5 line-clamp-2 max-w-[44rem] text-[15px] leading-relaxed text-muted">{post.excerpt}</p>
      </div>
      <div className="flex items-center gap-4 font-mono text-[12px] text-muted-2 sm:flex-col sm:items-end sm:gap-2">
        <time dateTime={new Date(post.createdAt).toISOString()}>{formatDate(post.createdAt, locale)}</time>
        <span className="flex items-center gap-1.5">
          <Clock3 size={12} />
          {readingMinutes(post.content)} {dict.minRead}
          {post.source === "telegram" && <Send size={12} className="ml-1 text-amber" aria-label="Telegram" />}
        </span>
        <ArrowUpRight
          size={18}
          className="ml-auto text-amber opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100 sm:ml-0 sm:mt-1"
        />
      </div>
    </article>
  );
}
