import { revalidateTag } from "next/cache";
import { siteUrl } from "@/content/profile";
import { isFirebaseConfigured } from "@/lib/firebase-admin";
import { GeminiBusyError, generateCommentReply, isGeminiConfigured } from "@/lib/gemini";
import { forgetPerson, getPerson, listPeople, rememberPerson, touchCommenter, type Person } from "@/lib/people";
import {
  findPostByChannelMessageId,
  findPostByTelegramSource,
  getPublishedPosts,
  listPostsUncached,
  POSTS_TAG,
} from "@/lib/posts";
import { createAndPublish, deleteEverywhere, postUrl, updateAndSync } from "@/lib/publish";
import { entitiesToMarkdown, escapeHtml, getBotId, getChannelChats, tg } from "@/lib/telegram";

type TgEntity = { type: string; offset: number; length: number; url?: string; language?: string };
type TgMessage = {
  message_id: number;
  chat: { id: number; type: string };
  from?: { id: number; is_bot?: boolean; first_name?: string; last_name?: string; username?: string };
  sender_chat?: { id: number };
  is_automatic_forward?: boolean;
  forward_origin?: { type: string; message_id?: number };
  reply_to_message?: TgMessage;
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
  "",
  "🧠 <b>Alex xotirasi</b> (kommentlarga javob berishda ishlatiladi):",
  "/people — eslab qolinganlar va oxirgi kommentatorlar (ID bilan)",
  "/remember &lt;id&gt; &lt;ma'lumot&gt; — odamni eslab qolish",
  "/forget &lt;id&gt; — unutish",
  "/help — yordam",
].join("\n");

const TIRED_REPLY = "Men biroz charchadim, dam olib kelaman 😴 Birozdan keyin yana yozing!";

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
  if (msg.chat.type === "group" || msg.chat.type === "supergroup") {
    if (update.message) await handleComment(update.message);
    return;
  }
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

  if (text === "/people") {
    const { known, recent } = await listPeople();
    const line = (p: Person) =>
      `• ${escapeHtml(p.firstName ?? "—")}${p.username ? ` @${p.username}` : ""} — <code>${p.id}</code>`;
    const parts = [
      known.length
        ? "🧠 <b>Eslab qolinganlar:</b>\n" +
          known.map((p) => `${line(p)}\n   <i>${escapeHtml((p.notes ?? "").slice(0, 200))}</i>`).join("\n")
        : "🧠 Hali hech kim eslab qolinmagan.",
      recent.length ? "💬 <b>Oxirgi kommentatorlar:</b>\n" + recent.map(line).join("\n") : "",
      "Eslab qolish: /remember &lt;id&gt; &lt;ma'lumot&gt;",
    ];
    await reply(msg.chat.id, parts.filter(Boolean).join("\n\n"));
    return;
  }

  if (text.startsWith("/remember")) {
    const m = text.match(/^\/remember(?:@\w+)?\s+(\d+)\s+([\s\S]+)$/);
    if (!m) {
      await reply(
        msg.chat.id,
        "Foydalanish: /remember &lt;id&gt; &lt;ma'lumot&gt;\nMasalan: <code>/remember 123456789 Ismi Ali, \"Ali aka\" deb chaqir, do'stim</code>\nID'ni /people dan oling.",
      );
      return;
    }
    await rememberPerson(m[1], m[2].trim());
    await reply(msg.chat.id, `✅ Saqlandi: <code>${m[1]}</code>\n<i>${escapeHtml(m[2].trim())}</i>`);
    return;
  }

  if (text.startsWith("/forget")) {
    const id = text.split(/\s+/)[1];
    if (!id || !/^\d+$/.test(id)) {
      await reply(msg.chat.id, "Foydalanish: /forget &lt;id&gt;");
      return;
    }
    await reply(msg.chat.id, (await forgetPerson(id)) ? `🗑 Unutildi: <code>${id}</code>` : "Bu ID bo'yicha ma'lumot yo'q.");
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

/** Auto-replies to comments under channel posts (in the channel's linked discussion group). */
async function handleComment(msg: TgMessage) {
  const comment = (msg.text ?? msg.caption ?? "").trim();
  const parent = msg.reply_to_message;
  if (!isGeminiConfigured() || comment.length < 2 || !parent) return;
  if (msg.is_automatic_forward) return;
  const chats = await getChannelChats();
  if (!chats || msg.chat.id !== chats.discussionId) return;

  // Comments posted as the channel or as the group (anonymous admin) count as the author's.
  // Telegram sends those with a service bot in `from`, so check sender_chat before is_bot.
  const asOwnChat = msg.sender_chat?.id === chats.channelId || msg.sender_chat?.id === msg.chat.id;
  if (msg.sender_chat ? !asOwnChat : msg.from?.is_bot) return;

  // Answer top-level comments and replies to the bot; stay out of conversations between people.
  const isTopLevel = Boolean(parent.is_automatic_forward);
  if (!isTopLevel && parent.from?.id !== (await getBotId())) return;

  let post: { title: string; content: string } | null = null;
  if (isTopLevel) {
    const channelMessageId = parent.forward_origin?.message_id;
    if (channelMessageId && isFirebaseConfigured()) post = await findPostByChannelMessageId(channelMessageId);
    const rootText = parent.text ?? parent.caption;
    if (!post && rootText) post = { title: "", content: rootText };
  }

  const fromAuthor = asOwnChat || String(msg.from?.id) === process.env.ADMIN_TELEGRAM_ID;
  let notes: string | null = null;
  if (!fromAuthor && msg.from && isFirebaseConfigured()) {
    // Memory is a nice-to-have; never let a Firestore hiccup block the reply.
    const [person] = await Promise.all([
      getPerson(msg.from.id).catch(() => null),
      touchCommenter(msg.from).catch((err) => console.warn("[bot] touchCommenter failed", err)),
    ]);
    notes = person?.notes ?? null;
  }

  await tg("sendChatAction", { chat_id: msg.chat.id, action: "typing" }).catch(() => {});
  const text = await generateCommentReply({
    post,
    comment,
    author: msg.from?.first_name,
    fromAuthor,
    notes,
    previousReply: isTopLevel ? undefined : parent.text,
  }).catch((err) => {
    // Free-tier quota or overload: answer in character instead of bothering the admin.
    if (err instanceof GeminiBusyError) {
      console.warn("[bot]", err.message);
      return TIRED_REPLY;
    }
    throw err;
  });
  if (!text) return;
  await tg("sendMessage", {
    chat_id: msg.chat.id,
    text,
    reply_parameters: { message_id: msg.message_id },
    link_preview_options: { is_disabled: true },
  });
}

// Lets you open /api/telegram/webhook in a browser to check the deployment.
export async function GET() {
  const posts = await getPublishedPosts();
  return Response.json({ ok: true, site: siteUrl, posts: posts.length });
}
