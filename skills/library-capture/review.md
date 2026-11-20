# Checking the page in the app

Start the app with `npm run dev`, or reuse the running one. Use the port it reports. Open `/sites/<slug>` and screenshot it with Playwright, at 1440px wide and also at 390px. The user corrected every item below at least once. "Front" means what the user sees; "back" is the data for Claude.

## Gallery
- [ ] The card appears under the right toggle: Homepages or Product pages (`pageType`).
- [ ] The card name is the company, or company plus product for a second page from the same site.

## Detail page
- [ ] The hero shows only short facts. No layout labels, no pixel sizes, no long paragraphs.
- [ ] **Full page:** desktop and mobile sit side by side at the same height (like the videos). "View full page" opens the lightbox, where it scrolls.
- [ ] **Screens:** first load, then one tile per section. Captions are the analysis section names (no "1440px" or "390px" suffix). Mobile captions match desktop, and the final CTA isn't captioned "Hero" just because it repeats the hero headline. Tall tiles fade out; the lightbox shows the whole crop and the description.
- [ ] **Video:** desktop and mobile play side by side. Mobile is phone-sized with no grey border. No contact sheets in the UI.
- [ ] **Copy:** reads like a Word doc of the page, content only (no navbar), grouped by section.
- [ ] Text is short everywhere. Descriptions live in the lightbox, not on tiles.

## Data
- [ ] `npm run index` ran after the last analysis edit.
- [ ] `analysis.json` paths all point at files that exist.
