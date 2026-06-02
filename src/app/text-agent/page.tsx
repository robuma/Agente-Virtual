"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ChatInput } from "@/components/ChatInput";
import { ChatWindow } from "@/components/ChatWindow";
import type { ChatMessage, DifyChatResponse } from "@/lib/types";
import { useState } from "react";

export default function TextAgentPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sendMessage(query: string) {
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: query,
    };

    setMessages((current) => [...current, userMessage]);
    setIsLoading(true);
    setError(null);

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
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.answer,
        },
      ]);
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
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-5 pt-16 pb-6 sm:px-8 lg:pt-20">
      <header className="mb-6 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
          title="Volver"
        >
          <ArrowLeft aria-hidden className="h-4 w-4" />
        </Link>
        <div className="text-right">
          <h1 className="text-xl font-semibold text-ink">Agente solo Texto</h1>
          <p className="text-sm text-slate-500">
            Agente de atención virtual por medio de texto
          </p>
        </div>
      </header>

      {error ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <section className="flex h-[33rem] min-h-0 flex-col gap-4">
        <ChatWindow messages={messages} isLoading={isLoading} />
        <ChatInput
          onSubmit={sendMessage}
          disabled={isLoading}
          placeholder="Pregunta al agente"
        />
      </section>

    </main>
  );
}
