import { createPost } from "../actions";
import { AdminHeader } from "../admin-header";
import { PostForm } from "../post-form";

export default function NewPostPage() {
  return (
    <>
      <AdminHeader active="editor" />
      <main className="mx-auto max-w-3xl px-4 pt-8 sm:px-6">
        <h1 className="font-display text-3xl font-bold leading-[1.05] sm:text-4xl">Yangi post</h1>
        <p className="mt-2 text-muted">Saqlanganda saytga joylanadi, xohlasangiz Telegram kanalga ham.</p>
        <PostForm action={createPost} submitLabel="Joylash" channelOption />
      </main>
    </>
  );
}
