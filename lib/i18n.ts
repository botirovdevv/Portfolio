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
      about: "Men haqimda",
      skills: "Ko'nikmalar",
      projects: "Loyihalar",
      blog: "Blog",
      contact: "Aloqa",
    },
    hero: {
      badge: "Yangi loyihalar uchun ochiqman",
      role: "Frontend dasturchi",
      intro:
        "Tez, chiroyli va foydalanuvchiga qulay web ilovalar quraman. React, Next.js va TypeScript — kundalik qurollarim.",
      ctaProjects: "Loyihalarni ko'rish",
      ctaContact: "Bog'lanish",
      scroll: "Pastga suring",
    },
    about: {
      kicker: "01 — Men haqimda",
      title: "Kod — bu men uchun dizayn tili",
      p1: "Salom! Men Mustafo Botirov — 4 yillik tajribaga ega frontend dasturchiman. Hozirda Al-Xorazmiy nomidagi universitetda Software Engineering yo'nalishida 1-kurs talabasiman.",
      p2: "Interfeysning har bir pikseli, har bir animatsiyasi va har bir millisekund yuklanish vaqti muhim deb hisoblayman. Ta'lim, biznes va AI yo'nalishidagi real loyihalarda ishlaganman — g'oyadan to ishga tushirishgacha.",
      p3: "Bo'sh vaqtimda yangi texnologiyalarni o'rganaman, blog yozaman va o'z bilimlarimni boshqalar bilan bo'lishaman.",
      stats: {
        years: "yillik tajriba",
        projects: "yirik loyiha",
        stack: "texnologiya",
      },
      cards: {
        study: "Ta'lim",
        studyValue: "Al-Xorazmiy universiteti",
        studySub: "Software Engineering · 1-kurs",
        location: "Joylashuv",
        locationValue: "Xorazm, O'zbekiston",
        focus: "Hozirgi fokus",
        focusValue: "Next.js, performance va AI interfeyslar",
      },
    },
    skills: {
      kicker: "02 — Ko'nikmalar",
      title: "Qurollar qutim",
      subtitle: "Har kuni ishlatadigan texnologiyalarim",
      groups: {
        core: "Asos",
        frameworks: "Freymvorklar",
        backend: "Backend va ma'lumotlar",
        ui: "UI va stil",
      },
    },
    projects: {
      kicker: "03 — Loyihalar",
      title: "Tanlangan ishlar",
      subtitle: "Men qurgan va ishtirok etgan loyihalar",
      visit: "Saytni ochish",
      details: "Batafsil",
      back: "Barcha loyihalar",
      stack: "Texnologiyalar",
      role: "Rolim",
      year: "Yil",
    },
    blog: {
      kicker: "04 — Blog",
      title: "Yozganlarim",
      subtitle: "Dasturlash, tajriba va o'rganganlarim haqida",
      all: "Barcha maqolalar",
      read: "O'qish",
      empty: "Hozircha maqolalar yo'q. Tez orada!",
      back: "Blogga qaytish",
      telegram: "Telegram kanalda kuzating",
      minRead: "daqiqa o'qish",
      pageTitle: "Blog",
      pageDescription:
        "Mustafo Botirovning frontend dasturlash, React, Next.js va tajribalar haqidagi maqolalari.",
    },
    contact: {
      kicker: "05 — Aloqa",
      title: "Keling, birga nimadir quramiz",
      text: "Loyiha g'oyangiz bormi yoki shunchaki salom demoqchimisiz? Xabar yozing — tez javob beraman.",
      cta: "Xabar yozish",
    },
    footer: {
      rights: "Barcha huquqlar himoyalangan.",
      built: "Next.js bilan qurilgan",
    },
    meta: {
      title: "Mustafo Botirov — Frontend dasturchi",
      description:
        "Mustafo Botirov — 4 yillik tajribaga ega frontend dasturchi. React, Next.js, TypeScript va Tailwind CSS bilan tez va zamonaviy web ilovalar.",
    },
    theme: { light: "Yorug' rejim", dark: "Qorong'i rejim" },
    menu: { open: "Menyuni ochish", close: "Menyuni yopish" },
    notFound: {
      title: "Sahifa topilmadi",
      text: "Siz qidirgan sahifa mavjud emas yoki ko'chirilgan.",
      home: "Bosh sahifaga",
    },
  },
  en: {
    nav: {
      about: "About",
      skills: "Skills",
      projects: "Projects",
      blog: "Blog",
      contact: "Contact",
    },
    hero: {
      badge: "Available for new projects",
      role: "Frontend Developer",
      intro:
        "I build fast, beautiful and user-friendly web applications. React, Next.js and TypeScript are my everyday tools.",
      ctaProjects: "View projects",
      ctaContact: "Get in touch",
      scroll: "Scroll down",
    },
    about: {
      kicker: "01 — About",
      title: "Code is my design language",
      p1: "Hi! I'm Mustafo Botirov — a frontend developer with 4 years of experience. I'm currently a first-year Software Engineering student at Al-Khwarizmi University.",
      p2: "I believe every pixel, every animation and every millisecond of load time matters. I've worked on real products in education, business and AI — from idea to launch.",
      p3: "In my free time I explore new technologies, write on my blog and share what I learn with others.",
      stats: {
        years: "years of experience",
        projects: "major projects",
        stack: "technologies",
      },
      cards: {
        study: "Education",
        studyValue: "Al-Khwarizmi University",
        studySub: "Software Engineering · 1st year",
        location: "Location",
        locationValue: "Khorezm, Uzbekistan",
        focus: "Current focus",
        focusValue: "Next.js, performance and AI interfaces",
      },
    },
    skills: {
      kicker: "02 — Skills",
      title: "My toolbox",
      subtitle: "Technologies I use every day",
      groups: {
        core: "Core",
        frameworks: "Frameworks",
        backend: "Backend & data",
        ui: "UI & styling",
      },
    },
    projects: {
      kicker: "03 — Projects",
      title: "Selected work",
      subtitle: "Projects I've built and contributed to",
      visit: "Visit site",
      details: "Details",
      back: "All projects",
      stack: "Tech stack",
      role: "My role",
      year: "Year",
    },
    blog: {
      kicker: "04 — Blog",
      title: "Writing",
      subtitle: "On programming, experience and things I've learned",
      all: "All posts",
      read: "Read",
      empty: "No posts yet. Coming soon!",
      back: "Back to blog",
      telegram: "Follow on Telegram",
      minRead: "min read",
      pageTitle: "Blog",
      pageDescription:
        "Articles by Mustafo Botirov about frontend development, React, Next.js and lessons learned.",
    },
    contact: {
      kicker: "05 — Contact",
      title: "Let's build something together",
      text: "Have a project idea or just want to say hi? Drop me a message — I reply fast.",
      cta: "Send a message",
    },
    footer: {
      rights: "All rights reserved.",
      built: "Built with Next.js",
    },
    meta: {
      title: "Mustafo Botirov — Frontend Developer",
      description:
        "Mustafo Botirov — frontend developer with 4 years of experience building fast, modern web apps with React, Next.js, TypeScript and Tailwind CSS.",
    },
    theme: { light: "Light mode", dark: "Dark mode" },
    menu: { open: "Open menu", close: "Close menu" },
    notFound: {
      title: "Page not found",
      text: "The page you're looking for doesn't exist or has been moved.",
      home: "Back home",
    },
  },
} as const;

export type Dictionary = (typeof dictionaries)[Locale];

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
