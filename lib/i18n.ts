export const locales = ["uz", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "uz";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export const ogLocale: Record<Locale, string> = {
  uz: "uz_UZ",
  en: "en_US",
};

const dictionaries = {
  uz: {
    nav: {
      home: "Bosh sahifa",
      about: "Men haqimda",
      skills: "Ko'nikmalar",
      experience: "Tajriba",
      projects: "Loyihalar",
      blog: "Maqolalar",
      contact: "Aloqa",
    },
    ticker: {
      label: "HOZIR",
      live: "ishlab turibdi",
      dev: "ishlanmoqda",
      learning: "o'qish — Software Engineering, 1-kurs",
    },
    hero: {
      badge: "Yangi loyihalarga ochiqman",
      role: "Frontend dasturchi",
      tagline: "Tez va chiroyli\ninterfeyslar quraman.",
      intro:
        "React, Next.js va TypeScript bilan foydalanuvchi sevadigan web ilovalar yarataman — g'oyadan to ishga tushirishgacha.",
      ctaProjects: "Loyihalar",
      ctaContact: "Bog'lanish",
      ctaChannel: "TG kanal",
      stats: { years: "yil tajriba", projects: "loyiha", stack: "texnologiya" },
      basedIn: "Joylashuv",
      location: "Xorazm, UZ",
      photoChip: "Frontend · 4 yil",
    },
    domains: {
      label: "Nimalar yarataman",
      items: ["Web ilovalar", "Mobil ilovalar", "Saytlar", "Admin panellar"],
    },
    about: {
      kicker: "01 — Men haqimda",
      title: "Men kimman va nima qilaman",
      p1: "Salom! Men Mustafo Botirov — 4 yillik tajribaga ega frontend dasturchiman. Hozirda Al-Xorazmiy nomidagi universitetda Software Engineering yo'nalishida 1-kurs talabasiman.",
      p2: "Dasturlashni mustaqil o'rgandim va har kuni o'rganishda davom etaman. SAT va IELTS mock platformasi Prep-Zone asoschisiman — uni noldan o'zim yaratganman. Ta'lim, sog'liq, moliya va AI yo'nalishidagi real loyihalarda ishlaganman.",
      p3: "Men uchun yaxshi interfeys — bu tez yuklanadigan, har qanday ekranda chiroyli ko'rinadigan va foydalanuvchini o'ylashga majburlamaydigan interfeys.",
      status: "Status",
      rows: {
        role: "Rol",
        roleValue: "Frontend dasturchi",
        location: "Joylashuv",
        locationValue: "Xorazm, UZ",
        study: "Ta'lim",
        studyValue: "Al-Xorazmiy univ.",
        focus: "Fokus",
        focusValue: "Web ilovalar va UI",
        state: "Holat",
        stateValue: "Loyihaga ochiq",
      },
    },
    skills: {
      kicker: "02 — Ko'nikmalar",
      title: "Qaysi texnologiyalarda ishlayman",
      groups: {
        frontend: "Frontend va mobil",
        language: "Tillar",
        backend: "Backend va ma'lumotlar",
        styling: "UI va stil",
      },
    },
    experience: {
      kicker: "03 — Tajriba",
      title: "O'qish va ish tajribam",
      now: "hozirgacha",
    },
    projects: {
      kicker: "04 — Loyihalar",
      title: "Men yaratgan loyihalar",
      details: "Batafsil",
      visit: "Saytni ochish",
      back: "Barcha loyihalar",
      stack: "Texnologiyalar",
      role: "Rolim",
      year: "Yil",
      status: { live: "Live", dev: "Ishlanmoqda" },
      next: "Keyingi loyiha",
    },
    blog: {
      kicker: "05 — Blog",
      title: "So'nggi maqolalar",
      all: "Maqolalar",
      read: "O'qish",
      empty: "Hozircha maqolalar yo'q — tez orada birinchisi chiqadi.",
      back: "Barcha maqolalar",
      telegram: "Telegram kanal",
      minRead: "daqiqa",
      pageTitle: "Maqolalar",
      pageSubtitle: "Frontend, React, Next.js va o'rganganlarim haqida. Har bir maqola Telegram kanalda ham chiqadi.",
      pageDescription:
        "Mustafo Botirovning frontend dasturlash, React, Next.js va tajribalar haqidagi maqolalari.",
    },
    contact: {
      kicker: "06 — Aloqa",
      title: "Men bilan\nbog'laning",
      text: "Loyiha, hamkorlik yoki shunchaki savol — yozing, tez javob beraman.",
    },
    footer: {
      rights: "Barcha huquqlar himoyalangan.",
    },
    meta: {
      title: "Mustafo Botirov — Frontend dasturchi",
      description:
        "Mustafo Botirov — 4 yillik tajribaga ega frontend dasturchi. React, Next.js, TypeScript va Tailwind CSS bilan tez va zamonaviy web ilovalar.",
    },
    menu: { open: "Menyuni ochish", close: "Menyuni yopish" },
  },
  en: {
    nav: {
      home: "Home",
      about: "About",
      skills: "Skills",
      experience: "Experience",
      projects: "Projects",
      blog: "Writing",
      contact: "Contact",
    },
    ticker: {
      label: "NOW",
      live: "operational",
      dev: "in development",
      learning: "studying — Software Engineering, year 1",
    },
    hero: {
      badge: "Open to new projects",
      role: "Frontend Developer",
      tagline: "I build fast,\nbeautiful interfaces.",
      intro:
        "I craft web apps people love using React, Next.js and TypeScript — from the first idea to launch.",
      ctaProjects: "Projects",
      ctaContact: "Get in touch",
      ctaChannel: "TG channel",
      stats: { years: "years", projects: "projects", stack: "technologies" },
      basedIn: "Based in",
      location: "Khorezm, UZ",
      photoChip: "Frontend · 4 yrs",
    },
    domains: {
      label: "What I build",
      items: ["Web apps", "Mobile apps", "Websites", "Dashboards"],
    },
    about: {
      kicker: "01 — About",
      title: "Who I am and what I do",
      p1: "Hi! I'm Mustafo Botirov — a frontend developer with 4 years of experience. I'm currently a first-year Software Engineering student at Al-Khwarizmi University.",
      p2: "I taught myself to code and keep learning every day. I'm the founder of Prep-Zone, an SAT and IELTS mock-exam platform I built from scratch myself. I've worked on real products in education, health, finance and AI.",
      p3: "To me, a good interface loads fast, looks great on every screen and never makes people think twice.",
      status: "Status",
      rows: {
        role: "Role",
        roleValue: "Frontend developer",
        location: "Location",
        locationValue: "Khorezm, UZ",
        study: "Education",
        studyValue: "Al-Khwarizmi Univ.",
        focus: "Focus",
        focusValue: "Web apps & UI",
        state: "Status",
        stateValue: "Open to work",
      },
    },
    skills: {
      kicker: "02 — Skills",
      title: "Technologies I work with",
      groups: {
        frontend: "Frontend & mobile",
        language: "Languages",
        backend: "Backend & data",
        styling: "UI & styling",
      },
    },
    experience: {
      kicker: "03 — Experience",
      title: "My learning & work journey",
      now: "present",
    },
    projects: {
      kicker: "04 — Projects",
      title: "Projects I've built",
      details: "Details",
      visit: "Visit site",
      back: "All projects",
      stack: "Tech stack",
      role: "My role",
      year: "Year",
      status: { live: "Live", dev: "In progress" },
      next: "Next project",
    },
    blog: {
      kicker: "05 — Blog",
      title: "Latest articles",
      all: "All posts",
      read: "Read",
      empty: "No posts yet — the first one is coming soon.",
      back: "All posts",
      telegram: "Telegram channel",
      minRead: "min",
      pageTitle: "Writing",
      pageSubtitle: "On frontend, React, Next.js and things I've learned. Every post is also published to my Telegram channel.",
      pageDescription:
        "Articles by Mustafo Botirov about frontend development, React, Next.js and lessons learned.",
    },
    contact: {
      kicker: "06 — Contact",
      title: "Get in\ntouch",
      text: "A project, a collaboration or just a question — write to me, I reply fast.",
    },
    footer: {
      rights: "All rights reserved.",
    },
    meta: {
      title: "Mustafo Botirov — Frontend Developer",
      description:
        "Mustafo Botirov — frontend developer with 4 years of experience building fast, modern web apps with React, Next.js, TypeScript and Tailwind CSS.",
    },
    menu: { open: "Open menu", close: "Close menu" },
  },
} as const;

export type Dictionary = (typeof dictionaries)[Locale];

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
