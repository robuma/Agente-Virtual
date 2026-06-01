import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";

type AgentModeCardProps = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

export function AgentModeCard({
  title,
  description,
  href,
  icon: Icon
}: AgentModeCardProps) {
  return (
    <Link
      href={href}
      className="group flex h-full min-h-64 flex-col justify-between rounded-lg border border-slate-200 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100"
    >
      <div>
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
          <Icon aria-hidden className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-semibold tracking-normal text-ink">{title}</h2>
        <p className="mt-3 max-w-sm text-sm leading-6 text-slate-600">{description}</p>
      </div>
      <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-brand-700">
        Abrir
        <ArrowRight aria-hidden className="h-4 w-4 transition group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
