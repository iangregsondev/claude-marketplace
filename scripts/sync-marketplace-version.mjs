// Sets `.claude-plugin/marketplace.json`'s `metadata.version` to the package version.
//
// `changeset version` bumps package.json, and this copies that number across, so
// the catalogue, its changelog and its tag all carry one version — and the first
// release is 1.0.0 in all three.
//
// Run by the release workflow immediately after `changeset version`, so the
// change lands in the same release pull request. Never edit either by hand.
//
// This is the catalogue's own version. It moves when the catalogue changes — an
// entry added, removed or repointed — never when a catalogued plugin releases.

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const MANIFEST = new URL("../.claude-plugin/marketplace.json", import.meta.url);
const PACKAGE = new URL("../package.json", import.meta.url);

/**
 * Returns the marketplace.json source with `metadata.version` set to `version`.
 * Throws on a version that is not MAJOR.MINOR.PATCH, or a source with no
 * `metadata.version` to replace.
 */
export function syncVersion(source, version) {
  if (!/^\d+\.\d+\.\d+$/.test(String(version ?? ""))) {
    throw new Error(
      `package.json version must be MAJOR.MINOR.PATCH, got ${JSON.stringify(version)}`,
    );
  }

  // Only `metadata.version` is ours. Refuse rather than guess when it is missing,
  // so a manifest that lost the field fails the release instead of shipping unversioned.
  if (typeof JSON.parse(source).metadata?.version !== "string") {
    throw new Error('could not find "metadata.version" in marketplace.json');
  }

  // Patch the one line rather than re-serialising: JSON.stringify would reflow
  // whatever the formatter keeps on one line, turning a one-line change into a
  // reformat that then fails `vp check`. The catalogue's only `version` key is
  // the one under `metadata` — entries carry none, see CONTRIBUTING.md.
  const line = /"version": "[^"]*"/;
  return source.replace(line, `"version": "${version}"`);
}

function main() {
  const version = JSON.parse(readFileSync(PACKAGE, "utf8")).version;
  const source = readFileSync(MANIFEST, "utf8");
  const from = JSON.parse(source).metadata?.version;
  writeFileSync(MANIFEST, syncVersion(source, version));
  console.log(`marketplace.json: ${from} -> ${version}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
