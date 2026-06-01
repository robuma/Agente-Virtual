export type ChatRole = "user" | "assistant" | "system";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
};

export type DifyChatRequest = {
  query: string;
  conversationId?: string | null;
  userId?: string;
  inputs?: Record<string, unknown>;
};

export type DifyChatResponse = {
  answer: string;
  conversation_id: string;
  metadata?: Record<string, unknown>;
};

export type LiveAvatarSessionToken = {
  sessionId: string;
  sessionToken: string;
};

export type ApiErrorPayload = {
  error: string;
};
