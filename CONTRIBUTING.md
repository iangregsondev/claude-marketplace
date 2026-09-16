# Contributing

Thanks for considering a contribution. This repo is a **catalogue**, not a plugin. It holds one file that matters — [`.claude-plugin/marketplace.json`](.claude-plugin/marketplace.json) — listing plugins that live in their own repositories.

Please read the [Code of Conduct](CODE_OF_CONDUCT.md) before taking part.

## What belongs here, and what doesn't

The catalogue's job is to survive untouched between plugin _additions_. Anything that tracks a plugin's contents is a reason to commit here when nothing here changed, and that coupling is what this repo exists to avoid.

So: **no plugin code**. No skills, commands, agents, or hooks. A change to a skill belongs in the repository that ships that skill — the one named in that plugin's catalogue entry — and reaches users without any commit here at all.

## Ways to contribute

- **Report a broken entry** — a plugin that won't install, resolves to the wrong repository, or shows a stale description.
- **Fix the catalogue or its docs** — a wrong link, an install instruction that no longer matches the CLI.
- **Suggest a plugin** — see the next section for what happens to that.

## Can I add my own plugin to this catalogue?

Almost certainly not, and the reason is structural rather than a judgment about your plugin.

This is an author-scoped catalogue. The `iangregson` marketplace means "plugins Ian Gregson maintains", and the `iangregson-` prefix on each plugin name is what stops `iangregson-skills:tdd` colliding with anyone else's `tdd`. Listing a plugin someone else releases would make this repo responsible for a supply chain it does not control — and the entries here are deliberately unpinned, which is only defensible for first-party repos (see [SECURITY.md](SECURITY.md)).

**Publish your own marketplace instead.** It is one file. Copy [`.claude-plugin/marketplace.json`](.claude-plugin/marketplace.json), change the name and the entries, push it, and people add it with `claude plugin marketplace add <you>/<repo>`. You keep control of your own release cadence, and users get one line in their marketplace list per author rather than per product.

If you think a plugin genuinely belongs here, open a **Plugin proposal** issue and make the case. Expect the answer to be the paragraph above.

## Reporting issues

Search [existing issues](https://github.com/iangregsondev/claude-marketplace/issues) first. If nothing matches, open a new one and pick the template that fits — it asks for what's needed to act on the report.

For a plugin that won't install, include the exact command you ran and its output. Say whether `claude plugin marketplace list` shows `iangregson`, because that separates "the catalogue is wrong" from "the marketplace was never added".

**Do not open a public issue for a security vulnerability.** Follow [SECURITY.md](SECURITY.md) instead — a public issue is itself a disclosure.

## Development setup

This repo uses [Vite+](https://viteplus.dev), a single `vp` CLI wrapping the runtime, package manager and tooling. **Use `vp` — not npm, pnpm, yarn or bun — and `vpx` in place of `npx`.** `devEngines.packageManager` pins the project to pnpm, and npm errors with `EBADDEVENGINES`.

It builds nothing. The toolchain is there to check the manifest and to release it. Requires Node.js >= 22.18.0.

```bash
git clone https://github.com/iangregsondev/claude-marketplace.git
cd claude-marketplace
vp install
```

Run `vp install` again after pulling changes. It also installs the Claude Code CLI the checks use, at the version in the lockfile.

## Checks

```bash
vp run ready   # format, lint, type check, test, validate the manifest
```

Validation is `claude plugin validate .` with `--strict` semantics, run by `scripts/validate-marketplace.mjs`. Strict mode treats warnings as errors, so it also catches unrecognized fields and missing metadata that the runtime would otherwise tolerate. The one warning let through is an empty `plugins` array, so the catalogue can exist before its first plugin. The tests in `tests/marketplace.test.ts` check what `validate` does not know about: the `iangregson-` prefix, a first-party `github` source, no `ref`, `sha`, `keywords` or `version` on an entry, and a README row for every entry. Run `vp run ready` before opening a pull request.

To confirm the manifest actually resolves rather than merely parsing, add the working copy as a marketplace from its local path, then remove it again:

```bash
claude plugin marketplace add ./
claude plugin marketplace list          # expect a iangregson row
claude plugin marketplace remove iangregson
```

The trailing slash matters. A bare `.` is rejected — the CLI reads an unadorned path as a GitHub `owner/repo` and only treats it as a directory when it starts `./`.

Remove it. Leaving a marketplace registered against a local checkout means it breaks the day you move or delete that directory.

Do not run `claude plugin install <plugin>@iangregson` against a local checkout if you already have that plugin installed from elsewhere — plugin names are unique per install, so the two collide.

### What CI checks

[`.github/workflows/validate.yml`](.github/workflows/validate.yml) runs two jobs on every push, on every pull request, and weekly on Monday morning. Neither needs a secret.

**`manifest shape`** runs the same steps as `vp run ready`, so a clean local run is a clean CI run.

**`source resolution`** checks what `validate` does not: for each entry it fetches `https://raw.githubusercontent.com/<repo>/HEAD/.claude-plugin/plugin.json` and requires both an HTTP 200 and a `name` matching the entry's. `validate` never resolves a source, so a manifest naming a repository that does not exist passes it cleanly — in a file whose entire content is repository paths, that is the defect most likely to reach a user. The fetch is unauthenticated on purpose: a 200 proves the repository is public, which is what someone who is not the author needs. A name mismatch means the plugin would install under a namespace the catalogue does not advertise.

The weekly run exists because the catalogue is static and its targets are not. A plugin repo renamed, archived, or made private months from now breaks installs without any commit here to trigger a check. The README badge reports that weekly run, which is the only place an unattended failure becomes visible — it is keyed on the workflow's **file name**, so renaming `validate.yml` silently breaks the badge and the README needs the same edit.

## Changing an entry

An entry is a JSON object in the `plugins` array. Keep it to the fields that do not track the plugin's contents:

| Field         | Use it?  | Why                                                                                                                                                           |
| ------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`        | Required | Keeps the author prefix — `iangregson-skills`, not `skills`.                                                                                                  |
| `source`      | Required | `{"source": "github", "repo": "owner/repo"}`.                                                                                                                 |
| `description` | Required | Cannot be omitted: for a `github` source, `plugin.json` sits in a repo that isn't fetched until install, so an entry without one renders blank when browsing. |
| `category`    | Optional | `plugin.json` has no such field, so this is the catalogue's own data rather than a copy of something.                                                         |
| `ref` / `sha` | **No**   | Pinning means a commit here for every release in a plugin repo. See [SECURITY.md](SECURITY.md) for the risk this accepts.                                     |
| `keywords`    | **No**   | The churniest field — skill-level specifics that go stale on every addition. Name plus description carries browse-time search adequately.                     |

**Keep the description generic.** Since it has to live here, it must not enumerate the plugin's skills or categories, or adding a skill over there becomes a commit over here. "A general-purpose collection of agent skills for everyday development work" survives; a list of eight skill names does not.

Adding a plugin is one more object in that array, one row in the README table, and a changeset. Nothing else in this repo moves.

## Changesets and releases

Every change to the catalogue needs a changeset:

```bash
vpx changeset
```

The catalogue's version is its own. It moves when an entry is added, removed or repointed, never when a catalogued plugin releases — those version in their own repositories. `patch` fixes an entry or the docs, `minor` adds an entry, and `major` removes or renames one, because that breaks anyone who installed it. The package started at `0.0.0` and its first changeset was `major`, so the first release is `1.0.0`.

**Never hand-edit a version.** The release workflow bumps `package.json` through changesets and copies that version into `metadata.version` in `.claude-plugin/marketplace.json`, in the same release pull request.

Merging to `main` starts the release: [`.github/workflows/release.yml`](.github/workflows/release.yml) runs `vp run release:version` — `changeset version`, then `scripts/sync-marketplace-version.mjs` — and opens a "chore: version marketplace" pull request. Merging that one applies the version and tags it.

Run the whole thing locally first:

```bash
vp run release:dry-run
```

It runs the same `release:version` task, prints the diff of what the release would produce, then reverts. It refuses to start unless the working tree is clean. Pass `--keep` to inspect the files instead; it prints how to clean up. The changelog looks up each changeset's commit on GitHub, so the dry run only works once that commit is pushed.

The workflow reads the repository variable `RELEASE_APP_CLIENT_ID` and the repository secret `RELEASE_APP_PRIVATE_KEY`, for the GitHub App that authors the release pull request. `iangregsondev` is a personal account, which has no organization-level variables or secrets, so both are set on this repository. The App must be installed on this repository with **Contents** and **Pull requests** set to read and write.

## Pull requests

Branch off `main` and target `main`. Branch names follow `<type>/<ticket>-<short-description>`, e.g. `feat/1-bootstrap-marketplace` or `chore/no-ticket-fix-readme-link`.

The PR template will appear when you open the PR — fill it in rather than leaving the body empty.

### Keeping a branch current

A PR must be up to date with `main` before it can merge, so that any checks have run against what will actually land.

**Rebase onto `main` rather than merging it in**, so the branch stays a clean line of your own commits:

```bash
git fetch origin && git rebase origin/main
git push --force-with-lease
```

GitHub's "Update branch" button writes a merge commit by default; its "Update with rebase" option does the same as the above. Use `--force-with-lease` rather than `--force` — it refuses if someone else has pushed to your branch in the meantime.

## Commit messages

Commits follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<optional scope>): <short description>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`. Use the imperative mood, lower case, no trailing period. The scope, where there is one, is usually the plugin whose entry you touched, as in `feat(iangregson-skills): point the entry at the renamed repo`.

This is convention rather than tooling — nothing lints it — so it relies on you. It is separate from the changeset: the commit message describes the commit, the changeset describes the release.

## License

Contributions are accepted under the [MIT License](LICENSE.md).
