import { defineConfig } from "vite-plus";

export default defineConfig({
  staged: {
    "*": "vp check --fix",
  },
  fmt: {
    // Verbatim upstream copies (Contributor Covenant 2.1, MIT). Their line breaks
    // are the upstream text's, not ours to reflow.
    ignorePatterns: ["CODE_OF_CONDUCT.md", "LICENSE.md", "CHANGELOG.md"],
  },
  lint: {
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    options: { typeAware: true, typeCheck: true },
  },
  run: {
    cache: true,
    tasks: {
      // Uncached: the run takes under a second, and a cache that misses the
      // manifest replays a stale pass. `--strict` semantics, except that an
      // empty catalogue is allowed — see the script.
      "validate:marketplace": {
        command: "node scripts/validate-marketplace.mjs",
        cache: false,
      },
      // What the release workflow runs to produce a release pull request.
      // Lives here rather than inline in the workflow so `release:dry-run` can
      // exercise the real thing instead of a copy of it.
      "release:version": {
        command: "vpx changeset version && node scripts/sync-marketplace-version.mjs",
        cache: false,
      },
      "release:dry-run": {
        command: "node scripts/release-dry-run.mjs",
        cache: false,
      },
    },
  },
});
