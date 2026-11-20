# Templates

Skeletons to copy and fill in. Everything in angle brackets, and every hex or font shown, is a placeholder: replace it
with the brand's own values. Nothing here belongs to a particular client.

## _shared/brand-original.css

```css
/* The brand kit as delivered, untouched. Source: <file or Figma link> (read YYYY-MM-DD). Never edit; extend in tokens.css. */
:root {
  /* <family name> */
  --brand-<official-name>: #RRGGBB;  /* primary */
  --brand-<official-name>: #RRGGBB;
  /* … every kit colour, kit names, kit order … */
  /* <second family name> */
  --brand-<official-name>: #RRGGBB;  /* secondary */
}
```

## references/<source>/index.md

```markdown
# <Source name>

<One paragraph: where the captures come from and when they were read. Then the recurring hexes (approximate), the type
feel, the motifs (photo style, cards, illustration, product UI), what is on the kit palette and what is invented.>

### [<source>-<what>.png](<source>-<what>.png)
<img src="<source>-<what>.png" width="500">

**What it is:** <page, viewport, date>.
**Visual assets:** <colours, components, imagery, type you can see>.
**Search words:** <5 to 8 words to find it later>
```

## research/premium-patterns.md

```markdown
# What makes the references feel premium

## Measurements

| | site A | site B | site C | site D |
|---|---|---|---|---|
| Heading text | #… | | | |
| Body text | #… | | | |
| Borders | #… @ n% | | | |
| Pale surfaces | #… | | | |
| Accent | | | | |
| Radius set | | | | |
| Shadows | | | | |
| Heading weight / tracking | | | | |
| Nav | | | | |
| Button motion | | | | |

## Patterns

1. **<Pattern>.** <Evidence with values from the table. Keep it only if two or more references show it.>
…

## What this direction takes

| Pattern | How it applies to <brand> | Carried by |
|---|---|---|

## What it doesn't take

| Pattern | Why not |
|---|---|
```

## PRODUCT.md

```markdown
# <Product> · product context

## Register
<Marketing page / product UI. Who reads it and in what mood.>

## Users
<Personas from the brief: role, what they need to see, what makes them act.>

## Product Purpose
<What the product does, in the brief's words.>

## Brand Personality
<Three words.> <Colour roles: primary, secondary, where each is used.>

| Reference folder | What it shows |
|---|---|
| references/<source>/ | … |

## Anti-references
<What it must not look like: generic gradients, a competitor's signature, a style the brand rejects…>

## Design Principles
1. …

## Accessibility & Inclusion
<WCAG level, reduced motion, markets and languages, currency.>
```

## tokens.css

```css
/* Direction NN: <Heading font> + <Body font>. Two tiers: primitives (never read by styles.css) and semantic roles.
   Primitives come from `node ../scripts/palette.mjs ../scripts/palette.config.mjs --css`; edit the config, not these lines.
   Surfaces (.on-dark, .on-tint, …) re-declare semantic roles, so components need no variants. */

:root {
  /* ── Primitives: colour (pasted from --css) ── */
  --primitive-<family>-950: #RRGGBB;      /* <family>/<official name> */
  /* … */

  /* ── Primitives: type, space, radius, motion, effects ── */
  --primitive-font-heading: "<Heading font>", ui-sans-serif, system-ui, sans-serif;
  --primitive-font-body: "<Body font>", ui-sans-serif, system-ui, sans-serif;
  --primitive-space-1: 0.25rem;  /* 4 */  /* … 2: 8, 3: 12, 4: 16, 5: 24, 6: 32, 7: 48, 8: 64, 9: 80, 10: 120 */
  --primitive-radius-sm: 4px;  --primitive-radius-md: 8px;  --primitive-radius-lg: 16px;  --primitive-radius-xl: 24px;  --primitive-radius-full: 999px;
  --primitive-ease-out: cubic-bezier(0.23, 1, 0.32, 1);
  --primitive-ease-out-soft: cubic-bezier(0.33, 1, 0.68, 1);
  --primitive-duration-fast: 160ms;  --primitive-duration-base: 200ms;  --primitive-duration-slow: 320ms;
  --primitive-duration-enter: 560ms;  --primitive-duration-reveal: 720ms;

  /* ── Semantic: colour (measured ratio on page in the comment) ── */
  --color-text-heading: var(--primitive-<family>-950);    /* <ratio>:1 */
  --color-text-body: var(--primitive-neutral-600);        /* <ratio>:1 */
  --color-text-muted: var(--primitive-neutral-500);       /* <ratio>:1; note any "never on X" rule */
  --color-text-link: var(--primitive-<family>-600);
  --color-text-on-action: var(--primitive-<family>-950);

  --color-surface-page: var(--primitive-neutral-0);
  --color-surface-subtle: var(--primitive-<family>-25);
  --color-surface-tint: var(--primitive-<family>-50);
  --color-surface-media: var(--primitive-<family>-50);    /* image slots until real images exist */
  --color-surface-inverse: var(--primitive-<family>-900);
  --color-surface-inverse-raised: var(--primitive-<family>-800);
  --color-surface-accent: var(--primitive-<family>-600);

  --color-border-faint: var(--primitive-neutral-100);
  --color-border-subtle: var(--primitive-neutral-200);
  --color-border-default: var(--primitive-neutral-300);
  --color-border-input: var(--primitive-neutral-500);     /* control boundaries need 3:1 */
  --color-border-accent: var(--primitive-<family>-200);

  --color-action-primary: var(--primitive-<action-family>-300);
  --color-action-primary-hover: var(--primitive-<action-family>-400);
  --color-control: var(--primitive-<family>-950);
  --color-focus-ring: var(--primitive-<family>-500);

  /* ── Semantic: type ── */
  --font-heading: var(--primitive-font-heading);
  --font-body: var(--primitive-font-body);
  --type-display-size: clamp(2.5rem, 1.6rem + 3vw, 4rem);  --type-display-leading: 1.08;  --type-display-tracking: -0.025em;
  --type-h2-size: clamp(2rem, 1.5rem + 1.6vw, 3rem);       --type-h2-leading: 1.12;       --type-h2-tracking: -0.02em;
  /* h3, h4, quote, stat, lead, body, small … */
  --weight-heading: 500;  --weight-body: 400;  --weight-control: 500;

  /* ── Semantic: layout, shape, motion ── */
  --layout-max: 84.5rem;
  --layout-gutter: clamp(1rem, 0.2rem + 3.6vw, 5rem);
  --space-section: clamp(4rem, 2.5rem + 5vw, 7.5rem);
  --space-control-inline: var(--primitive-space-5);
  --space-control-inline-small: var(--primitive-space-4);
  --radius-control: var(--primitive-radius-md);
  --radius-media: var(--primitive-radius-lg);
  --radius-panel: var(--primitive-radius-xl);
  --radius-pill: var(--primitive-radius-full);
  --motion-ease: var(--primitive-ease-out);
  --motion-fast: var(--primitive-duration-fast);
  --motion-reveal: var(--primitive-duration-reveal);
  --motion-reveal-ease: var(--primitive-ease-out-soft);
}

/* ── Surfaces: a band sets one class, the roles inside follow. Keep only the ones the brand uses. ── */
.on-tint   { --color-surface-media: var(--primitive-neutral-0); --color-text-muted: var(--color-text-body); }
.on-dark   { --color-text-heading: var(--primitive-neutral-0); --color-text-body: var(--primitive-<family>-200); --color-text-muted: var(--primitive-<family>-200);
             --color-surface-media: var(--color-surface-inverse-raised); --color-border-subtle: var(--primitive-<family>-800);
             --color-control: var(--primitive-neutral-0); --color-focus-ring: var(--primitive-<family>-300); }
.on-accent { --color-text-heading: var(--primitive-neutral-0); --color-text-body: var(--primitive-<family>-200); --color-text-muted: var(--primitive-<family>-200); }
.on-action { --color-text-heading: var(--primitive-<family>-950); --color-text-body: var(--primitive-<family>-900); --color-text-muted: var(--primitive-<family>-900); }

@media (prefers-reduced-motion: reduce) {
  :root { --motion-reveal-distance: 0px; }
}
```

## DESIGN.md

```markdown
---
version: alpha
name: <Brand> · Direction NN (<Heading> + <Body>)
description: <one line: palette, type, layout, the one action colour>
colors:
  primary: "#…"
  heading: "#…"
  body: "#…"
  # … every semantic role, resolved to hex
typography:
  display: { fontFamily: …, fontSize: 64px, fontWeight: 500, lineHeight: 1.08, letterSpacing: -0.025em }
  # h2, h3, h4, lead, body, small
rounded: { control: 8px, media: 16px, panel: 24px, pill: 999px }
spacing: { section: 120px, gutter: 80px, max: 1352px }
components:
  button: { background: "{colors.action}", color: "{colors.on-action}", rounded: "{rounded.control}", height: 48px }
---

# Direction NN · <Heading> + <Body>

## Overview
## Colors
### Code name → design-tool name
| Code | Name | Hex | |
|---|---|---|---|
### Semantic roles and surfaces
## Typography
## Layout
## Elevation & Depth
## Shapes
## Components and sections
### Components
### Sections
| Section | Built from | Tone |
|---|---|---|
## Motion
## Do's and Don'ts
```

## A component (CSS shape)

`xx` stands for the brand's short prefix.

```css
.xx-button {
  display: inline-flex; align-items: center; justify-content: center;
  min-height: 3rem; padding-inline: var(--space-control-inline);
  border-radius: var(--radius-control);
  background: var(--color-action-primary); color: var(--color-text-on-action);
  font: var(--weight-control) var(--type-body-size) / 1 var(--font-body);
  transition: background-color var(--motion-fast) var(--motion-ease), transform var(--motion-fast) var(--motion-ease);
}
@media (hover: hover) { .xx-button:hover { background: var(--color-action-primary-hover); } }
.xx-button:active { transform: scale(0.97); }
.xx-button:focus-visible { outline: 2px solid var(--color-focus-ring); outline-offset: 3px; }
.xx-button[aria-disabled="true"] { opacity: 0.5; pointer-events: none; }
.xx-button--small { min-height: 2.5rem; padding-inline: var(--space-control-inline-small); }
@media (prefers-reduced-motion: reduce) { .xx-button:active { transform: none; } }
```

Every value is a semantic role. When a component needs a value that has no role yet, add the role to tokens.css (here
`--space-control-inline: var(--primitive-space-5)`) rather than reading the primitive.
