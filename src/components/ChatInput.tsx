"use client";

import {
  FormEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";
import { Mic, Send, Square } from "lucide-react";

type SpeechRecognitionConstructor = new () => SpeechRecognition;

type SpeechRecognition = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
};

type SpeechRecognitionEvent = {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
};

type BrowserWithSpeech = Window & {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
};

type ChatInputProps = {
  onSubmit: (value: string) => Promise<void> | void;
  disabled?: boolean;
  placeholder?: string;
  enableVoice?: boolean;
  autoSubmitVoice?: boolean;
};

export function ChatInput({
  onSubmit,
  disabled,
  placeholder = "Escribe tu mensaje",
  enableVoice,
  autoSubmitVoice
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const shouldRestoreFocusRef = useRef(false);
  const disabledRef = useRef(disabled);
  const onSubmitRef = useRef(onSubmit);
  const voiceTranscriptRef = useRef("");
  const valueRef = useRef("");
  const [value, setValue] = useState("");
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [isListening, setIsListening] = useState(false);
  const canUseVoice = enableVoice && Boolean(recognition);

  useEffect(() => {
    disabledRef.current = disabled;
  }, [disabled]);

  useEffect(() => {
    onSubmitRef.current = onSubmit;
  }, [onSubmit]);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const submitMessage = useCallback((nextValue = valueRef.current) => {
    const trimmed = nextValue.trim();

    if (!trimmed || disabledRef.current) return;

    setValue("");
    valueRef.current = "";
    shouldRestoreFocusRef.current = true;
    const submitResult = onSubmitRef.current(trimmed);

    void Promise.resolve(submitResult).finally(() => {
      if (!disabledRef.current) {
        shouldRestoreFocusRef.current = false;
        requestAnimationFrame(() => {
          textareaRef.current?.focus();
        });
      }
    });
    requestAnimationFrame(() => {
      textareaRef.current?.focus();
    });
  }, []);

  useEffect(() => {
    if (!enableVoice || typeof window === "undefined") return;

    const browser = window as BrowserWithSpeech;
    const Recognition = browser.SpeechRecognition || browser.webkitSpeechRecognition;

    if (!Recognition) return;

    const instance = new Recognition();
    instance.lang = "es-ES";
    instance.continuous = false;
    instance.interimResults = false;
    instance.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript;
      if (!transcript) return;

      voiceTranscriptRef.current = transcript;
      setValue(transcript);
    };
    instance.onend = () => {
      setIsListening(false);

      if (autoSubmitVoice) {
        submitMessage(voiceTranscriptRef.current);
      }

      voiceTranscriptRef.current = "";
    };
    instance.onerror = () => {
      setIsListening(false);
      voiceTranscriptRef.current = "";
    };
    setRecognition(instance);

    return () => instance.stop();
  }, [autoSubmitVoice, enableVoice, submitMessage]);

  useEffect(() => {
    if (disabled || !shouldRestoreFocusRef.current) return;

    shouldRestoreFocusRef.current = false;
    requestAnimationFrame(() => {
      textareaRef.current?.focus();
    });
  }, [disabled]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submitMessage();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== "Enter" || event.shiftKey || event.nativeEvent.isComposing) {
      return;
    }

    event.preventDefault();
    submitMessage();
  }

  function toggleVoice() {
    if (!recognition || disabled) return;

    if (isListening) {
      recognition.stop();
      setIsListening(false);
      return;
    }

    recognition.start();
    setIsListening(true);
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2 rounded-lg border border-slate-200 bg-white p-2">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={1}
        disabled={disabled}
        className="h-11 max-h-11 min-h-11 flex-1 resize-none overflow-y-auto rounded-md border-0 bg-transparent px-3 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
      />
      {enableVoice ? (
        <button
          type="button"
          onClick={toggleVoice}
          disabled={!canUseVoice || disabled}
          title={canUseVoice ? "Dictar mensaje" : "Dictado no disponible"}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-45"
        >
          {isListening ? <Square aria-hidden className="h-4 w-4" /> : <Mic aria-hidden className="h-4 w-4" />}
        </button>
      ) : null}
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        title="Enviar"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-brand-600 text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        <Send aria-hidden className="h-4 w-4" />
      </button>
    </form>
  );
}
