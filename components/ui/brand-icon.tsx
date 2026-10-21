import type { SVGProps } from "react";
import {
  siCss,
  siExpo,
  siFirebase,
  siGit,
  siGithub,
  siHtml5,
  siJavascript,
  siNextdotjs,
  siNodedotjs,
  siPython,
  siReact,
  siSass,
  siTailwindcss,
  siTelegram,
  siTypescript,
} from "simple-icons";

// LinkedIn is no longer shipped by simple-icons, so its path lives here.
const siLinkedin = {
  title: "LinkedIn",
  hex: "0A66C2",
  path: "M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.8 0 0 .77 0 1.73v20.54C0 23.23.8 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z",
};

const icons = {
  html: siHtml5,
  css: siCss,
  javascript: siJavascript,
  typescript: siTypescript,
  react: siReact,
  expo: siExpo,
  nextjs: siNextdotjs,
  python: siPython,
  firebase: siFirebase,
  tailwind: siTailwindcss,
  sass: siSass,
  node: siNodedotjs,
  git: siGit,
  github: siGithub,
  telegram: siTelegram,
  linkedin: siLinkedin,
} as const;

export type BrandName = keyof typeof icons;

// Brand colours that disappear on the midnight background get a light fallback.
const darkBrands = new Set(["000000", "181717", "1C2024"]);

export function BrandIcon({
  name,
  colored = false,
  size = 16,
  ...props
}: { name: BrandName; colored?: boolean; size?: number } & SVGProps<SVGSVGElement>) {
  const icon = icons[name];
  const fill = colored && !darkBrands.has(icon.hex) ? `#${icon.hex}` : "currentColor";
  return (
    <svg role="img" aria-hidden width={size} height={size} viewBox="0 0 24 24" fill={fill} {...props}>
      <path d={icon.path} />
    </svg>
  );
}
