# Darkroom — mobile app (iOS + Android)

Built with Expo (React Native) — one codebase, both platforms. It calls the
**same backend** as the web app (`photo-style-app`), so you only maintain the
AI pipeline in one place.

## Before you start
You need the web app's backend deployed and reachable from your phone:
- **Easiest**: deploy `photo-style-app` to Vercel (free) — see its README.
  Then set `API_BASE_URL` in `constants/styles.ts` to your Vercel URL.
- **For local testing only**: run `npm run dev` in `photo-style-app`, find your
  computer's LAN IP (e.g. `192.168.1.24`), and set `API_BASE_URL` to
  `http://192.168.1.24:3000`. Your phone and computer must be on the same WiFi.
  ("localhost" will not work from a phone.)

## Setup
```
npm install
```

Install the free **Expo Go** app on your phone (App Store / Play Store).

```
npm start
```
This opens a QR code in your terminal/browser. Scan it with:
- iPhone: the Camera app
- Android: the Expo Go app's built-in scanner

Your app opens live on your phone. Edit code, save, and it reloads instantly.

## What's already built
- `components/CameraScreen.tsx` — live camera with a real-time color-tint preview per
  style (an approximation, not the real AI look — see note below), plus a shutter
  button and a style filmstrip
- `components/ReviewScreen.tsx` — after capture (or picking from your library), shows
  the photo and runs the real AI style transfer when you tap "Apply Look"
- `App.tsx` — opens straight to the camera, hands off to the review screen after capture
- `constants/styles.ts` — same 4 starter styles as the web app, each with a
  `previewTint`/`previewOpacity` used only for the live camera preview

## Why the live preview isn't the "real" AI look
The real style transfer (Portra grain, noir contrast, etc.) runs as a cloud AI
generation and takes a few seconds per image — too slow and too costly to run
30 times a second while you're framing a shot. So the live camera view shows a
fast, on-device color tint that approximates the mood, and the full-quality AI
version is generated after you tap the shutter. This is the same tradeoff apps
like Instagram/Snapchat make: their *live* filters are simple color/light
effects; heavier AI look changes happen after capture, not live.
If you want a closer live approximation later (e.g. real per-pixel grain or
proper desaturation instead of a flat tint), that needs a GPU shader pipeline
(`react-native-vision-camera` + `react-native-skia`) — a bigger addition I can
scope separately if you want it.


## Keeping styles in sync
If you add a new style in the web app's `lib/styles.ts`, copy the same entry
into this app's `constants/styles.ts`. (Once you're comfortable, these can be
merged into one shared package — ask me and I'll set that up.)

## Getting it onto real devices / app stores
Expo Go is for development only. To publish for real:
1. Create a free Expo (EAS) account at https://expo.dev
2. Run `npx eas build --platform ios` / `--platform android`
   (this builds real installable app files in the cloud, no Mac needed even
   for iOS)
3. Submit to the App Store / Google Play via `npx eas submit`
   (needs a $99/yr Apple Developer account and a $25 one-time Google Play
   account)

I can walk through the EAS build + store submission step by step whenever
you're ready for that stage — it's a good next milestone once the app works
the way you want in Expo Go.
