import type { ReactNode } from "react";
import { Reveal } from "./ui/reveal";

export function SectionHeading({
  kicker,
  title,
  id,
  action,
}: {
  kicker: string;
  title: string;
  id: string;
  action?: ReactNode;
}) {
  return (
    <Reveal className="mb-12 flex flex-wrap items-end justify-between gap-6 sm:mb-14">
      <div>
        <p className="eyebrow">{kicker}</p>
        <h2 id={id} className="h-section mt-4">
          {title}
        </h2>
      </div>
      {action}
    </Reveal>
  );
}
