"use client";

import { STYLES } from "@/lib/styles";

interface Props {
  value: string;
  onChange: (id: string) => void;
}

const SWATCHES: Record<string, string> = {
  roblox:
    "radial-gradient(circle at 30% 30%, #4ea8ff 0%, #1e3aa8 60%, #0a1438 100%)",
  fortnite:
    "radial-gradient(circle at 70% 30%, #ffd166 0%, #ef476f 50%, #06d6a0 100%)",
  pixar:
    "radial-gradient(circle at 50% 30%, #ffd6a5 0%, #ff8a5c 50%, #6a4a8a 100%)",
  anime:
    "radial-gradient(circle at 30% 30%, #ffb6e6 0%, #ff66c4 45%, #5a3aff 100%)",
  superhero:
    "linear-gradient(135deg, #ff2a2a 0%, #c01515 45%, #1f3aab 100%)",
  gta:
    "linear-gradient(135deg, #ff6b1a 0%, #c0420f 50%, #1a1a1a 100%)",
  minecraft:
    "linear-gradient(135deg, #6cbf3f 0%, #3a7a1f 50%, #6b4426 100%)",
  cyberpunk:
    "linear-gradient(135deg, #ff00d4 0%, #00f0ff 60%, #1a0030 100%)",
  fantasy:
    "radial-gradient(circle at 30% 70%, #ffd86b 0%, #b87a30 45%, #1a3a25 100%)",
};

export default function StylePicker({ value, onChange }: Props) {
  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between">
        <h3 className="text-[11px] font-medium uppercase tracking-[0.3em] text-bone-300">
          Style
        </h3>
        <span className="text-[11px] text-bone-500">tap to choose</span>
      </div>
      <div className="grid grid-cols-3 gap-2.5">
        {STYLES.map((s) => {
          const selected = value === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onChange(s.id)}
              className={`relative overflow-hidden rounded-2xl text-left transition ${
                selected
                  ? "ring-2 ring-forge ring-offset-2 ring-offset-ink-950"
                  : "ring-1 ring-white/5 hover:ring-white/15"
              }`}
              aria-pressed={selected}
            >
              <div
                className="aspect-square w-full"
                style={{ background: SWATCHES[s.id] || "#1c1e26" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/30 to-transparent" />
              <div className="absolute inset-x-2 bottom-2 flex items-center justify-between">
                <div className="text-[12px] font-medium leading-tight text-bone-50">
                  {s.label}
                </div>
                {selected ? (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-forge text-[9px] text-ink-950">
                    <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M2.5 6.5l2.5 2.5 4.5-5"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                ) : null}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
