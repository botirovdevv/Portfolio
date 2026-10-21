import type { Locale } from "@/lib/i18n";

export type ExperienceItem = {
  period: string;
  current?: boolean;
  role: Record<Locale, string>;
  org: string;
  orgUrl?: string;
  text: Record<Locale, string>;
  tags: string[];
};

export const experience: ExperienceItem[] = [
  {
    period: "2026 — now",
    current: true,
    role: { uz: "Software Engineering talabasi", en: "Software Engineering student" },
    org: "Al-Khwarizmi University",
    text: {
      uz: "Al-Xorazmiy nomidagi universitetga qabul qilindim va hozir shu yerda o'qiyapman. Shu yili jamoam bilan WIUT hakatonining final bosqichiga chiqdik.",
      en: "Admitted to Al-Khwarizmi University, where I'm studying now. This year my team also made it to the final round of the WIUT hackathon.",
    },
    tags: ["Software Engineering", "WIUT Hackathon — finalist"],
  },
  {
    period: "2025",
    role: { uz: "Shaxsiy loyihalar", en: "Personal projects" },
    org: "Prep-Zone, FeMate, ShowRoom AI Pulse",
    text: {
      uz: "O'z mahsulotlarim ustida ishladim: AI study plan tuzadigan mock platforma, xarajatlarni kamaytiruvchi ilova va avtosalon uchun AI tahlil tizimi.",
      en: "Worked on my own products: a mock-exam platform with AI study plans, a spending-control app and an AI analytics system for car showrooms.",
    },
    tags: ["Next.js", "TypeScript", "Firebase", "AI"],
  },
  {
    period: "2024",
    role: { uz: "Frontend dasturchi (mijozlar bilan)", en: "Frontend developer (client work)" },
    org: "Xorazm VBSKS",
    orgUrl: "https://xorazmvbsks.uz",
    text: {
      uz: "Mahalliy mijozlar bilan ishlashni boshladim. Bolalar sil kasalliklari sanatoriyasi uchun rasmiy saytni ishlab chiqdim: yangiliklar, xizmatlar, mobil moslik.",
      en: "Started working with local clients. Built the official website for a children's tuberculosis sanatorium: news, services and a mobile-first layout.",
    },
    tags: ["React", "JavaScript", "Sass", "REST API"],
  },
  {
    period: "2023",
    role: { uz: "Mustaqil o'rganish", en: "Self-study" },
    org: "Self-taught",
    text: {
      uz: "O'z ustimda ishlashni boshladim: mustaqil ravishda yangi texnologiyalarni o'rgandim va ko'nikmalarimni chuqurlashtirdim.",
      en: "Started studying on my own: picked up new technologies independently and deepened my skills.",
    },
    tags: ["React", "TypeScript", "Git"],
  },
  {
    period: "2022 — 2023",
    role: { uz: "Dasturlashni boshladim", en: "Started programming" },
    org: "DATA",
    text: {
      uz: "Dasturlashni DATA o'quv markazida o'rganishni boshladim va u yerda qariyb bir yil o'qidim.",
      en: "Began learning to code at the DATA learning center and studied there for about a year.",
    },
    tags: ["HTML", "CSS", "JavaScript"],
  },
];
