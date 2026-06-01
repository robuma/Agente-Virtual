import { Bot, MessageSquareText, MonitorPlay } from "lucide-react";
import { AgentModeCard } from "@/components/AgentModeCard";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-8 sm:px-8 lg:py-12">
      <nav className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-lg font-semibold text-ink">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border-2 border-brand-700 bg-transparent text-brand-700 transition-colors duration-200 ease-out hover:bg-brand-700 hover:text-white">
            <Bot aria-hidden className="h-5 w-5" />
          </span>
          Agente de atención virtual
        </div>
        <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600">
          Consultorios Jurídicos
        </div>
      </nav>

      <section className="flex flex-1 flex-col pt-16 pb-12 lg:pt-20">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-700">
            Selección de modo
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-normal text-ink sm:text-5xl">
            Elige cómo quieres conversar con el agente.
          </h1>
          <p className="mt-5 max-w-4xl text-base leading-7 text-slate-600">
            Esta plataforma es un plan piloto para la implementación de un
            agente de atención virtual en los Consultorios Jurídicos de la
            Universidad de Costa Rica.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <AgentModeCard
            title="Agente con Avatar y Voz"
            description="Agente de atención virtual por medio de voz y video."
            href="/avatar-agent"
            icon={MonitorPlay}
          />
          <AgentModeCard
            title="Agente solo Texto"
            description="Agente de atención virtual por medio de texto."
            href="/text-agent"
            icon={MessageSquareText}
          />
        </div>
      </section>
    </main>
  );
}
