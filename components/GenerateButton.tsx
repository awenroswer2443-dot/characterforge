"use client";

interface Props {
  onClick: () => void;
  loading: boolean;
  disabled?: boolean;
}

export default function GenerateButton({ onClick, loading, disabled }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-forge px-6 py-4 text-base font-semibold text-ink-950 shadow-[0_0_30px_rgba(255,107,26,0.25)] transition enabled:hover:bg-forge-400 enabled:hover:shadow-[0_0_40px_rgba(255,107,26,0.35)] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 2.5c2.5 4 5 5.5 5 9.5a5 5 0 1 1-10 0c0-2 1-3.5 1-5 0 1.5 1 2.5 2 2.5 0-2 1-4 2-7Z"
          fill="currentColor"
        />
      </svg>
      <span>Forge character</span>
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
        <path
          d="M3 9h12M11 5l4 4-4 4"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
