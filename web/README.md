# Darkroom — one-tap photographer styles

Upload a photo, tap a style, get a real AI-edited photo back in seconds.
Built with Next.js (React), using Pollinations.ai's free `kontext` model for
genuine AI photo editing -- real re-lighting, mood, and atmosphere, not
just a color filter.

## Why this setup
No API key, no signup, no billing, no environment variables. This app tried
two paid/quota-limited AI providers before landing here (Replicate required
billing after a short free trial; Google's Gemini image models dropped
their free tier to zero in December 2025). Pollinations.ai's image editing
is free with no account required -- your photo is uploaded directly to
their edit endpoint, no third-party relay involved.

## What's already built
- Upload UI with drag-and-drop and automatic resizing (`app/page.tsx`)
- 78 styles across 13 categories (`lib/styles.ts`)
- A backend API route (`app/api/generate/route.ts`) that handles the
  temporary upload + AI edit + returns the result
- Custom "darkroom" visual design (dark charcoal, copper accent)

## Running it
```
npm install
npm run dev
```
Open http://localhost:3000. That's genuinely it -- no keys, no accounts.

## Deploying
Push to GitHub, import into Vercel. No environment variables needed.

## Limits to know about
Pollinations' anonymous tier allows about 1 request every 15 seconds --
fine for one person using the app, but it'll bottleneck with many
simultaneous users. If you outgrow this:
- Register a free Pollinations account (auth.pollinations.ai) for higher
  limits and no watermark
- Or swap in a paid provider (Replicate, Gemini with billing enabled) in
  `app/api/generate/route.ts` for guaranteed capacity and better privacy

## Adding your own styles
Open `lib/styles.ts`. Each style needs a `referenceImage` (thumbnail for
the picker) and a `prompt` (the actual instruction the AI follows) — be
specific about lighting, color, mood, and technique.

## Next steps if you outgrow the free tier
- Add real user accounts + private photo storage instead of the temporary
  public-URL step, if privacy matters for your users
- Add a paid AI provider as a fallback when Pollinations is rate-limited
