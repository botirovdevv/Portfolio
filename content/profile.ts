// Shaxsiy ma'lumotlar — bitta joyda tahrirlanadi.
// TODO: haqiqiy havolalarni qo'ying.
export const profile = {
  name: "Mustafo Botirov",
  shortName: "Mustafo",
  initials: "MB",
  email: "hello@example.com",
  telegram: "https://t.me/your_username",
  telegramChannel: "https://t.me/your_channel",
  github: "https://github.com/your_username",
  linkedin: "https://www.linkedin.com/in/your_username",
  location: "Khorezm, Uzbekistan",
  university: "Al-Khwarizmi University",
  yearsOfExperience: 4,
};

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://botirov.uz"
).replace(/\/$/, "");
