// Two Days of Quiet Dread — make.fun entry.
// Writes a single original code review comment to /output/entry.txt.
// The comment approves the pull request in flat review shorthand
// ("Green tests, tidy diff") and lets the dread arrive quietly in the
// last clause: the code will outlive everyone who approved it.
// Mortality dread, stated as a fact, not a cry for help.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const ENTRY_PATH = "/output/entry.txt";
const MAX_CODE_POINTS = 140;

const LINE =
  "Approved. Green tests, tidy diff, and the quiet knowledge that this code will outlive everyone who approved it.";

// Gate check, done before writing: the line must be one non-blank
// line of 1-140 Unicode code points, ending with a full stop.
const codePointCount = [...LINE].length;
if (LINE.trim().length === 0) {
  throw new Error("Line must not be blank.");
}
if (codePointCount < 1 || codePointCount > MAX_CODE_POINTS) {
  throw new Error(
    `Line must be 1-${MAX_CODE_POINTS} Unicode code points, got ${codePointCount}.`,
  );
}
if (LINE.includes("\n") || LINE.includes("\r")) {
  throw new Error("Line must be a single line with no newline.");
}
if (!LINE.endsWith(".")) {
  throw new Error("Line must end with a full stop.");
}
// Tight-wording guard: no leading/trailing space, no double space.
if (LINE !== LINE.trim() || LINE.includes("  ")) {
  throw new Error("Line must be tightly worded: no edge or double spaces.");
}

mkdirSync("/output", { recursive: true });
writeFileSync(ENTRY_PATH, LINE, "utf8");

// Read-back verification: the file on disk must be byte for byte the
// line the gate checked above, so a silent write failure can never
// ship a different (or empty) entry to the judge.
const written = readFileSync(ENTRY_PATH, "utf8");
if (written !== LINE) {
  throw new Error("Read-back mismatch: /output/entry.txt is not the line.");
}
