export type SkillGroup = "core" | "frameworks" | "backend" | "ui";

export const skills: { group: SkillGroup; items: string[] }[] = [
  { group: "core", items: ["HTML", "CSS", "JavaScript", "TypeScript"] },
  { group: "frameworks", items: ["React.js", "Next.js"] },
  { group: "backend", items: ["Python", "REST API", "Firebase"] },
  { group: "ui", items: ["Tailwind CSS", "Sass"] },
];

export const allSkills = skills.flatMap((s) => s.items);
