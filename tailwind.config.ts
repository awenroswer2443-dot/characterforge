import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#08080b",
          900: "#0c0d11",
          800: "#14161c",
          700: "#1c1e26",
          600: "#272a35",
        },
        bone: {
          50: "#f5f4ef",
          100: "#ecebe4",
          200: "#d9d7cc",
          300: "#b8b6a9",
          400: "#8e8c80",
          500: "#6a685e",
        },
        forge: {
          DEFAULT: "#ff6b1a",
          50: "#fff3ec",
          100: "#ffe2cf",
          200: "#ffc296",
          300: "#ffa05d",
          400: "#ff8537",
          500: "#ff6b1a",
          600: "#e8520b",
          700: "#bd3f06",
        },
        ember: "#ffae5c",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
        display: ["var(--font-display)", "ui-serif", "Georgia", "serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out both",
        "rise": "rise 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",
        "spark": "spark 1.6s ease-in-out infinite",
        "shimmer": "shimmer 2.4s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        rise: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        spark: {
          "0%, 100%": { opacity: "0.55", transform: "scale(0.95)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
