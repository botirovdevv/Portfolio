import Link from "next/link";
import type { Dictionary, Locale } from "@/lib/i18n";
import { getPublishedPosts } from "@/lib/posts";
import { PostCard } from "../post-card";
import { SectionHeading } from "../section-heading";
import { Reveal } from "../ui/reveal";
import { ArrowRight } from "../ui/icons";

export async function BlogPreview({ dict, locale }: { dict: Dictionary["blog"]; locale: Locale }) {
  const posts = (await getPublishedPosts()).slice(0, 3);

  return (
    <section id="blog" aria-labelledby="blog-title" className="border-t border-line">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading id="blog-title" kicker={dict.kicker} title={dict.title} subtitle={dict.subtitle} />
          <Link
            href={`/${locale}/blog`}
            className="group mb-12 inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-semibold transition hover:border-accent hover:text-accent"
          >
            {dict.all}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {posts.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-line p-10 text-center text-muted">{dict.empty}</p>
        ) : (
          <ul className="grid gap-5 md:grid-cols-3">
            {posts.map((post, i) => (
              <Reveal as="li" key={post.id} delay={i * 100}>
                <PostCard post={post} locale={locale} dict={dict} />
              </Reveal>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
