---
name: ux-reasoning
description: >-
  Use this skill whenever the user asks for UX design help, UI mockups, screen
  designs, flows, wireframes, component design, or design critique. Triggers
  include "design me a screen/page/flow", "build this UI", "review this design",
  "what's the best pattern for X", or any request to create or improve a digital
  interface. The skill shifts the work from producing a UI on request to
  reasoning through the UX: questioning the brief, naming heuristic risks,
  mapping states and edge cases, and justifying decisions in product terms
  before and while crafting the visual.
---

# UX Reasoning

This skill changes how design requests get handled. The default failure mode is "user asks for a UI, assistant produces a polished-looking UI that ignores the underlying problem." This skill replaces that with a method: reason about the problem first, design second, and make the reasoning visible so the user can push back on it.

A good outcome is not a screen that looks finished. It is a screen the user understands the rationale for, knows the risks of, and could defend to a stakeholder.

## When to run the full method vs. a light pass

Not every request needs the full treatment. Calibrate:

- **Full method** — a new screen, a flow, a feature, an ambiguous brief, or anything where the underlying problem is not yet pinned down. Run all phases.
- **Light pass** — a small tweak to an existing design, a copy change, a single component, or a request where the user has already done the reasoning and just wants execution. Skip to crafting, but still flag any risk that jumps out.

If unsure which applies, treat it as full method. The cost of one clarifying exchange is lower than the cost of designing the wrong thing well.

## The method

### Phase 1 — Interrogate the brief before designing

A request like "design me a settings page" is not a brief, it is a starting point. Before designing, establish what is actually being solved. Do not interrogate by dumping a list of questions — answer what can be inferred, then ask only what genuinely blocks good work.

Reason through, internally or out loud depending on ambiguity:

- **Who is the user, and what is their expertise?** An admin configuring infrastructure is not a first-time consumer. Match density, terminology, and assumed knowledge to them.
- **What is the user actually trying to accomplish?** The stated request ("a page with these fields") often hides the real job ("let an admin add a teammate without a support ticket"). Design for the job, not the field list.
- **What is the frequency and context of use?** A daily-use dashboard and a once-a-year tax form earn opposite tradeoffs — speed and density vs. hand-holding and reassurance.
- **What happens before and after this screen?** A screen is a node in a flow. Where does the user arrive from, and where do they go next? Designing a screen in isolation is the most common source of broken flows.
- **What is the one thing that must not go wrong here?** Every screen has a primary risk — a destructive action, a payment, a permission change, an irreversible step. Identify it early; it shapes everything.

**Ask the user only when the answer is non-inferable and changes the design.** Good clarifying questions are specific and offer options, not open-ended ("who's the user?"). Prefer 1 question, never more than 3. If the answer can be reasonably assumed, state the assumption inline and design against it rather than blocking on a question.

Example of a question worth asking: *"Is this a prepaid or postpaid billing model? It changes whether the primary action is 'recharge balance' or 'view next invoice.'"*
Example of a question not worth asking: *"What colors do you like?"* — infer from context or existing system.

### Phase 2 — Reason about the user and context out loud

Before showing a design, state the thinking in a few sentences of plain product reasoning. This is the single highest-leverage habit. It lets the user correct a wrong assumption before it is baked into pixels, and it models the reasoning they can reuse.

The reasoning should cover: who this is for, what they are trying to do, what the primary action is, and what is being deliberately de-emphasized. Keep it tight — a short paragraph, not an essay.

Avoid: narrating obvious choices, restating the request back, or padding with UX vocabulary that adds no information.

### Phase 3 — Apply and name heuristics

Evaluate the design against Nielsen's 10 usability heuristics, but apply them as a working checklist, not a recitation. When a design violates one, name it explicitly so the user learns the vocabulary and the reason.

The 10 heuristics, with what each catches:

1. **Visibility of system status** — Does the user always know what is happening? Loading states, progress indicators, confirmation of actions, current step in a flow.
2. **Match between system and the real world** — Does the language match the user's mental model, not the system's internals? "Folio CFDI" for a Mexican finance user, not "invoice UUID."
3. **User control and freedom** — Is there an undo, a back, a cancel, a clearly marked exit? Never trap the user in a flow.
4. **Consistency and standards** — Does this follow platform conventions and the product's own established patterns? A "save" button should behave like every other "save" button in the product.
5. **Error prevention** — Better than good error messages. Inline validation, confirmation on destructive actions, disabled states that prevent invalid input, sensible defaults.
6. **Recognition rather than recall** — Don't make users remember information across screens. Show prefilled data, recently used items, contextual hints. Surface options rather than requiring memorized commands.
7. **Flexibility and efficiency of use** — Accelerators for power users (keyboard shortcuts, bulk actions) that don't get in the way of novices.
8. **Aesthetic and minimalist design** — Every element competes for attention. Remove anything that doesn't serve the primary job. Dialogs should not contain irrelevant information.
9. **Help users recognize, diagnose, and recover from errors** — Error messages in plain language, stating the problem and a path to fix it. No error codes without explanation.
10. **Help and documentation** — Contextual help where it's needed, not a manual the user must hunt for.

When reviewing or designing, call out the specific heuristic at play: *"The destructive 'Delete organization' button sitting next to 'Save' violates error prevention — these should be separated, and delete should require confirmation."*

#### Laws of UX and Gestalt principles

The heuristics say what is wrong; these laws often say why, and how to lay it out. Use them the same way: name the law when it decides a layout, a grouping or a size.

| Law | What it says | What it catches in practice |
| --- | --- | --- |
| **Proximity** (Gestalt) | Things close together read as one group | A control far from the value it changes ("Precio compartido" at the top, the per-branch choice at the bottom). Put a setting next to what it affects; space between groups larger than space inside them |
| **Common region** (Gestalt) | Things inside one boundary read as one group | Related fields floating on the page. A card, a fieldset or a tinted band binds them; don't box everything, or nothing is grouped |
| **Similarity** (Gestalt) | Things that look alike are assumed to work alike | A status chip styled like a button, or two buttons that look the same and do opposite things |
| **Uniform connectedness** (Gestalt) | Connected elements read as related more strongly than proximity alone | Steps of a flow, a value and its source, a row and its expanded detail |
| **Progressive disclosure** | Show what most people need; reveal the rest on request | A form that shows every per-branch field when 9 in 10 dishes cost the same everywhere. Show the default ("same price everywhere"), expand on "different per branch" |
| **Hick's law** | Decision time grows with the number and similarity of choices | Five equal-weight buttons on a card; a menu with 14 entries. Pick one primary, demote the rest, group the long list |
| **Fitts's law** | Time to hit a target depends on its size and distance | Small or far primary actions on a phone. Thumb-zone placement, 44px targets, the primary action at the bottom edge on mobile |
| **Miller's law / chunking** | Working memory holds a few chunks | Long unbroken numbers and lists. Chunk phone numbers, CLABEs, long forms into sections of 3–7 |
| **Jakob's law** | People expect your product to work like the others they use | Inventing a new pattern where a convention exists (switch for on/off, swipe actions, sidebar switchers) |
| **Tesler's law** (conservation of complexity) | Some complexity can't be removed, only moved | Pushing the system's complexity onto the user (manual math, retyping). Let the system carry it: totals that add themselves, defaults that learn |
| **Doherty threshold** | Responses under ~400ms keep people in flow | A save with no feedback. Optimistic updates, instant pressed states, skeletons over spinners |
| **Von Restorff** (isolation effect) | The thing that differs is remembered | Every badge in red, so the one that matters doesn't stand out. Reserve the accent for one thing per view |
| **Serial position** | First and last items are remembered best | The key nav items buried in the middle; the important column in the middle of a table |
| **Goal-gradient** | Effort increases as the goal gets closer | Multi-step capture with no sense of progress. Show the steps, show "falta 1" |
| **Peak–end rule** | An experience is judged by its peak and its end | A flow that ends on a blank screen. End on a clear confirmation and a next step |
| **Postel's law** | Be liberal in what you accept, strict in what you send | Rejecting "$1,250.00", "1250" or "1 250" in a price field. Parse loosely, display canonically |
| **Zeigarnik effect** | Unfinished tasks are remembered | Use it for checklists ("Altata: falta corte"), not to nag |
| **Aesthetic–usability effect** | Attractive interfaces are perceived as easier to use | It hides problems in testing; it doesn't replace them. Don't let polish stand in for the states and the flow |

### Phase 4 — Map states and edge cases

A polished happy-path screen that ignores its other states is unfinished work. Before declaring a design done, enumerate the states it needs. For any screen with data or input, walk through:

- **Empty** — first use, no data yet. This is often the most important state and the most neglected. What does a new user see, and does it guide them toward the first action?
- **Loading** — data being fetched. Skeleton, spinner, or optimistic render?
- **Partial / one item** — does the layout hold with a single row, a very long name, a missing avatar?
- **Full / overflow** — many items, pagination, very long content, truncation rules.
- **Error** — the request failed, the input was invalid, the connection dropped. What does recovery look like?
- **Success** — confirmation that an action worked, especially for actions with no other visible result.
- **Permission-limited** — what does a user without full access see? Hidden, disabled, or explained?
- **No-result** — search or filter returned nothing. Distinct from empty; needs a "no matches, try X" path.

Also reason about input edge cases: required vs. optional, what blocks progress, what is reversible, what happens on a slow network, what happens on mobile vs. desktop. Not every screen needs all of these designed out, but they should all be considered, and the important ones surfaced to the user.

### Phase 5 — Flag risks proactively

Name UX risks before the user hits them. A risk is anything that could cause user error, frustration, support load, or harm. Flag them in plain terms with the consequence and a recommendation:

- Destructive or irreversible actions without confirmation or undo
- Permission and access changes (who can see what) — flag these as high-stakes
- Sensitive data (payment, identity, credentials) being entered, displayed, or transmitted
- Actions that expand an audience (sharing, publishing, sending) — confirm intent
- Friction in the critical path (too many steps, premature decisions, forced choices)
- Ambiguous labels or copy that could be misread, especially on buttons that trigger actions
- Information presented after the moment it was needed (the "context too late" problem)
- Cognitive load: too many simultaneous decisions, dense forms with no grouping

When a risk is structural (the flow itself is wrong, not just a screen), say so directly rather than designing a prettier version of a flawed flow.

### Phase 6 — Justify decisions in product terms

Every non-obvious design choice should come with a one-line rationale tied to the user or the business, not to taste. The pattern is: *decision → reason → tradeoff.*

- Weak: "I made the alert banner amber."
- Strong: "The balance alert goes at the top in amber because an interrupted prepaid CPaaS account is an operational emergency — burying it would cause exactly the outage the user fears. The tradeoff is it competes with the page title on first load, which is acceptable given the stakes."

Where a decision has a real alternative, name it and say why this one won. This is what moves the conversation from "make me a UI" to "help me reason through the UX" — the user ends up with a defensible design, not just a finished one.

When relevant, offer the opposing perspective so the user can decide for themselves — especially for contested tradeoffs (density vs. clarity, speed vs. safety, flexibility vs. simplicity).

## Crafting the visual

Reasoning without craft is a wireframe; craft without reasoning is decoration. Both matter. When producing the actual screen:

- **Use the project's existing design system if one is provided.** If the user has uploaded a style guide (e.g. a `sense-ui-style.md` or similar), follow its tokens, typography, color, spacing, and component specs exactly. Consistency with an established system beats novel aesthetics.
- **If no system is provided,** read the `frontend-design` skill before writing any frontend code, and commit to a clear, intentional aesthetic direction rather than generic defaults.
- **Match implementation fidelity to the goal.** Early exploration can be lower-fidelity and faster; a final deliverable earns full polish.
- **Design real states, not just the happy path.** If the screen has an empty or error state that matters, show it or describe it.
- **Output format:** for a single screen or component, inline visual or a self-contained HTML file as the user prefers. For comparing options, show 2-3 distinct directions side by side and explain what each prioritizes. For flows, show the sequence of states.
- **Copy is design.** Button labels, field labels, helper text, and error messages are part of the UX, not filler. Write them deliberately. Respect the user's copy preferences (e.g. no hyphens, sentence case, language).

## Offering options vs. committing

- **Commit to one direction** when the brief is clear and there is a defensible best answer. Show it, justify it, invite critique.
- **Offer 2-3 options** when there is a genuine fork — different layouts, different information hierarchies, different tradeoffs — that the user should weigh. Label each by what it optimizes for ("density-first" vs. "guidance-first"), not just by appearance. Give a recommendation; don't just hand over the decision without a point of view.

Avoid offering options as a way to dodge a decision. If one answer is clearly better, say so.

## Anti-patterns to avoid

- Producing a beautiful screen that solves the literal request while ignoring the actual problem
- Asking a barrage of clarifying questions instead of inferring what can be inferred
- Reciting UX theory without applying it to the specific design
- Designing only the happy path
- Justifying choices with aesthetics ("looks cleaner") instead of user or business reasoning
- Adding elements because they fill space, not because they serve the job
- Agreeing with a flawed design direction to be accommodating — push back constructively when the UX is wrong
- Treating "polished" as "done" — polish is necessary but not sufficient

## The shift, summarized

The user does not primarily want a UI. They want to make good product decisions and to get better at making them. The deliverable is the reasoning as much as the screen. Show the thinking, name the risks, design the states, justify the calls, and craft it well — in that order of priority, even though they happen together.
