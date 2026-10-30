import path from "node:path";
import assert from "node:assert/strict";
import { loadVault, VAULT_PATH } from "./vault.ts";

const vault = loadVault(VAULT_PATH);
const s = vault.stats;

const rows = (title: string, values: [string, number][]) =>
  `${title}\n` + values.map(([name, n]) => `  ${name.padEnd(34)} ${n}`).join("\n");

console.log(`Vault: ${path.resolve(VAULT_PATH)}`);
console.log(`MOCs: ${s.mocs}  |  notes: ${s.total}  (Notes/: ${s.inNotes}, legacy: ${s.legacy})`);
console.log(`Words: ${s.words.toLocaleString()}  |  tags: ${s.tags}  |  full content: ${s.fullContent}`);
console.log();
console.log(rows("Categories", s.categories));
console.log();
console.log(rows("Platforms", s.platforms));
console.log();
console.log(`Frontmatter missing: ${s.noFrontmatter}`);
console.log(`Missing fields: ${s.missingFields.map(([f, n]) => `${f}=${n}`).join(", ") || "none"}`);
console.log();
console.log(`Broken wikilinks: ${s.brokenLinks} across ${s.notesWithBroken} notes (${s.brokenTargets} unique targets)`);
console.log(`Notes with no links: ${s.zeroLinks}`);
console.log();
console.log(rows("Top unresolved targets", s.topBroken));
console.log();
console.log("Files without frontmatter:");
for (const note of vault.notes.filter((note) => !note.moc && !note.hasFrontmatter)) console.log(`  ${note.path}`);

assert.ok(s.total > 300, `expected >300 notes, got ${s.total}`);
assert.equal(s.inNotes + s.legacy, s.total);
assert.equal(new Set(vault.notes.map((note) => note.id)).size, vault.notes.length, "duplicate note ids");
for (const note of vault.notes) {
  assert.ok(note.title, `missing title: ${note.path}`);
  assert.ok(note.category, `missing category: ${note.path}`);
  for (const id of note.backlinks) assert.ok(vault.byId.has(id), `dangling backlink ${id}`);
}
console.log("\nSelf-check: ok");
