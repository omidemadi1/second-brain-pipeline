import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type Section = { heading: string; body: string };

export type Note = {
  id: string;
  path: string;
  legacy: boolean;
  moc: boolean;
  title: string;
  category: string;
  platform: string;
  contentType: string;
  rating: string;
  tags: string[];
  author: string;
  source: string;
  dateSaved: string;
  dateProcessed: string;
  summary: string;
  sections: Section[];
  body: string;
  wordCount: number;
  contentStatus: "full" | "summary-only";
  hasFrontmatter: boolean;
  missing: string[];
  links: string[];
  brokenLinks: string[];
  backlinks: string[];
  edges: string[];
};

export type Vault = {
  path: string;
  notes: Note[];
  byId: Map<string, Note>;
  resolve: (target: string) => Note | null;
  stats: ReturnType<typeof vaultStats>;
};

const EXCLUDED = new Set([
  ".git",
  ".obsidian",
  ".inbox-queue",
  ".inbox-archive",
  ".sources",
  ".dashboard",
  "Templates",
  "Daily Digests",
  "scripts",
  "skills",
  "docs",
  "node_modules",
  // Code that may sit next to the vault when VAULT_PATH points at the repo root.
  "services",
  "packages",
  "dashboard",
]);

const REQUIRED = [
  "title",
  "source",
  "platform",
  "content_type",
  "date_saved",
  "date_processed",
  "category",
  "tags",
  "rating",
  "author",
];

function walk(dir: string, out: string[]) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".") || EXCLUDED.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name.toLowerCase().endsWith(".md")) out.push(full);
  }
}

function text(value: unknown): string {
  if (value == null) return "";
  return String(value).trim().replace(/^["']|["']$/g, "").trim();
}

function list(value: unknown): string[] {
  const raw = Array.isArray(value) ? value : typeof value === "string" ? value.split(",") : [];
  return [...new Set(raw.map((item) => text(item).toLowerCase()).filter(Boolean))];
}

function splitSections(body: string): Section[] {
  const out: Section[] = [];
  let current: Section = { heading: "", body: "" };
  let fence = false;

  for (const line of body.split(/\r?\n/)) {
    if (/^\s*(```|~~~)/.test(line)) fence = !fence;
    const heading = !fence && line.match(/^##\s+(.+?)\s*$/);
    if (heading) {
      if (current.heading || current.body.trim()) out.push(current);
      current = { heading: heading[1].trim(), body: "" };
    } else {
      current.body += line + "\n";
    }
  }
  if (current.heading || current.body.trim()) out.push(current);
  return out;
}

function wikiLinks(body: string): string[] {
  // Fenced code is not content; inline code is rare enough to accept here.
  const textOnly = body.replace(/```[\s\S]*?```/g, "").replace(/~~~[\s\S]*?~~~/g, "");
  const links = new Set<string>();
  for (const match of textOnly.matchAll(/\[\[([^\]|#]+)(?:#[^\]|]*)?(?:\|[^\]]*)?\]\]/g)) {
    const target = match[1].trim();
    if (target && !target.includes("://")) links.add(target);
  }
  return [...links];
}

function key(value: string): string {
  return value.replace(/\\/g, "/").replace(/\.md$/i, "").trim().toLowerCase();
}

function addUnique(map: Map<string, Note | null>, name: string, note: Note) {
  const existing = map.get(name);
  if (existing === undefined) map.set(name, note);
  else if (existing !== note) map.set(name, null); // ambiguous names must not resolve silently
}

function dateValue(value: unknown): string {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value.toISOString().slice(0, 10);
  const raw = text(value);
  if (!raw) return "";
  if (/^\d{4}-\d{2}-\d{2}/.test(raw)) return raw.slice(0, 10);
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? raw.slice(0, 10) : parsed.toISOString().slice(0, 10);
}

function firstHeading(body: string): string {
  let fence = false;
  for (const line of body.split(/\r?\n/)) {
    if (/^\s*(```|~~~)/.test(line)) fence = !fence;
    const match = !fence && line.match(/^#\s+(.+?)\s*$/);
    if (match) return match[1].trim();
  }
  return "";
}

function firstParagraph(body: string): string {
  const paragraph = body
    .replace(/^#\s+.+$/gm, "")
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .find((part) => part && !part.startsWith("[[") && !/^\*\*(Author|Bio)/i.test(part));
  return (paragraph ?? "").slice(0, 600);
}

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  let previous = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const current = [i];
    for (let j = 1; j <= b.length; j++) {
      current[j] = Math.min(
        previous[j] + 1,
        current[j - 1] + 1,
        previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
    previous = current;
  }
  return previous[b.length];
}

function overlap(a: string, b: string): number {
  const left = new Set(a.split(" ").filter((word) => word.length > 2));
  const right = new Set(b.split(" ").filter((word) => word.length > 2));
  if (!left.size || !right.size) return 0;
  let shared = 0;
  for (const word of left) if (right.has(word)) shared++;
  return shared / (left.size + right.size - shared);
}

export type LinkSuggestion = { note: Note; score: number };

export function suggestLinks(target: string, notes: Note[], limit = 3): LinkSuggestion[] {
  const wanted = normalize(target);
  if (!wanted) return [];

  return notes
    .map((note) => {
      const candidates = [note.title, path.basename(note.path, ".md"), note.id.split("/").pop() ?? ""];
      let score = 0;
      for (const candidate of candidates) {
        const value = normalize(candidate);
        if (!value) continue;
        if (value === wanted) score = Math.max(score, 1);
        else if (value.includes(wanted) || wanted.includes(value)) {
          score = Math.max(score, 0.82 - Math.abs(value.length - wanted.length) / 200);
        } else {
          const edit = 1 - levenshtein(wanted, value) / Math.max(wanted.length, value.length);
          score = Math.max(score, edit * 0.8, overlap(wanted, value) * 0.85);
        }
      }
      return { note, score };
    })
    .filter((item) => item.score >= 0.45)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function loadVault(vaultPath: string): Vault {
  const files: string[] = [];
  for (const entry of fs.readdirSync(vaultPath, { withFileTypes: true })) {
    if (entry.isDirectory() && !entry.name.startsWith(".") && !EXCLUDED.has(entry.name)) {
      walk(path.join(vaultPath, entry.name), files);
    }
  }

  const notes: Note[] = [];

  for (const file of files) {
    const rel = path.relative(vaultPath, file).replace(/\\/g, "/");
    const raw = fs.readFileSync(file, "utf8");
    let data: Record<string, unknown> = {};
    let body = raw;
    let hasFrontmatter = false;

    try {
      const parsed = matter(raw);
      data = parsed.data as Record<string, unknown>;
      body = parsed.content;
      hasFrontmatter = raw.startsWith("---") && Object.keys(data).length > 0;
    } catch {
      hasFrontmatter = false;
    }

    const folder = rel.includes("/") ? rel.split("/")[0] : "General";
    const moc = rel.startsWith("Maps of Content/");
    const category = moc ? "Maps of Content" : text(data.category) || (rel.startsWith("Notes/") ? rel.split("/")[1] : folder);
    const base = path.basename(file, ".md");
    const title = text(data.title) || firstHeading(body) || base.replace(/^[0-9a-f]{12}\s+/i, "");
    const sections = splitSections(body);
    const summary =
      sections.find((section) => section.heading.toLowerCase() === "summary")?.body.trim() ||
      firstParagraph(body);

    const note: Note = {
      id: rel.replace(/\.md$/i, ""),
      path: rel,
      legacy: !rel.startsWith("Notes/") && !moc,
      moc,
      title,
      category: category || "General",
      platform: text(data.platform) || "unknown",
      contentType: text(data.content_type) || "unknown",
      rating: text(data.rating) || "unknown",
      tags: list(data.tags),
      author: text(data.author),
      source: text(data.source) || text(data.url),
      dateSaved: dateValue(data.date_saved) || dateValue(data.date) || dateValue(data.timestamp),
      dateProcessed: dateValue(data.date_processed),
      summary,
      sections,
      body,
      wordCount: body.split(/\s+/).filter(Boolean).length,
      contentStatus: sections.some((section) => /^full content$/i.test(section.heading)) ? "full" : "summary-only",
      hasFrontmatter,
      missing: REQUIRED.filter((field) => {
        if (field === "tags") return list(data.tags).length === 0;
        if (field === "source") return !text(data.source) && !text(data.url);
        if (field === "date_saved") return !dateValue(data.date_saved) && !dateValue(data.date) && !dateValue(data.timestamp);
        if (field === "title") return !text(data.title) && !firstHeading(body);
        return !text(data[field]);
      }),
      links: wikiLinks(body),
      brokenLinks: [],
      backlinks: [],
      edges: [],
    };

    notes.push(note);
  }

  const byId = new Map(notes.map((note) => [note.id, note]));
  const byPath = new Map<string, Note | null>();
  const byBase = new Map<string, Note | null>();
  const byTitle = new Map<string, Note | null>();

  for (const note of notes) {
    addUnique(byPath, key(note.id), note);
    const base = path.basename(note.path, ".md");
    addUnique(byBase, key(base), note);
    addUnique(byBase, key(base.replace(/^[0-9a-f]{12}\s+/i, "")), note);
    addUnique(byTitle, key(note.title), note);
  }

  for (const note of notes) {
    for (const target of note.links) {
      const resolved = resolve(target);
      if (resolved) {
        resolved.backlinks.push(note.id);
        note.edges.push(resolved.id);
      } else {
        note.brokenLinks.push(target);
      }
    }
  }

  function resolve(target: string): Note | null {
    const lookup = key(target);
    const base = lookup.split("/").pop() ?? lookup;
    return byPath.get(lookup) ?? byBase.get(base) ?? byTitle.get(lookup) ?? byTitle.get(base) ?? null;
  }

  return { path: vaultPath, notes, byId, resolve, stats: vaultStats(notes) };
}

export function vaultStats(notes: Note[]) {
  const count = (values: string[]) =>
    [...values.reduce((map, value) => map.set(value, (map.get(value) ?? 0) + 1), new Map<string, number>())]
      .sort((a, b) => b[1] - a[1]);

  const content = notes.filter((note) => !note.moc);
  const broken = notes.flatMap((note) => note.brokenLinks);
  const tags = content.flatMap((note) => note.tags);
  const missing = content.flatMap((note) => note.missing);

  return {
    total: content.length,
    mocs: notes.length - content.length,
    inNotes: content.filter((note) => !note.legacy).length,
    legacy: content.filter((note) => note.legacy).length,
    categories: count(content.map((note) => note.category)),
    platforms: count(content.map((note) => note.platform)),
    ratings: count(content.map((note) => note.rating)),
    contentTypes: count(content.map((note) => note.contentType)),
    noFrontmatter: content.filter((note) => !note.hasFrontmatter).length,
    missingFields: count(missing),
    brokenLinks: broken.length,
    brokenTargets: new Set(broken).size,
    notesWithBroken: notes.filter((note) => note.brokenLinks.length > 0).length,
    topBroken: count(broken).slice(0, 10),
    zeroLinks: content.filter((note) => note.links.length === 0).length,
    tags: new Set(tags).size,
    tagCounts: count(tags),
    fullContent: content.filter((note) => note.contentStatus === "full").length,
    words: content.reduce((sum, note) => sum + note.wordCount, 0),
  };
}

// The dashboard lives at <repo>/services/dashboard, so the vault is at <repo>/vault.
export const VAULT_PATH = process.env.VAULT_PATH ?? path.resolve(import.meta.dirname, "../../../vault");
