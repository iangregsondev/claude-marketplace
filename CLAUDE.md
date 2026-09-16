# What this repo is

A Claude Code **plugin marketplace catalogue**. It ships one manifest, `.claude-plugin/marketplace.json`, naming plugins that live in their own repositories. The toolchain exists only to check that manifest and to release it — it builds nothing and ships nothing.

# Toolchain

This repo uses [Vite+](https://viteplus.dev). `vp` and `vpx` replace the whole npm/pnpm/yarn/bun surface. Translate before running anything:

| Instead of                                             | Use                      |
| ------------------------------------------------------ | ------------------------ |
| `npm install`, `pnpm install`, `yarn`, `bun install`   | `vp install`             |
| `npm install <pkg>`, `pnpm add`, `yarn add`, `bun add` | `vp add <pkg>`           |
| `npm run <task>`, `pnpm run`, `yarn <task>`, `bun run` | `vp run <task>`          |
| `npx <pkg>`, `pnpm dlx`, `yarn dlx`, `bunx`            | `vpx <pkg>` (= `vp dlx`) |

`devEngines.packageManager` pins this repo to pnpm, so npm and npx abort with `EBADDEVENGINES`, while yarn and bun would quietly resolve a different dependency tree.

Before calling a change done: `vp run ready` (format, lint, type check, tests, and `claude plugin validate .` with `--strict` semantics via `scripts/validate-marketplace.mjs`, which lets through only the empty-catalogue warning). Strict mode fails on unrecognized fields, which is the error you are most likely to introduce. `tests/marketplace.test.ts` checks the invariants below.

# The one invariant: nothing here changes when a plugin changes

Adding a skill to a catalogued plugin's repository must require no commit in this repo. That is the whole reason the catalogue is a separate repo, and almost every plausible "improvement" to a catalogue entry breaks it.

So when you are asked to enrich an entry, or you notice one looks thin, check what the new field tracks before adding it:

- **Never add `ref` or `sha`.** Pinning means a commit here for every release over there. Entries track each plugin repo's default branch on purpose. The risk that accepts is written down in [SECURITY.md](SECURITY.md) — it is a decision, not an oversight, so do not "fix" it.
- **Never add `keywords`.** It is the churniest field available: skill-level specifics that go stale the next time a skill lands in the plugin repo.
- **Keep `description` generic.** It cannot be omitted — for a `github` source, `plugin.json` is not fetched until install, so an entry without a description renders blank when browsing. Since it has to live here, it must not enumerate the plugin's skills, or it goes stale on every addition.
- **`category` is fine.** `plugin.json` has no such field, so it is the catalogue's own data rather than a copy that can drift.

# No plugin code

No skills, commands, agents, or hooks. If a task seems to call for one, it belongs in the plugin's own repository, not here. A pull request that adds a `skills/` directory to this repo has misunderstood the split.

# Adding a plugin

Three edits, and nothing else moves:

1. One more object in the `plugins` array of `.claude-plugin/marketplace.json`.
2. One more row in the README's "Catalogued plugins" table.
3. A changeset (`vpx changeset`), keyed by the root `package.json` name, `iangregson`.

Plugin names keep the `iangregson-` prefix. Names are unique per install rather than per marketplace, so the prefix is what separates `iangregson-skills:tdd` from another author's `tdd`.

# Versioning

The catalogue has one version of its own, through changesets, and nothing about it is ever hand-edited.

- It moves when the catalogue changes — an entry added, removed or repointed — never when a catalogued plugin releases. Plugins version in their own repositories.
- The package started at `0.0.0` and the first changeset was `major`, so the first release is `1.0.0`. After that: `patch` for a fixed entry or docs, `minor` for an added entry, `major` for a removed or renamed one.
- Never touch the `version` in `package.json`, `metadata.version` in `.claude-plugin/marketplace.json`, `CHANGELOG.md`, or a released version. The release workflow writes them: `changeset version` bumps the package, and `scripts/sync-marketplace-version.mjs` copies that version into the manifest.

# Writing Markdown here

Do not hard-wrap prose. One line per paragraph, per list item, per table row — let the editor soft-wrap. A one-word edit then touches one line instead of reflowing the whole paragraph, which keeps diffs reviewable.

Two files are exempt because they are verbatim copies of upstream text: `CODE_OF_CONDUCT.md` (Contributor Covenant 2.1) and `LICENSE.md` (MIT). Leave their line breaks alone; the formatter already ignores them.

[CONTRIBUTING.md](CONTRIBUTING.md) is the full account — the field-by-field table, the local marketplace check and why to undo it, and why third-party plugins are not listed here. Read it before changing the manifest's shape; this file only carries the parts that are easiest to walk past.
