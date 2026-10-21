"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import type { FormState } from "./actions";

type Initial = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover: string;
  tags: string;
};

const empty: Initial = { title: "", slug: "", excerpt: "", content: "", cover: "", tags: "" };

const field =
  "mt-2 w-full rounded-xl border border-line bg-bg px-4 py-3 text-base outline-none transition focus:border-amber";

export function PostForm({
  action,
  initial = empty,
  submitLabel,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  initial?: Initial;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const [content, setContent] = useState(initial.content);

  return (
    <form action={formAction} className="mt-8 grid gap-6">
      <div>
        <label htmlFor="title" className="text-sm font-medium">Sarlavha</label>
        <input id="title" name="title" required defaultValue={initial.title} className={field} />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="slug" className="text-sm font-medium">
            URL (slug) <span className="text-muted">— ixtiyoriy</span>
          </label>
          <input id="slug" name="slug" defaultValue={initial.slug} placeholder="avtomatik" className={`${field} font-mono`} />
        </div>
        <div>
          <label htmlFor="tags" className="text-sm font-medium">
            Teglar <span className="text-muted">— vergul bilan</span>
          </label>
          <input id="tags" name="tags" defaultValue={initial.tags} placeholder="react, nextjs" className={field} />
        </div>
      </div>

      <div>
        <label htmlFor="cover" className="text-sm font-medium">
          Muqova rasmi URL <span className="text-muted">— ixtiyoriy</span>
        </label>
        <input id="cover" name="cover" type="text" defaultValue={initial.cover} placeholder="https://…" className={field} />
      </div>

      <div>
        <label htmlFor="excerpt" className="text-sm font-medium">
          Qisqa tavsif (SEO) <span className="text-muted">— bo&apos;sh qolsa matndan olinadi</span>
        </label>
        <textarea id="excerpt" name="excerpt" rows={2} maxLength={300} defaultValue={initial.excerpt} className={field} />
      </div>

      <div>
        <div className="flex items-baseline justify-between">
          <label htmlFor="content" className="text-sm font-medium">Matn (Markdown)</label>
          <span className="font-mono text-xs text-muted">{content.length} belgi</span>
        </div>
        <textarea
          id="content"
          name="content"
          required
          rows={18}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={"## Kirish\n\n**qalin**, _kursiv_, `kod`, [havola](https://...)\n\n```js\nconsole.log('salom')\n```"}
          className={`${field} font-mono text-sm leading-relaxed`}
        />
        <p className="mt-2 text-xs text-muted">
          Telegram kanalga sarlavha + matn (4096 belgigacha, rasm bo&apos;lsa 1024) + saytga havola yuboriladi.
        </p>
      </div>

      {state?.error && <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-400">{state.error}</p>}
      {state?.warning && (
        <p className="rounded-xl bg-amber/10 px-4 py-3 text-sm text-amber">
          {state.warning} — <Link href="/admin" className="underline">ro&apos;yxatga qaytish</Link>
        </p>
      )}

      <div className="flex gap-3">
        <button
          disabled={pending}
          className="rounded-full bg-amber px-7 py-3 font-semibold text-amber-ink transition hover:brightness-110 disabled:opacity-60"
        >
          {pending ? "Saqlanmoqda…" : submitLabel}
        </button>
        <Link href="/admin" className="rounded-full border border-line px-6 py-3 text-muted hover:text-fg">
          Bekor qilish
        </Link>
      </div>
    </form>
  );
}
