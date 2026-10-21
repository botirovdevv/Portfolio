import { getFileUrl, isTelegramConfigured } from "@/lib/telegram";

// Proxies images sent to the bot so the bot token never reaches the browser.
export async function GET(_: Request, { params }: RouteContext<"/api/tg-file/[fileId]">) {
  const { fileId } = await params;
  if (!isTelegramConfigured() || !/^[\w-]+$/.test(fileId)) {
    return new Response("Not found", { status: 404 });
  }
  try {
    const upstream = await fetch(await getFileUrl(fileId));
    if (!upstream.ok || !upstream.body) return new Response("Not found", { status: 404 });
    return new Response(upstream.body, {
      headers: {
        // Telegram often reports application/octet-stream; bot photos are always JPEG.
        "content-type": upstream.headers.get("content-type")?.startsWith("image/")
          ? upstream.headers.get("content-type")!
          : "image/jpeg",
        "cache-control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
