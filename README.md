# Darkroom

One project, two apps, both fully self-contained:

```
darkroom/
├── web/      <- Next.js app: a browser version of the app
└── mobile/   <- Expo app: the camera-first phone app
```

Both apps apply all 68 styles **entirely in code** -- real color grading,
contrast, warmth/tint, grain, and vignette math, applied instantly on your
own device. No AI service, no API keys, no per-photo cost, no backend at
all. (Earlier versions of this project used an external AI API; that's been
fully replaced.)

## Setup

### Web app
```
cd web
npm install
npm run dev
```
Open http://localhost:3000. No environment variables needed.

### Mobile app
```
cd mobile
npm install
npm start
```
Scan the QR code with the free Expo Go app on your phone.

## Deploying the web app
Push this whole folder to GitHub, then import it into Vercel
(vercel.com/dashboard > Add New > Project). Set "Root Directory" to `web`
during import (or in Settings > Build and Deployment afterward). No
environment variables needed -- it's a static, backend-free app.

## Keeping styles in sync
Both apps' style lists (`web/lib/styles.ts` and `mobile/constants/styles.ts`)
are generated from the same source data so they stay identical. If you add
or tune a style in one, make the matching edit in the other.

## More detail
Each subfolder has its own README with the full specifics: `web/README.md`
and `mobile/README.md`.
