#!/usr/bin/env node
// Extends a brand palette in OKLCH and checks every text/surface pair against WCAG 2.x.
// Zero dependencies. Brand hexes are anchors and are never changed; only the missing steps are generated.
//
//   node palette.mjs <config.mjs>          table + contrast report (exit 1 if a pair fails)
//   node palette.mjs <config.mjs> --css    the primitive block for tokens.css
//   node palette.mjs <config.mjs> --json   every step with its design-tool name (for a Figma write)
//
// Copy palette.config.example.mjs next to the exploration, edit it, and point this script at it.
// Step kinds in config.steps:
//   { code, name, brand: "#hex" }                          a brand-kit colour, kept exactly
//   { code, name, tintOf: "#hex", l, chroma }              keeps that hue; l = OKLCH lightness 0–1,
//                                                          chroma = share of the source's chroma (0–1)
//   { code, name, between: ["#a", "#b"], t }               interpolates two anchors in OKLCH (t 0–1)
//   { code, name, hueOf: "#hex", l, c }                    a tinted neutral: that hue, absolute chroma c
// Add `note` to any step; it shows in the report and the CSS comment.

import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const toLinear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const fromLinear = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => v / 255);
}

function rgbToHex(rgb) {
  return "#" + rgb.map((v) => Math.round(Math.min(1, Math.max(0, v)) * 255).toString(16).padStart(2, "0")).join("").toUpperCase();
}

function rgbToOklch(rgb) {
  const [r, g, b] = rgb.map(toLinear);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return { l: L, c: Math.hypot(A, B), h: ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360 };
}

function oklchToRgbRaw({ l: L, c: C, h: H }) {
  const a = C * Math.cos((H * Math.PI) / 180);
  const b = C * Math.sin((H * Math.PI) / 180);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map(fromLinear);
}

// Reduce chroma until the colour fits in sRGB (keeps lightness and hue).
function oklchToHex(lch) {
  let c = lch.c;
  for (let i = 0; i < 60; i++) {
    const rgb = oklchToRgbRaw({ ...lch, c });
    if (rgb.every((v) => v >= -0.0005 && v <= 1.0005)) return rgbToHex(rgb);
    c *= 0.97;
  }
  return rgbToHex(oklchToRgbRaw({ ...lch, c: 0 }));
}

const lerp = (a, b, t) => a + (b - a) * t;
const lerpHue = (a, b, t) => a + ((((b - a) % 360) + 540) % 360 - 180) * t;
const lch = (hex) => rgbToOklch(hexToRgb(hex));

function luminance(hex) {
  const [r, g, b] = hexToRgb(hex).map(toLinear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(fg, bg) {
  const [a, b] = [luminance(fg), luminance(bg)].sort((x, y) => y - x);
  return (a + 0.05) / (b + 0.05);
}

// The solid colour an alpha border looks like on a background (to replace alpha borders with solid ones).
function flatten(hex, alpha, bg = "#FFFFFF") {
  const f = hexToRgb(hex);
  const b = hexToRgb(bg);
  return rgbToHex(f.map((v, i) => v * alpha + b[i] * (1 - alpha)));
}

const fmt = (c) => `oklch(${(c.l * 100).toFixed(1)}% ${c.c.toFixed(3)} ${c.h.toFixed(1)})`;

// ---------- load the config ----------

const [configPath, ...flags] = process.argv.slice(2);
if (!configPath || configPath.startsWith("--")) {
  console.error("usage: node palette.mjs <config.mjs> [--css | --json]");
  process.exit(2);
}
const { default: config } = await import(pathToFileURL(resolve(configPath)).href);
const args = new Set(flags);

const steps = config.steps.map((s) => {
  let target;
  if (s.brand) return { ...s, hex: s.brand.toUpperCase(), lch: lch(s.brand), isNew: false };
  if (s.tintOf) {
    const src = lch(s.tintOf);
    target = { l: s.l, c: src.c * s.chroma, h: src.h };
  } else if (s.between) {
    const [a, b] = s.between.map(lch);
    target = { l: lerp(a.l, b.l, s.t), c: lerp(a.c, b.c, s.t), h: lerpHue(a.h, b.h, s.t) };
  } else if (s.hueOf) {
    target = { l: s.l, c: s.c, h: lch(s.hueOf).h };
  } else {
    throw new Error(`step ${s.code}: needs brand, tintOf, between or hueOf`);
  }
  const hex = oklchToHex(target);
  return { ...s, hex, lch: lch(hex), isNew: true };
});

const hex = Object.fromEntries(steps.map((s) => [s.code, s.hex]));
const prefix = config.prefix ?? "--primitive-";

// ---------- output ----------

if (args.has("--json")) {
  console.log(JSON.stringify(steps.map(({ code, name, hex, isNew, note }) => ({ code, name, hex, isNew, note })), null, 2));
  process.exit(0);
}

if (args.has("--css")) {
  const width = Math.max(...steps.map((s) => s.code.length)) + 2;
  console.log(steps.map((s) => `  ${prefix}${s.code}: ${s.hex};${" ".repeat(width - s.code.length)}/* ${s.name}${s.isNew ? " (new)" : ""}${s.note ? ` — ${s.note}` : ""} */`).join("\n"));
  process.exit(0);
}

console.log(`\n${config.title ?? "Palette"} (brand anchors fixed, new steps generated in OKLCH)\n`);
console.log("code          hex       oklch                         name");
for (const s of steps) {
  console.log(`${s.code.padEnd(13)} ${s.hex}  ${fmt(s.lch).padEnd(29)} ${s.name}${s.isNew ? "  [new]" : ""}${s.note ? `  (${s.note})` : ""}`);
}

if (config.alphaBorders?.length) {
  console.log("\nReference alpha borders flattened onto white (what solid borders stand in for)\n");
  for (const [label, base, alpha, bg] of config.alphaBorders) console.log(`${label.padEnd(32)} -> ${flatten(base, alpha, bg)}`);
}

console.log("\nContrast (WCAG 2.x): 4.5 body text, 3 large text (>=24px or >=18.66px bold) and UI boundaries\n");
let failures = 0;
for (const [label, fg, bg, min] of config.pairs ?? []) {
  if (!hex[fg] || !hex[bg]) throw new Error(`pair "${label}": unknown step ${hex[fg] ? bg : fg}`);
  const ratio = contrast(hex[fg], hex[bg]);
  const ok = ratio >= min;
  if (!ok) failures++;
  console.log(`${ok ? "pass" : "FAIL"}  ${ratio.toFixed(2).padStart(5)}:1  (min ${min})  ${label.padEnd(42)} ${fg} ${hex[fg]} on ${bg} ${hex[bg]}`);
}
console.log(failures ? `\n${failures} pair(s) below their minimum.\n` : "\nAll pairs pass.\n");
process.exit(failures ? 1 : 0);
