# Cutframe

A free library of original animation styles drawn in code. Visitors watch a style, type their topic, and copy one prompt into Claude, which builds the video. The site is static: nothing is generated on a server, and what visitors type never leaves their browser.

Plan and decisions: `../style-library-plan.md`.

## Run it

```bash
npm install
npm run dev          # http://localhost:4321 while editing
npm run build        # checks the styles, then builds to dist/
npm run preview      # serves dist/ at http://localhost:4321
npm run test:builder # end-to-end test of the prompt builders (needs preview running)
```

## Add a style

1. Put its files in `public/styles/<id>/`: `prompt.md` (the rules, with a `{{CONTENT}}` slot) and `reference.html` (the working animation, keeping `window.seek`, `window.DURATION`, `window.scoreSound`, `window.SFX`, `window.__ready` and a 1280×720 canvas).
2. Add its entry to `src/data/styles.ts` (name, tagline, look, highlights…).
3. `npm run previews <id>` renders `media/sample.mp4`, `media/poster.jpg` and 30 frames into `media/frames/`. Needs FFmpeg and HyperFrames' Chrome Headless Shell (or `CHROME_PATH`).
4. `npm run build`. The style check fails the build if a file, the slot or the renderer contract is missing, or if anything references a third-party style library.

Only original styles belong here.

## Where things are

| Path | What |
|---|---|
| `src/lib/site.ts` | Site name, description, contact: rename the brand here |
| `src/data/styles.ts` | The style list |
| `src/lib/buildPrompt.ts` | How the copied prompt is assembled |
| `src/components/PromptBuilder.tsx` · `TitleCard.tsx` · `CloneBuilder.tsx` | The interactive parts |
| `src/pages/` | Home, style pages, Make your own, About, License, Privacy |
| `src/css/global.css` | Tokens and shared styles |
| `scripts/` | Preview renderer, style check, builder test |

## Deploy

Cloudflare Pages: build command `npm run build`, output directory `dist`. Set the real domain in `astro.config.mjs` (`site`) and the contact address in `src/lib/site.ts` first.
