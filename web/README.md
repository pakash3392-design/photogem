# Darkroom — one-tap photographer styles

Upload a photo, tap a style, get a real AI-edited photo back in seconds.
Built with Next.js (React), using Pollinations.ai's `kontext` model for
genuine AI photo editing -- real re-lighting, mood, and atmosphere, not
just a color filter.

## Why this setup
No billing, no paid plan, no credit card. This app tried two paid/quota-
limited AI providers before landing here (Replicate required billing after
a short free trial; Google's Gemini image models dropped their free tier
to zero in December 2025). Pollinations.ai's image editing is free, but
does need a free registered API key (their edit endpoint returns 401
without one) -- a two-minute signup, no card, at auth.pollinations.ai.

## What's already built
- Upload UI with drag-and-drop and automatic resizing (`app/page.tsx`)
- 78 styles across 13 categories (`lib/styles.ts`)
- A backend API route (`app/api/generate/route.ts`) that sends your photo
  directly to Pollinations for editing and returns the result
- Custom "darkroom" visual design (dark charcoal, copper accent)

## Running it

### 1. Install dependencies
```
npm install
```

### 2. Get a free Pollinations API key
- Go to https://auth.pollinations.ai
- Sign up (no credit card)
- Copy your API key

### 3. Set your environment variable
```
cp .env.example .env.local
```
Paste your key into `POLLINATIONS_API_KEY` in `.env.local`.

### 4. Run it
```
npm run dev
```
Open http://localhost:3000

## Deploying
Push to GitHub, import into Vercel, add `POLLINATIONS_API_KEY` in Vercel's
Environment Variables (Settings > Environments > Production), covering
Production.

## Limits to know about
Free registered accounts get higher limits than fully anonymous use, but
still aren't unlimited -- fine for one person using the app, may bottleneck
with many simultaneous users. If you outgrow this, Pollinations offers paid
tiers, or you can swap in a different provider in
`app/api/generate/route.ts`.

## Adding your own styles
Open `lib/styles.ts`. Each style needs a `referenceImage` (thumbnail for
the picker) and a `prompt` (the actual instruction the AI follows) — be
specific about lighting, color, mood, and technique.
