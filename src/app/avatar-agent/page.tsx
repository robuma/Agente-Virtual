"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { AvatarPanel, type AvatarPanelHandle } from "@/components/AvatarPanel";
import { ChatInput } from "@/components/ChatInput";
import { ChatWindow } from "@/components/ChatWindow";
import type { AvatarPanelState } from "@/lib/liveavatar-state";
import type { ChatMessage, DifyChatResponse } from "@/lib/types";

export default function AvatarAgentPage() {
  const avatarRef = useRef<AvatarPanelHandle | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [avatarState, setAvatarState] =
    useState<AvatarPanelState>("disconnected");
  const [error, setError] = useState<string | null>(null);
  const isAvatarReady = avatarState === "connected";

  async function sendMessage(query: string) {
    if (!isAvatarReady) return;

    setIsLoading(true);
    setError(null);
    setMessages((current) => [
      ...current,
      { id: crypto.randomUUID(), role: "user", content: query },
    ]);

    try {
      const response = await fetch("/api/dify/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, conversationId }),
      });
      const payload = await response.json();

      if (!response.ok) throw new Error(payload.error || "Error del agente.");

      const data = payload as DifyChatResponse;
      setConversationId(data.conversation_id);
      setMessages((current) => [
        ...current,
        { id: crypto.randomUUID(), role: "assistant", content: data.answer },
      ]);
      avatarRef.current?.speak(data.answer);
    } catch (caught) {
      const message =
        caught instanceof Error
          ? caught.message
          : "No pudimos completar la solicitud.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-5 py-6 sm:px-8">
      <header className="mb-6 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
          title="Volver"
        >
          <ArrowLeft aria-hidden className="h-4 w-4" />
        </Link>
        <div className="text-right">
          <h1 className="text-xl font-semibold text-ink">
            Agente con Avatar y Voz
          </h1>
          <p className="text-sm text-slate-500">
            Agente de atención virtual por medio de voz y video
          </p>
        </div>
      </header>

      {error ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <section className="grid min-h-0 items-stretch gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(22rem,0.85fr)]">
        <AvatarPanel
          ref={avatarRef}
          onError={setError}
          onStateChange={setAvatarState}
        />
        <div className="flex min-h-0 flex-col gap-4">
          <ChatWindow messages={messages} isLoading={isLoading} />
          <ChatInput
            onSubmit={sendMessage}
            disabled={isLoading || !isAvatarReady}
            placeholder={
              isAvatarReady
                ? "Pregunta al avatar"
                : "Inicia el avatar para escribir"
            }
            enableVoice
          />
        </div>
      </section>
    </main>
  );
}
