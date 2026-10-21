import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { siteUrl } from "@/content/profile";
import { locales } from "@/lib/i18n";
import { getPublishedPosts } from "@/lib/posts";

function entry(
  path: string,
  opts: Omit<MetadataRoute.Sitemap[number], "url" | "alternates">,
): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(locales.map((l) => [l, `${siteUrl}/${l}${path}`]));
  return locales.map((l) => ({
    url: `${siteUrl}/${l}${path}`,
    alternates: { languages },
    ...opts,
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPublishedPosts();
  const latest = posts[0] ? new Date(posts[0].updatedAt) : undefined;
  return [
    ...entry("", { changeFrequency: "monthly", priority: 1, lastModified: latest }),
    ...entry("/blog", { changeFrequency: "weekly", priority: 0.8, lastModified: latest }),
    ...projects.flatMap((p) => entry(`/projects/${p.slug}`, { changeFrequency: "yearly", priority: 0.6 })),
    ...posts.flatMap((p) =>
      entry(`/blog/${p.slug}`, { changeFrequency: "monthly", priority: 0.7, lastModified: new Date(p.updatedAt) }),
    ),
  ];
}
