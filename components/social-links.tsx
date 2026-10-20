import { profile } from "@/content/profile";
import { Github, Linkedin, Mail, Telegram } from "./ui/icons";

const items = [
  { href: profile.github, label: "GitHub", Icon: Github },
  { href: profile.telegram, label: "Telegram", Icon: Telegram },
  { href: profile.linkedin, label: "LinkedIn", Icon: Linkedin },
  { href: `mailto:${profile.email}`, label: "Email", Icon: Mail },
];

export function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex items-center gap-2 ${className}`}>
      {items.map(({ href, label, Icon }) => (
        <li key={label}>
          <a
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel="noopener noreferrer me"
            aria-label={label}
            className="grid size-10 place-items-center rounded-full border border-line text-muted transition hover:-translate-y-0.5 hover:border-accent hover:text-accent"
          >
            <Icon />
          </a>
        </li>
      ))}
    </ul>
  );
}
