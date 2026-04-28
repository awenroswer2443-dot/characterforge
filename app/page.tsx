"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Uploader from "@/components/Uploader";
import StylePicker from "@/components/StylePicker";
import PromptInput from "@/components/PromptInput";
import GenerateButton from "@/components/GenerateButton";
import ResultView from "@/components/ResultView";
import { findStyle, STYLES } from "@/lib/styles";

type Phase = "compose" | "generating" | "result";

const LOADING_PHASES = [
  "stoking the forge",
  "studying the photo",
  "shaping the form",
  "tempering details",
  "finishing",
];

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [style, setStyle] = useState<string>(STYLES[2].id); // pixar default
  const [prompt, setPrompt] = useState<string>("");
  const [phase, setPhase] = useState<Phase>("compose");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    image: string;
    refinedPrompt: string;
    styleId: string;
  } | null>(null);
  const [loadingPhase, setLoadingPhase] = useState(LOADING_PHASES[0]);
  const phaseTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (phaseTimer.current) window.clearInterval(phaseTimer.current);
    };
  }, []);

  const styleDef = useMemo(() => findStyle(style), [style]);

  const startLoadingPhases = () => {
    let i = 0;
    setLoadingPhase(LOADING_PHASES[0]);
    if (phaseTimer.current) window.clearInterval(phaseTimer.current);
    phaseTimer.current = window.setInterval(() => {
      i = Math.min(i + 1, LOADING_PHASES.length - 1);
      setLoadingPhase(LOADING_PHASES[i]);
    }, 2400);
  };

  const stopLoadingPhases = () => {
    if (phaseTimer.current) {
      window.clearInterval(phaseTimer.current);
      phaseTimer.current = null;
    }
  };

  const generate = async () => {
    if (!image) {
      setError("Upload a photo first.");
      return;
    }
    setError(null);
    setPhase("generating");
    startLoadingPhases();
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image, prompt, style }),
      });
      const json = (await res.json().catch(() => null)) as {
        image?: string;
        refinedPrompt?: string;
        error?: string;
      } | null;
      if (!res.ok || !json?.image) {
        throw new Error(json?.error || "Generation failed.");
      }
      setResult({
        image: json.image,
        refinedPrompt: json.refinedPrompt || "",
        styleId: style,
      });
      setPhase("result");
    } catch (err) {
      const e = err as Error;
      setError(e.message || "Something went wrong.");
      setPhase("compose");
    } finally {
      stopLoadingPhases();
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
    setPhase("compose");
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
          <span className="text-[10px] uppercase tracking-[0.3em] text-bone-400">
            beta
          </span>
        </header>

        {phase !== "result" && (
          <>
            <div className="mb-6 animate-fade-in">
              <h1 className="font-display text-[34px] leading-[1.05] text-bone-50 sm:text-[44px]">
                <span className="italic">Your photo,</span>
                <br />
                reforged.
              </h1>
              <p className="mt-3 text-[14px] text-bone-300">
                Upload a photo. Pick a style. Get a one-of-a-kind character in
                seconds.
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
                    loading={phase === "generating"}
                    disabled={!image}
                    loadingPhase={loadingPhase}
                  />
                  <p className="text-center text-[11px] text-bone-500">
                    {styleDef ? `Style: ${styleDef.label}` : ""} · ~10–20s · no
                    sign-up
                  </p>
                </>
              ) : (
                <div className="rounded-2xl border border-white/5 bg-ink-800/30 px-5 py-4 text-[13px] text-bone-400">
                  Tip: a clear, well-lit photo of one person works best.
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
