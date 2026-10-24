// Usage: node --env-file=.env.local scripts/set-webhook.mjs https://your-domain.uz
const base = (process.argv[2] ?? process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "");
const token = process.env.TELEGRAM_BOT_TOKEN;
const secret = process.env.TELEGRAM_WEBHOOK_SECRET;

if (!base || !token || !secret) {
  console.error("Need site URL (arg or NEXT_PUBLIC_SITE_URL), TELEGRAM_BOT_TOKEN and TELEGRAM_WEBHOOK_SECRET.");
  process.exit(1);
}

const api = (method, body) =>
  fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  }).then((r) => r.json());

console.log(
  await api("setWebhook", {
    url: `${base}/api/telegram/webhook`,
    secret_token: secret,
    allowed_updates: ["message", "edited_message", "callback_query"],
    drop_pending_updates: true,
  }),
);
// The bot is private: only the admin's chat gets the command menu.
const adminId = process.env.ADMIN_TELEGRAM_ID;
console.log(await api("deleteMyCommands", {}));
console.log(
  await api("setMyCommands", {
    ...(adminId && { scope: { type: "chat", chat_id: Number(adminId) } }),
    commands: [
      { command: "list", description: "Oxirgi postlar" },
      { command: "delete", description: "Postni o'chirish: /delete slug" },
      { command: "help", description: "Yordam" },
    ],
  }),
);
