import { profile } from "@/content/profile";

export const socials = [
  { href: profile.github, label: "GitHub" },
  { href: profile.telegram, label: "Telegram" },
  { href: profile.telegramChannel, label: "Kanal" },
  { href: profile.linkedin, label: "LinkedIn" },
  { href: profile.instagram, label: "Instagram" },
  { href: `mailto:${profile.email}`, label: "Email" },
];

export function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[12.5px] ${className}`}>
      {socials.map(({ href, label }) => (
        <li key={label}>
          <a
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel="noopener noreferrer me"
            className="text-muted transition-colors hover:text-amber"
          >
            {label}
          </a>
        </li>
      ))}
    </ul>
  );
}
