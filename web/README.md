# Darkroom — one-tap photographer styles

Upload a photo, tap a style, get it back transformed instantly. Built with
Next.js (React). All 68 styles are applied entirely in the browser using
real color-grading code (Canvas API) -- no AI service, no API keys, no
per-image cost, and it works instantly.

## What's already built
- Upload UI with drag-and-drop (`app/page.tsx`)
- 68 styles across 13 categories (`lib/styles.ts`) — Portrait, Landscape,
  Street, Wedding, Fashion, Film & Vintage, Cinematic, Black & White,
  Experimental, Nature & Wildlife, Architecture, Night & Urban, Lifestyle.
  18 of these use real reference photos (in `public/reference-photos`);
  the rest use placeholder thumbnail images clearly marked in the code.
- A real photo-filter engine (`lib/applyFilter.ts`) that applies each
  style's color grade, contrast, warmth/tint, grain, and vignette directly
  to the pixels of your photo using the Canvas API
- Custom "darkroom" visual design (dark charcoal, copper accent)

## Running it

```
npm install
npm run dev
```

Open http://localhost:3000. That's it — no environment variables, no API
keys, no third-party account needed. Everything runs client-side.

## How the styling actually works
Each style in `lib/styles.ts` has a `filter` field:

```ts
filter: { grayscale: false, warmth: 24, tint: 4, saturation: 1.1, contrast: 1.15, grain: 0.08, vignette: 0.12 }
```

`lib/applyFilter.ts` reads these numbers and applies them directly to your
photo's pixels: contrast and brightness math, a saturation blend against
luminance, a warmth/tint channel shift, an optional grayscale pass, a radial
vignette, and a film-grain overlay. This is the same category of technique
real photo-filter apps use — deterministic, fast, and free to run as much as
you want.

## Adding or tuning your own styles
Open `lib/styles.ts`. Each style needs a `referenceImage` (thumbnail shown
in the picker) and a `filter` recipe. Tweak the numbers directly, or use
these ranges as a guide:
- `warmth`: -100 (cooler/blue) to 100 (warmer/orange)
- `tint`: -100 (green) to 100 (magenta)
- `saturation`: 0 (grayscale) to ~1.5 (vivid); 1 = untouched
- `contrast`: ~0.75 (flat) to ~1.45 (punchy); 1 = untouched
- `grain`: 0 (clean) to ~0.3 (heavy film grain)
- `vignette`: 0 (none) to ~0.3 (strong edge darkening)

## Deploying
Push to GitHub, import into Vercel (vercel.com) — no environment variables
needed. It's a static-friendly app with no backend calls required for the
core feature.

## Next steps
- Swap the 50 placeholder-image styles for real reference photos as you
  shoot or source them
- If you later want true AI-level transformations (e.g. actually repainting
  a background, not just color grading), that's a separate, paid feature
  you can add back via a service like Replicate -- but the current filter
  engine covers the vast majority of "photographer style" requests for free
