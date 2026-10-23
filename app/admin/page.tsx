import { CircleCheck, ExternalLink, Globe, Pencil, Send, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { isFirebaseConfigured } from "@/lib/firebase-admin";
import { listPostsUncached } from "@/lib/posts";
import { isTelegramConfigured } from "@/lib/telegram";
import { requireAdmin } from "@/lib/admin-session";
import { AdminHeader } from "./admin-header";
import { DeleteButton } from "./delete-button";

const messages: Record<string, string> = {
  created: "Post saytga va Telegram kanalga joylandi",
  updated: "Post yangilandi",
  deleted: "Post o'chirildi",
};

export default function AdminPage({ searchParams }: PageProps<"/admin">) {
  return (
    <>
      <AdminHeader active="posts" />
      <main className="mx-auto max-w-5xl px-4 pb-16 pt-8 sm:px-6">
        <h1 className="font-display text-3xl font-bold leading-[1.05] sm:text-4xl">Postlar</h1>
        <Suspense fallback={<ListSkeleton />}>
          <Flash searchParams={searchParams} />
          <PostList />
        </Suspense>
      </main>
    </>
  );
}

function ListSkeleton() {
  return (
    <div className="group-card mt-8 overflow-hidden" aria-busy="true" aria-label="Yuklanmoqda">
      {[0, 1, 2].map((i) => (
        <div key={i} className="group-row flex items-center gap-4 p-5">
          <div className="size-10 animate-pulse rounded-xl bg-white/5" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-2/3 animate-pulse rounded bg-white/5" />
            <div className="h-3 w-1/3 animate-pulse rounded bg-white/5" />
          </div>
        </div>
      ))}
    </div>
  );
}

async function Flash({ searchParams }: { searchParams: PageProps<"/admin">["searchParams"] }) {
  const { ok } = await searchParams;
  const msg = typeof ok === "string" ? messages[ok] : undefined;
  if (!msg) return null;
  return (
    <p
      role="status"
      className="materialize mt-6 flex items-center gap-2.5 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200"
    >
      <CircleCheck className="size-4 shrink-0 text-emerald-300" />
      {msg}
    </p>
  );
}

async function PostList() {
  await requireAdmin();

  const warnings = [
    !isFirebaseConfigured() && "Firebase sozlanmagan — .env.local faylida FIREBASE_* qiymatlarini kiriting.",
    !isTelegramConfigured() && "Telegram bot sozlanmagan — postlar faqat saytga joylanadi.",
  ].filter(Boolean) as string[];

  const posts = isFirebaseConfigured() ? await listPostsUncached() : [];

  return (
    <>
      {warnings.map((w) => (
        <p
          key={w}
          role="alert"
          className="mt-6 flex items-start gap-2.5 rounded-2xl border border-amber/25 bg-amber/10 px-4 py-3 text-sm text-amber"
        >
          <TriangleAlert className="mt-0.5 size-4 shrink-0" />
          {w}
        </p>
      ))}

      {posts.length === 0 ? (
        <div className="group-card materialize mt-8 grid place-items-center px-6 py-16 text-center">
          <p className="font-semibold">Hali postlar yo&apos;q</p>
          <p className="mt-1 text-sm text-muted">Birinchisini yozing yoki botga xabar yuboring.</p>
          <Link href="/admin/new" className="press btn-primary mt-6 h-10 px-5 text-sm">
            Birinchi postni yozish
          </Link>
        </div>
      ) : (
        <>
          <p className="section-label mt-8">{posts.length} ta post</p>
          <ul className="group-card materialize mt-2 overflow-hidden">
            {posts.map((p) => (
              <li key={p.id} className="group-row flex flex-wrap items-center gap-x-4 gap-y-3 p-4 sm:flex-nowrap sm:px-5">
                <span
                  aria-hidden
                  className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/[0.06] text-muted"
                  title={p.source === "telegram" ? "Telegram bot" : "Sayt"}
                >
                  {p.source === "telegram" ? <Send className="size-[18px]" /> : <Globe className="size-[18px]" />}
                </span>
                <Link href={`/admin/edit/${p.id}`} className="min-w-0 flex-1">
                  <p className="truncate font-semibold tracking-tight">{p.title}</p>
                  <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-muted">
                    <span>{new Date(p.createdAt).toLocaleDateString("uz-UZ", { day: "numeric", month: "short", year: "numeric" })}</span>
                    <span aria-hidden className="text-muted-2">·</span>
                    <span className="truncate font-mono">/{p.slug}</span>
                    <span aria-hidden className="text-muted-2">·</span>
                    <span className={p.channelMessageId ? "text-emerald-300/90" : "text-muted-2"}>
                      {p.channelMessageId ? "Kanalda" : "Kanalda yo'q"}
                    </span>
                  </p>
                </Link>
                <div className="ml-14 flex items-center gap-1 sm:ml-0">
                  <Link
                    href={`/uz/blog/${p.slug}`}
                    target="_blank"
                    className="press btn-quiet size-9"
                    aria-label={`"${p.title}" ni saytda ko'rish`}
                    title="Saytda ko'rish"
                  >
                    <ExternalLink className="size-4" />
                  </Link>
                  <Link
                    href={`/admin/edit/${p.id}`}
                    className="press btn-quiet size-9"
                    aria-label={`"${p.title}" ni tahrirlash`}
                    title="Tahrirlash"
                  >
                    <Pencil className="size-4" />
                  </Link>
                  <DeleteButton id={p.id} title={p.title} />
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
