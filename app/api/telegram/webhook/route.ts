import { revalidateTag } from "next/cache";
import { siteUrl } from "@/content/profile";
import { isFirebaseConfigured } from "@/lib/firebase-admin";
import { findPostByTelegramSource, getPublishedPosts, listPostsUncached, POSTS_TAG } from "@/lib/posts";
import { createAndPublish, deleteEverywhere, postUrl, updateAndSync } from "@/lib/publish";
import { entitiesToMarkdown, escapeHtml, tg } from "@/lib/telegram";

type TgEntity = { type: string; offset: number; length: number; url?: string; language?: string };
type TgMessage = {
  message_id: number;
  chat: { id: number; type: string };
  from?: { id: number; is_bot?: boolean; first_name?: string; last_name?: string; username?: string };
  text?: string;
  caption?: string;
  entities?: TgEntity[];
  caption_entities?: TgEntity[];
  photo?: { file_id: string; width: number; height: number }[];
};
type TgUpdate = { update_id: number; message?: TgMessage; edited_message?: TgMessage };

const HELP = [
  "<b>Blog bot</b> — saytga va kanalga post joylash.",
  "",
  "📝 <b>Yangi post:</b> xabar yuboring. Birinchi qator — sarlavha, qolgani — matn.",
  "🖼 Rasm + izoh (caption) yuborsangiz, rasm muqova bo'ladi.",
  "✏️ Yuborgan xabaringizni tahrirlasangiz — sayt va kanaldagi post ham yangilanadi.",
  "",
  "/list — oxirgi postlar",
  "/delete &lt;slug&gt; — postni o'chirish",
  "/help — yordam",
].join("\n");

const reply = (chatId: number, text: string) =>
  tg("sendMessage", {
    chat_id: chatId,
    text,
    parse_mode: "HTML",
    link_preview_options: { is_disabled: true },
  }).catch((err) => console.error("[bot] reply failed", err));

/** Splits "Title\n\nbody" into parts; returns null when there's no body. */
function parseMessage(msg: TgMessage) {
  const raw = msg.text ?? msg.caption ?? "";
  const entities = msg.entities ?? msg.caption_entities ?? [];
  const md = entitiesToMarkdown(raw, entities);
  const nl = md.indexOf("\n");
  if (nl === -1) return null;
  const title = md.slice(0, nl).replace(/[*_~`]/g, "").trim();
  const content = md.slice(nl + 1).trim();
  if (!title || !content) return null;
  const tags = Array.from(content.matchAll(/(?:^|\s)#([\p{L}\d_]+)/gu), (m) => m[1]);
  const photo = msg.photo?.at(-1);
  return {
    title,
    content,
    tags,
    cover: photo ? `/api/tg-file/${encodeURIComponent(photo.file_id)}` : null,
  };
}

export async function POST(request: Request) {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!secret || request.headers.get("x-telegram-bot-api-secret-token") !== secret) {
    return new Response("Unauthorized", { status: 401 });
  }

  const update = (await request.json()) as TgUpdate;
  // Always answer 200 so Telegram doesn't retry; errors are reported back to the chat.
  try {
    await handleUpdate(update);
  } catch (err) {
    console.error("[bot] update failed", err);
    const chat = (update.message ?? update.edited_message)?.chat;
    // Errors from the comments group go to the admin's DM, not to the public thread.
    const chatId = chat?.type === "private" ? chat.id : Number(process.env.ADMIN_TELEGRAM_ID) || null;
    if (chatId) await reply(chatId, `⚠️ Xatolik: ${escapeHtml((err as Error).message)}`);
  }
  return Response.json({ ok: true });
}

async function handleUpdate(update: TgUpdate) {
  const msg = update.message ?? update.edited_message;
  if (!msg) return;
  if (msg.chat.type !== "private") return;

  const adminId = process.env.ADMIN_TELEGRAM_ID;
  if (!adminId || String(msg.from?.id) !== adminId) {
    if (update.message) await handleStranger(update.message, adminId);
    return;
  }
  if (!isFirebaseConfigured()) {
    await reply(msg.chat.id, "⚠️ Firebase sozlanmagan.");
    return;
  }

  const text = (msg.text ?? "").trim();
  const sourceId = `${msg.chat.id}:${msg.message_id}`;

  if (update.edited_message) {
    const existing = await findPostByTelegramSource(sourceId);
    const parsed = parseMessage(msg);
    if (!existing || !parsed) return;
    const { post, channelError } = await updateAndSync(existing.id, {
      title: parsed.title,
      content: parsed.content,
      tags: parsed.tags,
      cover: parsed.cover ?? existing.cover,
    });
    revalidateTag(POSTS_TAG, { expire: 0 });
    await reply(
      msg.chat.id,
      `✏️ Yangilandi: <a href="${postUrl(post.slug)}">${escapeHtml(post.title)}</a>` +
        (channelError ? `\n⚠️ Kanal: ${escapeHtml(channelError)}` : ""),
    );
    return;
  }

  if (text === "/start" || text === "/help") {
    await reply(msg.chat.id, HELP);
    return;
  }

  if (text === "/list") {
    const posts = (await listPostsUncached()).slice(0, 10);
    await reply(
      msg.chat.id,
      posts.length
        ? posts.map((p, i) => `${i + 1}. <a href="${postUrl(p.slug)}">${escapeHtml(p.title)}</a>\n<code>${p.slug}</code>`).join("\n\n")
        : "Hali postlar yo'q.",
    );
    return;
  }

  if (text.startsWith("/delete")) {
    const slug = text.split(/\s+/)[1];
    if (!slug) {
      await reply(msg.chat.id, "Foydalanish: /delete &lt;slug&gt;");
      return;
    }
    const post = (await listPostsUncached()).find((p) => p.slug === slug);
    if (!post) {
      await reply(msg.chat.id, "Bunday post topilmadi.");
      return;
    }
    await deleteEverywhere(post.id);
    revalidateTag(POSTS_TAG, { expire: 0 });
    await reply(msg.chat.id, `🗑 O'chirildi: ${escapeHtml(post.title)}`);
    return;
  }

  if (text.startsWith("/")) {
    await reply(msg.chat.id, "Noma'lum buyruq. /help");
    return;
  }

  // Idempotency: Telegram may redeliver an update.
  if (await findPostByTelegramSource(sourceId)) return;

  const parsed = parseMessage(msg);
  if (!parsed) {
    await reply(msg.chat.id, "Birinchi qatorga sarlavha, keyingi qatorlarga matn yozing. /help");
    return;
  }

  const { post, channelError } = await createAndPublish(parsed, "telegram", {
    id: `tg-${msg.chat.id}-${msg.message_id}`,
    telegramSourceId: sourceId,
  });
  revalidateTag(POSTS_TAG, { expire: 0 });
  await reply(
    msg.chat.id,
    `✅ Joylandi: <a href="${postUrl(post.slug)}">${escapeHtml(post.title)}</a>` +
      (channelError ? `\n⚠️ Kanalga yuborilmadi: ${escapeHtml(channelError)}` : "\n📢 Kanalga ham yuborildi."),
  );
}

/** The bot is private: strangers are turned away, and the admin hears about every /start. */
async function handleStranger(msg: TgMessage, adminId: string | undefined) {
  await reply(msg.chat.id, "⛔ Siz admin emassiz. Bu bot faqat egasi uchun ishlaydi.");
  const text = (msg.text ?? "").trim();
  if (!adminId || !msg.from || !/^\/start\b/.test(text)) return;
  const u = msg.from;
  const name = [u.first_name, u.last_name].filter(Boolean).join(" ") || "—";
  await reply(
    Number(adminId),
    [
      "👤 <b>Botga start bosildi</b>",
      `Ism: <a href="tg://user?id=${u.id}">${escapeHtml(name)}</a>`,
      u.username ? `Username: @${u.username}` : "Username: yo'q",
      `ID: <code>${u.id}</code>`,
    ].join("\n"),
  );
}

// Lets you open /api/telegram/webhook in a browser to check the deployment.
export async function GET() {
  const posts = await getPublishedPosts();
  return Response.json({ ok: true, site: siteUrl, posts: posts.length });
}
