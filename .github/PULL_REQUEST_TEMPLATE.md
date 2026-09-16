## Summary

<!-- What does this change and why? One or two sentences. -->

## Related issue

<!-- e.g. #1 — use a plain reference, not a closing keyword. -->

## Type of change

- [ ] New catalogue entry
- [ ] Change to an existing entry
- [ ] Documentation
- [ ] Repo config

## Checklist

- [ ] `vp run ready` passes
- [ ] If this changes the catalogue, a changeset is included (`vpx changeset`)
- [ ] This adds no plugin code — no skills, commands, agents, or hooks
- [ ] Markdown prose is not hard-wrapped — one line per paragraph

For a new or changed entry:

- [ ] The entry adds no `ref`, `sha`, or `keywords` — none of them, since each one turns a release in the plugin's repo into a commit in this one
- [ ] Its `description` is generic: it does not enumerate the plugin's skills or categories, so adding one over there needs no commit here
- [ ] The plugin name keeps the `iangregson-` prefix
- [ ] The README's "Catalogued plugins" table has a matching row
- [ ] The manifest resolves, not just parses — `claude plugin marketplace add ./` (trailing slash required), then `list` shows `iangregson`, then `remove iangregson` undoes it

For a new plugin:

- [ ] The plugin's repository is public, and its `.claude-plugin/plugin.json` exists on the default branch — that is the file this catalogue reads
- [ ] It is first-party. Entries here are unpinned, which is only defensible for repos we control; see [SECURITY.md](https://github.com/iangregsondev/claude-marketplace/blob/main/SECURITY.md)
