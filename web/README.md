# Darkroom — one-tap photographer styles

A working starter app: upload a photo, pick a style, get it back transformed.
Built with Next.js (React) so the same code can power your web app, and the
API route can later be reused by a mobile app (React Native / Flutter) too.

## What's already built
- Upload UI with drag-and-drop (`app/page.tsx`)
- 68 styles across 13 categories (`lib/styles.ts`) — Portrait, Landscape,
  Street, Wedding, Fashion, Film & Vintage, Cinematic, Black & White,
  Experimental, Nature & Wildlife, Architecture, Night & Urban, Lifestyle.
  18 of these use real reference photos (in `public/reference-photos`);
  the rest use placeholder images clearly marked in the code.
- A backend API route (`app/api/generate/route.ts`) that sends your photo +
  the chosen style's prompt to Replicate's Flux Kontext Pro model and
  returns the edited result
- Custom "darkroom" visual design (dark charcoal, copper accent, film-strip frame)

## What you need to do to run it

### 1. Install dependencies
```
npm install
```

### 2. Get a Replicate account + API token
Replicate is the AI provider that actually does the photo editing.
- Sign up at https://replicate.com
- Create a token at https://replicate.com/account/api-tokens
- You pay per image generated (roughly $0.04-$0.08 each depending on
  resolution) — no monthly fee

### 3. Set your environment variables
```
cp .env.example .env.local
```
Fill in `REPLICATE_API_TOKEN` in `.env.local`. You don't need to pick or
configure a model -- the app defaults to Replicate's official
`black-forest-labs/flux-kontext-pro`, a text-instructed photo editing model.
(You can override it with `REPLICATE_MODEL_VERSION` later if you want to
try a different model.)

### 4. Run it
```
npm run dev
```
Open http://localhost:3000

Note: reference photos stored locally (`public/reference-photos`) only
resolve to a real URL once this app is deployed -- Replicate's servers can't
reach `localhost`. Locally, "Apply Look" only fully works for styles using
an external `https://` reference image or a picsum.photos placeholder,
until you deploy.

## How the AI editing works
Flux Kontext Pro takes your uploaded photo plus a text instruction and edits
the photo directly -- it doesn't need a separate "style reference" image the
way older style-transfer models did. Each style's `prompt` in `lib/styles.ts`
IS that instruction. The `referenceImage` on each style is only used to show
a thumbnail in the app's UI, not sent to the AI for image-based matching.

## Adding your own photographer styles
Open `lib/styles.ts`. Each style needs:
- `referenceImage`: a thumbnail shown in the picker -- can be a photo you
  upload to `public/reference-photos` (see the 18 existing examples) or any
  public image URL
- `prompt`: a specific text description of the look (lighting, color grade,
  film grain, mood) -- this is what the AI actually follows, so be precise

## Next steps (in order)
1. **Get this running locally** and confirm one style works end-to-end
   before relying on all 68.
2. **Deploy the web app** — push this to GitHub, then import it on
   https://vercel.com (free tier), or deploy directly with `npx vercel`.
   Add your `REPLICATE_API_TOKEN` in Vercel's environment variables.
3. **Add accounts + saved history** (optional) — Supabase or Firebase for
   users to save past edits.
4. **Wrap for mobile** — the `photo-style-mobile` Expo app calls this same
   `/api/generate` endpoint once it's deployed.

## Notes on cost and scale
Every "Apply Look" click = one paid API call to Replicate. Keep an eye on
usage while testing. Once you have real users, you'll want to add rate
limiting and possibly a credits system so costs don't run away.
