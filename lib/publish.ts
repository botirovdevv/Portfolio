import "server-only";
import { profile, siteUrl } from "@/content/profile";
import {
  getPostById,
  insertPost,
  patchPost,
  removePost,
  uniqueSlug,
  type Post,
  type PostSource,
} from "./posts";
import { makeExcerpt, slugify } from "./slug";
import {
  escapeHtml,
  isTelegramConfigured,
  markdownToTelegramHtml,
  tg,
  truncateMarkdown,
} from "./telegram";

/**
 * Single place that keeps the website (Firestore) and the Telegram channel in sync.
 * Used by both the admin panel and the Telegram bot webhook.
 */

export type PostInput = {
  title: string;
  content: string;
  excerpt?: string;
  cover?: string | null;
  tags?: string[];
  slug?: string;
};

const channelId = () => process.env.TELEGRAM_CHANNEL_ID;
const canPostToChannel = () => isTelegramConfigured() && Boolean(channelId());

export function postUrl(slug: string) {
  return `${siteUrl}/uz/blog/${slug}`;
}

/** Absolute URL Telegram can download for a cover (bot covers are proxied by /api/tg-file). */
function absoluteCover(cover: string) {
  return cover.startsWith("/") ? `${siteUrl}${cover}` : cover;
}

function telegramFileId(cover: string | null): string | null {
  const m = cover?.match(/^\/api\/tg-file\/(.+)$/);
  return m ? decodeURIComponent(m[1]) : null;
}

const handle = (url: string) => "@" + url.replace(/\/+$/, "").split("/").pop();

/** Contacts under every channel post. */
const CHANNEL_FOOTER = [
  "\n\n➖➖➖➖➖➖",
  `💬 DM: ${handle(profile.telegram)}`,
  `📢 Kanal: ${handle(profile.telegramChannel)}`,
  `📸 <a href="${profile.instagram}">Instagram</a> · 💻 <a href="${profile.github}">GitHub</a> · 🌐 <a href="${siteUrl}">Sayt</a>`,
].join("\n");

function channelText(post: Post, limit: number) {
  const link = `\n\n<a href="${postUrl(post.slug)}">🔗 Saytda o'qish →</a>` + CHANNEL_FOOTER;
  const tags = post.tags.length ? "\n\n" + post.tags.map((t) => `#${t.replace(/\W+/g, "_")}`).join(" ") : "";
  const head = `<b>${escapeHtml(post.title)}</b>\n\n`;
  const budget = limit - head.length - link.length - tags.length - 50;
  const { text, cut } = truncateMarkdown(post.content, Math.max(budget, 100));
  let body = markdownToTelegramHtml(text);
  // HTML conversion may grow the text; fall back to the plain excerpt if it no longer fits.
  if (head.length + body.length + link.length + tags.length > limit) body = escapeHtml(post.excerpt);
  return head + body + (cut ? " …" : "") + tags + link;
}

async function sendToChannel(post: Post): Promise<{ id: number; photo: boolean }> {
  const chat_id = channelId();
  if (post.cover) {
    const msg = await tg<{ message_id: number }>("sendPhoto", {
      chat_id,
      photo: telegramFileId(post.cover) ?? absoluteCover(post.cover),
      caption: channelText(post, 1024),
      parse_mode: "HTML",
    });
    return { id: msg.message_id, photo: true };
  }
  const msg = await tg<{ message_id: number }>("sendMessage", {
    chat_id,
    text: channelText(post, 4096),
    parse_mode: "HTML",
    link_preview_options: { url: postUrl(post.slug), prefer_large_media: true },
  });
  return { id: msg.message_id, photo: false };
}

async function editInChannel(post: Post) {
  if (!post.channelMessageId) return;
  const chat_id = channelId();
  if (post.channelHasPhoto) {
    await tg("editMessageCaption", {
      chat_id,
      message_id: post.channelMessageId,
      caption: channelText(post, 1024),
      parse_mode: "HTML",
    });
  } else {
    await tg("editMessageText", {
      chat_id,
      message_id: post.channelMessageId,
      text: channelText(post, 4096),
      parse_mode: "HTML",
      link_preview_options: { url: postUrl(post.slug), prefer_large_media: true },
    });
  }
}

/** Sends a saved post to the channel once; a post already there is left alone. */
export async function publishToChannel(post: Post): Promise<{ post: Post; channelError?: string }> {
  if (post.channelMessageId) return { post };
  if (!canPostToChannel()) return { post, channelError: "Telegram kanal sozlanmagan" };
  try {
    const msg = await sendToChannel(post);
    await patchPost(post.id, { channelMessageId: msg.id, channelHasPhoto: msg.photo });
    return { post: { ...post, channelMessageId: msg.id, channelHasPhoto: msg.photo } };
  } catch (err) {
    console.error("[publish] channel send failed", err);
    return { post, channelError: (err as Error).message };
  }
}

export async function createAndPublish(
  input: PostInput,
  source: PostSource,
  extra: { id?: string; telegramSourceId?: string; toChannel?: boolean } = {},
): Promise<{ post: Post; channelError?: string }> {
  const now = Date.now();
  const slug = await uniqueSlug(slugify(input.slug || input.title));
  const post = await insertPost(
    {
      slug,
      title: input.title.trim(),
      content: input.content.trim(),
      excerpt: input.excerpt?.trim() || makeExcerpt(input.content),
      cover: input.cover || null,
      tags: input.tags ?? [],
      source,
      createdAt: now,
      updatedAt: now,
      channelMessageId: null,
      channelHasPhoto: false,
      telegramSourceId: extra.telegramSourceId ?? null,
    },
    extra.id,
  );

  // Without a configured channel the post just stays on the site, as before.
  if (extra.toChannel === false || !canPostToChannel()) return { post };
  return publishToChannel(post);
}

export async function updateAndSync(
  id: string,
  input: PostInput,
): Promise<{ post: Post; channelError?: string }> {
  const existing = await getPostById(id);
  if (!existing) throw new Error("Post not found");

  const slug = input.slug ? await uniqueSlug(slugify(input.slug), id) : existing.slug;
  const changes = {
    slug,
    title: input.title.trim(),
    content: input.content.trim(),
    excerpt: input.excerpt?.trim() || makeExcerpt(input.content),
    cover: input.cover === undefined ? existing.cover : input.cover || null,
    tags: input.tags ?? existing.tags,
    updatedAt: Date.now(),
  };
  await patchPost(id, changes);
  const post = { ...existing, ...changes };

  let channelError: string | undefined;
  if (canPostToChannel() && post.channelMessageId) {
    try {
      // A text message can't gain a photo (and vice versa) — repost in that case.
      if (Boolean(post.cover) !== post.channelHasPhoto) {
        await tg("deleteMessage", { chat_id: channelId(), message_id: post.channelMessageId }).catch(() => {});
        const msg = await sendToChannel(post);
        await patchPost(id, { channelMessageId: msg.id, channelHasPhoto: msg.photo });
        Object.assign(post, { channelMessageId: msg.id, channelHasPhoto: msg.photo });
      } else {
        await editInChannel(post);
      }
    } catch (err) {
      const message = (err as Error).message;
      if (!message.includes("message is not modified")) {
        channelError = message;
        console.error("[publish] channel edit failed", err);
      }
    }
  }
  return { post, channelError };
}

export async function deleteEverywhere(id: string): Promise<Post | null> {
  const post = await getPostById(id);
  if (!post) return null;
  await removePost(id);
  if (canPostToChannel() && post.channelMessageId) {
    // Telegram only allows deleting channel posts younger than 48h; ignore failures.
    await tg("deleteMessage", { chat_id: channelId(), message_id: post.channelMessageId }).catch(
      (err) => console.warn("[publish] channel delete failed", err),
    );
  }
  return post;
}
