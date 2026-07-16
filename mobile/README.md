# Darkroom — mobile app (iOS + Android)

Built with Expo (React Native) — one codebase, both platforms. All 68 styles
are applied instantly, entirely on your phone, using real color-grading
code -- no backend, no AI service, no API keys, no per-photo cost.

## Setup
```
npm install
```

Install the free **Expo Go** app on your phone (App Store / Play Store).

```
npm start
```
Scan the QR code with your phone (Camera app on iPhone, Expo Go's scanner
on Android). Your phone and computer need to be on the same WiFi.

## What's already built
- `components/CameraScreen.tsx` — live camera with a real-time color-tint
  preview per style, plus a shutter button and a style filmstrip
- `components/ReviewScreen.tsx` — after capture (or picking from your
  library), instantly applies the selected style's real color-grading
  filter -- tap any style and it updates immediately, no waiting
- `components/FilteredImage.tsx` — renders the live filtered preview using
  `react-native-svg`'s built-in color-matrix filter support
- `lib/colorMatrix.ts` — converts each style's filter recipe into the SVG
  color matrix that actually does the work
- "Save to Photos" button — captures the filtered view and saves it to your
  camera roll using `expo-media-library`
- `constants/styles.ts` — same 68 styles as the web app, each with a
  `filter` recipe (warmth, tint, saturation, contrast, grain, vignette)

## How the styling works (no AI, no network)
Each style has a `filter` recipe, e.g.:
```ts
filter: { grayscale: false, warmth: 24, tint: 4, saturation: 1.1, contrast: 1.15, grain: 0.08, vignette: 0.12 }
```
`lib/colorMatrix.ts` turns these numbers into an SVG color matrix, applied
live via `react-native-svg`'s `<FeColorMatrix>` -- the same underlying idea
as the web app's canvas-based engine, just expressed as a matrix instead of
a per-pixel loop. Note: grain and vignette are applied on the web app but
not yet on mobile (a color matrix can't express per-pixel noise or a radial
overlay) -- color grading (warmth/tint/saturation/contrast) is fully live
on both platforms.

## Keeping styles in sync
The web app and mobile app both read from the same generator
(`style-gen/generate.py` if you have it, or edit `constants/styles.ts`
directly) -- if you add a style in one, add the matching entry in the other
so they stay identical.

## Getting it onto real devices / app stores
Expo Go is for development only. To publish for real:
1. Create a free Expo (EAS) account at https://expo.dev
2. Run `npx eas build --platform ios` / `--platform android`
3. Submit via `npx eas submit` (needs a $99/yr Apple Developer account and
   a $25 one-time Google Play account)

Since this app has zero backend dependency now, once it's built as a real
installable app it works completely offline, anywhere, anytime -- no
computer, no WiFi requirement, no server costs ever.
