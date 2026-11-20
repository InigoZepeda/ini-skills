# ini skills

Agent skills I use for design and frontend work. Install any subset with the
[`skills`](https://skills.sh) CLI — it works with Claude Code, OpenCode, Codex,
Cursor and [80+ other agents](https://github.com/vercel-labs/skills/blob/main/docs/agents.md).

## Install

```bash
# see what's in here first
npx skills add InigoZepeda/ini-skills --list

# install everything, globally, to every agent it can find
npx skills add InigoZepeda/ini-skills --all -g -y

# or pick exactly what you want, for specific agents
npx skills add InigoZepeda/ini-skills -g -y \
  -a claude-code -a opencode -a cursor -a codex \
  -s ux-reasoning -s prototype-polish -s product-ui-assets -s brand-to-design-system
```

Drop `-g` to install into the current project instead (`./.agents/skills/` +
`./.<agent>/skills/`). Requires Node **22.20+**.

## Portability across agents

`SKILL.md` is the same format everywhere (the [agent skills spec](https://agentskills.io)),
so one pack serves every tool:

- **Claude Code** → `~/.claude/skills/`
- **OpenCode** → `~/.config/opencode/skills/`
- **Cursor** → `~/.cursor/skills/`
- **Codex** (incl. ChatGPT/Codex in Orca) → `~/.agents/skills/`
- **GitHub Copilot** → `~/.copilot/skills/`

The CLI installs one canonical copy and links it into each agent, so `skills update`
keeps them all in sync. Harnesses like Orca are just running one of these agents
underneath, so global installs are what you want there.

Because it all has to run outside Claude Code, this pack keeps to the portable
subset:

- Frontmatter is **`name` + `description` only**. `allowed-tools` works in most agents,
  `context: fork` is Claude-only, and hooks don't survive the trip — so none of them
  are used here.
- No `$ARGUMENTS` substitution (Claude Code specific).
- No absolute paths or machine-local references.
- Broad `description` triggers instead of slash-command names.

## Updating and removing

```bash
npx skills update -g                 # pull the latest from this repo
npx skills list -g                   # what's installed
npx skills remove -g ux-reasoning    # remove one
```

Local edits? `npx skills check` flags skills whose files drifted from the lock.

## What's inside

| Skill | Use it when |
|---|---|
| `ux-reasoning` | A design request lands and you want the UX problem reasoned about before pixels: heuristic risks, states, edge cases, decisions you can defend. |
| `prototype-polish` | Any HTML/CSS prototype or mockup needs to stop feeling flat: motion, micro-interactions, the aesthetic layer. |
| `product-ui-assets` | A landing page needs real product-UI imagery, built as Remotion stills from reference assets. Needs the Remotion plugin, so Claude Code only in practice. |
| `brand-to-design-system` | You have a brand kit / screenshots / site and need palette → tokens → `DESIGN.md` → components. |

## Deliberately excluded

- `impeccable-v3` — third-party (Apache 2.0), pinned old version. Installed on its own,
  not redistributed here.
- `ini-design-library`, `library-capture` — hardcode a local library path that only
  exists on one machine.
- `prototype`, `pick-ui-library`, `review-animations` — `disable-model-invocation: true`,
  i.e. slash-command-only in Claude Code; useless in a shared pack.

## Layout

```
skills/<skill-name>/SKILL.md      # required: name + description frontmatter
skills/<skill-name>/...           # any extra .md, scripts/, references/
```

`skills/` is a standard discovery location, so no manifest is needed. Adding a
skill = add a folder with a `SKILL.md`, commit, done.

## License

MIT — see [LICENSE](LICENSE).
