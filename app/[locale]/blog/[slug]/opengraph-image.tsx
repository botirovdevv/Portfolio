import { ogSize, renderOg } from "@/lib/og";
import { getPostBySlug } from "@/lib/posts";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Blog post";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  return renderOg({ kicker: "Blog", title: post?.title ?? "Blog", subtitle: post?.excerpt.slice(0, 110) });
}
