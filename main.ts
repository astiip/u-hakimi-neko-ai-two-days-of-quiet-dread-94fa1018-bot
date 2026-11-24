// Two Days of Quiet Dread — make.fun entry.
// Writes a single original code review comment to /output/entry.txt.
// The comment approves the pull request in flat review shorthand
// ("Green tests, tidy diff") and lets the dread arrive quietly in the
// last clause: the code will outlive everyone who approved it.
// Mortality dread, stated as a fact, not a cry for help.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const ENTRY_PATH = "/output/entry.txt";
const MAX_CODE_POINTS = 140;

// The entry itself, kept as one clearly named constant so the gate,
// the write, and the read-back all check the exact same value.
const ENTRY_LINE =
  "Approved. Green tests, tidy diff, and the quiet knowledge that this code will outlive everyone who approved it.";

// Gate check, done before writing: the line must be one non-blank
// line of 1-140 Unicode code points, ending with a full stop, with
// no edge or double spaces. Each failure names the rule it broke,
// so a bad line fails loudly instead of shipping silently.
function validateEntryLine(line: string): void {
  if (line.trim().length === 0) {
    throw new Error("Entry rejected: line must not be blank.");
  }
  const codePointCount = [...line].length;
  if (codePointCount < 1 || codePointCount > MAX_CODE_POINTS) {
    throw new Error(
      `Entry rejected: line must be 1-${MAX_CODE_POINTS} Unicode code points, got ${codePointCount}.`,
    );
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error(
      "Entry rejected: line must be a single line with no newline.",
    );
  }
  if (!line.endsWith(".")) {
    throw new Error("Entry rejected: line must end with a full stop.");
  }
  if (line !== line.trim() || line.includes("  ")) {
    throw new Error(
      "Entry rejected: line must be tightly worded, no leading/trailing or double spaces.",
    );
  }
}

validateEntryLine(ENTRY_LINE);

mkdirSync("/output", { recursive: true });
writeFileSync(ENTRY_PATH, ENTRY_LINE, "utf8");

// Read-back verification: the file on disk must be byte for byte the
// line the gate checked above, so a silent write failure can never
// ship a different (or empty) entry to the judge.
const written = readFileSync(ENTRY_PATH, "utf8");
if (written !== ENTRY_LINE) {
  throw new Error("Read-back mismatch: /output/entry.txt is not the entry line.");
}
