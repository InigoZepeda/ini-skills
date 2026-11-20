# ini-skills

The design toolkit for your coding agent. Think it through with `ux-reasoning`, finish it with `prototype-polish`, ship imagery with `product-ui-assets`, and turn a brand into a system with `brand-to-design-system`.

From your project root:

```bash
npx ini-skills install
```

Reload your coding tool, then just describe the work — "design me the checkout flow", "make this prototype feel alive", "build tokens from these screenshots".

Works with Claude Code, Cursor, Codex CLI, GitHub Copilot, OpenCode, Gemini CLI, Windsurf, Cline, Amp, Zed, Warp, and every other agent the [`skills`](https://skills.sh) CLI supports.

| Without ini-skills | With ini-skills |
|---|---|
| A design request becomes a screen, and the states, edge cases and heuristic risks show up in review — or in production. | `ux-reasoning` names the risks and maps the states before any pixels exist, and hands you a rationale you can defend. |
| Prototypes look finished but feel dead: no press states, no easing, nothing moves. | `prototype-polish` defines the motion, micro-interaction and aesthetic layer, applied automatically to any mockup. |
| "Can you mock up how the product looks?" ends with screenshot collages or stock art. | `product-ui-assets` renders real product UI as code, on-token and re-renderable when the theme changes. |
| Every project starts its palette, type scale and components from zero. | `brand-to-design-system` goes brand → palette → tokens → `DESIGN.md` → components, the same way each time. |

## Why

Ask an agent for a screen and you get the tasteful default: centered hero, three feature cards, generous padding, no thought about what happens when the list is empty. Ask for a polished prototype and you get flat rectangles. Ask for product screenshots and you get something that isn't your product.

These four skills are the vocabulary for the parts that decision-by-decision get skipped:

- **Reasoning before pixels.** `ux-reasoning` questions the brief, names the heuristic risks, maps states and edge cases, and makes the trade-offs visible so you can push back.
- **Motion that reads as production.** `prototype-polish` covers enter/exit, press and hover feedback, easing and duration — the difference between a mockup and something that feels alive.
- **Imagery that is actually your product.** `product-ui-assets` builds visuals as React components rendered to PNG, so the text is exact, the numbers reconcile and everything re-renders on-token.
- **A system, not a one-off.** `brand-to-design-system` turns a brand kit, screenshots or a live site into a two-tier token set and a small component library.

## What's inside

| Skill | Use it when |
|---|---|
| **`ux-reasoning`** | A design request lands. It reasons about the problem first: brief, heuristic risks, states, edge cases, decisions in product terms. |
| **`prototype-polish`** | Any HTML/CSS prototype, mockup or component needs motion, micro-interactions and the aesthetic layer. |
| **`product-ui-assets`** | A landing page needs hero visuals, feature-card images or "how it works" fragments built from reference assets. |
| **`brand-to-design-system`** | You have a brand and need palette, tokens, `DESIGN.md` and components. Brand-agnostic, client-ready. |

Each skill is a plain `SKILL.md` with progressive disclosure files next to it (`templates.md`, `scripts/`, `references/`), loaded only when the task needs them.

## How it works

Skills load by description, not by command. You don't invoke anything: describe the work and the matching skill is read into context.

```
design the onboarding flow for a B2B billing app
make this pricing page feel expensive
turn these brand screenshots into a token set
build three feature-card images for the landing page
```

Narrow targets get better results: one screen reasoned about closely beats a whole app at a glance. If you want to force one, name it — "use ux-reasoning on this checkout".

## Installation

```bash
npx ini-skills install
```

The installer detects your coding tools, asks whether to install for this project or globally, and links all four skills into each one. Reload your tool afterward. `npx ini-skills update` refreshes an existing install.

For scripts, pass flags straight through:

```bash
npx ini-skills install -g -a claude-code cursor codex -y
```

<details>
<summary><b>Install only some skills or agents</b></summary>

```bash
npx ini-skills install --list                                  # see the pack
npx ini-skills install -s ux-reasoning -s prototype-polish     # two of the four
npx ini-skills install -a opencode -y                          # one agent
```

The wrapper passes every option to `skills add`, so `--skill`, `--agent`, `--global`, `--copy`, `--rename` and `--yes` all work.
</details>

<details>
<summary><b>Install without this package</b></summary>

The installer is a thin wrapper around the ecosystem CLI. Same result:

```bash
npx skills add InigoZepeda/ini-skills
```

Before the npm package exists, use the repo directly:

```bash
npx github:InigoZepeda/ini-skills install
```
</details>

<details>
<summary><b>Pin a version for a team</b></summary>

```bash
npx ini-skills@1.0.0 install          # pin the wrapper
npx skills add InigoZepeda/ini-skills@v1.0.0
```

Project installs write `skills-lock.json` with a content hash per skill; commit it so the whole team gets the same files. `npx skills check` flags skills whose files drifted.
</details>

<details>
<summary><b>Manual copy, no Node required</b></summary>

Copy the `skills/` folder from this repo into the right place. Global folders:

| Tool | Global skills folder |
|---|---|
| Claude Code | `~/.claude/skills/` |
| OpenCode | `~/.config/opencode/skills/` |
| Codex CLI | `~/.agents/skills/` |
| Cursor | `~/.cursor/skills/` |
| GitHub Copilot | `~/.copilot/skills/` |
| Gemini CLI | `~/.gemini/skills/` |

For example:

```bash
mkdir -p ~/.claude/skills
cp -r skills/ux-reasoning skills/prototype-polish \
      skills/product-ui-assets skills/brand-to-design-system \
      ~/.claude/skills/
```

A manual copy won't appear in `skills list`, so `update` and `check` won't manage it.
</details>

Node 22.20+ is required — that is the floor for the `skills` CLI this wraps.

## What gets installed

One canonical copy lands in `~/.agents/skills/` (project installs: `./.agents/skills/`) and each agent gets a link to it, so an update happens once:

| Tool | Linked path (global) |
|---|---|
| Claude Code | `~/.claude/skills/<skill>` |
| OpenCode | `~/.config/opencode/skills/<skill>` |
| Cursor | `~/.cursor/skills/<skill>` |
| Codex, Copilot, Gemini, Windsurf, Cline, Amp, Zed | `~/.agents/skills/<skill>` |

Nothing runs at load time beyond reading `SKILL.md`. No hooks, no MCP server, no binary, no commands.

## Good to know

**Project or global.** Project installs (`./.agents/skills/`) only apply inside that repo and belong in version control. Global installs apply everywhere, which is what you want for harnesses that switch working directories, like Orca.

**What travels, what doesn't.** These skills are portable by design: `name` + `description` frontmatter only, no `$ARGUMENTS`, no absolute paths, no Claude-only fields. `product-ui-assets` is the exception — it renders with Remotion, so it needs the Remotion plugin, which in practice means Claude Code.

**Telemetry.** The `skills` CLI records anonymous install events. Opt out with `DISABLE_TELEMETRY=1` or `DO_NOT_TRACK=1`.

**Not in the pack.** `impeccable-v3` is third-party (Apache 2.0) and pinned separately. `ini-design-library` and `library-capture` hardcode a local library path, and `prototype` / `pick-ui-library` / `review-animations` are slash-command-only — none of them belong in a shared install.

**Something broken?** `npx ini-skills list` shows what is installed and whether files drifted. `npx ini-skills install --list` shows what the pack contains.

## Community

- [Issues](https://github.com/InigoZepeda/ini-skills/issues) for bugs, questions and ideas.
- [skills.sh](https://skills.sh) for the installer and the wider ecosystem.
- [agentskills.io](https://agentskills.io) for the `SKILL.md` format.

## License

MIT. See [LICENSE](LICENSE).

---

Created by [Iñigo Zepeda](https://github.com/InigoZepeda)
