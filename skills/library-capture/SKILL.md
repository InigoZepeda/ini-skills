---
name: library-capture
description: End-to-end playbook for adding a website or product page to the ini design library exactly the way Ramp and Clara were done, covering the capture, the screenshot and video review against the user's recording rules, the fixes when something looks wrong, the analysis and the final check in the app. Use whenever the user gives a URL to capture, add, save or study, mentions a new company homepage or product page for the library, or asks to recapture, redo screenshots or re-record a video for an existing entry.
---

# Add a page to the library

Library root: `${INI_DESIGN_LIBRARY:-$HOME/Documents/Personal Work/Personal Projects/ini-design-library}`. Resolve it once and stop if it is missing:

```bash
LIBRARY_ROOT="${INI_DESIGN_LIBRARY:-$HOME/Documents/Personal Work/Personal Projects/ini-design-library}"
[ -d "$LIBRARY_ROOT" ] || { echo "ini design library not found at $LIBRARY_ROOT. Set INI_DESIGN_LIBRARY to its path."; exit 1; }
```

Run every command from `$LIBRARY_ROOT`.

A capture is done when the screenshots show every section whole, the videos follow the recording rules, `analysis.json` is written, and the page looks right in the app. A finished capture script is not enough: the user has caught bad videos and broken screenshots that the script reported as fine.

Copy this checklist into your reply and tick it off as you go:

```
- [ ] 1. Capture
- [ ] 2. Read the log and notes
- [ ] 3. Review screenshots  (screenshots.md)
- [ ] 4. Review videos       (recording.md)
- [ ] 5. Fix the pipeline and redo, if 3 or 4 failed
- [ ] 6. Analyze             (library-analyze skill)
- [ ] 7. Check it in the app (review.md)
- [ ] 8. Report briefly
```

## 1. Capture

Run it from the library root, in the background, because it takes about 10 to 15 minutes with both videos:

```bash
npm run capture -- <url>                       # homepage or any page
INI_DEBUG_MOTION=1 npm run capture -- <url>    # also logs every video stop (use when a video looks wrong)
```

- **Components:** the capture also saves candidate UI components to `components/` (skip with `--no-components`; redo with `npm run refresh -- <slug> components`). They are curated in step 6.
- **Flags:**
  - `--slug <name>`
  - `--headed` (sites that block headless browsers)
  - `--no-video`
  - `--no-mobile`
  - `--ignore-videos` (pages whose `<video>` elements are content, not motion graphics: the recording never waits on them)
  - `--open-accordions` (opens the first item of each section's accordion before shooting)
- **Default slug:** `<domain>-<path>-<yyyy-mm>`, for example `ramp-com-expense-management-2026-10`. Keep it unless it collides.
- **Product pages:** capture each product page as its own entry. See "Product pages" below.
- **Recapturing a URL:** this overwrites the media but never touches `analysis.json`. Afterwards, update the analysis paths in step 6.

The pipeline is documented in `<root>/docs/capture-pipeline.md`. Read it before changing any capture code.

## 2. Read the log and notes

`[capture]` lines report:
- popups closed;
- slice and section counts (desktop and mobile should have the same number of sections);
- video length.

Then read `capture.json → notes`.

| Note or symptom | Do |
| --- | --- |
| "Possible bot protection" | View `desktop/hero.png`. If it shows a challenge page, recapture with `--headed`. If that fails too, tell the user |
| "Redirected to …" | The site sent its geo or locale version (Stripe served /mx/payments in MXN). Keep it, and say so in the analysis description |
| ffmpeg error | `npx playwright install ffmpeg` or `brew install ffmpeg`, then retry |
| Cookie banner in `hero.png` | Add the provider to `PROVIDERS` in `scripts/capture/consent.ts` |
| Popup still covering the screenshots or video | Extend `CLOSE` / `CLOSE_LABEL` / the icon-button or banner patterns in `dismissPopups` (consent.ts). A toast that appears mid-video shows for about 1s before the per-second check closes it; that's accepted |
| Every still video stop logs about 5.7s instead of 1.2s | A close button `dismissPopups` can't click is timing out at each popup check. Skip it in consent.ts (hidden dialogs already are) |
| "sections: page is … vs …; crops may be off" | The page changed height between visits. Run `npm run refresh -- <slug> screens` |

## 3–4. Review screenshots and videos

Look at the actual images, not just the logs:
- Screenshots: follow [screenshots.md](screenshots.md). It also explains the blank-section fix and the section crops.
- Videos: follow [recording.md](recording.md). It holds the user's recording rules, how the pipeline meets each one, and how to check a video frame by frame.

## 5. Fix the pipeline, never just the output

When a screenshot or video breaks a rule, fix the capture code so every future page benefits. Don't hand-edit images or skip the problem. Then:

1. Redo only what changed:
   - screenshots and section crops: `npm run refresh -- <slug> screens`
   - videos: a full `npm run capture -- <url>` (there is no video-only step)
   - other steps: `refresh -- <slug> design|sitelinks|locales|ai|copy`
2. Check the fix doesn't break the approved pages: capture `https://ramp.com/` and `https://clara.com/` under throwaway slugs (`--slug check-ramp`, `--slug check-clara`) and compare them with `ramp-com-2026-10` and `clara-com-2026-10`. Each fix so far was written for one site and could break the others. Never recapture or refresh the approved entries themselves: the user has signed them off. Afterwards, delete the check folders and run `npm run index`.
3. Run `npx prettier --print-width 180 --write <changed files>`, then `npm run typecheck && npm run lint`.
4. Add the symptom and fix to the matching reference file in this skill and to `docs/capture-pipeline.md`.

## 6. Analyze

Use the `library-analyze` skill. The points the user has corrected before:

- Every `sections[].slice` points at a section crop (`desktop/sections/NN.jpg`). After any recapture, view the new crops and remap each slice by hand: crop numbers shift when a section is added or merged.
- `analysis.json` is only ever edited by hand. Scripts never write it.
- Tags come only from `docs/taxonomy.md`, with at most 2 `style.keywords`.
- The data is for Claude's searches; the app is for the user to look at. Keep the data complete even where the app doesn't show it.
- `serp` is only filled from a Google screenshot the user shares. Never search Google yourself. At the end, offer: "If you Google <company>, send me a screenshot and I'll add the sitelinks."

Then run `npm run index`.

## Product pages

- Set `pageType` to `product-page`, or the closer taxonomy term (`pricing`, `landing-page`…). Any page that isn't a homepage goes under the "Product pages" toggle in the gallery.
- `name` is the company plus the product ("Ramp Expense Management"). `about` describes that product, not the company.
- Pages from the same domain are grouped as one brand. A dropdown at the top of the page switches between them (Homepage, Expense Management…).
- If the company's homepage is already in the library, open its `analysis.json` and say in `summary` what the product page does differently (layout, motion, proof, CTA). Shared tokens don't need describing twice.

## 7–8. Check in the app and report

Run the app checks in [review.md](review.md). Then reply in a few lines (the user dislikes long text):
- the link;
- 2–3 standout findings;
- anything that still looks off and why.

Don't commit unless asked.

## Rules that always apply

- **Passive capture only.** Load the page like a normal visitor. No probing, no path scanning, no spoofed crawler user agents (no Googlebot UA).
- **Patterns, not copies.** Describe what to learn from a page, never how to clone it.
