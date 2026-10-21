import { ArrowRight, NotebookPen } from "lucide-react";
import Link from "next/link";
import type { Dictionary, Locale } from "@/lib/i18n";
import { getPublishedPosts } from "@/lib/posts";
import { PostRow } from "../post-card";
import { SectionHeading } from "../section-heading";
import { Reveal } from "../ui/reveal";

export async function BlogPreview({ dict, locale }: { dict: Dictionary["blog"]; locale: Locale }) {
  const posts = (await getPublishedPosts()).slice(0, 3);

  return (
    <section id="blog" aria-labelledby="blog-title" className="border-t border-line-soft">
      <div className="mx-auto max-w-[1200px] px-5 py-24 sm:px-8 sm:py-32">
        <SectionHeading id="blog-title" kicker={dict.kicker} title={dict.title} />

        {posts.length === 0 ? (
          <EmptyPosts text={dict.empty} />
        ) : (
          <ul className="-mx-5 divide-y divide-line-soft sm:-mx-6">
            {posts.map((post, i) => (
              <Reveal as="li" key={post.id} delay={i * 80}>
                <PostRow post={post} locale={locale} dict={dict} />
              </Reveal>
            ))}
          </ul>
        )}

        <Link
          href={`/${locale}/blog`}
          className="group mt-10 inline-flex items-center gap-2 font-mono text-[13.5px] font-medium text-amber"
        >
          {dict.all}
          <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}

export function EmptyPosts({ text }: { text: string }) {
  return (
    <div className="card-surface flex flex-col items-center gap-4 rounded-[20px] px-6 py-14 text-center">
      <span className="grid size-12 place-items-center rounded-xl border border-amber/30 bg-amber/10 text-amber">
        <NotebookPen size={20} />
      </span>
      <p className="max-w-sm text-muted">{text}</p>
    </div>
  );
}
