import { createPost } from "../actions";
import { PostForm } from "../post-form";

export default function NewPostPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold">Yangi post</h1>
      <p className="mt-2 text-muted">Saqlanganda saytga va Telegram kanalga avtomatik joylanadi.</p>
      <PostForm action={createPost} submitLabel="Joylash" />
    </div>
  );
}
