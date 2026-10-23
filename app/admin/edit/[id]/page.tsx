import { notFound } from "next/navigation";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/admin-session";
import { getPostById } from "@/lib/posts";
import { updatePost } from "../../actions";
import { AdminHeader } from "../../admin-header";
import { PostForm } from "../../post-form";

export default function EditPostPage({ params }: PageProps<"/admin/edit/[id]">) {
  return (
    <>
      <AdminHeader active="editor" />
      <main className="mx-auto max-w-3xl px-4 pt-8 sm:px-6">
        <h1 className="font-display text-3xl font-bold leading-[1.05] sm:text-4xl">Postni tahrirlash</h1>
        <p className="mt-2 text-muted">O&apos;zgarishlar Telegram kanaldagi postda ham yangilanadi.</p>
        <Suspense fallback={<div className="group-card mt-8 h-96 animate-pulse" aria-busy="true" aria-label="Yuklanmoqda" />}>
          <EditForm params={params} />
        </Suspense>
      </main>
    </>
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
