import "server-only";

const API = "https://api.telegram.org";

export function isTelegramConfigured() {
  return Boolean(process.env.TELEGRAM_BOT_TOKEN);
}

function token() {
  const t = process.env.TELEGRAM_BOT_TOKEN;
  if (!t) throw new Error("TELEGRAM_BOT_TOKEN is not set");
  return t;
}

export async function tg<T = unknown>(method: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(`${API}/bot${token()}/${method}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  const json = (await res.json()) as { ok: boolean; result: T; description?: string };
  if (!json.ok) throw new Error(`Telegram ${method} failed: ${json.description}`);
  return json.result;
}

type ChannelChats = { channelId: number; discussionId: number | null };
let channelChats: Promise<ChannelChats | null> | undefined;

/** The channel's numeric ID and its linked comments group (cached per instance). */
export function getChannelChats(): Promise<ChannelChats | null> {
  const channel = process.env.TELEGRAM_CHANNEL_ID;
  if (!channel) return Promise.resolve(null);
  channelChats ??= tg<{ id: number; linked_chat_id?: number }>("getChat", { chat_id: channel })
    .then((c) => ({ channelId: c.id, discussionId: c.linked_chat_id ?? null }))
    .catch((err) => {
      channelChats = undefined;
      throw err;
    });
  return channelChats;
}

let botId: Promise<number> | undefined;

export function getBotId(): Promise<number> {
  botId ??= tg<{ id: number }>("getMe", {})
    .then((me) => me.id)
    .catch((err) => {
      botId = undefined;
      throw err;
    });
  return botId;
}

export async function getFileUrl(fileId: string): Promise<string> {
  const file = await tg<{ file_path: string }>("getFile", { file_id: fileId });
  return `${API}/file/bot${token()}/${file.file_path}`;
}

/* ---------- Formatting ---------- */

export function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Converts the Markdown subset used in posts to Telegram-compatible HTML. */
export function markdownToTelegramHtml(md: string): string {
  const blocks: string[] = [];
  let text = md.replace(/```[^\n]*\n([\s\S]*?)```/g, (_, code: string) => {
    blocks.push(`<pre>${escapeHtml(code.replace(/\n$/, ""))}</pre>`);
    return `\u0000${blocks.length - 1}\u0000`;
  });
  text = escapeHtml(text)
    .replace(/`([^`\n]+)`/g, "<code>$1</code>")
    .replace(/!\[[^\]]*\]\(([^)\s]+)\)/g, '<a href="$1">🖼</a>')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*([^*\n]+)\*\*/g, "<b>$1</b>")
    .replace(/(^|[^*\w])\*([^*\n]+)\*(?!\w)/g, "$1<i>$2</i>")
    .replace(/(^|\W)_([^_\n]+)_(?!\w)/g, "$1<i>$2</i>")
    .replace(/~~([^~\n]+)~~/g, "<s>$1</s>")
    .replace(/^#{1,6}\s+(.+)$/gm, "<b>$1</b>")
    .replace(/^&gt;\s?(.*)$/gm, "<blockquote>$1</blockquote>")
    .replace(/<\/blockquote>\n<blockquote>/g, "\n")
    .replace(/^\s*[-*]\s+/gm, "• ");
  return text.replace(/\u0000(\d+)\u0000/g, (_, i) => blocks[Number(i)]);
}

/** Cuts Markdown at a paragraph/sentence boundary so formatting stays balanced. */
export function truncateMarkdown(md: string, max: number): { text: string; cut: boolean } {
  if (md.length <= max) return { text: md, cut: false };
  const slice = md.slice(0, max);
  const para = slice.lastIndexOf("\n\n");
  const cutAt = para > max * 0.5 ? para : Math.max(slice.lastIndexOf(". ") + 1, slice.lastIndexOf(" "));
  let text = slice.slice(0, cutAt > 0 ? cutAt : max).trimEnd();
  // Drop an unterminated code fence.
  if ((text.match(/```/g)?.length ?? 0) % 2 === 1) text = text.slice(0, text.lastIndexOf("```")).trimEnd();
  return { text, cut: true };
}

type Entity = { type: string; offset: number; length: number; url?: string; language?: string };

/** Converts a Telegram message text + entities into Markdown. */
export function entitiesToMarkdown(text: string, entities: Entity[] = []): string {
  const inserts: { pos: number; str: string; order: number }[] = [];
  for (const e of entities) {
    const start = e.offset;
    const end = e.offset + e.length;
    const wrap = (open: string, close = open) => {
      inserts.push({ pos: start, str: open, order: 1 });
      inserts.push({ pos: end, str: close, order: 0 });
    };
    switch (e.type) {
      case "bold":
        wrap("**");
        break;
      case "italic":
        wrap("_");
        break;
      case "strikethrough":
        wrap("~~");
        break;
      case "code":
        wrap("`");
        break;
      case "pre":
        wrap("\n```" + (e.language ?? "") + "\n", "\n```\n");
        break;
      case "text_link":
        wrap("[", `](${e.url})`);
        break;
    }
  }
  // Apply from the end so earlier offsets stay valid. At the same position the
  // last applied insert ends up first, so apply openers before closers.
  inserts.sort((a, b) => b.pos - a.pos || b.order - a.order);
  let out = text;
  for (const ins of inserts) out = out.slice(0, ins.pos) + ins.str + out.slice(ins.pos);
  return out;
}
