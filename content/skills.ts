import type { BrandName } from "@/components/ui/brand-icon";

export type SkillGroup = "frontend" | "language" | "backend" | "styling";

export type Skill = { name: string; icon?: BrandName };

export const skills: { group: SkillGroup; items: Skill[] }[] = [
  {
    group: "frontend",
    items: [
      { name: "React", icon: "react" },
      { name: "Next.js", icon: "nextjs" },
      { name: "React Native", icon: "react" },
      { name: "Expo", icon: "expo" },
      { name: "HTML", icon: "html" },
      { name: "CSS", icon: "css" },
    ],
  },
  {
    group: "language",
    items: [
      { name: "JavaScript", icon: "javascript" },
      { name: "TypeScript", icon: "typescript" },
      { name: "Python", icon: "python" },
    ],
  },
  {
    group: "backend",
    items: [
      { name: "REST API" },
      { name: "Firebase", icon: "firebase" },
    ],
  },
  {
    group: "styling",
    items: [
      { name: "Tailwind CSS", icon: "tailwind" },
      { name: "Sass", icon: "sass" },
    ],
  },
];

export const allSkills = skills.flatMap((s) => s.items);
