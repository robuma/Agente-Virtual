"use client";

import {
  forwardRef,
  useEffect,
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
  onStateChange?: (state: AvatarPanelState) => void;
};

type LiveAvatarSessionInstance = {
  start: () => Promise<void>;
  stop: () => Promise<void>;
  attach: (element: HTMLMediaElement) => void;
  repeat: (message: string) => void;
  on: (event: string, callback: (...args: unknown[]) => void) => void;
};

export const AvatarPanel = forwardRef<AvatarPanelHandle, AvatarPanelProps>(
  function AvatarPanel({ onError, onStateChange }, ref) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const sessionRef = useRef<LiveAvatarSessionInstance | null>(null);
    const sessionTokenRef = useRef<string | null>(null);
    const streamReadyRef = useRef(false);
    const videoReadyRef = useRef(false);
    const pendingSpeechRef = useRef<string[]>([]);
    const connectionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [state, setState] = useState<AvatarPanelState>("disconnected");

    const isAvatarReady = () =>
      Boolean(sessionRef.current && streamReadyRef.current && videoReadyRef.current);

    useEffect(() => {
      onStateChange?.(state);
    }, [onStateChange, state]);

    useImperativeHandle(ref, () => ({
      speak(text: string) {
        const session = sessionRef.current;

        if (!session) return;

        if (!isAvatarReady()) {
          pendingSpeechRef.current.push(text);
          return;
        }

        session.repeat(text);
      }
    }));

    function resetSessionState() {
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
        connectionTimeoutRef.current = null;
      }
      sessionRef.current = null;
      sessionTokenRef.current = null;
      streamReadyRef.current = false;
      videoReadyRef.current = false;
      pendingSpeechRef.current = [];
      setState("disconnected");
    }

    function speakPendingMessages() {
      const session = sessionRef.current;
      if (!session || !isAvatarReady()) return;

      for (const message of pendingSpeechRef.current) {
        session.repeat(message);
      }
      pendingSpeechRef.current = [];
    }

    function markVideoReady() {
      if (!sessionRef.current || !streamReadyRef.current) return;

      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
        connectionTimeoutRef.current = null;
      }
      videoReadyRef.current = true;
      setState("connected");
      speakPendingMessages();
    }

    function attachAvatarStream(session: LiveAvatarSessionInstance) {
      const video = videoRef.current;
      if (!video) return;

      session.attach(video);
      video.muted = true;
      video.volume = 1;

      if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        markVideoReady();
      }

      void video
        .play()
        .then(() => {
          video.muted = false;
        })
        .catch((error) => {
          console.warn("LiveAvatar media playback needs a browser gesture.", error);
          onError(
            "El navegador bloqueó la reproducción automática del avatar. Intenta iniciar la conversación nuevamente o usa Chrome/Safari con permisos de audio y video."
          );
        });
    }

    async function startSession() {
      try {
        setState("connecting");
        connectionTimeoutRef.current = setTimeout(() => {
          if (isAvatarReady()) return;

          void sessionRef.current?.stop().catch((error) => {
            console.warn("Could not stop stalled LiveAvatar session.", error);
          });
          resetSessionState();
          onError(
            "LiveAvatar creó la sesión, pero no recibimos el video del avatar. Revisa la conexión de red/WebRTC o prueba nuevamente con el modo sandbox."
          );
        }, 20000);
        const tokenResponse = await fetch("/api/heygen/session", { method: "POST" });
        const tokenPayload = await tokenResponse.json();

        if (!tokenResponse.ok) {
          throw new Error(tokenPayload.error || "No se pudo crear la sesión.");
        }

        const { LiveAvatarSession, SessionEvent } = await import(
          "@heygen/liveavatar-web-sdk"
        );
        const session = new LiveAvatarSession(tokenPayload.sessionToken, {
          voiceChat: false
        }) as LiveAvatarSessionInstance;

        sessionRef.current = session;
        sessionTokenRef.current = tokenPayload.sessionToken;
        session.on(SessionEvent.SESSION_STATE_CHANGED, (nextState) => {
          const nextPanelState = toAvatarPanelState(String(nextState));

          if (nextPanelState === "disconnected") {
            resetSessionState();
            return;
          }

          if (nextPanelState === "connecting" || !isAvatarReady()) {
            setState("connecting");
            return;
          }

          setState("connected");
        });
        session.on(SessionEvent.SESSION_STREAM_READY, () => {
          streamReadyRef.current = true;
          attachAvatarStream(session);
        });
        session.on(SessionEvent.SESSION_DISCONNECTED, (reason) => {
          resetSessionState();

          if (String(reason) === "CLIENT_INITIATED") return;

          onError(
            `LiveAvatar desconectó la sesión antes de cargar el avatar. Motivo: ${String(reason)}.`
          );
        });

        await session.start();
        attachAvatarStream(session);
      } catch (error) {
        console.error(error);
        resetSessionState();
        onError(getLiveAvatarErrorMessage(error));
      }
    }

    async function stopSession() {
      const currentSession = sessionRef.current;
      const currentToken = sessionTokenRef.current;

      try {
        resetSessionState();

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
      connected: "Conectado"
    }[state];
    const stateDotClass = {
      disconnected: "bg-red-500",
      connecting: "bg-amber-400",
      connected: "bg-emerald-500"
    }[state];

    return (
      <section className="flex min-h-[30rem] flex-col rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <MonitorPlay aria-hidden className="h-5 w-5 text-brand-700" />
            <span className="text-sm font-semibold text-slate-900">LiveAvatar</span>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            <span
              aria-hidden
              className={`h-2 w-2 rounded-full ${stateDotClass}`}
            />
            {stateLabel}
          </span>
        </div>
        <div className="relative flex min-h-[22rem] flex-1 items-center justify-center overflow-hidden rounded-lg bg-slate-950">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            onCanPlay={markVideoReady}
            onLoadedData={markVideoReady}
            onPlaying={markVideoReady}
            className="h-full w-full object-cover"
          />
          {state === "disconnected" ? (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 px-6 text-center text-sm leading-6 text-slate-300">
              Para iniciar una conversación, haz clic en Iniciar conversación.
            </div>
          ) : null}
          {state === "connecting" ? (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 text-center text-sm text-slate-300">
              Conectando video del avatar...
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
            Iniciar conversación
          </button>
          <button
            type="button"
            onClick={stopSession}
            disabled={state === "disconnected"}
            className="flex h-11 items-center justify-center gap-2 rounded-md border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-45"
          >
            <PhoneOff aria-hidden className="h-4 w-4" />
            Finalizar conversación
          </button>
        </div>
      </section>
    );
  }
);
