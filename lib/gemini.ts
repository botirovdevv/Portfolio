import "server-only";
import { profile } from "@/content/profile";

const API = "https://generativelanguage.googleapis.com/v1beta/models";

export function isGeminiConfigured() {
  return Boolean(process.env.GEMINI_API_KEY);
}

const SYSTEM = [
  `You are the assistant of ${profile.name}, a software developer who runs a Telegram channel and blog.`,
  "You reply to comments under the channel's posts on the author's behalf.",
  "Rules:",
  "- Reply in the commenter's language (Uzbek, Russian or English). Uzbek in Latin script.",
  "- Be friendly and concise: 1-3 sentences, no Markdown, no hashtags.",
  "- Base answers on the post and general technical knowledge. Never invent facts about the author, prices or plans.",
  `- If you don't know or the question is personal, say ${profile.firstName} will answer personally.`,
  "- Thanks and praise get a short warm thank-you.",
  "- For spam, insults or meaningless text, output exactly: SKIP",
].join("\n");

type GeminiResponse = {
  candidates?: { content?: { parts?: { text?: string; thought?: boolean }[] } }[];
  error?: { message: string };
};

type ReplyInput = {
  post?: { title: string; content: string } | null;
  comment: string;
  author?: string;
  previousReply?: string;
};

/** Writes a reply to a channel comment; returns null when the model decides not to answer. */
export async function generateCommentReply({ post, comment, author, previousReply }: ReplyInput) {
  const prompt = [
    post ? `Post: ${post.title}\n\n${post.content.slice(0, 6000)}` : "Post: (unknown)",
    previousReply ? `Your previous reply in this thread:\n${previousReply}` : "",
    `Comment${author ? ` from ${author}` : ""}:\n${comment.slice(0, 2000)}`,
  ]
    .filter(Boolean)
    .join("\n\n---\n\n");

  const body = JSON.stringify({
    systemInstruction: { parts: [{ text: SYSTEM }] },
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: { maxOutputTokens: 2048, temperature: 0.6 },
  });

  // Free-tier models are often overloaded (503) or rate-limited (429); try the next one.
  const models = [process.env.GEMINI_MODEL || "gemini-3.8-flash", "gemini-2.5-flash"];
  let json: GeminiResponse = {};
  for (const model of models) {
    const res = await fetch(`${API}/${model}:generateContent`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY! },
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(40_000),
    }).catch((err: Error) => err);
    if (res instanceof Error) {
      console.warn(`[gemini] ${model} unreachable`, res.message);
      continue;
    }
    json = (await res.json()) as GeminiResponse;
    if (res.ok) break;
    if (res.status === 401 || res.status === 403) throw new Error(`Gemini failed: ${json.error?.message ?? res.status}`);
    console.warn(`[gemini] ${model} ${res.status}: ${json.error?.message}`);
    json = {};
  }
  if (!json.candidates) throw new Error("Gemini is unavailable right now");

  const text = (json.candidates?.[0]?.content?.parts ?? [])
    .filter((p) => !p.thought)
    .map((p) => p.text ?? "")
    .join("")
    .trim();
  if (!text || text === "SKIP") return null;
  return text.slice(0, 4000);
}
