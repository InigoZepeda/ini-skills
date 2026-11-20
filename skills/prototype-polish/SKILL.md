---
name: prototype-polish
description: Apply this skill whenever building any HTML/CSS prototype, interactive mockup, UI component, or design concept. Triggers include "make a prototype", "build this UI", "design this screen", "create an HTML mockup", "make it interactive", or any request to produce a frontend file. This skill defines the motion, interaction, and aesthetic layer that separates a flat mockup from something that feels alive. Apply it automatically — do not wait to be asked about animations or polish. Even simple prototypes benefit from these details. If a user has previously asked for "nice animations", "polished interactions", or "beautiful prototypes", always use this skill.
---

# Prototype Polish

This skill defines the motion, micro-interaction, and aesthetic standards for all HTML/CSS prototypes. Apply every section that's relevant to the component being built. The goal is prototypes that feel real — not because they're functional, but because they move and respond like production software.

The bar: someone who opens the file should feel a small moment of delight before they've clicked anything.

---

## 1. Animation Foundations

### The cubic-bezier toolkit

Never use `ease`, `ease-in-out`, or `linear` for UI elements. These are the four curves to reach for:

```css
/* Spring — for elements entering the screen or expanding */
/* The >1.0 second value overshoots, creating the elastic feel */
--ease-spring:   cubic-bezier(.34, 1.56, .64, 1);   /* bouncy, playful */
--ease-spring-sm: cubic-bezier(.34, 1.32, .64, 1);  /* subtle spring, professional */

/* Smooth out — for elements leaving or collapsing */
--ease-out-smooth: cubic-bezier(.25, 1, .5, 1);

/* Snappy in — for interactions that need to feel instant */
--ease-snap: cubic-bezier(.4, 0, .2, 1);

/* Decelerate — for dropdowns, tooltips opening */
--ease-decel: cubic-bezier(0, 0, .2, 1);
```

### Duration scale

```css
--dur-instant:  80ms;   /* hover state changes, checkbox tick */
--dur-fast:    130ms;   /* chips appearing, button state changes */
--dur-mid:     200ms;   /* modals, dropdowns, panels */
--dur-slow:    320ms;   /* page-level transitions, large reveals */
```

Rule: **faster is almost always better**. When in doubt, go shorter. A 400ms modal feels sluggish; 200ms feels snappy.

---

## 2. Element Entry Animations

Every element that appears dynamically (chips, dropdown items, modals, toasts, cards) needs an entry animation. Static appearances feel broken.

### Chip / tag entering an input

```css
@keyframes chipIn {
  from { opacity: 0; transform: scale(.82); }
  to   { opacity: 1; transform: scale(1); }
}
.chip {
  animation: chipIn 180ms cubic-bezier(.34, 1.56, .64, 1) forwards;
}
```

### Dropdown / popover opening

```css
@keyframes dropIn {
  from { opacity: 0; transform: translateY(-6px) scale(.98); }
  to   { opacity: 1; transform: translateY(0)  scale(1); }
}
.dropdown {
  animation: dropIn 150ms cubic-bezier(0, 0, .2, 1) forwards;
}
```

### Modal entering

```css
@keyframes modalIn {
  from { opacity: 0; transform: scale(.95) translateY(12px); }
  to   { opacity: 1; transform: scale(1)  translateY(0); }
}
.modal {
  animation: modalIn 220ms cubic-bezier(.34, 1.32, .64, 1) forwards;
}
```

### Toast / notification

```css
@keyframes toastIn {
  from { opacity: 0; transform: translateY(12px) scale(.96); }
  to   { opacity: 1; transform: translateY(0)    scale(1); }
}
```

### List items staggering in (for tables, card grids)

```css
.list-item { opacity: 0; animation: fadeSlideIn 200ms var(--ease-decel) forwards; }
.list-item:nth-child(1) { animation-delay:  30ms; }
.list-item:nth-child(2) { animation-delay:  60ms; }
.list-item:nth-child(3) { animation-delay:  90ms; }
.list-item:nth-child(4) { animation-delay: 120ms; }
/* cap at ~5 items, beyond that all share the last delay */

@keyframes fadeSlideIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

---

## 3. Input & Form Field Polish

Forms are the most interacted-with surface. Every state must feel intentional.

### Focus ring

Never use the default browser outline. Build a custom one:

```css
input, textarea, select {
  border: 1.5px solid var(--gray-300);
  border-radius: 8px;
  outline: none;
  transition: border-color 130ms ease, box-shadow 130ms ease;
}
input:focus {
  border-color: var(--brand-500);
  box-shadow: 0 0 0 3px rgba(var(--brand-rgb), .12);
}
input:hover:not(:focus) {
  border-color: var(--gray-400);
}
```

### Error state (animated shake)

```css
input.error {
  border-color: var(--red-500);
  animation: shake 320ms cubic-bezier(.36, .07, .19, .97) forwards;
}
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%       { transform: translateX(-5px); }
  40%       { transform: translateX(5px); }
  60%       { transform: translateX(-4px); }
  80%       { transform: translateX(3px); }
}
```

### Floating label (when relevant)

```css
.field-wrap { position: relative; }
label {
  position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
  font-size: 14px; color: var(--gray-400); pointer-events: none;
  transition: all 150ms cubic-bezier(.25, 1, .5, 1);
}
input:focus ~ label,
input:not(:placeholder-shown) ~ label {
  top: -8px; font-size: 11px; color: var(--brand-600);
  background: white; padding: 0 4px;
}
```

---

## 4. Button & Interactive Element Feedback

### Button states

```css
.btn {
  transition: background 120ms ease, transform 80ms ease,
              box-shadow 120ms ease, opacity 120ms ease;
}
.btn:hover  { filter: brightness(1.06); }
.btn:active { transform: scale(.97); }
.btn:disabled { opacity: .42; cursor: not-allowed; filter: none; }
```

### Loading state (spinner inline)

```css
.btn.loading { pointer-events: none; }
.btn.loading .btn-label { opacity: 0; }
.btn.loading::after {
  content: '';
  position: absolute;
  width: 15px; height: 15px;
  border: 2px solid rgba(255,255,255,.35);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 600ms linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
```

### Checkbox / radio custom

```css
.checkbox {
  width: 16px; height: 16px; border-radius: 4px;
  border: 2px solid var(--gray-300);
  transition: all 130ms cubic-bezier(.34, 1.4, .64, 1);
  display: flex; align-items: center; justify-content: center;
}
.checkbox.checked {
  background: var(--brand-600);
  border-color: var(--brand-600);
  /* checkmark SVG fades in */
}
.checkbox svg { opacity: 0; transform: scale(.6); transition: all 130ms cubic-bezier(.34, 1.56, .64, 1); }
.checkbox.checked svg { opacity: 1; transform: scale(1); }
```

---

## 5. Surface & Depth

### Shadows (use instead of borders where possible)

```css
--shadow-xs: 0 1px 2px rgba(0,0,0,.06);
--shadow-sm: 0 1px 4px rgba(0,0,0,.08), 0 1px 2px rgba(0,0,0,.05);
--shadow-md: 0 4px 12px rgba(0,0,0,.10), 0 2px 4px rgba(0,0,0,.06);
--shadow-lg: 0 12px 32px rgba(0,0,0,.12), 0 4px 8px rgba(0,0,0,.06);
--shadow-xl: 0 24px 64px rgba(0,0,0,.16), 0 8px 24px rgba(0,0,0,.08);
```

Modals → `--shadow-xl`. Dropdowns → `--shadow-lg`. Cards → `--shadow-sm`. Floating buttons → `--shadow-md`.

### Card hover lift

```css
.card {
  transition: box-shadow 200ms ease, transform 200ms ease;
  transform: translateY(0);
}
.card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}
```

### Backdrop blur for modals

```css
.backdrop {
  background: rgba(17, 24, 39, .48);
  backdrop-filter: blur(2px);
}
```

---

## 6. Color & State Tokens

Always define CSS custom properties at `:root`. Never hardcode hex values inside component styles.

```css
:root {
  /* brand — derive from whatever the product's green/primary is */
  --brand-600: #16A34A;
  --brand-500: #22C55E;
  --brand-100: #DCFCE7;
  --brand-50:  #F0FDF4;
  --brand-rgb: 22, 163, 74;   /* for rgba() usage */

  /* neutrals */
  --gray-900: #111827;
  --gray-700: #374151;
  --gray-500: #6B7280;
  --gray-400: #9CA3AF;
  --gray-300: #D1D5DB;
  --gray-200: #E5E7EB;
  --gray-100: #F3F4F6;
  --gray-50:  #F9FAFB;

  /* semantic */
  --color-danger:  #EF4444;
  --color-warning: #F59E0B;
  --color-success: #22C55E;
  --color-info:    #3B82F6;

  /* surfaces */
  --surface-0: #FFFFFF;
  --surface-1: #F9FAFB;
  --surface-2: #F3F4F6;
}
```

---

## 7. Typography Rhythm

```css
/* import DM Sans — the Sense system font */
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');

body { font-family: 'DM Sans', sans-serif; }

/* scale */
.text-xs   { font-size: 11px; line-height: 1.4; }
.text-sm   { font-size: 12.5px; line-height: 1.5; }
.text-base { font-size: 14px; line-height: 1.55; }
.text-md   { font-size: 15.5px; line-height: 1.45; }
.text-lg   { font-size: 17px; line-height: 1.35; font-weight: 600; }
.text-xl   { font-size: 22px; line-height: 1.25; font-weight: 600; }
```

Labels above fields: `font-size: 12px; font-weight: 600; color: var(--gray-700)`.
Section headers: `font-size: 10.5px; font-weight: 600; letter-spacing: .07em; text-transform: uppercase; color: var(--gray-500)`.
Helper / hint text: `font-size: 12px; color: var(--gray-400)`.

---

## 8. Scrollbar Styling

Always override the default scrollbar in prototypes:

```css
::-webkit-scrollbar { width: 4px; height: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--gray-200); border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: var(--gray-300); }
```

---

## 9. Success / Empty / Error States

Every prototype must handle at least the success state. Skeletons and errors are bonus.

### Success flash

```css
@keyframes successPop {
  0%   { transform: scale(.7);  opacity: 0; }
  60%  { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1);   opacity: 1; }
}
.success-icon { animation: successPop 300ms cubic-bezier(.34, 1.56, .64, 1) forwards; }
```

### Empty state

Center in the container. Icon at 32–40px, muted color (opacity .3). Short label, optional CTA.

### Skeleton loader

```css
@keyframes shimmer {
  from { background-position: -400px 0; }
  to   { background-position:  400px 0; }
}
.skeleton {
  background: linear-gradient(90deg, var(--gray-100) 25%, var(--gray-200) 50%, var(--gray-100) 75%);
  background-size: 800px 100%;
  animation: shimmer 1.4s infinite linear;
  border-radius: 6px;
}
```

---

## 10. Interaction Checklist

Before considering a prototype done, verify:

- [ ] Modal / sheet has an entry animation
- [ ] All dynamically added elements (chips, rows, cards) animate in
- [ ] Inputs have custom focus ring (not browser default)
- [ ] Hover states on all clickable elements (not just cursor:pointer)
- [ ] Buttons have `:active` scale feedback
- [ ] Dropdowns / popovers animate open
- [ ] Disabled states look intentionally disabled (not just grey)
- [ ] Scrollbars are styled
- [ ] At least one "success" or confirmation state exists
- [ ] No hardcoded hex values — everything through CSS variables

---

## 11. Quick-Reference: Common Patterns

### Tag input (like Gmail To: field)
- Box with `min-height`, `flex-wrap`, `gap`
- Chips inside with `chipIn` animation
- Ghost `<input>` floats at end, no border
- Dropdown attached below with `dropIn` animation
- `onblur` → close with delay to allow item clicks via `mousedown` + `preventDefault`

### Role / option card (select-one)
- Full-width card, `border: 1.5px solid`, rounded
- Selected: border changes to brand color + light brand background tint
- Custom radio dot in top-right corner
- Transition on `border-color` and `background`, 140ms

### Stepper
- Circles: 22px, filled when active/complete, brand color
- Checkmark SVG replaces number when step is complete
- Connector line transitions to brand color when step passes
- Step labels: 12px, `font-weight: 500`

### Data table rows
- Hover: `background: var(--gray-50)` with `transition: background 90ms`
- No heavy borders — use `border-bottom: 1px solid var(--gray-100)` only
- Action buttons (⋯) visible on row hover only: `opacity: 0` → `opacity: 1` on `.row:hover .action-btn`

### Toast / notification
- Fixed position, bottom-right or bottom-center
- `toastIn` animation, auto-dismiss after 3–4s
- Pill shape, `border-radius: 999px`, subtle shadow
