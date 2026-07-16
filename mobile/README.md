# Darkroom — mobile app (iOS + Android)

Built with Expo (React Native) — one codebase, both platforms. Calls the
**same backend** as the web app (`darkroom/web`), which uses Google's
Gemini 2.5 Flash Image model for genuine AI photo editing.

## Before you start
You need the web app's backend deployed and reachable from your phone:
- **Easiest**: deploy `darkroom/web` to Vercel (free) — see its README.
  Then set `API_BASE_URL` in `constants/styles.ts` to your Vercel URL.
- **For local testing only**: run `npm run dev` in `darkroom/web`, find your
  computer's LAN IP (e.g. `192.168.1.24`), and set `API_BASE_URL` to
  `http://192.168.1.24:3000`. Your phone and computer must be on the same
  WiFi. ("localhost" will not work from a phone.)

## Setup
```
npm install
```

Install the free **Expo Go** app on your phone (App Store / Play Store).

```
npm start
```
Scan the QR code with your phone (Camera app on iPhone, Expo Go's scanner
on Android).

## What's already built
- `components/CameraScreen.tsx` — live camera with a rough color-tint
  preview per style, plus a shutter button and a style filmstrip
- `components/ReviewScreen.tsx` — after capture (or picking from your
  library), sends the photo to the backend for a real AI edit when you tap
  "Apply Look", then lets you save the result to your camera roll
- `constants/styles.ts` — same 78 styles as the web app, plus
  `API_BASE_URL` pointing at your backend

## Why the live camera preview isn't the final result
The real AI edit takes a few seconds and needs a network call, so it can't
run live at 30fps while framing a shot. The camera view shows a fast
on-device color tint as a rough preview of the mood; the actual AI-edited
photo is generated after you tap "Apply Look".

## Getting it onto real devices / app stores
Expo Go is for development only. To publish for real:
1. Create a free Expo (EAS) account at https://expo.dev
2. Run `npx eas build --platform ios` / `--platform android`
3. Submit via `npx eas submit` (needs a $99/yr Apple Developer account and
   a $25 one-time Google Play account)
