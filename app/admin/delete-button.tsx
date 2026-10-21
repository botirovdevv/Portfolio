"use client";

import { deletePost } from "./actions";

export function DeleteButton({ id }: { id: string }) {
  return (
    <form
      action={deletePost.bind(null, id)}
      onSubmit={(e) => {
        if (!confirm("Post saytdan va Telegram kanaldan o'chirilsinmi?")) e.preventDefault();
      }}
    >
      <button className="text-sm text-red-400 hover:underline">O&apos;chirish</button>
    </form>
  );
}
