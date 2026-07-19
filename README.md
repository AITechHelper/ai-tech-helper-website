# AI Tech Helper Website

Marketing site for AI Tech Helper LLC.

## Layout

```
.
├── aitechhelper-site/   # the deployable Next.js 14 app (App Router)
├── assets/              # source images
├── hero-preview.html            # standalone design prototypes,
├── receptionist-preview.html    # kept for reference — not part
└── service-carousel-poc.html    # of the build
```

**The repo root is not the app root.** The Next.js app lives in
`aitechhelper-site/`, so Vercel's **Root Directory** setting must be
`aitechhelper-site`. If that setting is empty, the build fails looking for a
`package.json` at the top level.

## Local development

```bash
cd aitechhelper-site
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
```

## Pages

| Route              | Source                          |
| ------------------ | ------------------------------- |
| `/`                | `app/page.tsx` + `HeroCarousel` |
| `/ai-receptionist` | `app/ai-receptionist/page.tsx`  |

All routes are static prerenders — no middleware, server actions, or image
optimization.

## Deployment

Vercel project `aitechhelper-site`, deployed from `main` via the GitHub
integration. Push to `main` to deploy.

Deploy from git rather than `vercel deploy` snapshot uploads: the initial
deploys of this project failed because a snapshot captured a half-saved working
tree, uploading `app/globals.css` as the literal text `PLACEHOLDER`.

Next.js is pinned to 14.2.x. Keep `package-lock.json` committed so builds
are reproducible.
