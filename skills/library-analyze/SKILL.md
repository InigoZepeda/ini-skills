---
name: library-analyze
description: Write analysis.json for a captured site in the ini design library by looking at its screenshots, contact sheets and capture.json. Use after a capture, when an entry shows "not analyzed", or when the user asks to (re)analyze an entry.
---

# Analyze a capture

The analysis turns pixels into searchable words. Future searches ("dark hero with product UI and a logo marquee") only find this entry if you describe it well and use the taxonomy terms.

Library root: `${INI_DESIGN_LIBRARY:-$HOME/Documents/Personal Work/Personal Projects/ini-design-library}`. Resolve it first, and stop if it is missing:

```bash
LIBRARY_ROOT="${INI_DESIGN_LIBRARY:-$HOME/Documents/Personal Work/Personal Projects/ini-design-library}"
[ -d "$LIBRARY_ROOT" ] || { echo "ini design library not found at $LIBRARY_ROOT. Set INI_DESIGN_LIBRARY to its path."; exit 1; }
```

Every path below is relative to `$LIBRARY_ROOT`, and every `npm run` command runs from there.

## Inputs (read in this order)

1. `docs/taxonomy.md`: the only allowed values for tag fields.
2. `library/sites/<slug>/capture.json`. Skim `content`, `design`, `seo`, `security`, `privacy`, `stack`, `performance`, `accessibility` and `notes`. Skip `allResponseHeaders` and `metaTags` unless something stands out.
3. Images (use the Read tool on them):
   - `desktop/hero.png`, `desktop/first-load.png` (cookie banner)
   - **every** `desktop/sections/NN.jpg`, in order (each is one whole section). These are your section map; older captures without them use `desktop/slices/NN.png`
   - `mobile/hero.png` and 3–4 mobile section crops or slices (how the layout adapts)
   - **every** `motion/desktop-sheet-NN.jpg`: 1 frame per second, read left-to-right, top-to-bottom, 12 frames per sheet. Sheet 01 covers 0–11 s, sheet 02 covers 12–23 s, and so on. Compare frames to spot what animates: elements appearing, moving, counting, pinning, autoplaying
   - `motion/mobile-sheet-01.jpg`
4. Only if something can't be explained from the images: grep `raw/rendered.html` or the files in `raw/js/` (for example, to confirm GSAP ScrollTrigger drives a pinned section). Never read raw files whole.

## Output

Write `library/sites/<slug>/analysis.json` matching the `Analysis` type in `src/lib/library/types.ts` (field guide in `docs/data-model.md`). Then run `npm run index`.

Guidelines:

- `analyzedAt`: ISO timestamp.
- `analyzedBy`: your model id.
- `name`: the company ("Ramp"). Add the page only when the library already holds another page of the same site ("Ramp Pricing").
- `about`: the product in at most 2 short lines (~160 characters): what it is and who it's for. It's shown under the name, so no marketing adjectives.
- `summary`: what the page is, plus **why it's worth saving**, in 2–4 sentences. Used for search, not shown in the app.
- `style.keywords`: **at most 2** taxonomy terms, the two that define the look at a glance. They are gallery filters, so more than two makes every site match everything. Color mode, saturation and density have their own fields; layouts like bento are `patterns`.
- `style.description`: plain words a designer would use ("warm off-white canvas, near-black type, one acid-lime accent used only on CTAs").
- `palette.swatches`: take hexes from `capture.design.colors` / `primaryButton` and give each a role. The role is your description, not a CSS name; the site's real token names are in `capture.design.system.tokens` and the app shows those, so mention a name in `style.description` only if it's telling.
- `sections`: one entry per visible section, top to bottom. Set `slice` to the screenshot path that shows it (`desktop/sections/03.jpg`; older captures: `desktop/slices/03.png`). Things that only exist before popups are closed (geo or cookie bars) are only visible in `desktop/first-load.png`; open the image and check the section is really in it. Each `pattern` is a taxonomy term.
- `components`: the visual components worth borrowing, chosen from the candidates in `components/NN.png` (see `components/manifest.json`; view every crop). Keep real, self-contained visuals: a credit card render, a checkout form, a dashboard or report mockup, a chart, a workflow card, a chat or AI UI, a pricing tile. Drop plain text cards, logos, photos with nothing on them, duplicates and crops that are mostly background or cut off. Each entry is `{ file: "components/04.png", name, kind, description, keywords, section }`: `kind` is a `component-kind` taxonomy term; `name` is short ("Credit card checkout form"); `description` says what it shows, in the words someone would remember it by ("white card with masked Visa number, expiry and CVC, green tick"); `keywords` are free search words (2–6: "credit card", "visa", "payment", "dark"). The crops you don't list are deleted by `npm run prune-components`, so only run that after curating. A page with none worth keeping gets `"components": []`.
- `interactions`: anything you'd want to rebuild, with trigger and location. Be concrete: "Tabs auto-advance every ~5s with a progress bar under the active tab".
- `motion.highlights[].timestamp`: approximate video time as `m:ss`, from the contact sheet frame index (frame n on sheet k ≈ `(k-1)*12 + n - 1` seconds).
- `seoNotes` / `securityNotes` / `privacyNotes`: interpret, don't repeat. Examples: "no hreflang despite 5 locales in sitemap", "CSP present but no frame-ancestors", "18 ad/analytics trackers load before any consent".
- `serp`: only when the user shares what Google showed (screenshot or text). Record the sitelink texts exactly, then in `seoNotes` trace each one to `capture.seo.sitelinks` (nav link, H1, title start, hreflang alternate). Never search Google or scrape results to fill it. First decide whether it's an ad: a "Sponsored"/"Patrocinado" label, an lp./landing subdomain, or clicked links carrying gclid/gad_source/utm_medium=sem mean it is. Then set `ad: true`; its sitelinks are Google Ads assets, so don't draw organic sitelink conclusions from them. Put clicked destinations (tracking parameters removed) in `sitelinkUrls`.
- `strengths` / `weaknesses`: specific and honest.
- `goodFor`: phrases you'd search with later.
- `tags`: extra words not covered above (company names, notable techniques).
- Don't invent what you can't see. If unsure, say "appears to…".

Finish by viewing `http://localhost:3000/sites/<slug>` if the dev server is running, or at least confirm `npm run index` reports the entry as analyzed.
