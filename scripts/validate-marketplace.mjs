// Runs `claude plugin validate .` with `--strict` semantics, minus one warning.
//
// `--strict` turns every warning into an error, and an empty `plugins` array is
// a warning. The catalogue is allowed to exist before its first plugin, so that
// one warning is let through. Every other warning still fails, as `--strict`
// would. Once the catalogue lists a plugin, the allowed warning can never fire,
// so this is plain `--strict`.

import { spawnSync } from "node:child_process";

const ALLOWED = ["plugins: Marketplace has no plugins defined"];

const run = spawnSync("claude", ["plugin", "validate", "."], { encoding: "utf8" });
const output = `${run.stdout ?? ""}${run.stderr ?? ""}`;
process.stdout.write(output);

if (run.error) throw run.error;
// Errors fail without --strict, so a non-zero exit is already a failure.
if (run.status !== 0) process.exit(run.status ?? 1);

// Each finding is printed on its own line after a `❯` marker.
const findings = output
  .split("\n")
  .map((line) => line.trim())
  .filter((line) => line.startsWith("❯"))
  .map((line) => line.slice(1).trim());

const rejected = findings.filter((finding) => !ALLOWED.includes(finding));
if (rejected.length > 0) {
  console.error(`\nValidation failed: ${rejected.length} warning(s) not allowed (strict mode).`);
  process.exit(1);
}
