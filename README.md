# claude-marketplace

[![validate](https://github.com/iangregsondev/claude-marketplace/actions/workflows/validate.yml/badge.svg)](https://github.com/iangregsondev/claude-marketplace/actions/workflows/validate.yml)

Claude Code plugin marketplace — a catalogue of Ian Gregson's plugins, each maintained in its own repository.

This repo ships no plugin code. It holds a single manifest, [`.claude-plugin/marketplace.json`](.claude-plugin/marketplace.json), that points Claude Code at each plugin's own repository. Add the marketplace once, then install plugins from it as they appear.

## Install

Add the marketplace. You only ever do this once:

```bash
claude plugin marketplace add iangregsondev/claude-marketplace
```

Then install a plugin from it. The `@iangregson` suffix names the marketplace to resolve the plugin from, which matters because plugin names are not globally unique:

```bash
claude plugin install <plugin>@iangregson
```

Restart your Claude Code session afterwards — plugins load at session start, so a running session will not see the new skills.

## Catalogued plugins

No plugins yet. Each one gets a row here when it is added.

## Updating

Entries track each plugin repository's default branch rather than a pinned commit, so an update pulls whatever is on `main` at that moment:

```bash
claude plugin marketplace update iangregson
```

That refreshes the catalogue itself — the list of plugins and their descriptions. To pull new versions of the plugins you have installed:

```bash
claude plugin update <plugin>@iangregson
```

`update` needs the full `plugin@marketplace` id. A bare name fails with `Plugin "<plugin>" not found`, even though `uninstall` accepts one — the two commands differ here.

Restart your session afterwards. An update is applied at session start, so a running session keeps the old version.

## Contributing

The catalogue exists so that changes to a plugin need no commit here — so most contributions belong in the plugin's own repository, not this one. [CONTRIBUTING.md](CONTRIBUTING.md) explains which is which, what a catalogue entry may and may not carry, and how to check a change before opening a pull request.

- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Security policy](SECURITY.md) — including why entries are not pinned to a commit, and what that means for you

## License

[MIT](LICENSE.md)
