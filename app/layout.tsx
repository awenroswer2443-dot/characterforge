import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";

const sans = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const display = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CharacterForge — your photo, reforged",
  description:
    "Upload a photo, pick a style, get a one-of-a-kind character. Roblox, Pixar, Anime, GTA, Cyberpunk and more.",
  openGraph: {
    title: "CharacterForge",
    description: "Upload a photo, pick a style, get a one-of-a-kind character.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CharacterForge",
    description: "Upload a photo, pick a style, get a one-of-a-kind character.",
  },
};

export const viewport: Viewport = {
  themeColor: "#08080b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
      <body className="bg-ink-950 text-bone-50 antialiased selection:bg-forge selection:text-ink-950">
        {children}
      </body>
    </html>
  );
}
