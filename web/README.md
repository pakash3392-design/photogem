# Darkroom — one-tap photographer styles

Upload a photo, tap a style, get a real AI-edited photo back in seconds.
Built with Next.js (React), using Google's Gemini 2.5 Flash Image model for
genuine AI photo editing -- actual re-lighting, mood, and atmosphere, not
just a color filter.

## Why Gemini
Gemini 2.5 Flash Image has a real free tier as of mid-2026: hundreds of
image edits per day, no credit card required. (An earlier version of this
app used Replicate's Flux Kontext Pro, which required paid billing after a
short free trial -- Gemini avoids that.)

## What's already built
- Upload UI with drag-and-drop and automatic resizing (`app/page.tsx`)
- 78 styles across 13 categories (`lib/styles.ts`)
- A backend API route (`app/api/generate/route.ts`) that sends your photo +
  the chosen style's prompt to Gemini and returns the edited result
- Custom "darkroom" visual design (dark charcoal, copper accent)

## Running it

### 1. Install dependencies
```
npm install
```

### 2. Get a free Gemini API key
- Go to https://aistudio.google.com/apikey
- Sign in with a Google account, click "Create API key" — no credit card
- Copy the key

### 3. Set your environment variable
```
cp .env.example .env.local
```
Paste your key into `GEMINI_API_KEY` in `.env.local`.

### 4. Run it
```
npm run dev
```
Open http://localhost:3000

## Deploying
Push to GitHub, import into Vercel, add `GEMINI_API_KEY` in Vercel's
Environment Variables (Settings > Environment Variables), covering
Production.

## How the AI editing works
Gemini 2.5 Flash Image takes your photo plus a text instruction and returns
a genuinely edited image (`app/api/generate/route.ts`). Each style's
`prompt` in `lib/styles.ts` describes the treatment; the route wraps it
with instructions to act as an expert retoucher and to keep the subject and
composition recognizable, so it reads as a professional edit of your photo
rather than a different photo entirely.

## Adding your own styles
Open `lib/styles.ts`. Each style needs a `referenceImage` (thumbnail for
the picker) and a `prompt` (the actual instruction Gemini follows) — be
specific about lighting, color, mood, and technique.

## Cost and limits
This app is free to run within Gemini's free tier. If you exceed the daily
free limit, requests will start failing until it resets — check current
limits at https://ai.google.dev/gemini-api/docs/pricing. If you outgrow the
free tier, Gemini's paid pricing is inexpensive per image, or you can swap
in another model in `app/api/generate/route.ts`.
