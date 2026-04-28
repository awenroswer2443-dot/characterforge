"use client";

import { useState } from "react";

interface Props {
  image: string;
  refinedPrompt: string;
  styleLabel: string;
  onReset: () => void;
}

export default function ResultView({
  image,
  refinedPrompt,
  styleLabel,
  onReset,
}: Props) {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  const download = () => {
    const a = document.createElement("a");
    a.href = image;
    a.download = `characterforge-${styleLabel.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(refinedPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* no-op */
    }
  };

  const share = async () => {
    if (typeof navigator === "undefined") return;
    try {
      const blob = await dataUrlToBlob(image);
      const file = new File([blob], "characterforge.png", { type: blob.type });
      const nav = navigator as Navigator & {
        canShare?: (data?: ShareData) => boolean;
      };
      if (nav.canShare?.({ files: [file] })) {
        await nav.share({
          files: [file],
          title: "CharacterForge",
          text: `Forged in ${styleLabel} on CharacterForge`,
        });
        setShared(true);
        setTimeout(() => setShared(false), 1400);
        return;
      }
      download();
    } catch {
      download();
    }
  };

  return (
    <div className="animate-rise space-y-5">
      <div className="hairline relative overflow-hidden rounded-3xl bg-ink-800/60">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt="Generated character"
          className="block h-auto w-full"
        />
        <div className="absolute left-3 top-3 rounded-full bg-ink-950/70 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-bone-200 backdrop-blur">
          {styleLabel}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={download}
          className="rounded-2xl bg-forge px-5 py-3 text-sm font-semibold text-ink-950 transition hover:bg-forge-400"
        >
          Download
        </button>
        <button
          type="button"
          onClick={share}
          className="hairline rounded-2xl bg-ink-800/60 px-5 py-3 text-sm font-semibold text-bone-50 transition hover:bg-ink-700/60"
        >
          {shared ? "shared" : "Share"}
        </button>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="w-full rounded-2xl border border-white/10 bg-transparent px-5 py-3 text-sm text-bone-200 transition hover:bg-white/5"
      >
        Forge another
      </button>

      <details className="hairline group rounded-2xl bg-ink-800/40 p-4 text-sm">
        <summary className="cursor-pointer list-none text-[11px] font-medium uppercase tracking-[0.3em] text-bone-400 transition group-open:text-bone-200">
          Prompt details
        </summary>
        <p className="mt-3 text-[13px] leading-relaxed text-bone-300">
          {refinedPrompt}
        </p>
        <button
          type="button"
          onClick={copyPrompt}
          className="mt-3 text-[11px] uppercase tracking-[0.25em] text-forge-400 transition hover:text-forge-300"
        >
          {copied ? "copied" : "copy prompt"}
        </button>
      </details>
    </div>
  );
}

async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  const res = await fetch(dataUrl);
  return res.blob();
}
