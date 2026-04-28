"use client";

import { useEffect, useState } from "react";

interface Props {
  phase: "refining" | "generating" | null;
  sourceImage: string | null;
  styleLabel: string;
  onCancel: () => void;
}

const EXPECTED_SECONDS = 70;

export default function ForgeProgress({
  phase,
  sourceImage,
  styleLabel,
  onCancel,
}: Props) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const id = window.setInterval(() => {
      setElapsed((Date.now() - start) / 1000);
    }, 250);
    return () => window.clearInterval(id);
  }, []);

  // Capped at 0.97 so the bar never fakes-out at 100%.
  const progress = Math.min(0.97, elapsed / EXPECTED_SECONDS);
  const overtime = elapsed > EXPECTED_SECONDS;

  const headline =
    phase === "refining"
      ? "shaping the prompt"
      : elapsed < 12
        ? "studying the photo"
        : elapsed < 28
          ? "sculpting the form"
          : elapsed < 50
            ? "tempering details"
            : overtime
              ? "almost there"
              : "polishing";

  return (
    <div className="animate-rise space-y-6 pb-4 pt-2">
      <div className="hairline relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-ink-800/60">
        {sourceImage ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={sourceImage}
              alt="Source photo being forged"
              className="h-full w-full object-cover opacity-60"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/30 to-transparent" />
            <div className="pointer-events-none absolute inset-0 mix-blend-screen">
              <div
                className="absolute -inset-x-10 top-1/2 h-32 animate-shimmer opacity-70"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(255,107,26,0.55) 50%, transparent 100%)",
                  backgroundSize: "400px 100%",
                }}
              />
            </div>
          </>
        ) : null}

        <div className="absolute inset-x-5 bottom-5 space-y-3">
          <div className="flex items-baseline justify-between">
            <span className="rounded-full bg-ink-950/70 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-bone-200 backdrop-blur">
              forging · {styleLabel}
            </span>
            <span className="font-mono text-[11px] tabular-nums text-bone-300">
              {elapsed.toFixed(1)}s
            </span>
          </div>

          <div className="h-[3px] w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-forge to-ember transition-[width] duration-300 ease-linear"
              style={{ width: `${progress * 100}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[12px]">
            <span className="text-bone-100">{headline}</span>
            <span className="text-bone-400">
              {overtime ? "any second now" : `~${Math.max(1, Math.round(EXPECTED_SECONDS - elapsed))}s`}
            </span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onCancel}
        className="w-full rounded-2xl border border-white/10 bg-transparent px-5 py-3 text-sm text-bone-300 transition hover:bg-white/5"
      >
        Cancel
      </button>

      <p className="text-center text-[11px] text-bone-500">
        Connection stays open while the model works. Don&apos;t close this tab.
      </p>
    </div>
  );
}
