---
name: ini-design-library
description: Search Iñigo's local website inspiration library (screenshots, motion recordings, raw code, style/pattern analysis, SEO/security/privacy facts) for references while designing or building pages in any project. Use when the user asks for inspiration, references, examples of a pattern/hero/section/interaction/motion, or says "check the design library" / "ini design library".
---

# ini design library (global)

Library root: `${INI_DESIGN_LIBRARY:-$HOME/Documents/Personal Work/Personal Projects/ini-design-library}`

```bash
LIBRARY_ROOT="${INI_DESIGN_LIBRARY:-$HOME/Documents/Personal Work/Personal Projects/ini-design-library}"
[ -d "$LIBRARY_ROOT" ] || { echo "ini design library not found at $LIBRARY_ROOT. Set INI_DESIGN_LIBRARY to its path."; exit 1; }
```

Everything below that says `<root>` means `$LIBRARY_ROOT`.

## Search

1. Read `<root>/library/index.json`: one row per captured page (pageType, industry, style, patterns, motion, hero, colorMode, saturation, stack, tags, summary).
2. Map the request to tag terms from `<root>/docs/taxonomy.md`, and also match free text in `summary`/`hero`.
3. For candidates, read `<root>/library/sites/<slug>/analysis.json` (`sections`, `interactions`, `motion.highlights`) to confirm the match and locate it.
4. View the relevant screenshots before recommending (the `slice` path in analysis.json, usually `desktop/sections/NN.jpg`; `desktop/hero.png`, `motion/desktop-sheet-NN.jpg`).
5. SEO, security, cookie, stack and performance facts are in `capture.json`. Read only the block you need.
6. Code questions: grep `raw/` (see `raw/manifest.json`). Never read raw files whole or scan raw/ to search.

Answer with: the match, why it fits, where (section + slice path + video timestamp), the link `http://localhost:3000/sites/<slug>#<section>` (requires `npm run dev` in the root), and what pattern to take. Describe patterns. Don't copy designs.

## Add a site

Use the `library-capture` skill for the whole flow, and `library-analyze` for the analysis step. Both need the library repo on disk: captures run inside it, so `cd "$LIBRARY_ROOT" && npm run capture -- <url>`, write `analysis.json`, then `npm run index`.

If file access to the root is denied, ask the user to add it to `permissions.additionalDirectories` or run `/add-dir "<root>"`.
