import { MessageSquareText, MonitorPlay } from "lucide-react";
import { AgentModeCard } from "@/components/AgentModeCard";

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full flex-1 flex-col px-5 sm:px-8">
      <section className="mx-auto flex w-full max-w-7xl flex-1 flex-col pt-20 pb-12 lg:pt-24">
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
