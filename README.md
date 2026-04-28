# CharacterForge

Upload a photo. Pick a style. Get a one-of-a-kind character.

Built with Next.js + TypeScript + Tailwind. Uses OpenRouter to call:

- **`deepseek/deepseek-v4-flash`** — refines the user's note + chosen style into a vivid image-generation prompt (cheap, fast).
- **`openai/gpt-5.4-image-2`** — image-to-image character generator that preserves the subject's face from the uploaded photo.

## Styles

Roblox · Fortnite · Pixar 3D · Anime · Superhero · GTA · Minecraft · Cyberpunk · Fantasy RPG.

## Run locally

```bash
# 1. Install
npm install

# 2. Set the API key
cp .env.example .env.local
# Then edit .env.local and paste your OpenRouter key:
#   OPENROUTER_API_KEY=sk-or-v1-...

# 3. Dev
npm run dev
# → http://localhost:3000

# 4. Production build
npm run build
npm start
```

Get an OpenRouter key at <https://openrouter.ai/keys>. The free tier won't cover image generation — you need a small credit balance (~$1 covers ~25 generations).

## Environment variables

| Var                   | Purpose                              |
| --------------------- | ------------------------------------ |
| `OPENROUTER_API_KEY`  | Your OpenRouter API key (server-only). Never exposed to the client. |

## Deploy on Vercel

1. Push this repo to GitHub.
2. Go to <https://vercel.com/new> and import the repo.
3. In project settings → **Environment Variables**, add:

   ```
   OPENROUTER_API_KEY = sk-or-v1-...
   ```

4. Deploy. Done.

The `/api/generate` route uses Node runtime with `maxDuration = 60` so it fits within Vercel Hobby limits.

## How it works

```
client                                 server (/api/generate)
  │                                            │
  ├── resize photo to 1024px max  ─────────────│
  │   send {image, prompt, style}              │
  │                                            ├── refine prompt (DeepSeek)
  │                                            ├── call Gemini 2.5 Flash Image
  │                                            │   with refined prompt + photo
  │                                            └── extract image from response
  │     ◄── {image, refinedPrompt} ────────────│
  └── render result, download, share
```

The API key never touches the browser. All OpenRouter calls happen server-side.

## File map

```
app/
  api/generate/route.ts    # OpenRouter proxy
  layout.tsx               # Fonts, metadata, theme
  page.tsx                 # State machine + UI shell
  globals.css              # Tailwind + small utilities
components/
  Uploader.tsx             # Tap / drag-drop, client-side resize
  StylePicker.tsx          # 3-col grid of styles
  PromptInput.tsx          # Optional note
  GenerateButton.tsx       # CTA + loading state
  ResultView.tsx           # Image + download + share + prompt details
lib/
  styles.ts                # Style definitions
  image.ts                 # File → resized data URL
  openrouter.ts            # Endpoint + headers
```

## Notes

- Verified live against the OpenRouter `/models` endpoint: `openai/gpt-5.4-image-2` advertises `input_modalities: [image, text, file]` and `output_modalities: [image, text]` — exactly what an image-to-image character app needs. `deepseek/deepseek-v4-flash` is text-in/text-out, used for prompt refinement only.
- Cost ballpark: image output dominates — roughly a few cents per generation. Refinement is fractions of a cent ($0.14/1M input tokens for DeepSeek V4 Flash).
- Photos are resized client-side to 1024px on the longer edge before upload (faster round-trips, lower model input cost).
- Errors from upstream (rate limits, content policy, network) surface as friendly inline messages.

## License

MIT.
