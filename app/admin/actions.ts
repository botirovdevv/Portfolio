"use server";

import { updateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { checkPassword, createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/auth";
import { requireAdmin } from "@/lib/admin-session";
import { POSTS_TAG } from "@/lib/posts";
import { createAndPublish, deleteEverywhere, updateAndSync, type PostInput } from "@/lib/publish";

export type FormState = { error?: string; warning?: string } | undefined;

export async function login(_: FormState, formData: FormData): Promise<FormState> {
  const password = String(formData.get("password") ?? "");
  if (!(await checkPassword(password))) return { error: "Parol noto'g'ri" };
  (await cookies()).set(SESSION_COOKIE, await createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  redirect("/admin");
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/admin/login");
}

function readForm(formData: FormData): PostInput {
  return {
    title: String(formData.get("title") ?? ""),
    content: String(formData.get("content") ?? ""),
    excerpt: String(formData.get("excerpt") ?? ""),
    cover: String(formData.get("cover") ?? "").trim() || null,
    slug: String(formData.get("slug") ?? "").trim() || undefined,
    tags: String(formData.get("tags") ?? "")
      .split(",")
      .map((t) => t.trim().replace(/^#/, ""))
      .filter(Boolean),
  };
}

function validate(input: PostInput): string | undefined {
  if (input.title.trim().length < 3) return "Sarlavha juda qisqa";
  if (input.content.trim().length < 10) return "Matn juda qisqa";
}

export async function createPost(_: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const input = readForm(formData);
  const error = validate(input);
  if (error) return { error };

  const toChannel = formData.get("toChannel") === "on";
  const { channelError } = await createAndPublish(input, "web", { toChannel });
  updateTag(POSTS_TAG);
  if (channelError) return { warning: `Saytga saqlandi, lekin kanalga yuborilmadi: ${channelError}` };
  redirect("/admin?ok=created");
}

export async function updatePost(id: string, _: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const input = readForm(formData);
  const error = validate(input);
  if (error) return { error };

  const { channelError } = await updateAndSync(id, input);
  updateTag(POSTS_TAG);
  if (channelError) return { warning: `Saytda yangilandi, lekin kanalda yangilanmadi: ${channelError}` };
  redirect("/admin?ok=updated");
}

export async function deletePost(id: string) {
  await requireAdmin();
  await deleteEverywhere(id);
  updateTag(POSTS_TAG);
  redirect("/admin?ok=deleted");
}
