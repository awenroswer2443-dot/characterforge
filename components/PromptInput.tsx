"use client";

interface Props {
  value: string;
  onChange: (s: string) => void;
}

export default function PromptInput({ value, onChange }: Props) {
  return (
    <div>
      <label
        htmlFor="prompt"
        className="mb-2 block text-[11px] font-medium uppercase tracking-[0.3em] text-bone-300"
      >
        Note <span className="text-bone-500">— optional</span>
      </label>
      <input
        id="prompt"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={200}
        placeholder="e.g. wielding a glowing sword, dramatic lighting"
        className="hairline w-full rounded-2xl bg-ink-800/60 px-4 py-3 text-[15px] text-bone-50 placeholder:text-bone-500 outline-none transition focus:bg-ink-700/60"
      />
    </div>
  );
}
