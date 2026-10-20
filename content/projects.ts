import type { Locale } from "@/lib/i18n";

// TODO: har bir loyiha tavsifini haqiqiy ma'lumot bilan almashtiring.
export type Project = {
  slug: string;
  name: string;
  url?: string;
  year: string;
  stack: string[];
  summary: Record<Locale, string>;
  description: Record<Locale, string>;
  role: Record<Locale, string>;
};

export const projects: Project[] = [
  {
    slug: "prep-zone",
    name: "Prep-Zone",
    url: "https://prep-zone.uz",
    year: "2025",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Firebase"],
    summary: {
      uz: "Imtihonlarga tayyorlanish uchun onlayn ta'lim platformasi.",
      en: "An online learning platform for exam preparation.",
    },
    description: {
      uz: "Prep-Zone — o'quvchilarga imtihonlarga samarali tayyorlanishda yordam beruvchi platforma: testlar, natijalar tahlili va qulay interfeys.",
      en: "Prep-Zone helps students prepare for exams effectively with practice tests, progress analytics and a clean interface.",
    },
    role: { uz: "Frontend dasturchi", en: "Frontend developer" },
  },
  {
    slug: "xorazmvbsks",
    name: "Xorazm VBSKS",
    url: "https://xorazmvbsks.uz",
    year: "2024",
    stack: ["React.js", "JavaScript", "Sass", "REST API"],
    summary: {
      uz: "Xorazm viloyati tashkiloti uchun rasmiy veb-sayt.",
      en: "Official website for a Khorezm regional organization.",
    },
    description: {
      uz: "Tashkilot faoliyati, yangiliklar va xizmatlar haqida ma'lumot beruvchi rasmiy sayt. Tez yuklanish va mobil qurilmalarga moslik asosiy e'tiborda.",
      en: "The official site presenting the organization's activities, news and services, built with a focus on speed and mobile-friendliness.",
    },
    role: { uz: "Frontend dasturchi", en: "Frontend developer" },
  },
  {
    slug: "femate",
    name: "FeMate App",
    year: "2025",
    stack: ["React", "TypeScript", "Firebase", "Tailwind CSS"],
    summary: {
      uz: "Ayollar salomatligi va kundalik hayoti uchun yordamchi ilova.",
      en: "A companion app for women's health and daily life.",
    },
    description: {
      uz: "FeMate — foydalanuvchilarga shaxsiy ma'lumotlarini kuzatish va foydali maslahatlar olishda yordam beruvchi zamonaviy ilova.",
      en: "FeMate is a modern app that helps users track personal data and receive helpful, personalized tips.",
    },
    role: { uz: "Frontend dasturchi", en: "Frontend developer" },
  },
  {
    slug: "showroompulse-ai",
    name: "ShowRoomPulse AI",
    year: "2026",
    stack: ["Next.js", "TypeScript", "Python", "AI API"],
    summary: {
      uz: "Avtosalonlar uchun AI asosidagi tahlil platformasi.",
      en: "An AI-powered analytics platform for showrooms.",
    },
    description: {
      uz: "ShowRoomPulse AI — showroom faoliyatini sun'iy intellekt yordamida tahlil qilib, savdo va mijozlar oqimi bo'yicha aniq xulosalar beradi.",
      en: "ShowRoomPulse AI uses artificial intelligence to analyze showroom activity and deliver clear insights on sales and customer flow.",
    },
    role: { uz: "Frontend dasturchi", en: "Frontend developer" },
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
