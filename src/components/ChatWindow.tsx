"use client";

import type { ChatMessage } from "@/lib/types";
import { LoadingIndicator } from "./LoadingIndicator";

type ChatWindowProps = {
  messages: ChatMessage[];
  isLoading?: boolean;
  compact?: boolean;
};

export function ChatWindow({ messages, isLoading, compact }: ChatWindowProps) {
  return (
    <div
      className={`flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto rounded-lg border border-slate-200 bg-white p-4 ${
        compact ? "max-h-[28rem]" : "min-h-[28rem]"
      }`}
    >
      {messages.length === 0 ? (
        <div className="flex h-full min-h-56 items-center justify-center text-center text-sm text-slate-500">
          La conversación aparecerá aquí.
        </div>
      ) : (
        messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[82%] rounded-lg px-4 py-3 text-sm leading-6 ${
                message.role === "user"
                  ? "bg-brand-600 text-white"
                  : "border border-slate-200 bg-slate-50 text-slate-800"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))
      )}
      {isLoading ? <LoadingIndicator /> : null}
    </div>
  );
}
