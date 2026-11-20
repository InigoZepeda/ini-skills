#!/usr/bin/env node
/**
 * npx ini-skills install
 *
 * Thin wrapper around the `skills` CLI (https://skills.sh) that pins this pack,
 * so the install command is one line instead of an owner/repo path.
 */
const { spawnSync } = require("node:child_process");
const path = require("node:path");
const pkg = require(path.join(__dirname, "..", "package.json"));

const REPO = "InigoZepeda/ini-skills";
const SKILLS_CLI = "skills@latest";

const HELP = `
  ini-skills — design skills for your coding agent

  Usage
    npx ini-skills install            Install the skills into your agents
    npx ini-skills list              Show what is installed
    npx ini-skills update            Pull the latest from ${REPO}

  Options after "install" are passed to the skills CLI
    --global, -g                     Install for every project
    --agent, -a <names...>           Only these agents (claude-code, cursor, codex, …)
    --skill, -s <names...>           Only these skills
    --yes, -y                       No prompts
    --list                          Show the skills in the pack without installing
    --copy                          Copy files instead of symlinking

  Examples
    npx ini-skills install
    npx ini-skills install -g -a claude-code cursor codex -y
    npx ini-skills install --list

  Docs: https://github.com/${REPO}
`;

function run(argv) {
  const npx = process.platform === "win32" ? "npx.cmd" : "npx";
  const result = spawnSync(npx, ["-y", SKILLS_CLI, ...argv], {
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  if (result.error) {
    console.error(`\n  Could not run npx: ${result.error.message}`);
    console.error("  ini-skills needs Node.js 22.20 or later: https://nodejs.org\n");
    process.exit(1);
  }
  process.exit(result.status === null ? 1 : result.status);
}

const [command, ...rest] = process.argv.slice(2);

switch (command) {
  case "install":
  case "add":
  case "i":
    console.log(`\n  ini-skills ${pkg.version} → ${REPO}\n`);
    run(["add", REPO, ...rest]);
    break;
  case "list":
  case "ls":
    run(["list", ...rest]);
    break;
  case "update":
  case "upgrade":
    run(["update", ...rest]);
    break;
  case "remove":
  case "rm":
    run(["remove", ...rest]);
    break;
  case "--version":
  case "-v":
    console.log(pkg.version);
    break;
  case undefined:
  case "--help":
  case "-h":
  case "help":
    console.log(HELP);
    break;
  default:
    console.error(`\n  Unknown command: ${command}`);
    console.log(HELP);
    process.exit(1);
}
