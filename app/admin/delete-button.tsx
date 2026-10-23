"use client";

import { Trash2 } from "lucide-react";
import { deletePost } from "./actions";

export function DeleteButton({ id, title }: { id: string; title: string }) {
  return (
    <form
      action={deletePost.bind(null, id)}
      onSubmit={(e) => {
        if (!confirm("Post saytdan va Telegram kanaldan o'chirilsinmi?")) e.preventDefault();
      }}
    >
      <button
        className="press btn-quiet size-9 text-red-300/90 hover:!bg-red-500/15 hover:!text-red-300"
        aria-label={`"${title}" ni o'chirish`}
        title="O'chirish"
      >
        <Trash2 className="size-4" />
      </button>
    </form>
  );
}
