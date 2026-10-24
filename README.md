# Mustafo Botirov — Portfolio & Blog

Next.js 16 (App Router, Cache Components) + Tailwind CSS v4. Ikki tilli (uz / en), SEO optimallashtirilgan,
blog sayt admin paneli ↔ Telegram bot ↔ Telegram kanal o'rtasida avtomatik sinxronlanadi.

## Ishga tushirish

```bash
cp .env.example .env.local   # qiymatlarni to'ldiring
npm install
npm run dev                  # http://localhost:3000 -> /uz
```

## Kontentni tahrirlash

| Nima | Fayl |
| --- | --- |
| Ism, email, Telegram, GitHub, LinkedIn havolalari | `content/profile.ts` |
| Loyihalar (tavsif, yil, stack, havola) | `content/projects.ts` |
| Ko'nikmalar | `content/skills.ts` |
| Barcha matnlar (uz / en) | `lib/i18n.ts` |
| Ranglar (midnight + sariq) | `app/globals.css` (`:root` va `[data-theme="dark"]`) |

## Blog qanday ishlaydi

- **Sayt orqali:** `/admin` → parol → "Yangi post". Saqlanganda post Firestore'ga yoziladi va Telegram kanalga
  avtomatik yuboriladi. Tahrirlash/o'chirish kanaldagi postni ham yangilaydi (Telegram 48 soatdan eski
  postlarni o'chirishga ruxsat bermaydi).
- **Bot orqali:** botga xabar yozing — 1-qator sarlavha, qolgani matn. Rasm + izoh yuborsangiz rasm muqova bo'ladi.
  Xabarni tahrirlasangiz sayt va kanal ham yangilanadi. Buyruqlar: `/list`, `/delete <slug>`, `/help`.
- Bot faqat `ADMIN_TELEGRAM_ID` dagi foydalanuvchidan qabul qiladi.
- **Kommentlarga AI javob:** kanal postlari ostidagi kommentlarga bot Gemini yordamida post mazmuniga mos
  qisqa javob yozadi. Bot javobiga reply qilinsa, suhbatni davom ettiradi. Muallifning o'z kommentlariga,
  odamlar orasidagi suhbatga va spamga javob bermaydi. Javob bot nomidan chiqadi.

### Sozlash

1. **Firebase:** console.firebase.google.com → loyiha → Firestore Database yarating →
   Project settings → Service accounts → *Generate new private key*. JSON'dagi `project_id`, `client_email`,
   `private_key` ni `.env.local` ga yozing.
2. **Telegram:** @BotFather → `/newbot` → token. Kanal yarating va botni kanalga **admin** qiling.
   O'z ID'ingizni @userinfobot dan oling.
3. **Kommentlar (ixtiyoriy):** kanal → Settings → Discussion → guruh ulang, botni shu guruhga **admin**
   qiling. aistudio.google.com dan bepul kalit olib, `GEMINI_API_KEY` ga yozing.
4. **Deploy (Vercel):** env qiymatlarini Vercel Project Settings → Environment Variables ga qo'shing.
5. **Webhook:** deploydan keyin bir marta:
   ```bash
   node --env-file=.env.local scripts/set-webhook.mjs https://sizning-domen.uz
   ```

## SEO

- Har sahifada `title`, `description`, canonical, `hreflang` (uz / en / x-default), Open Graph, Twitter card
- Dinamik OG rasmlar (`opengraph-image.tsx`), favicon / apple-icon, `manifest.webmanifest`
- JSON-LD: `Person`, `WebSite`, `BlogPosting`, `BreadcrumbList`, `CreativeWork`
- `sitemap.xml` (blog postlar bilan, hreflang), `robots.txt`
- Statik prerender + `use cache` (postlar yangilanganda `updateTag` / `revalidateTag`)
- Google Search Console: `GOOGLE_SITE_VERIFICATION` ni qo'ying va `sitemap.xml` ni yuboring
