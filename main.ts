// Monday, Reviewed in One Line — entry for make.fun bounty
// u-zeroxfive-monday-reviewed-in-one-line-e55de3c1
//
// Writes one line — the funniest one-line review of my own Monday —
// to <MAKEFUN_OUTPUT_DIR>/entry.txt (default /output/entry.txt).
// The text is fixed: byte-deterministic, no randomness, no timestamps,
// no network, no environment reads beyond the output directory.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const REVIEW =
  "Monday: one star. The standup could've been an email, my laptop updated at 9am, and my inbox CC'd me into a meeting about the meeting I missed. Would not Monday again.";

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

function main(): void {
  const chars = [...REVIEW];

  // Gate, mirrored from the competition rules: 1-200 characters,
  // not only white space, exactly one line.
  if (chars.length < 1 || chars.length > 200) {
    fail(`review is ${chars.length} characters, must be 1-200`);
  }
  if (REVIEW.trim().length === 0) {
    fail("review is only white space");
  }
  if (REVIEW.includes("\n") || REVIEW.includes("\r")) {
    fail("review must be a single line");
  }

  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  // No trailing newline: the file is exactly the one line, nothing else.
  writeFileSync(outPath, REVIEW, "utf8");

  // Verify the write landed byte-for-byte: read the file back and
  // refuse to report success if anything on disk differs from the
  // review (partial write, encoding surprise, stray trailing newline).
  const written = readFileSync(outPath, "utf8");
  if (written !== REVIEW) {
    fail(`${outPath} does not match the review after writing`);
  }

  console.log(`wrote ${outPath} (${chars.length} characters)`);
  console.log(REVIEW);
}

main();
