"use client";

import { useRef, useState } from "react";
import { fileToResizedDataUrl } from "@/lib/image";

interface Props {
  value: string | null;
  onChange: (dataUrl: string | null) => void;
  onError: (msg: string) => void;
}

export default function Uploader({ value, onChange, onError }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [working, setWorking] = useState(false);

  const handleFile = async (file: File | undefined | null) => {
    if (!file) return;
    setWorking(true);
    try {
      const dataUrl = await fileToResizedDataUrl(file);
      onChange(dataUrl);
    } catch (err) {
      const e = err as Error;
      onError(e.message || "Could not load that image.");
    } finally {
      setWorking(false);
    }
  };

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFile(e.dataTransfer.files?.[0]);
        }}
        className={`hairline relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-3xl bg-ink-800/60 backdrop-blur transition ${
          dragOver ? "ring-2 ring-forge/60" : ""
        }`}
        aria-label={value ? "Replace photo" : "Upload a photo"}
      >
        {value ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Uploaded photo"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-x-3 bottom-3 flex items-center justify-between rounded-full bg-ink-950/70 px-4 py-2 text-xs uppercase tracking-[0.2em] text-bone-200 backdrop-blur">
              <span>Photo loaded</span>
              <span className="text-forge-400">tap to change</span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-3 px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-forge/10 text-forge-400">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 16V4m0 0L7 9m5-5l5 5M5 19h14"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="text-base font-medium text-bone-50">
              Upload a photo
            </div>
            <p className="text-sm text-bone-300">
              Tap to choose, or drop one in. A clear face works best.
            </p>
            {working ? (
              <div className="mt-1 text-[11px] uppercase tracking-[0.25em] text-bone-400">
                preparing…
              </div>
            ) : null}
          </div>
        )}
      </button>
    </div>
  );
}
