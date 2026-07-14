# Darkroom

One project, two apps that share the same backend:

```
darkroom/
├── web/      <- Next.js app: the backend (AI processing) + a browser version
└── mobile/   <- Expo app: the camera-first phone app
```

You push this **whole folder** to GitHub as one repo. You only ever run one
`npm install` per app (they have separate dependencies), but there's only
one repo to manage, one place to look for files, and no more "which folder
was I in" confusion.

## The short version of how each piece works
- **`web`** is what gets deployed to Vercel. It's the AI backend (talks to
  Replicate) and also a working browser version of the app.
- **`mobile`** is NOT deployed anywhere. It runs on your computer via
  `npm start` and shows up on your phone through the free Expo Go app. It
  calls the live `web` backend once that's deployed.

## Setup

### 1. Push this whole folder to GitHub
```
cd darkroom
git init
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git add .
git commit -m "darkroom app"
git branch -M main
git push -u origin main --force
```

### 2. Deploy the web app to Vercel
Go to vercel.com/dashboard > Add New > Project > Import your GitHub repo.
**Important:** on the import screen, there's a field called "Root Directory"
— click Edit next to it and set it to `web`. This tells Vercel to only
build the web folder, not the whole repo (which also has the mobile app
it can't build). Then add your `REPLICATE_API_TOKEN` in the Environment
Variables section on that same screen, and click Deploy.

If you already imported the repo without setting Root Directory: go to
your project > Settings > General > Root Directory, set it to `web`, save,
then redeploy.

### 3. Get your live URL
Once deployed, Vercel shows a URL like `https://your-project.vercel.app`.

### 4. Point the mobile app at it
Open `mobile/constants/styles.ts`, find `API_BASE_URL` near the bottom,
and replace the placeholder with your real Vercel URL.

### 5. Run the mobile app
```
cd mobile
npm install
npm start
```
Scan the QR code with Expo Go (see `mobile/README.md` for full details).

### 6. Run the web app locally (optional)
```
cd web
npm install
npm run dev
```

## More detail
Each subfolder has its own README with the full specifics: `web/README.md`
and `mobile/README.md`.
