"use client";

import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState
} from "react";
import { MonitorPlay, PhoneOff, Play } from "lucide-react";
import { getLiveAvatarErrorMessage } from "@/lib/liveavatar-errors";
import { toAvatarPanelState, type AvatarPanelState } from "@/lib/liveavatar-state";

export type AvatarPanelHandle = {
  speak: (text: string) => void;
};

type AvatarPanelProps = {
  onError: (message: string) => void;
};

type LiveAvatarSessionInstance = {
  start: () => Promise<void>;
  stop: () => Promise<void>;
  attach: (element: HTMLMediaElement) => void;
  repeat: (message: string) => void;
  on: (event: string, callback: (...args: unknown[]) => void) => void;
};

export const AvatarPanel = forwardRef<AvatarPanelHandle, AvatarPanelProps>(
  function AvatarPanel({ onError }, ref) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const sessionRef = useRef<LiveAvatarSessionInstance | null>(null);
    const sessionTokenRef = useRef<string | null>(null);
    const [state, setState] = useState<AvatarPanelState>("disconnected");

    useImperativeHandle(ref, () => ({
      speak(text: string) {
        sessionRef.current?.repeat(text);
        setState("speaking");
      }
    }));

    function attachAvatarStream(session: LiveAvatarSessionInstance) {
      const video = videoRef.current;
      if (!video) return;

      session.attach(video);
      video.muted = false;
      video.volume = 1;
      void video.play().catch((error) => {
        console.warn("LiveAvatar media playback needs a browser gesture.", error);
      });
    }

    async function startSession() {
      try {
        setState("connecting");
        const tokenResponse = await fetch("/api/heygen/session", { method: "POST" });
        const tokenPayload = await tokenResponse.json();

        if (!tokenResponse.ok) {
          throw new Error(tokenPayload.error || "No se pudo crear la sesión.");
        }

        const { LiveAvatarSession, SessionEvent, AgentEventsEnum } = await import(
          "@heygen/liveavatar-web-sdk"
        );
        const session = new LiveAvatarSession(tokenPayload.sessionToken, {
          voiceChat: false
        }) as LiveAvatarSessionInstance;

        sessionRef.current = session;
        sessionTokenRef.current = tokenPayload.sessionToken;
        session.on(SessionEvent.SESSION_STATE_CHANGED, (nextState) => {
          setState(toAvatarPanelState(String(nextState)));
        });
        session.on(SessionEvent.SESSION_STREAM_READY, () => {
          attachAvatarStream(session);
          setState("connected");
        });
        session.on(AgentEventsEnum.AVATAR_SPEAK_STARTED, () => setState("speaking"));
        session.on(AgentEventsEnum.AVATAR_SPEAK_ENDED, () => setState("connected"));
        session.on(SessionEvent.SESSION_DISCONNECTED, () => setState("disconnected"));

        await session.start();
        attachAvatarStream(session);
        setState("connected");
      } catch (error) {
        console.error(error);
        setState("disconnected");
        onError(getLiveAvatarErrorMessage(error));
      }
    }

    async function stopSession() {
      const currentSession = sessionRef.current;
      const currentToken = sessionTokenRef.current;

      try {
        setState("disconnected");
        sessionRef.current = null;
        sessionTokenRef.current = null;

        if (currentSession) await currentSession.stop();
        else if (currentToken) {
          await fetch("/api/heygen/stop", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionToken: currentToken })
          });
        }
      } catch (error) {
        console.error(error);
        onError("No pudimos detener la sesión correctamente.");
      }
    }

    const stateLabel = {
      disconnected: "Desconectado",
      connecting: "Conectando",
      connected: "Conectado",
      speaking: "Hablando"
    }[state];

    return (
      <section className="flex min-h-[32rem] flex-col rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <MonitorPlay aria-hidden className="h-5 w-5 text-brand-700" />
            <span className="text-sm font-semibold text-slate-900">LiveAvatar</span>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            {stateLabel}
          </span>
        </div>
        <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-lg bg-slate-950">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="h-full min-h-[24rem] w-full object-cover"
          />
          {state === "disconnected" ? (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 text-center text-sm text-slate-300">
              El video aparecerá al iniciar sesión.
            </div>
          ) : null}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={startSession}
            disabled={state !== "disconnected"}
            className="flex h-11 items-center justify-center gap-2 rounded-md bg-brand-600 px-4 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            <Play aria-hidden className="h-4 w-4" />
            Iniciar
          </button>
          <button
            type="button"
            onClick={stopSession}
            disabled={state === "disconnected"}
            className="flex h-11 items-center justify-center gap-2 rounded-md border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-45"
          >
            <PhoneOff aria-hidden className="h-4 w-4" />
            Detener
          </button>
        </div>
      </section>
    );
  }
);
