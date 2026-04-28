"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Uploader from "@/components/Uploader";
import StylePicker from "@/components/StylePicker";
import PromptInput from "@/components/PromptInput";
import GenerateButton from "@/components/GenerateButton";
import ForgeProgress from "@/components/ForgeProgress";
import ResultView from "@/components/ResultView";
import { findStyle, STYLES } from "@/lib/styles";

type Phase = "compose" | "generating" | "result";
type GenPhase = "refining" | "generating" | null;

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [style, setStyle] = useState<string>(STYLES[2].id); // pixar default
  const [prompt, setPrompt] = useState<string>("");
  const [phase, setPhase] = useState<Phase>("compose");
  const [error, setError] = useState<string | null>(null);
  const [genPhase, setGenPhase] = useState<GenPhase>(null);
  const [result, setResult] = useState<{
    image: string;
    refinedPrompt: string;
    styleId: string;
  } | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const styleDef = useMemo(() => findStyle(style), [style]);

  const generate = async () => {
    if (!image) {
      setError("Upload a photo first.");
      return;
    }
    setError(null);
    setPhase("generating");
    setGenPhase("refining");

    const controller = new AbortController();
    abortRef.current?.abort();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image, prompt, style }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody?.error || `Request failed (${res.status}).`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let finished = false;

      while (!finished) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let nl = buffer.indexOf("\n");
        while (nl >= 0) {
          const line = buffer.slice(0, nl).trim();
          buffer = buffer.slice(nl + 1);
          if (line.length) {
            const evt = parseEvent(line);
            if (evt?.type === "phase") {
              setGenPhase(evt.phase as GenPhase);
            } else if (evt?.type === "done") {
              setResult({
                image: evt.image as string,
                refinedPrompt: (evt.refinedPrompt as string) || "",
                styleId: style,
              });
              setPhase("result");
              finished = true;
              break;
            } else if (evt?.type === "error") {
              throw new Error((evt.error as string) || "Generation failed.");
            }
          }
          nl = buffer.indexOf("\n");
        }
      }

      if (!finished) {
        throw new Error("Connection ended before the image arrived.");
      }
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      const e = err as Error;
      setError(e.message || "Something went wrong.");
      setPhase("compose");
    } finally {
      setGenPhase(null);
    }
  };

  const reset = () => {
    abortRef.current?.abort();
    setResult(null);
    setError(null);
    setPhase("compose");
    setGenPhase(null);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="relative min-h-[100dvh] overflow-hidden">
      <div className="aurora-bg pointer-events-none fixed inset-0 z-0" />
      <div className="grain" />

      <main className="relative z-10 mx-auto w-full max-w-md px-5 pt-6 pb-24 sm:max-w-lg sm:px-6 sm:pt-10">
        <header className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo />
            <span className="font-display text-[20px] italic leading-none text-bone-50">
              CharacterForge
            </span>
          </div>
          <span className="rounded-full border border-white/10 bg-ink-800/60 px-2 py-1 text-[10px] uppercase tracking-[0.3em] text-bone-400">
            beta
          </span>
        </header>

        {phase === "compose" && (
          <>
            <div className="mb-7 animate-fade-in">
              <h1 className="font-display text-[40px] leading-[0.98] text-bone-50 sm:text-[52px]">
                <span className="italic">Your photo,</span>
                <br />
                reforged.
              </h1>
              <p className="mt-3 max-w-sm text-[14px] leading-relaxed text-bone-300">
                Upload a photo. Pick a style. Get a one-of-a-kind character —
                your face, transformed.
              </p>
            </div>

            <div className="space-y-5">
              <Uploader
                value={image}
                onChange={(v) => {
                  setImage(v);
                  setError(null);
                }}
                onError={setError}
              />

              {image ? (
                <>
                  <StylePicker value={style} onChange={setStyle} />
                  <PromptInput value={prompt} onChange={setPrompt} />
                  <GenerateButton
                    onClick={generate}
                    loading={false}
                    disabled={!image}
                  />
                  <p className="text-center text-[11px] text-bone-500">
                    {styleDef ? `${styleDef.label} · ` : ""}
                    takes ~60 seconds · no sign-up
                  </p>
                </>
              ) : (
                <div className="rounded-2xl border border-white/5 bg-ink-800/30 px-5 py-4 text-[13px] leading-relaxed text-bone-400">
                  <span className="text-bone-200">Tip:</span> a clear, well-lit
                  photo of one person works best. Phone selfies are perfect.
                </div>
              )}

              {error ? (
                <div
                  role="alert"
                  className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-[13px] text-red-200"
                >
                  {error}
                </div>
              ) : null}
            </div>
          </>
        )}

        {phase === "generating" && (
          <ForgeProgress
            phase={genPhase}
            sourceImage={image}
            styleLabel={styleDef?.label || "Forging"}
            onCancel={() => {
              abortRef.current?.abort();
              setPhase("compose");
              setGenPhase(null);
            }}
          />
        )}

        {phase === "result" && result ? (
          <ResultView
            image={result.image}
            refinedPrompt={result.refinedPrompt}
            styleLabel={findStyle(result.styleId)?.label || "Forged"}
            onReset={reset}
          />
        ) : null}

        <footer className="mt-16 flex items-center justify-between text-[11px] text-bone-500">
          <span>CharacterForge · 2026</span>
          <span className="tracking-[0.2em] uppercase">no accounts</span>
        </footer>
      </main>
    </div>
  );
}

function parseEvent(line: string): Record<string, unknown> | null {
  try {
    return JSON.parse(line) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function Logo() {
  return (
    <div className="relative flex h-7 w-7 items-center justify-center">
      <div className="absolute inset-0 animate-spark rounded-full bg-forge/30 blur-md" />
      <svg
        className="relative"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M12 2.5c2.5 4 5 5.5 5 9.5a5 5 0 1 1-10 0c0-2 1-3.5 1-5 0 1.5 1 2.5 2 2.5 0-2 1-4 2-7Z"
          fill="#ff6b1a"
        />
        <path
          d="M12 2.5c2.5 4 5 5.5 5 9.5a5 5 0 1 1-10 0c0-2 1-3.5 1-5 0 1.5 1 2.5 2 2.5 0-2 1-4 2-7Z"
          stroke="#ffae5c"
          strokeWidth="0.6"
        />
      </svg>
    </div>
  );
}
