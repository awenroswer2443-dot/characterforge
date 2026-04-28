// OpenRouter constants used by the API route.
export const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

export const REFINE_MODEL = "deepseek/deepseek-v4-flash";
export const IMAGE_MODEL = "openai/gpt-5.4-image-2";

export const APP_TITLE = "CharacterForge";
export const APP_REFERER = "https://characterforge.app";

export function openRouterHeaders(apiKey: string): Record<string, string> {
  return {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    "HTTP-Referer": APP_REFERER,
    "X-Title": APP_TITLE,
  };
}
