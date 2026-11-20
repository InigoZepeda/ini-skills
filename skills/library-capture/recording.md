# Recording the scroll videos

The capture records `motion/desktop.mp4` (1440×900) and `motion/mobile.mp4` (390×844, phone user agent) by scrolling the page from top to bottom. The user set the rules below while reviewing the Ramp video. They are the spec: if a video breaks one, the video is wrong, even if the pipeline reported success.

## Contents
- The user's rules and how each one is met
- Reviewing a video
- Tuning knobs
- Known, accepted oddities

## The user's rules and how each one is met

| # | Rule (the user's words, condensed) | How the pipeline meets it (`scripts/capture/index.ts`, `motion.ts`) |
| --- | --- | --- |
| 1 | Start clean: no idle seconds at the start and no popups covering the page. | The video pass runs in its own browser context and reuses the cookies from the screenshot pass, so the consent banner doesn't come back. Popups are closed before recording, then every 2s at each stop. The MP4 is trimmed to start when the scroll choreography starts (`toMp4(..., trimStartSec)`). The ~18s idle start in early videos was the recorder waiting for network idle. |
| 2 | Show the whole hero motion asset. Scroll a little first if it's cut off, because "we can only see a section of the motion graphics asset". | `fitDelta`: within the first 4s of a stop (`FIT_WINDOW`), if an animated element (video, canvas, img, svg, iframe, lottie, rive) crosses the bottom edge, scroll just enough to show it whole without pushing the moving area under the header. Marquee cells (motion that's mostly drift) are left out of the moving area, so a logo strip above a carousel doesn't block the fit (Spendesk). After that small scroll, motion already running isn't treated as an entrance (Ramp's product hero used to be cut after 1.8s). |
| 3 | Stay on each animation until it repeats, then move on. Most are loops; some, like Ramp's hero, are long. | `MotionWatcher` (motion.ts) splits the screen into a grid (desktop 8×6, mobile 4×8) and compares frames. A cell is **done** when it does one of these: loops (the same picture comes back after at least `MIN_PERIOD` 2.5s, for `WINDOW` 3 frames in a row, or a still picture from before its latest change comes back: a carousel back on slide 1); settles (still for 1.5s after an entrance animation, or 5s after later motion, longer than a usual 4s carousel slide); or changes endlessly for 8s (`ENDLESS_MS`: tickers, marquees, counters). Autoplay `<video>` elements and Lottie players (`dotlottie-player`, `lottie-player`, `dotlottie-wc`, or lottie-web's registered animations) are held for one full play (`videoLoopMs`). A Lottie can pause mid-loop long enough to look settled: Navan's hero was cut after 2.9s before this. |
| 4 | With several animations on screen (the bento with four), wait for the last one to start looping. They finish at different times. | A stop only ends when **every** moving cell is done, so the slowest animation sets the pace. |
| 5 | Scroll slower. 0:19–0:26 of the first Ramp video was "super quick". | Half a screen per step (minus the sticky header and bottom bars), eased, at 450 px/s on desktop and 350 px/s on mobile (`smoothScroll`). |
| 6 | Same rules on mobile. | The same choreography runs on mobile with a finer grid. |
| 7 | The mobile video must look like a real phone, not a cropped frame on grey. | `recordVideo.size` is the CSS viewport (390×844), not the device pixels. A larger size leaves the page in a corner on grey. The app shows mobile at phone width next to desktop. |
| — | Don't wait twice for the same thing. | Areas watched at earlier stops (70%+ covered) are ignored. Endless motion that timed out also counts as watched. |

Limits: at least `MIN_DWELL` 1.2s at every stop, up to `FIRST_STOP_MAX` 60s on the first stop (hero), up to `STOP_MAX` 30s on the others, and a `VIDEO_BUDGET` of 300s per video. Past the budget the video just scrolls to the end.

## Reviewing a video

You can't watch an MP4. Use the contact sheets in `motion/` instead: one frame per second, tiled. Desktop sheets are 4×3 (12 s per sheet) and mobile sheets are 6×2. Frame *n* on sheet *k* is at about `(k−1)·12 + n − 1` seconds. The sheets are for Claude only; the app doesn't show them.

Check, sheet by sheet:
1. Frame 1 is the page, already loaded, with no popup.
2. The hero animation is fully in view and plays through at least once before the first scroll.
3. Each animated block stays on screen until it visibly repeats. The bento-style grids are where this goes wrong.
4. Between stops, consecutive frames overlap a lot (slow scroll). A jump of more than about half a screen in one second is too fast.
5. The mobile sheets meet the same rules.
6. Length is plausible: usually 1.5–4 min. Near 5 min means the budget was hit, so look for a stop that timed out.

When a stop looks wrong, recapture with `INI_DEBUG_MOTION=1`. Each stop then logs a line like:

```
desktop stop y=1840 30.1s TIMEOUT video=0 ..dd..PP/..dd..PP/...
```

- `y`: the scroll position.
- The time held, and whether the stop ended `done` or with a `TIMEOUT`.
- `video=`: the ms held for an autoplay video.
- The grid: `.` still, `d` done, `P` still pending, `x` ignored (already watched).

`P` cells at a timeout show which motion never looped or settled. Find that element in the frame and decide whether it's endless (tune the endless detection) or a long loop (raise `STOP_MAX`).

## Tuning knobs

Change these only to fix a rule that the video breaks. Then check Ramp and Clara still pass, using throwaway slugs (see SKILL.md step 5); never overwrite their approved captures.

| Symptom | Knob |
| --- | --- |
| Moves on before a slow loop repeats | `MIN_PERIOD` up (a short sub-step was taken for the loop) or `SETTLE_AFTER_LOOP` up (a long pause inside a loop, such as a slow carousel) |
| Stuck on a ticker or particle field | `ENDLESS_MS` down, or `ENDLESS_SHARE` / `DRIFT_SHARE` |
| A small animation is never noticed | `CHANGED` down, or a finer grid in `choreograph` |
| The hero is still cut off | `fitDelta` selector list (add the element type), `FIT_WINDOW` |
| Too fast or too slow between stops | `speed` in `choreograph`, or the 0.5-screen step |
| The page doesn't scroll at all | Note "possible custom scroll container"; `smoothScroll` falls back to wheel events. Extend that fallback |

## Known, accepted oddities

These were reviewed with the user. Don't try to fix them:
- **Scroll-driven animations** (Ramp's "Now sing together") only move while the page scrolls, so at a stop they look half-built.
- **Play-once animations triggered on scroll-in** (Ramp's "Scale the team" cursor) play during the scroll, before the stop starts.
