import { optionalEnv, requireEnv } from "./env";
import { parseJsonResponse } from "./http";
import type { LiveAvatarSessionToken } from "./types";

const LIVEAVATAR_API_URL = "https://api.liveavatar.com";
const SANDBOX_AVATAR_ID = "dd73ea75-1218-4ef3-92ce-606d5f7fbc0a";

type LiveAvatarTokenResponse = {
  data?: {
    session_id?: string;
    session_token?: string;
  };
};

export async function createLiveAvatarSessionToken(): Promise<LiveAvatarSessionToken> {
  const apiKey = requireEnv("HEYGEN_API_KEY");
  const configuredAvatarId = optionalEnv("HEYGEN_AVATAR_ID");
  const avatarId = configuredAvatarId || SANDBOX_AVATAR_ID;
  const voiceId = optionalEnv("HEYGEN_VOICE_ID");
  const contextId = optionalEnv("HEYGEN_CONTEXT_ID");
  const sandboxOverride = optionalEnv("HEYGEN_SANDBOX");
  const isSandbox = sandboxOverride ? sandboxOverride !== "false" : !configuredAvatarId;

  const response = await fetch(`${LIVEAVATAR_API_URL}/v1/sessions/token`, {
    method: "POST",
    headers: {
      "X-API-KEY": apiKey,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      mode: "FULL",
      is_sandbox: isSandbox,
      avatar_id: avatarId,
      avatar_persona: {
        ...(voiceId ? { voice_id: voiceId } : {}),
        ...(contextId ? { context_id: contextId } : {}),
        language: "es"
      }
    })
  });

  const payload = await parseJsonResponse<LiveAvatarTokenResponse>(
    response,
    "LiveAvatar"
  );
  const sessionId = payload.data?.session_id;
  const sessionToken = payload.data?.session_token;

  if (!sessionId || !sessionToken) {
    throw new Error("LiveAvatar returned an incomplete session token response.");
  }

  return { sessionId, sessionToken };
}

export async function stopLiveAvatarSession(sessionToken: string): Promise<void> {
  if (!sessionToken) {
    throw new Error("A LiveAvatar session token is required to stop the session.");
  }

  const response = await fetch(`${LIVEAVATAR_API_URL}/v1/sessions/stop`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${sessionToken}`
    }
  });

  await parseJsonResponse<unknown>(response, "LiveAvatar");
}
