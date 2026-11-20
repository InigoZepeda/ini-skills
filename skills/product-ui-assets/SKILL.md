---
name: product-ui-assets
description: Generate marketing product-UI images (hero visuals, feature-card images, "how it works" fragments) for a landing page from reference assets plus an idea, rendered as code with Remotion Stills so they're crisp, on-token and re-renderable per theme. Use when a page has image placeholders that should show the product, or when the user asks for UI mockup images, product illustrations or feature visuals built from references.
---

# Product-UI assets from references + an idea

The request: whatever the user asked for (which slots, or the idea), e.g. *"three
feature cards: card, team, vendor"*. If they didn't say, ask before building.

Images are **built as React components and rendered to PNG**, not drawn by an image model. That keeps the text
exact, the numbers reconciled, the palette on-token, and every image re-renderable when a token, a theme or a word
changes. An image model is fine for photography; it is the wrong tool for UI with real words and numbers.

If the project has its own skill for this (for example `<repo>/.claude/skills/*-ui-assets`), read it first: it
holds the paths, the theme file and the conventions; this skill is the method.

## 1. Read before drawing

1. **The slot.** Open the page's HTML/CSS and find the placeholder: its aspect ratio, its rendered width at the
   widest breakpoint (desktop column width) and at 390px, its background token and its radius. Write them down.
   The composition is drawn at that CSS size, so a 12px label in the Still is a 12px label on the page.
2. **The claims source** (brief, fact sheet). List what the image may show. Anything the source doesn't define in
   detail is "illustrative" and gets `[confirm with product]` in the alt text or the working notes.
3. **The references.** Open every reference image you lean on (Read the file; never describe one you haven't
   seen): the brand's own product shots and ads first, then 2–4 competitor captures for abstraction level.
   Take hierarchy and abstraction from competitors, never their colours, layout or marks.
4. **What already exists.** Other generated images on the page: list their components (glass cards, an approval
   card, a member list…) so the new set stays a family without repeating them. Same palette, type, radius and
   shadow language; different objects and composition.

## 2. Decide the idea per slot, in one line each

One image answers one question. For each slot write: *the object, the one supporting overlay, the one number or
state that carries it.* Examples that worked:
- **Card controls:** a portrait card (the brand's real card language) + a speech bubble listing its conditions.
- **Team limits:** columns, one per team, each filled against its own cap; the highlighted team gets a tooltip.
- **Vendor limits:** a vendor list with one row lifted out and its monthly limit shown as a slider.

Rules: one focal object, at most two overlays; numbers before decoration; one loud colour (the action or accent),
everything else white, tints and ink; no dashboard chrome unless the slot is a hero.

## 3. Project setup (once)

```bash
npx create-video@latest <name>-visual --blank   # or copy an existing one; Remotion 4
npm i @remotion/google-fonts
```

- `src/theme.ts` — **mirrors the site tokens**: colour primitives with their token names in comments, the font via
  `@remotion/google-fonts/<Family>`, radii, a shadow set that is almost invisible (faint contact line + one wide
  low-alpha blur), shared text styles in CSS px. Comment: "change tokens.css first, then here".
- `src/data.ts` — **illustrative data only**, with a header comment saying so. Local currency (MXN/BRL/COP, not
  USD). Generic names, generic merchants, no real customer or vendor brands. Every subtotal sums to its total and
  every percentage matches its bar; compute them in code (`used / limit`) rather than typing both.
- `src/ui/primitives.tsx` — Surface, Chip, Bar, Avatar, Icon (lucide paths inline, stroked so they scale), Button,
  the brand mark taken from the official logo SVG path (never redrawn by eye).
- `src/Root.tsx` — one `<Still>` per image and per theme variant, `width`/`height` = the slot's CSS size.

## 4. Build each Still

- **Theme variants by prop, not by copy:** `tone: "a" | "b"` switches the slot fill, the tracks, the accent and
  the button colour from a small palette object. One component, N Stills in `Root.tsx`.
- **Paint the slot or stay transparent — decide per slot.** Paint the background (exactly the slot's token) when
  the image uses blur/glass or a glow, or when it must match the slot seamlessly in a webp. Stay transparent when
  the same image must sit on several surfaces.
- Position with absolute boxes in CSS px; keep text ≥ 11px at the desktop size (it shrinks ~20% on phones).
- **Gotchas:**
  - Glass over a dark element turns to mud: keep anything behind `backdrop-filter` light.
  - Shadows read as "AI render" fast: hairline (`rgba(navy, 0.08)`) + one ambient blur, never a dark drop.
  - `fontVariantNumeric: "tabular-nums"` on amounts.
  - Don't put the wordmark in the image; the brand's mark/isotype from the official SVG is fine.
  - No real payment-network logos: two outline circles stand in.
  - No cursors, hands or devices unless the idea needs the gesture.

## 5. Render, export, wire

```bash
npx remotion still <Id> out/<Id>.png --scale=3 --image-format=png [--browser-executable=<headless shell>]
cwebp -q 90 -resize <2×W> <2×H> out/<Id>.png -o <site>/assets/<folder>/<name>-<2×W>.webp
```

- Render at **3×**, ship webp at **2×** the slot's desktop width (and a 1× one if the image is large).
- **Path with spaces:** Remotion's bundled headless shell fails with "Target closed". Pass
  `--browser-executable` pointing at a shell elsewhere (puppeteer's cache:
  `~/.cache/puppeteer/chrome-headless-shell/<platform>-*/chrome-headless-shell-*/chrome-headless-shell`).
- Add each Id to a `render.sh` loop so one command re-renders the set.
- **HTML:** an `<img>` with `width`/`height` (2× size), `loading="lazy"` below the fold, `decoding="async"`, and an
  `alt` that says what it shows and that amounts are illustrative. One `<img>` per theme variant, the extra ones
  hidden by default and shown by the theme attribute (`[data-theme="02"] .x--b { display: block }`), so switching
  themes never refetches layout.

## 6. Verify by eye

1. Open every PNG (Read it) at full size: text exact, numbers reconcile, nothing clipped, one focal point.
2. Screenshot the page at desktop and 390px in every theme (Playwright, headless); open the shots. Check the image
   edge disappears into the slot, nothing is unreadable on mobile, no console errors.
3. Read the set side by side with the existing images: same family, no repeated component.
4. Record the decision (what each image shows, what's illustrative) in the project's decision log.
