import Link from "next/link";
import { Bot } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="mx-auto w-full max-w-7xl px-5 pt-8 sm:px-8 lg:pt-12">
      <nav className="flex items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-3 text-lg font-semibold text-ink"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border-2 border-brand-700 bg-transparent text-brand-700 transition-colors duration-200 ease-out hover:bg-brand-700 hover:text-white">
            <Bot aria-hidden className="h-5 w-5" />
          </span>
          <span>Agente de atención virtual</span>
        </Link>
        <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600">
          Consultorios Jurídicos
        </div>
      </nav>
    </header>
  );
}
