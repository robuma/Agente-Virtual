import { requireEnv } from "./env";
import { parseJsonResponse } from "./http";
import type { DifyChatRequest, DifyChatResponse } from "./types";

type DifyRawResponse = {
  answer?: string;
  conversation_id?: string;
  metadata?: Record<string, unknown>;
};

export async function sendDifyChatMessage({
  query,
  conversationId,
  userId,
  inputs = {}
}: DifyChatRequest): Promise<DifyChatResponse> {
  const apiUrl = requireEnv("DIFY_API_URL").replace(/\/$/, "");
  const apiKey = requireEnv("DIFY_API_KEY");
  const resolvedUserId = userId || requireEnv("DIFY_USER_ID");

  const response = await fetch(`${apiUrl}/chat-messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      query,
      inputs,
      response_mode: "blocking",
      user: resolvedUserId,
      ...(conversationId ? { conversation_id: conversationId } : {})
    })
  });

  const payload = await parseJsonResponse<DifyRawResponse>(response, "Dify");

  if (!payload.answer || !payload.conversation_id) {
    throw new Error("Dify returned an incomplete chat response.");
  }

  return {
    answer: payload.answer,
    conversation_id: payload.conversation_id,
    metadata: payload.metadata
  };
}
