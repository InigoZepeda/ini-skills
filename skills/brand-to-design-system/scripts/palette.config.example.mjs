// Template for a brand palette extension. Copy this file to palette.config.mjs, replace EVERY anchor below with the
// brand's own kit colours (the hexes here are placeholders, not any real brand), rename the families to match the kit,
// and keep the shape. Brand steps are exact kit colours; everything else is generated.
//
// How the numbers are chosen (starting points, adjust per brand):
// - Light tints keep the palest brand colour's hue and step lightness up evenly; chroma falls toward white so the
//   palest steps read as coloured white, not as a pastel.
// - The neutral ramp uses the darkest brand colour's hue at very low chroma (<= about 0.036), with lightness targets
//   borrowed from a premium reference's grey ramp.
// - Pairs list only the combinations the page really uses. A pair that fails becomes a rule in tokens.css, never a
//   change to a brand hex.
// - Delete step groups the brand does not need (for example, a brand that already ships light tints needs no `tintOf`
//   steps) and add groups for any extra family.

const PALEST = "#9DBBF2"; // palest brand colour of the main family (placeholder)
const MID = "#2F6BDB"; // the next brand colour up, used to bridge a gap (placeholder)
const DARKEST = "#0B1530"; // darkest brand colour, lends its hue to the neutrals (placeholder)

export default {
  title: "Brand palette",
  prefix: "--primitive-",
  steps: [
    // Main family: kit colours exactly as given, darkest to lightest, then generated light tints.
    { code: "primary-950", name: "<family>/<official name>", brand: DARKEST, note: "headings" },
    { code: "primary-900", name: "<family>/<official name>", brand: "#12255C", note: "brand primary" },
    { code: "primary-700", name: "<family>/<official name>", brand: "#1D43A8" },
    { code: "primary-500", name: "<family>/<official name>", brand: MID },
    { code: "primary-400", name: "<family>/<new name>", between: [MID, PALEST], t: 0.5, note: "bridges the gap" },
    { code: "primary-300", name: "<family>/<official name>", brand: PALEST },
    { code: "primary-200", name: "<family>/<new name>", tintOf: PALEST, l: 0.885, chroma: 0.62 },
    { code: "primary-100", name: "<family>/<new name>", tintOf: PALEST, l: 0.935, chroma: 0.4 },
    { code: "primary-50", name: "<family>/<new name>", tintOf: PALEST, l: 0.965, chroma: 0.22 },
    { code: "primary-25", name: "<family>/<new name>", tintOf: PALEST, l: 0.984, chroma: 0.1 },

    // Neutral ramp: white from the kit, the rest generated from the darkest brand hue.
    { code: "neutral-0", name: "neutral/white", brand: "#FFFFFF" },
    { code: "neutral-25", name: "neutral (extended)/<new name>", hueOf: DARKEST, l: 0.988, c: 0.003 },
    { code: "neutral-50", name: "neutral (extended)/<new name>", hueOf: DARKEST, l: 0.975, c: 0.005 },
    { code: "neutral-100", name: "neutral (extended)/<new name>", hueOf: DARKEST, l: 0.952, c: 0.008 },
    { code: "neutral-200", name: "neutral (extended)/<new name>", hueOf: DARKEST, l: 0.918, c: 0.011, note: "border subtle" },
    { code: "neutral-300", name: "neutral (extended)/<new name>", hueOf: DARKEST, l: 0.866, c: 0.016, note: "border default" },
    { code: "neutral-400", name: "neutral (extended)/<new name>", hueOf: DARKEST, l: 0.72, c: 0.022 },
    { code: "neutral-500", name: "neutral (extended)/<new name>", hueOf: DARKEST, l: 0.545, c: 0.03, note: "text muted" },
    { code: "neutral-600", name: "neutral (extended)/<new name>", hueOf: DARKEST, l: 0.45, c: 0.034, note: "text body" },
    { code: "neutral-700", name: "neutral (extended)/<new name>", hueOf: DARKEST, l: 0.37, c: 0.036 },
    { code: "neutral-800", name: "neutral (extended)/<new name>", hueOf: DARKEST, l: 0.28, c: 0.034 },
    { code: "neutral-900", name: "neutral (extended)/<new name>", hueOf: DARKEST, l: 0.215, c: 0.03 },

    // Action / secondary family: the colour the live site really uses for its CTA, plus a hover step.
    { code: "action-400", name: "<secondary family>/<official name>", brand: "#FFB347", note: "CTA" },
    { code: "action-500", name: "<secondary family>/<official name>", brand: "#F59E2E", note: "CTA hover" },
  ],

  // Optional: a reference site's alpha borders, to see which solid neutral stands in for each.
  // [label, base hex, alpha 0 to 1]
  alphaBorders: [
    ["reference A border @13%", "#17273E", 0.13],
    ["reference B border @20%", "#142341", 0.2],
  ],

  // [label, foreground step, background step, minimum ratio]
  pairs: [
    ["text-heading on page", "primary-950", "neutral-0", 4.5],
    ["text-heading on surface-tint", "primary-950", "primary-50", 4.5],
    ["text-body on page", "neutral-600", "neutral-0", 4.5],
    ["text-body on surface-tint", "neutral-600", "primary-50", 4.5],
    ["text-muted on page", "neutral-500", "neutral-0", 4.5],
    ["text-link on page", "primary-500", "neutral-0", 4.5],
    ["text-on-action on action", "primary-950", "action-400", 4.5],
    ["text-on-action on action-hover", "primary-950", "action-500", 4.5],
    ["text-on-dark on surface-inverse", "neutral-0", "primary-900", 4.5],
    ["text-on-dark-muted on surface-inverse", "primary-200", "primary-900", 4.5],
    ["focus-ring on page", "primary-500", "neutral-0", 3],
    ["focus-ring-on-dark on surface-inverse", "primary-300", "primary-900", 3],
    ["border-input on page (control boundary)", "neutral-500", "neutral-0", 3],
  ],
};
