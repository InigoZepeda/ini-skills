# Screenshots

What each viewport folder (`desktop/`, `mobile/`) holds, the bugs that were fixed and how, and what to check. The code is in `scripts/capture/screens.ts` (the screenshot pass), `media.ts` (`stitch`), `sections.ts` and `in-page/sections.js` (section crops).

## Contents
- Files
- The blank section fix (stitched full page)
- Section crops
- Remapping the analysis after a recapture
- Checklist

## Files

| File | What it is |
| --- | --- |
| `first-load.png` | The page exactly as it first loads, cookie banner and geo or announcement bar included. This is the only place the geo bar is visible |
| `hero.png` | The first screen after consent and popups are closed |
| `slices/NN.png` | Fixed scroll steps. Kept for older captures; the app uses section crops instead |
| `full.jpg` | The whole page, stitched |
| `sections/NN.jpg` | Each page section, cropped whole from `full.jpg`. The app's "Screens" view and `analysis.json → sections[].slice` use these |

Popups closed during capture are listed in `capture.json → notes`.

## The blank section fix (stitched full page)

**Symptom:** on Clara, a large empty area showed above "Built on the intelligence of 70k+ finance teams" in the full-page screenshot. The section was there on the live site.

**Cause:** Playwright's `fullPage: true` screenshot resizes the viewport to the height of the whole page. Pinned and sticky scroll sections (`position: sticky` inside a tall wrapper, scroll-driven reveals) are laid out against the viewport, so in one giant viewport they never pin or reveal and render blank.

**Fix:** never use `fullPage`. `full.jpg` is stitched (`stitch` in media.ts) from normal 1440×900 (or 390×844) viewport screenshots taken while scrolling the page for real:
- Every frame is a real scroll position, so pinned sections render as a visitor sees them.
- Frames overlap by 48px (`SLICE_OVERLAP`), and each frame adds only what earlier frames didn't cover, so there are no gaps. Smooth-scroll libraries can overshoot, so the scroller steps back if needed.
- Before each frame the screen must stop changing (`settle`, up to 2.5s), so reveals and counters are finished (Chainlink's stats read "$0B+").
- A frame ends just above any animation (video, canvas, svg, Lottie) its bottom edge would cut (`frameCut`), so the next frame shows it whole. Otherwise its halves come from different moments (Ramp Spend Management's hero bento came out cut, over a blank band).
- A frame also ends above a heading or paragraph low on the screen that hasn't faded in yet, so the next frame shows it revealed (Chainlink's "Explore CCIP in action" was missing, Jeeves's word-by-word heading came out half drawn).
- Stacked sticky panels (2+ sticky siblings filling their parent, like Wise's scroll-stacked cards) are unpinned during the stitch (`unstickStacks`), or every frame shows the same stuck panel. Small ones too: Wise's mobile cards are under 30% of the screen, so `pageChrome` took them for a sticky header and hid them (a blank crop). One pinned section on its own stays pinned (Ramp's).
- Playing videos cut by a frame's bottom edge are paused until the stitch ends (`holdVideos`), so the next frame continues the same moment (Wise's card hero video showed seams).
- Paused videos in view that haven't loaded are told to load first (`loadVideos`), or they stitch as black boxes (Jeeves's lion).
- All lazy images are loaded before the stitch (`loadLazyImages`, up to 5s), so the page has its final height. Navan's 102 lazy images held placeholder heights: the page shrank from 10011px to 8752px mid-scroll, and the stitch silently skipped the Flock quote and the corporate-cards card (no gap note, because each frame's y was stale). The frame's y is also read after `settle`, since scroll anchoring moves the page when the layout shifts.
- The scroll gives up after 6 minutes and notes "Scrolling ran out of time". At 2 minutes Airwallex's mobile page lost its FAQ, CTA and footer.
- At the bottom, the pass waits 1.5s and keeps scrolling if lazy content grew the page (Airwallex's mobile CTA and footer were missing).
- Repeating page chrome is hidden (`withoutChrome`). The sticky header shows only in the top frame. Bottom bars (cookie, ticker) and floating chat bubbles are hidden in every frame. Without this, the header repeats down the image. `pageChrome` treats small fixed or sticky elements (under 30% of the viewport height) stuck to the viewport edges as chrome. Big fixed elements (pinned sections, backgrounds) are content and stay.
- Images taller than 65,000px are capped (`JPEG_MAX`).

If a new site shows a blank band, a repeated header, or a duplicated strip in `full.jpg`, fix it in `pageChrome` or the scroll loop in screens.ts. Never go back to `fullPage`.

## Section crops

**Why:** fixed scroll slices split sections in half, and the sticky nav covered content at the top of each slice. So each section is cropped whole from `full.jpg`, measured in the same visit so the coordinates match. The full page has no sticky header, so nothing covers the crops.

**How sections are found** (`in-page/sections.js`):
- **Card titles never count:** a heading that shares its row (tops within 40px) with another heading of the same size is a card title, whatever its tag. Ramp tags card titles `h2`, Brex `h3`/`h4`. Footer headings are left out too.
- **A section starts at:** every other `h1` and `h2`, plus `h3`–`h6` titles on sites that title sections that way (Brex). Those must be at least 0.85 × the lower median `h2` size, and only their top size tier counts (≥ 0.85 × the largest), so a zig-zag row's sub-heading doesn't split its section.
- **Very tall stretches split:** a stretch over two screens with no section title splits at its biggest lone headings (Ramp Spend Management titles its zig-zag rows with h3s at 0.7× its only h2, so its hero crop ran 5,600px).
- **Subtitles never count:** a heading under 1.25× the body text size (the median paragraph size) isn't a section title, whatever its tag. Navan tags its 17px hero subtitle `h2`, which split the hero in two.
- **The footer:** `<footer>` or `[role=contentinfo]`. If neither exists, the outermost box around the last ©/copyright text. Nothing after the footer start makes a new section.
- **Short bands join the next section:** anything under 200px (`MIN_HEIGHT`), such as an intro heading above its cards. The header and hero form section 01, and the first heading anywhere on the first screen joins it (on mobile the hero media often sits above the headline).
- **Mobile:** splits at exactly the desktop section headings, found by their text (the `like` parameter, passed in as `window.__iniSectionLike`). The size rules aren't rerun on mobile: cards that sit side by side on desktop stack on mobile and would each start a section, and phones shrink h3 section titles below the size cut (Brex came out 3 mobile sections against 8). Desktop and mobile should end up with the same number of sections.
- **Placement:** every heading and footer in view is marked during the stitch (`markTops`), and each section moves to where its stitch frame showed its heading. The layout can shift after the stitch (Chainlink's crops all started 100px high). Headings inside a sticky or fixed box aren't marked: the frame shows where they're stuck, not where they sit (Ramp's mobile "Now sing together" merged into the section above). A section with no marked heading moves with the one above.
- **Drift:** if the page height changed between the stitched page and the measurement by more than 3%, a note says crops may be off. Run `npm run refresh -- <slug> screens`.

## Remapping the analysis after a recapture

Section numbers shift whenever detection changes or the site adds a section. After `refresh screens` or a recapture:
1. View every `desktop/sections/NN.jpg`.
2. Set each `analysis.json → sections[].slice` to the crop it's in. Several analysis sections can share one crop; the app captions the crop with all their names. An announcement or geo bar stays on `desktop/first-load.png`.
3. Fix any description text that names an old file path.

## Checklist

- [ ] `first-load.png` shows the banner and popups as first seen. `hero.png` shows none.
- [ ] `full.jpg` has no blank bands, no repeated sticky header, no cut or doubled strips. Compare it against the slices at any suspicious spot.
- [ ] Every section crop starts at a section title and contains the whole section.
- [ ] The last crop is the footer, whole.
- [ ] Desktop and mobile have the same section count, or there is a clear reason.
- [ ] Very tall crops (pinned sections, long bentos) look right in the lightbox. The Screens tiles cut tall crops short with a fade on purpose.
