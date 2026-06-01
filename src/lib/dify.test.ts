import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { sendDifyChatMessage } from "./dify";

describe("sendDifyChatMessage", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
    process.env = {
      ...originalEnv,
      DIFY_API_URL: "https://api.dify.ai/v1",
      DIFY_API_KEY: "dify-secret",
      DIFY_USER_ID: "local-user"
    };
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    process.env = originalEnv;
  });

  it("sends a blocking chat message with the previous conversation id", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          answer: "Respuesta de Dify",
          conversation_id: "conversation-123",
          metadata: { usage: { total_tokens: 12 } }
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    );

    const result = await sendDifyChatMessage({
      query: "Hola",
      conversationId: "conversation-123"
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.dify.ai/v1/chat-messages",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer dify-secret"
        }),
        body: JSON.stringify({
          query: "Hola",
          inputs: {},
          response_mode: "blocking",
          user: "local-user",
          conversation_id: "conversation-123"
        })
      })
    );
    expect(result).toEqual({
      answer: "Respuesta de Dify",
      conversation_id: "conversation-123",
      metadata: { usage: { total_tokens: 12 } }
    });
  });

  it("fails before calling Dify when required environment is missing", async () => {
    delete process.env.DIFY_API_KEY;

    await expect(sendDifyChatMessage({ query: "Hola" })).rejects.toThrow(
      "DIFY_API_KEY"
    );
    expect(fetch).not.toHaveBeenCalled();
  });
});
