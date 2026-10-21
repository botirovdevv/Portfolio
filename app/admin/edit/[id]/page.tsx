import { notFound } from "next/navigation";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/admin-session";
import { getPostById } from "@/lib/posts";
import { updatePost } from "../../actions";
import { PostForm } from "../../post-form";

export default function EditPostPage({ params }: PageProps<"/admin/edit/[id]">) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold">Postni tahrirlash</h1>
      <p className="mt-2 text-muted">O&apos;zgarishlar Telegram kanaldagi postda ham yangilanadi.</p>
      <Suspense fallback={<p className="mt-8 text-muted">Yuklanmoqda…</p>}>
        <EditForm params={params} />
      </Suspense>
    </div>
  );
}

async function EditForm({ params }: { params: PageProps<"/admin/edit/[id]">["params"] }) {
  await requireAdmin();
  const { id } = await params;
  const post = await getPostById(id);
  if (!post) notFound();

  return (
    <PostForm
      action={updatePost.bind(null, post.id)}
      submitLabel="Saqlash"
      initial={{
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        cover: post.cover ?? "",
        tags: post.tags.join(", "),
      }}
    />
  );
}
