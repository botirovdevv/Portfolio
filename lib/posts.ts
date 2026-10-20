import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { getDb, isFirebaseConfigured } from "./firebase-admin";

export type PostSource = "web" | "telegram";

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // Markdown
  cover: string | null;
  tags: string[];
  source: PostSource;
  createdAt: number;
  updatedAt: number;
  /** Message id of the post in the Telegram channel. */
  channelMessageId: number | null;
  channelHasPhoto: boolean;
  /** For posts created from the bot: "<chatId>:<messageId>" of the original message. */
  telegramSourceId: string | null;
};

export const POSTS_TAG = "posts";
const COLLECTION = "posts";

function toPost(id: string, data: FirebaseFirestore.DocumentData): Post {
  return {
    id,
    slug: data.slug,
    title: data.title,
    excerpt: data.excerpt ?? "",
    content: data.content ?? "",
    cover: data.cover ?? null,
    tags: data.tags ?? [],
    source: data.source ?? "web",
    createdAt: data.createdAt ?? 0,
    updatedAt: data.updatedAt ?? data.createdAt ?? 0,
    channelMessageId: data.channelMessageId ?? null,
    channelHasPhoto: data.channelHasPhoto ?? false,
    telegramSourceId: data.telegramSourceId ?? null,
  };
}

/* ---------- Public, cached reads ---------- */

export async function getPublishedPosts(): Promise<Post[]> {
  "use cache";
  cacheTag(POSTS_TAG);
  cacheLife("hours");
  if (!isFirebaseConfigured()) return [];
  try {
    const snap = await getDb().collection(COLLECTION).orderBy("createdAt", "desc").limit(200).get();
    return snap.docs.map((d) => toPost(d.id, d.data()));
  } catch (err) {
    console.error("[posts] failed to load", err);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  "use cache";
  cacheTag(POSTS_TAG, `post-${slug}`);
  cacheLife("hours");
  if (!isFirebaseConfigured()) return null;
  const snap = await getDb().collection(COLLECTION).where("slug", "==", slug).limit(1).get();
  const doc = snap.docs[0];
  return doc ? toPost(doc.id, doc.data()) : null;
}

/* ---------- Uncached admin reads / writes ---------- */

export async function listPostsUncached(): Promise<Post[]> {
  const snap = await getDb().collection(COLLECTION).orderBy("createdAt", "desc").get();
  return snap.docs.map((d) => toPost(d.id, d.data()));
}

export async function getPostById(id: string): Promise<Post | null> {
  const doc = await getDb().collection(COLLECTION).doc(id).get();
  return doc.exists ? toPost(doc.id, doc.data()!) : null;
}

export async function findPostByTelegramSource(sourceId: string): Promise<Post | null> {
  const snap = await getDb()
    .collection(COLLECTION)
    .where("telegramSourceId", "==", sourceId)
    .limit(1)
    .get();
  const doc = snap.docs[0];
  return doc ? toPost(doc.id, doc.data()) : null;
}

export async function uniqueSlug(base: string, ignoreId?: string): Promise<string> {
  const col = getDb().collection(COLLECTION);
  let slug = base;
  for (let i = 2; ; i++) {
    const snap = await col.where("slug", "==", slug).limit(1).get();
    if (snap.empty || snap.docs[0].id === ignoreId) return slug;
    slug = `${base}-${i}`;
  }
}

export async function insertPost(data: Omit<Post, "id">, id?: string): Promise<Post> {
  const col = getDb().collection(COLLECTION);
  const ref = id ? col.doc(id) : col.doc();
  await ref.set(data);
  return { id: ref.id, ...data };
}

export async function patchPost(id: string, data: Partial<Omit<Post, "id">>) {
  await getDb().collection(COLLECTION).doc(id).update(data);
}

export async function removePost(id: string) {
  await getDb().collection(COLLECTION).doc(id).delete();
}
