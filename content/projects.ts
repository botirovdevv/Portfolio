import type { Locale } from "@/lib/i18n";

export type ProjectIcon = "education" | "government" | "health" | "finance" | "ai";

export type Project = {
  slug: string;
  name: string;
  monogram: string;
  icon: ProjectIcon;
  url?: string;
  repo?: string;
  year: string;
  status: "live" | "dev";
  stack: string[];
  summary: Record<Locale, string>;
  description: Record<Locale, string>;
  role: Record<Locale, string>;
};

export const projects: Project[] = [
  {
    slug: "prep-zone",
    name: "Prep-Zone",
    monogram: "PZ",
    icon: "education",
    url: "https://prep-zone.uz",
    year: "2026",
    status: "live",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Firebase"],
    summary: {
      uz: "SAT va IELTS uchun onlayn mock platforma: AI imtihon kuningizgacha shaxsiy study plan tuzadi.",
      en: "An online SAT and IELTS mock platform where AI builds a study plan up to your test date.",
    },
    description: {
      uz: "Prep-Zone — men asos solgan SAT va IELTS mock imtihonlari platformasi. G'oyadan tortib dizayn, frontend, backend va ishga tushirishgacha hammasini o'zim yaratganman. Foydalanuvchi imtihon kunini belgilaydi, AI esa shu kungacha shaxsiy study plan tuzib beradi — real imtihonga bosqichma-bosqich tayyorlanish uchun.",
      en: "Prep-Zone is an online SAT and IELTS mock-exam platform I founded. I built everything myself — from the idea and design to the frontend, backend and launch. Users set their test date and AI builds a personal study plan up to that day, so they can prepare for the real exam step by step.",
    },
    role: { uz: "Asoschi (Founder)", en: "Founder" },
  },
  {
    slug: "xorazmvbsks",
    name: "Xorazm VBSKS",
    monogram: "XV",
    icon: "health",
    url: "https://xorazmvbsks.uz",
    year: "2024",
    status: "live",
    stack: ["React", "JavaScript", "Sass", "REST API"],
    summary: {
      uz: "Xorazm viloyat bolalar sil kasalliklari sanatoriyasi uchun rasmiy veb-sayt.",
      en: "Official website for the Khorezm regional children's tuberculosis sanatorium.",
    },
    description: {
      uz: "Mahalliy mijoz buyurtmasi asosida Bolalar sil kasalliklari sanatoriyasi uchun yaratilgan rasmiy sayt. Loyihada frontend dasturchi sifatida ishladim: sanatoriya faoliyati, yangiliklar va xizmatlar tez yuklanadigan va har qanday qurilmaga mos interfeysda.",
      en: "An official website built for a children's tuberculosis sanatorium, commissioned by a local client. I worked on it as the frontend developer, presenting the sanatorium's work, news and services in a fast, mobile-friendly interface.",
    },
    role: { uz: "Frontend dasturchi", en: "Frontend developer" },
  },
  {
    slug: "femate",
    name: "FeMate App",
    monogram: "FM",
    icon: "finance",
    repo: "https://github.com/botirovdevv/shenzhen-fintech",
    year: "2026",
    status: "dev",
    stack: ["React", "TypeScript", "Firebase", "Tailwind CSS"],
    summary: {
      uz: "Kunlik xarajatlarni kamaytirishga yordam beruvchi ilova: AI daromadingizga qarab kunlik limitni hisoblaydi.",
      en: "An app that helps cut daily spending: AI works out a daily budget from your income.",
    },
    description: {
      uz: "FeMate — kunlik xarajatlarni kamaytirish uchun yaratilgan ilova. Foydalanuvchi oylik daromadini kiritadi, ilova esa AI yordamida unga mos kunlik xarajatlarni hisoblab beradi.",
      en: "FeMate is built to help people cut their daily spending. Users enter their monthly income and the app uses AI to calculate how much they can spend each day.",
    },
    role: { uz: "Frontend dasturchi", en: "Frontend developer" },
  },
  {
    slug: "showroompulse-ai",
    name: "ShowRoom AI Pulse",
    monogram: "SP",
    icon: "ai",
    year: "2026",
    status: "dev",
    stack: ["Next.js", "TypeScript", "Python", "AI API"],
    summary: {
      uz: "Avtosalon uchun AI tahlil: mijozlar qaysi mashina yonida ko'proq turadi va qaysi mashina ko'proq sotiladi.",
      en: "AI analytics for car showrooms: which cars visitors linger by and which cars sell best.",
    },
    description: {
      uz: "ShowRoom AI Pulse — avtosalonga kelayotgan mijozlarni tahlil qiluvchi tizim. Mijoz qaysi mashina yonida ko'proq turayotgani va qaysi mashina ko'proq sotilayotganini aniqlab, salon uchun foydali xulosalar beradi.",
      en: "ShowRoom AI Pulse analyzes visitors at a car showroom: it shows which cars people spend the most time next to and which cars sell best, giving the dealership useful insights.",
    },
    role: { uz: "Frontend dasturchi", en: "Frontend developer" },
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
