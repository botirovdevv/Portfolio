// Shaxsiy ma'lumotlar — bitta joyda tahrirlanadi.
// TODO: haqiqiy email manzilni qo'ying.
export const profile = {
  firstName: "Mustafo",
  lastName: "Botirov",
  name: "Mustafo Botirov",
  initials: "MB",
  email: "hello@example.com",
  telegram: "https://t.me/mustafo_dv",
  telegramChannel: "https://t.me/mustafo_dev",
  github: "https://github.com/botirovdevv",
  linkedin: "https://www.linkedin.com/in/botirovdev",
  instagram: "https://www.instagram.com/dilmuradov1ch_",
  university: "Al-Khwarizmi University",
  yearsOfExperience: 4,
  // Rasmni public/ papkasiga qo'ying va yo'lini yozing, masalan: "/me.jpg"
  photo: "/me.jpg" as string | null,
};

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://botirov.uz").replace(/\/$/, "");
