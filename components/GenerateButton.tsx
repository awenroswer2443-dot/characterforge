"use client";

interface Props {
  onClick: () => void;
  loading: boolean;
  disabled?: boolean;
  loadingPhase?: string;
}

export default function GenerateButton({
  onClick,
  loading,
  disabled,
  loadingPhase,
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-forge px-6 py-4 text-base font-semibold text-ink-950 transition enabled:hover:bg-forge-400 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? (
        <span className="flex items-center gap-3">
          <svg
            className="animate-spin"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              cx="12"
              cy="12"
              r="9"
              stroke="currentColor"
              strokeOpacity="0.25"
              strokeWidth="2.5"
            />
            <path
              d="M21 12a9 9 0 0 0-9-9"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
          <span className="text-sm font-medium uppercase tracking-[0.2em]">
            {loadingPhase || "forging"}
          </span>
        </span>
      ) : (
        <>
          <span>Forge character</span>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M3 9h12M11 5l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </>
      )}
      {loading ? (
        <span className="shimmer-bg pointer-events-none absolute inset-0 animate-shimmer opacity-60" />
      ) : null}
    </button>
  );
}
