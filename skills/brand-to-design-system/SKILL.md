---
name: brand-to-design-system
description: Turn any company's brand (brand kit, logo files, screenshots of its sites and ads) into an extended colour palette, two-tier tokens, a DESIGN.md and a small set of components for a visual exploration. Brand-agnostic; use it for every client. Use when starting a new exploration or direction for a brand, when asked to "get the branding from these images", "extend the palette", "the brand has no light tints / no greys", "build tokens and components", or "write a DESIGN.md / design system" for a prototype.
---

# Brand → palette → tokens → components

A repeatable process for turning one brand's raw material into a working design system. It is brand-agnostic: nothing
in this skill belongs to a particular client, and every hex, font and name in the templates is a placeholder to replace.
The steps run in order: each step's output is the next step's input. Skeletons for each file are in
[templates.md](templates.md), and the palette generator is in `scripts/`.

If the project already has artifacts from an earlier exploration (a `PRODUCT.md`, a research file, a `tokens.css`, a
`DESIGN.md`), read them first and follow their shape. Otherwise create them from the templates.

**The core rules:**
- **Extend the brand; don't replace it.** Brand hexes are anchors and never change. Logo files are used as provided
  and never redrawn or recoloured.
- **Generate new colours; don't pick them by eye.** Every new step comes out of `scripts/palette.mjs` in OKLCH, and
  every text/surface pair the page uses gets a contrast check.
- **Styles read roles, never raw values.** Components use semantic tokens only. A band that changes background
  re-declares the roles instead of creating component variants.
- **Claims come from the source of truth only.** Never invent a metric, logo, quote or certification. Unsourced slots
  stay visibly marked (`[METRIC: needs source]`, `[confirm with product]`).
- **Nothing from another client leaks in.** Names, hexes, fonts, example copy and reference choices all come from the
  brand in front of you. If a value in this skill looks specific, it is a placeholder.

## Before you start

Ask for, or locate, what exists: the brand kit (PDF, Figma file, `brand.md`), logo files, the live site(s), other
markets, ads, and any brief. If something is missing (no kit, no fonts, no live site), say so and decide with the user
what stands in for it. Do not fill a gap silently.

## Folder shape

Adapt to the repo's conventions; this is the default.

```
<project>/design/
  PRODUCT.md                    who, why, personality, anti-references (shared by all directions)
  research/premium-patterns.md  measured references → numbered patterns → take / don't take
  scripts/palette.mjs           + palette.config.mjs (copied from this skill)
  _shared/brand-original.css    the untouched brand kit as CSS variables, so the extension is diffable
  _shared/reset.css
  NN-<type-pairing>/            one folder per direction
    DESIGN.md  tokens.css  index.html  styles.css  page.js
    PRODUCT.md -> ../PRODUCT.md (symlink, so tools that read the folder find both)
    assets/  screenshots/
references/<source>/index.md    one catalog per image source (one market, one site, ads, …)
```

## 1. Inventory the brand kit

Read the brand kit and write down:
- **Colour families,** with each hex and its official name. Note which colour is primary and which is secondary.
- **Logo files:** positive, negative, isotype. Note the clear-space and minimum-size rules.
- **Fonts,** if the kit names any. If it doesn't, the type pairing is the direction's choice; name the folder after it.

Snapshot the kit's colours, untouched, into `_shared/brand-original.css`. Everything later is a diff against this
file.

**Then list the gaps.** These drive the whole extension. Typical gaps, to check one by one:
- **No light tints.** A family with many dark steps and nothing light enough to use as a surface.
- **No greys,** only white and black, or greys that clash with the brand hue.
- **Too many similar darks** and a big jump to the next family.
- **The live sites invent colours outside the kit.** That proves a gap is real and shows which direction the brand
  already leans.

Write the gaps down for this brand specifically. Do not assume a gap exists because it existed for a previous brand.

## 2. Read the brand from images

Collect screenshots of the company's live site(s), its other markets and its ads into `references/<source>/`, named
`<source>-<what>.<ext>`. Look at each image yourself (Read the file); never describe one you haven't opened.

Each folder gets an `index.md` that opens with one **context paragraph**: the approximate hexes that recur, the type
feel, recurring motifs (photo style, card shapes, illustration, product UI), and what is on and off the kit palette.
Then one entry per image:

```markdown
### [<source>-<what>.png](<source>-<what>.png)
<img src="<source>-<what>.png" width="500">

**What it is:** <page, viewport, date read>.
**Visual assets:** <colours, components, imagery and type you can see>.
**Search words:** <5 to 8 words to find it later>
```

Finish with a short **synthesis** (in PRODUCT.md or in the catalog):
- **The colours the brand really uses,** and the share of each.
- **The colours it invents** outside the kit. These are candidates for new steps.
- **The motifs worth keeping,** and the ones that read as dated or generic.
- **The CTA colour the live site really uses.** It can differ from the kit's "secondary". Use the live one, and say so.

## 3. Measure premium references

Pick 3 to 5 sites in the same category that feel the way the page should feel. Prefer references the user names; if
they name none, propose some and let them veto. Measure them read-only: read their CSS and screenshots, and don't
change anything on those sites.

Write `research/premium-patterns.md`:
1. **A measurements table,** one column per site: heading text colour, body text colour, borders (colour and alpha),
   pale surfaces, accent, radius set, shadows, heading weight and tracking, nav treatment, button motion. Use real
   values read from the CSS, not impressions.
2. **Numbered patterns,** each with its evidence from the table. Patterns that often hold across premium sites, to
   **test** against your references rather than assume:
   1. No pure black: a tinted near-black for headings.
   2. Greys built from the brand hue.
   3. Two text colours far apart: body clearly lighter than headings.
   4. Separation by hairlines, not shadows; one tinted border colour.
   5. Large headings at modest weight with tight tracking.
   6. One accent, used sparingly; the CTA colour appears almost nowhere else.
   7. Pale brand tints instead of bordered boxes.
   8. A small radius set (3 to 4 values).
   9. A quiet nav: glass, a hairline, one CTA.
   10. Fast, exponential easing for UI; nothing bouncy.

   Keep a pattern only if at least two references show it. Drop or replace any that the references contradict.
3. **A "what we take" table** (pattern → how it applies to this brand → which token or component carries it) and a
   **"what we don't take" table** (and why: off-brand, a competitor's signature, or an accessibility problem).

## 4. Write PRODUCT.md (who and why, not how it looks)

Sections: **Register** (marketing vs product UI), **Users** (personas from the brief), **Product Purpose**, **Brand
Personality** (three words, the colour roles, and a table pointing to each `references/` folder), **Anti-references**
(what it must not look like), **Design Principles** (3 to 5), and **Accessibility & Inclusion** (WCAG level, reduced
motion, languages and markets).

Keep PRODUCT.md separate from DESIGN.md: one brand context, many visual directions.

## 5. Extend the palette

Copy `scripts/palette.mjs` and `scripts/palette.config.example.mjs` from this skill's folder into the exploration's
`scripts/` (renaming the config to `palette.config.mjs`), then replace every anchor in the config with this brand's
colours:

- **`brand` steps:** every kit colour that stays in the code scale, exactly as given.
- **`tintOf` steps:** the light tints. Keep the palest brand colour's hue and step lightness up evenly
  (`l` 0.885 → 0.935 → 0.965 → 0.984), letting chroma fall (`chroma` share 0.62 → 0.4 → 0.22 → 0.1) so the palest
  steps read as coloured white, not lavender. Adjust the numbers to the brand; they are a starting point.
- **`between` steps:** bridge any big jump between two brand colours (for example `t: 0.5` between two families that
  sit far apart in lightness).
- **`hueOf` steps:** the neutral ramp. Use the darkest brand colour's hue at very low chroma (about 0.003 at the light
  end, up to about 0.036 in the dark middle). Borrow the lightness targets from a premium reference's grey ramp.
- **Names:**
  - code names are a numeric scale (`<family>-25…950`, `neutral-0…900`), lighter numbers for lighter colours;
  - each step also carries its design-tool name in the kit's own naming style (`<family>/<official name>`);
  - new names go in a new group (`neutral (extended)/…`), so it's clear what was added.
- **`pairs`:** every foreground/background combination the page will really use, each with its minimum ratio (4.5
  for body text, 3 for large text, focus rings and control boundaries).
- **`alphaBorders`** (optional): a reference's alpha borders, to see which solid neutral each one stands in for.

Then run:

```bash
node scripts/palette.mjs scripts/palette.config.mjs          # table + contrast; exit 1 on any failure
node scripts/palette.mjs scripts/palette.config.mjs --css    # paste into tokens.css primitives
node scripts/palette.mjs scripts/palette.config.mjs --json   # for a Figma write-back
```

**A failing pair is a design decision, not a tweak.** Either pick a different step for that role, or turn it into a
rule (for example, muted text that passes on white but not on a tint gets swapped for body text inside an `.on-tint`
surface). Write the rule into tokens.css and DESIGN.md. Never nudge a brand hex to pass.

## 6. Build tokens.css (two tiers plus surfaces)

The shape is in [templates.md](templates.md):

1. **Primitives** (`--primitive-*`): raw values only. Colour comes straight from `--css`. Add font stacks, a 4px-based
   space scale, the radius set, easing curves, durations and blur. Styles never read primitives.
2. **Semantic roles,** which is what styles read:
   - **Colour:** `--color-text-{heading,body,muted,link,on-action}`,
     `--color-surface-{page,subtle,tint,media,inverse,inverse-raised,accent,glass}`,
     `--color-border-{faint,subtle,default,input,accent}`, `--color-action-primary(-hover)`, `--color-control`,
     `--color-focus-ring`. Comment each colour role with its measured ratio and any "never on X" rule. Drop roles the
     brand doesn't need and add the ones it does.
   - **Type:** families, then per role (display, h2, h3, h4, quote, stat, lead, body, small) a fluid
     `clamp()` size, leading and tracking, plus weights.
   - **Layout:** max width, gutter, section spacing, nav height.
   - **Radius roles:** control, media, panel, pill.
   - **Motion roles:** fast, base, slow, enter, reveal, plus ease and reveal distance and stagger.
3. **Surface classes:** `.on-tint`, `.on-dark`, `.on-accent`, `.on-action`. Each re-declares only the roles that change
   on that background (heading, body, muted, media fill, border, control, focus ring), with ratios commented. A band
   sets one class and every component inside follows, so no component needs a "dark" variant. Include only the
   surfaces the brand actually uses (a brand with no dark band needs no `.on-dark`).

If the project has a real token pipeline (for example a `tokens.json` that generates CSS), give the exploration the
same shape so moving it over is a copy, not a rewrite.

## 7. Write DESIGN.md (Google design.md format)

The file opens with YAML front matter: `version`, `name`, a one-line `description`, and `colors`, `typography`,
`rounded`, `spacing` and `components` holding resolved values. Then these sections, in this order:

- **Overview:** the direction in one paragraph, and what was kept from the brand versus pushed.
- **Colors:** a table mapping each code name to its design-tool name and hex (marking new steps), the semantic roles,
  and the surfaces with their rules.
- **Typography:** families, the role table, and any font-feature setting that must be repeated (a variable font with an
  `opsz` axis needs its optical size pinned, or browsers render a different size from the design tool).
- **Layout:** container, gutter, the grid per breakpoint, and band rhythm.
- **Elevation & Depth:** state what the direction does (for example "flat; hairlines and tint changes, no shadows"),
  plus any single exception.
- **Shapes:** the radius role table, with what uses each value.
- **Components and sections:** the naming convention, one bullet per component (anatomy, variants, states, sizes),
  and a section table (built from → tone).
- **Motion:** each kind (entrance, scroll reveal, interactions, reduced motion), with durations and curves.
- **Do's and Don'ts:** paired, concrete, and tied to tokens. These are the rules a later session needs most.

Optional: `npx @google/design.md lint DESIGN.md` checks broken references and contrast. It is an alpha tool.

## 8. Build the components

Naming: `<prefix>-<name>`, `<prefix>-<name>__<part>`, `<prefix>-<name>--<variant>`. Choose a short prefix from the
brand's name or initials (two letters is enough) and use it everywhere.
- A **component** sits inside a band.
- A **section** is a full-width band built from components, with one tone class.

**Every component needs:**
- **Token use only.** No raw hex, px colour or primitive in `styles.css`.
- **States:** rest, hover (inside `@media (hover: hover)` only), `:active`, `:focus-visible` (2px ring, 2 to 3px
  offset, `--color-focus-ring`), disabled (`aria-disabled`), and selected or current where relevant.
- **Responsive behaviour** written down: what stacks, what scrolls, what hides, and at which breakpoint. Check at 390,
  768, 1024, 1440 and 1512.
- **Motion** with a reason and a reduced-motion fallback: keep the fades, drop every translate, scale and loop.
- **Honest placeholders:** an image slot uses the `surface-media` fill, a small label naming the image it stands for,
  `role="img"` and an accessible name beginning "Placeholder: …".
- **Accessible names** and a correct DOM order. For a stat, the label comes first in the DOM even if the number shows
  first, so screen readers hear what the number is before they hear it.

A menu that covers a full product page. Pick what the page needs; five well-built ones beat twelve sloppy ones:

| Component | Notes |
|---|---|
| `button` | The one action colour, 48px (40px `--small`), press `scale(0.97)` at 160ms on a strong ease-out |
| `icon-button` | Round, 48px, `--color-control` fill; carousel arrows, play/pause |
| `nav` | Fixed glass, logo plus one CTA; takes `.on-dark` over dark bands |
| `section-header` | H2 plus lead, centred; `--start` aligns left |
| `media` | The image slot (see placeholders above) |
| `feature-card` | Borderless media panel, title, body |
| `feature-row` | Tint panel with copy and media; `--reverse` swaps sides |
| `icon-feature` | Icon tile, title, body |
| `proof-card` | One shell, variants per kind of proof (photo, quote, stat, recognition, list), each a surface class |
| `stat` | Value plus label, with one source line under the group |
| `accordion` | Native `details`/`summary` |
| `logo-marquee` | Cloned list (`aria-hidden`, `inert`), hover pause, a visible play/pause control (WCAG 2.2.2), static wrap under reduced motion or without JS |

## 9. Optional: write the tokens back to Figma

Load `figma:figma-use` first.
- **Primitives:** add the new steps to the kit's existing collection, in the new groups, with scopes matching the
  existing variables. Rename or change nothing that already exists.
- **Semantic roles:** a separate collection (for example `<Kit name> Semantic`) that aliases the primitives, with
  tight scopes: `TEXT_FILL` for text roles, `FRAME_FILL` + `SHAPE_FILL` for surfaces, `STROKE_COLOR` for borders.
- **Read-back:** list the collections again and confirm the counts and alias targets before reporting.

## 10. Verify (by eye, not just by script)

1. **Palette:** `palette.mjs` exits 0.
2. **Screenshots:** headless Chromium at 1512, 1440 and 390, both full page and scrolled. In a repo with Playwright,
   load it with `createRequire` from that package's `package.json`. Save the shots to the scratchpad, then **open them
   and look**.
3. **Mechanical checks:** no horizontal overflow at 390 (`scrollWidth <= innerWidth`), no console errors, focus rings
   visible on every surface, and reduced motion really stops the loops.
4. **Reviews, if those skills or agents are available:**
   - an `impeccable` critique and audit, run from the direction folder so it reads PRODUCT.md and DESIGN.md;
   - an `emil-design-eng` Before/After table for interactions;
   - `ux-reasoning` for structure;
   - an accessibility review agent.
5. **Don't report a check you didn't run.** If a check was skipped, say so.

Then save `screenshots/` for the design-direction deliverable.

## 11. Record the decisions

In the project's decision log (create `docs/HISTORY.md` if none exists), add a dated entry with each decision, why it
was made and what was rejected (for example: replacing the palette, alpha borders, kit names used as code names).
Add the sources behind each decision.

## Gotchas

- **Wireframe borders are scaffolding.** If the wireframes have 1px borders on every card, check whether the design
  should drop them for borderless media panels and tone changes between bands.
- **Pin the optical size.** A variable font with an `opsz` axis renders differently in the browser than in Figma unless
  you pin it.
- **Muted text on a tint usually fails.** Swap it for body inside `.on-tint`.
- **`border-subtle` disappears on dark bands.** Use a raised surface fill (`surface-inverse-raised`) for circles and
  badges instead of a border.
- **An accent card needs its own text colours.** A saturated mid-tone card needs its own heading and body colours
  (`.on-accent`); an avatar on it needs a fill that still contrasts.
- **Logos:**
  - size them optically (height = scale / √aspect, capped);
  - give them one tone with `grayscale(1) brightness(0.45) contrast(1.6)`, because `brightness(0)` fills the inner
    shapes;
  - log each logo's source URL in `assets/logos/SOURCE.md` and note that usage rights need confirming.
- **Scroll reveals:**
  - gate the hidden state on a class that JS sets, so nothing is hidden without JS;
  - use a softer curve than the UI's, for example 720ms ease-out-cubic, 20px, 90ms stagger;
  - never let a reveal block input.
- **Proof is the hardest part.** Before showing any number, quote or logo from the company's own site, log it with its
  URL in the source-of-truth brief. Anything unsourced stays a visible marked slot.
