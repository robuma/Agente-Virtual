import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createLiveAvatarSessionToken, stopLiveAvatarSession } from "./heygen";

describe("LiveAvatar service", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
    process.env = {
      ...originalEnv,
      HEYGEN_API_KEY: "liveavatar-secret",
      HEYGEN_AVATAR_ID: "avatar-123",
      HEYGEN_VOICE_ID: "voice-123"
    };
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    process.env = originalEnv;
  });

  it("creates a FULL mode LiveAvatar session token without exposing the API key", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          data: {
            session_id: "session-123",
            session_token: "browser-safe-session-token"
          }
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    );

    const result = await createLiveAvatarSessionToken();

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.liveavatar.com/v1/sessions/token",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "X-API-KEY": "liveavatar-secret"
        }),
        body: expect.stringContaining('"mode":"FULL"')
      })
    );
    expect(result).toEqual({
      sessionId: "session-123",
      sessionToken: "browser-safe-session-token"
    });
  });

  it("does not enable sandbox mode when a production avatar id is configured", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          data: {
            session_id: "session-123",
            session_token: "browser-safe-session-token"
          }
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    );

    await createLiveAvatarSessionToken();

    const body = JSON.parse(fetchMock.mock.calls[0]?.[1]?.body as string);
    expect(body).toMatchObject({
      mode: "FULL",
      is_sandbox: false,
      avatar_id: "avatar-123"
    });
  });

  it("stops a session with the session token bearer auth", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({ data: {} }), { status: 200 }));

    await stopLiveAvatarSession("browser-safe-session-token");

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.liveavatar.com/v1/sessions/stop",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer browser-safe-session-token"
        })
      })
    );
  });
});
