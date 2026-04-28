# CharacterForge

Upload a photo. Pick a style. Get a one-of-a-kind character.

Built with Next.js + TypeScript + Tailwind. Uses OpenRouter to call:

- **`deepseek/deepseek-chat`** — refines the user's note + chosen style into a vivid image-generation prompt (cheap, fast).
- **`google/gemini-2.5-flash-image`** — image-to-image character generator that preserves the subject's face from the uploaded photo.

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

- The model IDs `gpt-image-2` and `deepseek-v4-fast` mentioned in the spec don't currently exist. This build uses `google/gemini-2.5-flash-image` (purpose-built for *photo → stylized character* with identity preservation) and `deepseek/deepseek-chat` (cheap, fast prompt refinement).
- Cost: ~$0.04 per generation (Gemini image output) + a fraction of a cent for refinement.
- Photos are resized to 1024px on the longer edge before upload to keep round-trips fast.
- Errors from the upstream model (rate limits, content policy, network) are surfaced as friendly inline messages.

## License

MIT.
