"use client";

import { TriangleAlert } from "lucide-react";
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

function Label({ htmlFor, children, hint }: { htmlFor: string; children: React.ReactNode; hint?: string }) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-medium">
      {children}
      {hint && <span className="font-normal text-muted"> — {hint}</span>}
    </label>
  );
}

export function PostForm({
  action,
  initial = empty,
  submitLabel,
  channelOption = false,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  initial?: Initial;
  submitLabel: string;
  /** New posts let the author choose whether the post also goes to the Telegram channel. */
  channelOption?: boolean;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const [content, setContent] = useState(initial.content);

  return (
    <form action={formAction} className="mt-8">
      <p className="section-label">Asosiy</p>
      <div className="group-card materialize mt-2 grid gap-5 p-5 sm:p-6">
        <div>
          <Label htmlFor="title">Sarlavha</Label>
          <input id="title" name="title" required defaultValue={initial.title} className="field text-lg font-semibold tracking-tight" />
        </div>

        <div>
          <div className="flex items-baseline justify-between gap-3">
            <Label htmlFor="content">Matn (Markdown)</Label>
            <span className="font-mono text-xs tabular-nums text-muted">{content.length} belgi</span>
          </div>
          <textarea
            id="content"
            name="content"
            required
            rows={18}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={"## Kirish\n\n**qalin**, _kursiv_, `kod`, [havola](https://...)\n\n```js\nconsole.log('salom')\n```"}
            className="field font-mono text-sm leading-relaxed"
          />
          <p className="mt-2 text-xs text-muted">
            Telegram kanalga sarlavha + matn (4096 belgigacha, rasm bo&apos;lsa 1024) + saytga havola yuboriladi.
          </p>
        </div>
      </div>

      <p className="section-label mt-8">Qo&apos;shimcha</p>
      <div className="group-card materialize-late mt-2 grid gap-5 p-5 sm:p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="slug" hint="ixtiyoriy">URL (slug)</Label>
            <input id="slug" name="slug" defaultValue={initial.slug} placeholder="avtomatik" className="field font-mono" />
          </div>
          <div>
            <Label htmlFor="tags" hint="vergul bilan">Teglar</Label>
            <input id="tags" name="tags" defaultValue={initial.tags} placeholder="react, nextjs" className="field" />
          </div>
        </div>

        <div>
          <Label htmlFor="cover" hint="ixtiyoriy">Muqova rasmi URL</Label>
          <input id="cover" name="cover" type="text" defaultValue={initial.cover} placeholder="https://…" className="field" />
        </div>

        <div>
          <Label htmlFor="excerpt" hint="bo'sh qolsa matndan olinadi">Qisqa tavsif (SEO)</Label>
          <textarea id="excerpt" name="excerpt" rows={2} maxLength={300} defaultValue={initial.excerpt} className="field" />
        </div>
      </div>

      {channelOption && (
        <label className="group-card materialize-late mt-8 flex cursor-pointer items-center gap-3 p-5 sm:p-6">
          <input type="checkbox" name="toChannel" defaultChecked className="size-5 shrink-0 accent-amber" />
          <span>
            <span className="block text-sm font-medium">Telegram kanalga ham yuborish</span>
            <span className="block text-xs text-muted">Belgilanmasa, post faqat saytda chiqadi.</span>
          </span>
        </label>
      )}

      {state?.error && (
        <p role="alert" className="materialize mt-6 flex items-center gap-2.5 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          <TriangleAlert className="size-4 shrink-0" />
          {state.error}
        </p>
      )}
      {state?.warning && (
        <p role="alert" className="materialize mt-6 flex items-start gap-2.5 rounded-2xl border border-amber/25 bg-amber/10 px-4 py-3 text-sm text-amber">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" />
          <span>
            {state.warning} — <Link href="/admin" className="underline">ro&apos;yxatga qaytish</Link>
          </span>
        </p>
      )}

      {/* Floating action bar: stays within reach while writing long posts. */}
      <div className="sticky bottom-0 z-30 -mx-4 mt-8 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 sm:-mx-6 sm:px-6">
        <div className="admin-bar !static flex items-center justify-end gap-2 rounded-full border border-white/10 p-1.5 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.8)] after:hidden">
          <Link href="/admin" className="press btn-quiet h-11 px-5 text-sm !bg-transparent hover:!bg-white/[0.08]">
            Bekor qilish
          </Link>
          <button disabled={pending} className="press btn-primary h-11 px-7">
            {pending ? "Saqlanmoqda…" : submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}
