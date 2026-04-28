import { NextRequest, NextResponse } from "next/server";
import { findStyle } from "@/lib/styles";
import {
  IMAGE_MODEL,
  OPENROUTER_URL,
  REFINE_MODEL,
  openRouterHeaders,
} from "@/lib/openrouter";

export const runtime = "nodejs";
export const maxDuration = 60;
export const dynamic = "force-dynamic";

type Body = {
  image?: string;
  prompt?: string;
  style?: string;
};

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Server is missing OPENROUTER_API_KEY." },
      { status: 500 }
    );
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { image, prompt = "", style = "" } = body;

  if (!image || typeof image !== "string" || !image.startsWith("data:image/")) {
    return NextResponse.json(
      { error: "Please upload a valid image." },
      { status: 400 }
    );
  }
  if (image.length > 9_000_000) {
    return NextResponse.json(
      { error: "Image is too large. Try a smaller photo." },
      { status: 413 }
    );
  }

  const styleDef = findStyle(style);
  if (!styleDef) {
    return NextResponse.json({ error: "Unknown style." }, { status: 400 });
  }

  const userNote = prompt.toString().slice(0, 500).trim();
  const headers = openRouterHeaders(apiKey);

  const refined = await refinePrompt({
    headers,
    styleSeed: styleDef.seed,
    styleLabel: styleDef.label,
    userNote,
  });

  try {
    const result = await generateImage({ headers, image, refinedPrompt: refined });
    return NextResponse.json({ image: result, refinedPrompt: refined });
  } catch (err) {
    const e = err as Error & { status?: number };
    const status = e.status ?? 502;
    return NextResponse.json(
      { error: e.message || "Image generation failed." },
      { status }
    );
  }
}

async function refinePrompt({
  headers,
  styleSeed,
  styleLabel,
  userNote,
}: {
  headers: Record<string, string>;
  styleSeed: string;
  styleLabel: string;
  userNote: string;
}): Promise<string> {
  const fallback = `${styleSeed} The subject is the person from the uploaded photo. Preserve their face, hair, and identity. ${userNote}`.trim();

  try {
    const res = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: REFINE_MODEL,
        messages: [
          {
            role: "system",
            content:
              "You write concise, vivid prompts for an image-to-image character generator. The user uploads a real photo of a person and wants it transformed into a stylized character. Output ONLY the final prompt as 2-3 sentences. No preamble. No quotes. Always include an explicit instruction to preserve the subject's face, hair color, skin tone, and identifying features. Always lead with the chosen style. Never describe the photo itself — describe the desired output.",
          },
          {
            role: "user",
            content: `Style: ${styleLabel}\nStyle direction: ${styleSeed}\nUser note (optional): ${userNote || "(none)"}\n\nWrite the refined image prompt.`,
          },
        ],
        max_tokens: 220,
        temperature: 0.7,
      }),
    });

    if (!res.ok) return fallback;
    const json = await res.json();
    const content = json?.choices?.[0]?.message?.content;
    if (typeof content === "string" && content.trim().length > 10) {
      return content.trim();
    }
    return fallback;
  } catch {
    return fallback;
  }
}

async function generateImage({
  headers,
  image,
  refinedPrompt,
}: {
  headers: Record<string, string>;
  image: string;
  refinedPrompt: string;
}): Promise<string> {
  const res = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model: IMAGE_MODEL,
      modalities: ["image", "text"],
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: refinedPrompt },
            { type: "image_url", image_url: { url: image } },
          ],
        },
      ],
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    const err = new Error(humanizeUpstreamError(res.status, text)) as Error & {
      status?: number;
    };
    err.status = res.status >= 500 ? 502 : res.status;
    throw err;
  }

  const json = await res.json();
  const dataUrl = extractImageDataUrl(json);
  if (!dataUrl) {
    const err = new Error(
      "The model didn't return an image. Try a different photo or style."
    ) as Error & { status?: number };
    err.status = 502;
    throw err;
  }
  return dataUrl;
}

function extractImageDataUrl(json: unknown): string | null {
  const j = json as {
    choices?: Array<{
      message?: {
        content?: unknown;
        images?: Array<{
          type?: string;
          image_url?: { url?: string };
          url?: string;
        }>;
      };
    }>;
  };
  const msg = j?.choices?.[0]?.message;
  if (!msg) return null;

  if (Array.isArray(msg.images)) {
    for (const item of msg.images) {
      const url = item?.image_url?.url || item?.url;
      if (typeof url === "string" && url.startsWith("data:image/")) return url;
    }
  }

  if (typeof msg.content === "string" && msg.content.startsWith("data:image/")) {
    return msg.content;
  }

  if (Array.isArray(msg.content)) {
    for (const part of msg.content as Array<{
      type?: string;
      image_url?: { url?: string };
    }>) {
      const url = part?.image_url?.url;
      if (typeof url === "string" && url.startsWith("data:image/")) return url;
    }
  }

  return null;
}

function humanizeUpstreamError(status: number, text: string): string {
  const lower = text.toLowerCase();
  if (status === 401) return "API key was rejected. Check OPENROUTER_API_KEY.";
  if (status === 402) return "Out of credit on the OpenRouter account.";
  if (status === 429) return "Rate limited — try again in a few seconds.";
  if (
    status === 400 &&
    (lower.includes("safety") ||
      lower.includes("policy") ||
      lower.includes("blocked"))
  ) {
    return "That image or prompt was blocked by the model's safety filter. Try a different photo or style.";
  }
  if (status >= 500) return "The image model is having a moment. Try again.";
  return `Image generation failed (${status}).`;
}
