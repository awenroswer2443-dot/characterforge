"use client";

import { STYLES } from "@/lib/styles";

interface Props {
  value: string;
  onChange: (id: string) => void;
}

export default function StylePicker({ value, onChange }: Props) {
  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between">
        <h3 className="text-[11px] font-medium uppercase tracking-[0.3em] text-bone-300">
          Style
        </h3>
        <span className="text-[11px] text-bone-500">{STYLES.length} options</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {STYLES.map((s) => {
          const selected = value === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onChange(s.id)}
              className={`hairline relative flex aspect-square flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-center transition ${
                selected
                  ? "bg-forge/15 ring-2 ring-forge/60"
                  : "bg-ink-800/60 hover:bg-ink-700/60"
              }`}
              aria-pressed={selected}
            >
              <div className="text-2xl leading-none" aria-hidden>
                {s.emoji}
              </div>
              <div className="text-[12px] font-medium text-bone-50">
                {s.label}
              </div>
              <div className="text-[10px] text-bone-400">{s.blurb}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
