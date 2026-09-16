# Security Policy

## Reporting a vulnerability

Please do **not** report security vulnerabilities through public GitHub issues, discussions, or pull requests — a public report is itself a disclosure.

Instead, use [GitHub's private vulnerability reporting](https://github.com/iangregsondev/claude-marketplace/security/advisories/new) to open a draft advisory. It's private, and it lets us work on the fix and the advisory in the same place.

Please include:

- what the problem is and why it's a security issue rather than a bug;
- the catalogue entry affected, and the commit you're looking at;
- steps to reproduce, or a proof of concept;
- what an attacker could achieve with it.

## What counts as a vulnerability here

This repo ships **one JSON manifest** and no code. Nothing here executes on your machine when you add the marketplace — the scripts and dev dependencies only check and release the manifest, and never reach a user. What it does do is tell Claude Code which repositories to fetch plugins from, so the realistic threat is the manifest pointing somewhere it should not:

- **An entry pointing at the wrong repository** — a typosquat, a fork, or a transferred or renamed repo whose old name someone else has since claimed. The catalogue is the only thing asserting that a plugin name like `iangregson-skills` means a particular `iangregsondev/...` repository, so an entry that lies is the whole attack.
- **A compromise of a repository this catalogue points at.** Report it against that repository, not this one — but tell us here too, because the fix here is to pull the entry while the other repo is dealt with.
- **A compromise of this repository's own supply chain** — its workflows, or anything with write access to `main`.

Reports about a _plugin's_ behaviour — a skill that gives poor advice, or fires when it shouldn't — belong in that plugin's own repository. This catalogue only names it.

## Known accepted risk: entries are not pinned

Catalogue entries carry no `ref` or `sha`. Each one tracks its plugin repository's default branch, so an install or update fetches whatever is on `main` at that moment. A bad commit reaching a plugin's `main` therefore reaches users without any change landing here.

That is a deliberate tradeoff, not an oversight — pinning would mean a commit in this repo for every release in a plugin repo, which is exactly the coupling this catalogue exists to remove. It is acceptable because every catalogued repository is first-party with CI gating `main`. It would not be acceptable for third-party entries, which is one reason there are none.

Reporting it as a vulnerability is not useful. Reporting a specific bad commit that reached users through it is.

## Supported versions

The catalogue is versioned and tagged, but `claude plugin marketplace update iangregson` always reads the current `main` branch, never a tag. So `main` is the only thing supported — a fix is a commit to `main`, and users pick it up on the next update. The version and [CHANGELOG.md](CHANGELOG.md) record what changed and when.

The plugins listed here version independently, in their own repositories, under their own security policies.

## What to expect

This repo is maintained by one person in their own time, so there's no guaranteed response time and no bug bounty. Reports are read and handled on a best-effort basis.

If a report is valid, the fix lands on `main` and a GitHub advisory is published. Credit is given to the reporter unless you'd rather stay anonymous — say which you prefer in the report.
