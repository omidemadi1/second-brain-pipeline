import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { loadVault, suggestLinks, VAULT_PATH, type Note } from "./vault.ts";
import { noteUrl, renderMarkdown } from "./render.ts";
import { categoryHref, esc, icon, issueHref, layout, tagHref, type NavKey } from "./ui.ts";

let vault = loadVault(VAULT_PATH);
const PORT = Number(process.env.PORT ?? 8787);
const HOST = process.env.HOST ?? "127.0.0.1";
const reload = () => {
  vault = loadVault(VAULT_PATH);
};

const app = new Hono();

const REQUIRED_FIELDS = [
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

const sorted = (notes: Note[]) =>
  [...notes].sort((a, b) => (b.dateSaved || "").localeCompare(a.dateSaved || "") || a.title.localeCompare(b.title));

const stat = (value: string | number, label: string, tone = "", href = "") => {
  const inner = `<span class="num">${value}</span><span class="lbl">${label}</span>`;
  return href ? `<a class="stat ${tone}" href="${href}">${inner}</a>` : `<div class="stat ${tone}">${inner}</div>`;
};

const pageHead = (title: string, subtitle: string, action = "") =>
  `<div class="page-head"><div><h1>${title}</h1><p>${subtitle}</p></div>${action ? `<div class="head-action">${action}</div>` : ""}</div>`;

const crumb = (...parts: string[]) => parts.filter(Boolean).join('<span class="sep">/</span>');

const anchor = (note: Note) => `n-${Buffer.from(note.id).toString("base64url")}`;

const noteRows = (notes: Note[]) =>
  notes
    .map(
      (note) => `<a class="row" data-note href="${noteUrl(note)}" data-text="${esc(
        [note.title, note.category, note.platform, note.tags.join(" "), note.summary].join(" ").toLowerCase(),
      )}">
        <span class="row-title">${esc(note.title)}${note.legacy ? ' <span class="badge">legacy</span>' : ""}</span>
        <span class="row-cat">${esc(note.category)}</span>
        <span class="row-platform">${esc(note.platform)}</span>
        <span class="row-date">${esc(note.dateSaved)}</span>
      </a>`,
    )
    .join("");

const sourceValue = (note: Note) => {
  if (!note.source) return `<span style="color:var(--error)">Not stored</span>`;
  if (!/^https?:/i.test(note.source)) return esc(note.source);
  let host = note.source;
  try {
    host = new URL(note.source).hostname.replace(/^www\./, "");
  } catch {
    // keep the raw value
  }
  return `<a href="${esc(note.source)}" target="_blank" rel="noopener noreferrer" title="${esc(note.source)}">${esc(host)} ${icon("external", 11)}</a>`;
};

const replaceLink = (raw: string, target: string, candidate: Note) => {
  const escaped = target.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`\\[\\[\\s*${escaped}\\s*(#[^\\]|]*)?(?:\\|([^\\]]*))?\\]\\]`, "g");
  let count = 0;
  const text = raw.replace(pattern, (_match, heading: string | undefined, alias: string | undefined) => {
    count++;
    const display = (alias ?? target).replace(/\|/g, "/").replace(/\]/g, ")").trim();
    return `[[${candidate.id}${heading ?? ""}|${display}]]`;
  });
  return { text, count };
};

// ---------------------------------------------------------------- library

app.get("/", (c) => {
  const category = c.req.query("category") ?? "";
  const tag = (c.req.query("tag") ?? "").trim().toLowerCase();
  const notes = sorted(
    vault.notes.filter((note) => !note.moc && (!category || note.category === category) && (!tag || note.tags.includes(tag))),
  );
  const stats = vault.stats;

  const chips = stats.categories
    .map(
      ([name, count]) =>
        `<a class="chip ${name === category ? "active" : ""}" href="${categoryHref(name)}">${esc(name)} <span class="count">${count}</span></a>`,
    )
    .join("");

  const activeTag = tag
    ? `<a class="chip active" href="/">#${esc(tag)} <span class="count">×</span></a>`
    : "";

  const title = tag ? `#${esc(tag)}` : category ? esc(category) : "Library";
  const subtitle = tag
    ? `${notes.length} notes tagged #${esc(tag)}.`
    : category
      ? `${notes.length} notes filed under ${esc(category)}.`
      : `${stats.total} notes captured by Hermes, newest first.`;

  const body = `${pageHead(title, subtitle, tag ? `<a class="btn" href="/">Clear tag</a>` : "")}
    <div class="stats">
      ${stat(stats.total, "notes")}
      ${stat(stats.categories.length, "categories")}
      ${stat(stats.fullContent, "full rewrites")}
      ${stat(stats.brokenLinks, "broken links", "bad", issueHref("broken"))}
      ${stat(stats.noFrontmatter, "no frontmatter", "warn", issueHref("frontmatter"))}
      ${stat(stats.tags.toLocaleString(), "unique tags", "", "/tags")}
    </div>
    <div class="chips"><a class="chip ${!category ? "active" : ""}" href="/">All</a>${chips}${activeTag}</div>
    <div class="toolbar">
      <div class="search-wrap">${icon("search", 15)}<input class="search" id="q" type="search" placeholder="Search ${notes.length} notes by title, tag, category or summary…" autocomplete="off" aria-label="Search notes"></div>
      <span class="result-count" id="count">${notes.length} notes</span>
    </div>
    <div class="note-list" id="list">${noteRows(notes)}</div>
    <div class="empty-state" id="no-results" hidden><strong>No matching notes</strong>Try a shorter search or clear the filters.</div>
    <div class="empty-state" id="empty-filter" ${notes.length ? "hidden" : ""}><strong>No notes here yet</strong>${tag ? "Nothing has this tag." : "This category is empty."}</div>
    <script>
      const q = document.getElementById('q');
      const rows = [...document.querySelectorAll('[data-note]')];
      const count = document.getElementById('count');
      const noResults = document.getElementById('no-results');
      function filter() {
        const value = q.value.trim().toLowerCase();
        let shown = 0;
        for (const row of rows) {
          const ok = !value || row.dataset.text.includes(value);
          row.hidden = !ok;
          if (ok) shown++;
        }
        count.textContent = shown + (shown === 1 ? ' note' : ' notes');
        noResults.hidden = shown > 0 || rows.length === 0;
      }
      q.addEventListener('input', filter);
      filter();
    </script>`;

  return c.html(
    layout({
      title: tag ? `#${tag}` : category || "Library",
      body,
      vault,
      active: "library",
      category,
      crumb: crumb(`<a href="/">Library</a>`, tag ? `<span>#${esc(tag)}</span>` : category ? `<span>${esc(category)}</span>` : ""),
    }),
  );
});

// ---------------------------------------------------------------- note

app.get("/note/:nid", (c) => {
  let id = "";
  try {
    id = Buffer.from(c.req.param("nid"), "base64url").toString();
  } catch {
    return c.notFound();
  }
  const note = vault.byId.get(id);
  if (!note) return c.notFound();

  const sections = note.sections
    .filter((section) => section.heading && section.heading.toLowerCase() !== "summary")
    .map((section) => `<h2>${esc(section.heading)}</h2>${renderMarkdown(vault, section.body)}`)
    .join("");
  const hasFull = note.sections.some((section) => /^full content$/i.test(section.heading));
  const summary = note.summary
    ? renderMarkdown(vault, note.summary)
    : `<p class="empty-state">No summary stored for this note.</p>`;

  const tags = note.tags.length
    ? note.tags.map((tag) => `<a class="tag" href="${tagHref(tag)}">${esc(tag)}</a>`).join("")
    : `<span class="side">No tags.</span>`;

  const backlinks = note.backlinks.length
    ? `<div class="backlink-list">${note.backlinks
        .map((bid) => vault.byId.get(bid))
        .filter((linked): linked is Note => Boolean(linked))
        .map((linked) => `<a href="${noteUrl(linked)}">${esc(linked.title)}</a>`)
        .join("")}</div>`
    : `<p class="side">Nothing links here yet.</p>`;

  const broken = note.brokenLinks.length
    ? `<h2>Unresolved links</h2><div class="broken-list">${note.brokenLinks
        .map(
          (target) =>
            `<a class="broken-link" href="/issues?tab=broken&amp;note=${encodeURIComponent(note.id)}#${anchor(note)}">${icon("link", 11)}${esc(target)}</a>`,
        )
        .join("")}</div>`
    : "";

  const body = `<div class="breadcrumbs"><a href="/">Library</a><span class="sep">/</span><a href="${categoryHref(
    note.category,
  )}">${esc(note.category)}</a></div>
    <article class="note">
      <h1>${esc(note.title)}</h1>
      <div class="meta-grid">
        <div class="meta-item"><span class="k">Category</span><span class="v"><a href="${categoryHref(note.category)}">${esc(note.category)}</a></span></div>
        <div class="meta-item"><span class="k">Platform</span><span class="v">${esc(note.platform)}</span></div>
        <div class="meta-item"><span class="k">Rating</span><span class="v">${esc(note.rating)}</span></div>
        <div class="meta-item"><span class="k">Saved</span><span class="v">${esc(note.dateSaved || "Unknown")}</span></div>
        <div class="meta-item"><span class="k">Source</span><span class="v">${sourceValue(note)}</span></div>
      </div>
      <div class="tag-row">${tags}</div>
      <div class="summary-panel"><div class="label">Summary</div>${summary}</div>
      ${hasFull ? "" : '<div class="notice warn" style="margin-bottom:24px"><strong>Summary only.</strong> Hermes has not written the full rewrite for this note yet. The original source is still one click away.</div>'}
      ${sections || `<h2>Content</h2>${renderMarkdown(vault, note.body)}`}
      ${broken}
      <h2>Linked from</h2>${backlinks}
      <p class="note-foot">${esc(note.path)}${note.legacy ? " · legacy layout" : ""}${note.moc ? " · map of content" : ""} · ${note.wordCount.toLocaleString()} words</p>
    </article>`;

  return c.html(
    layout({
      title: note.title,
      body,
      vault,
      active: "library",
      category: note.category,
      crumb: crumb(
        `<a href="/">Library</a>`,
        `<a href="${categoryHref(note.category)}">${esc(note.category)}</a>`,
        `<span>${esc(note.title)}</span>`,
      ),
    }),
  );
});

// ---------------------------------------------------------------- tags

app.get("/tags", (c) => {
  const tags = vault.stats.tagCounts;
  const tiles = tags
    .map(
      ([tag, count]) =>
        `<a class="tag-tile" data-tag="${esc(tag.toLowerCase())}" href="${tagHref(tag)}"><span>#${esc(tag)}</span><span class="count">${count}</span></a>`,
    )
    .join("");

  const body = `${pageHead(
    "Tags",
    `${vault.stats.tags.toLocaleString()} unique tags across ${vault.stats.total} notes. Tags are the connective tissue; click one to open its notes.`,
  )}
    <div class="toolbar">
      <div class="search-wrap">${icon("search", 15)}<input class="search" id="tagq" type="search" placeholder="Filter tags…" autocomplete="off" aria-label="Filter tags"></div>
      <span class="result-count" id="tagcount">${tags.length.toLocaleString()} tags</span>
    </div>
    <div class="tags-grid" id="taglist">${tiles}</div>
    <div class="empty-state" id="tag-empty" hidden><strong>No matching tags</strong>Try a shorter fragment.</div>
    <script>
      const tq = document.getElementById('tagq');
      const tiles = [...document.querySelectorAll('[data-tag]')];
      const tc = document.getElementById('tagcount');
      const te = document.getElementById('tag-empty');
      tq.addEventListener('input', () => {
        const value = tq.value.trim().toLowerCase();
        let shown = 0;
        for (const tile of tiles) {
          const ok = !value || tile.dataset.tag.includes(value);
          tile.hidden = !ok;
          if (ok) shown++;
        }
        tc.textContent = shown.toLocaleString() + (shown === 1 ? ' tag' : ' tags');
        te.hidden = shown > 0;
      });
    </script>`;

  return c.html(
    layout({
      title: "Tags",
      body,
      vault,
      active: "tags",
      crumb: crumb(`<a href="/">Library</a>`, `<span>Tags</span>`),
    }),
  );
});

// ---------------------------------------------------------------- issues

app.get("/issues", (c) => {
  const tab = c.req.query("tab") === "frontmatter" ? "frontmatter" : "broken";
  const noteFilter = c.req.query("note") ?? "";
  const fixed = c.req.query("fixed") ?? "";
  const stats = vault.stats;
  const frontmatterNotes = vault.notes.filter((note) => !note.moc && !note.hasFrontmatter);
  const missingTotal = stats.missingFields.reduce((sum, [, count]) => sum + count, 0);

  const groups = new Map<Note, { target: string; suggestions: ReturnType<typeof suggestLinks> }[]>();
  for (const note of vault.notes) {
    if (noteFilter && note.id !== noteFilter) continue;
    for (const target of note.brokenLinks) {
      const list = groups.get(note) ?? [];
      list.push({
        target,
        suggestions: suggestLinks(target, vault.notes).filter(({ note: candidate }) => candidate.id !== note.id),
      });
      groups.set(note, list);
    }
  }
  const filteredNote = noteFilter ? vault.byId.get(noteFilter) : undefined;

  const brokenRows = [...groups]
    .sort((a, b) => b[1].length - a[1].length || a[0].title.localeCompare(b[0].title))
    .map(
      ([note, targets]) => `<div class="issue-group" id="${anchor(note)}">
        <div class="issue-source">
          <a href="${noteUrl(note)}">${esc(note.title)}</a>
          <span class="path">${esc(note.path)}</span>
        </div>
        ${targets
          .map(
            ({ target, suggestions }) => `<div class="issue-line">
              <div>
                <div class="issue-target">[[${esc(target)}]] <span class="arrow">→</span> no match</div>
                ${
                  suggestions.length
                    ? `<div class="suggestions">${suggestions
                        .map(
                          ({ note: candidate, score }) =>
                            `<a class="suggest" href="/issues/fix?note=${encodeURIComponent(note.id)}&amp;target=${encodeURIComponent(
                              target,
                            )}&amp;to=${encodeURIComponent(candidate.id)}" title="Preview replacement with ${esc(candidate.title)}">${esc(
                              candidate.title,
                            )} <span class="score">${Math.round(score * 100)}%</span></a>`,
                        )
                        .join("")}</div><div class="fix-hint">Pick a note to preview the exact one-line replacement.</div>`
                    : `<div class="fix-hint">No close match. Create a note named <code>${esc(target)}</code>, or edit the link in the source note.</div>`
                }
              </div>
            </div>`,
          )
          .join("")}
      </div>`,
    )
    .join("");

  const frontmatterRows = frontmatterNotes
    .map(
      (note) => `<div class="issue-group">
        <div class="issue-source"><a href="${noteUrl(note)}">${esc(note.title)}</a><span class="path">${esc(note.path)}</span></div>
        <div class="field-list">${REQUIRED_FIELDS.map(
          (field) => `<span class="field ${note.missing.includes(field) ? "missing" : ""}">${field}</span>`,
        ).join("")}</div>
        <div class="fix-hint">Add a YAML block at the top of this file. Missing fields are highlighted; the pipeline can backfill the rest on its next pass.</div>
      </div>`,
    )
    .join("");

  const fieldSummary = stats.missingFields
    .map(([field, count]) => `<span class="field missing">${esc(field)} · ${count}</span>`)
    .join(" ");

  const body = `${pageHead(
    "Issues",
    "The vault is healthy enough to read, but links and metadata still drift. Each issue below is concrete and fixable.",
  )}
    <div class="stats">
      ${stat(stats.brokenLinks, "broken links", "bad", issueHref("broken"))}
      ${stat(stats.notesWithBroken, "notes affected", "warn", issueHref("broken"))}
      ${stat(frontmatterNotes.length, "no frontmatter", "warn", issueHref("frontmatter"))}
      ${stat(missingTotal, "missing fields", "warn", issueHref("frontmatter"))}
    </div>
    ${fixed ? `<div class="notice ${fixed === "saved" ? "warn" : "success"}" style="margin-bottom:18px">${
      fixed === "saved"
        ? "<strong>Link fixed.</strong> The note was rewritten, but the git commit failed. Commit the change manually."
        : "<strong>Link fixed.</strong> The note was rewritten and committed to git. The vault index has been reloaded."
    }</div>` : ""}
    <div class="tabs">
      <a class="tab ${tab === "broken" ? "active" : ""}" href="${issueHref("broken")}">Broken links <span class="count">${stats.brokenLinks}</span></a>
      <a class="tab ${tab === "frontmatter" ? "active" : ""}" href="${issueHref("frontmatter")}">Missing frontmatter <span class="count">${frontmatterNotes.length}</span></a>
    </div>
    ${
      tab === "broken"
        ? `<div class="notice" style="margin-bottom:18px"><strong>How a fix works.</strong> A wikilink resolves by exact path, filename, or title. Pick a suggested note to preview a one-line replacement; applying it rewrites only that note and creates one git commit. If nothing matches, create the missing note or edit the source by hand.</div>
          ${
            filteredNote
              ? `<div class="notice" style="margin-bottom:18px">Showing broken links in <a href="${noteUrl(filteredNote)}">${esc(
                  filteredNote.title,
                )}</a>. <a href="${issueHref("broken")}">Show all notes</a>.</div>`
              : ""
          }
          ${brokenRows || `<div class="issue-empty">No broken links in this view.</div>`}`
        : `<div class="notice" style="margin-bottom:18px"><strong>Why this matters.</strong> Without YAML frontmatter, the dashboard has to guess the title, category, and source from the filename and headings. Add the required fields once; later pipeline passes can fill in the rest. The template lives in <code>Templates/</code>.</div>
          ${frontmatterRows || `<div class="issue-empty">Every note has frontmatter.</div>`}
          <h2 style="font-size:15px;margin:28px 0 10px">Missing fields across the vault</h2>
          <div class="field-list">${fieldSummary || `<span class="field">none</span>`}</div>`
    }`;

  return c.html(
    layout({
      title: "Issues",
      body,
      vault,
      active: "issues",
      crumb: crumb(`<a href="/">Library</a>`, `<span>Issues</span>`, `<span>${tab === "broken" ? "Broken links" : "Frontmatter"}</span>`),
    }),
  );
});

// ---------------------------------------------------------------- fix preview + apply

app.get("/issues/fix", (c) => {
  const noteId = c.req.query("note") ?? "";
  const target = c.req.query("target") ?? "";
  const toId = c.req.query("to") ?? "";
  const note = vault.byId.get(noteId);
  const candidate = vault.byId.get(toId);

  if (!note || !candidate || candidate.id === note.id || !note.brokenLinks.includes(target)) {
    return c.html(
      layout({
        title: "Fix link",
        body: `<div class="empty-state"><strong>That fix is no longer valid.</strong>The note, target, or replacement could not be found. <a href="${issueHref("broken")}">Back to issues</a>.</div>`,
        vault,
        active: "issues",
      }),
      400,
    );
  }

  const raw = fs.readFileSync(path.join(VAULT_PATH, note.path), "utf8");
  const { text, count } = replaceLink(raw, target, candidate);
  if (!count) {
    return c.html(
      layout({
        title: "Fix link",
        body: `<div class="empty-state"><strong>The link could not be located in the file.</strong>It may have changed since the index was built. <a href="${issueHref("broken")}">Back to issues</a>.</div>`,
        vault,
        active: "issues",
      }),
      400,
    );
  }

  const before = raw.split(/\r?\n/);
  const after = text.split(/\r?\n/);
  const changed = before.map((line, index) => (line !== after[index] ? index : -1)).filter((index) => index >= 0);
  const show = new Set<number>();
  for (const index of changed) {
    for (let offset = -1; offset <= 1; offset++) if (index + offset >= 0) show.add(index + offset);
  }
  const diff = [...show]
    .sort((a, b) => a - b)
    .slice(0, 40)
    .map((index) => {
      if (changed.includes(index)) {
        return `<div class="del">- ${esc(before[index])}</div><div class="add">+ ${esc(after[index])}</div>`;
      }
      return `<div class="ctx">  ${esc(before[index])}</div>`;
    })
    .join("");

  const body = `${pageHead("Fix broken link", "Preview the exact change before it touches the vault.")}
    <div class="fix-card">
      <h2>${esc(note.title)}</h2>
      <p>In <code>${esc(note.path)}</code>, replace the unresolved link</p>
      <div class="link-preview">[[${esc(target)}]] <b>→</b> [[${esc(candidate.id)}|${esc(target)}]]</div>
      <p>The replacement points at <a href="${noteUrl(candidate)}">${esc(candidate.title)}</a> using its exact vault path, so the link resolves even if another note shares its title.</p>
      <div class="diff">${diff}</div>
      <form method="post" action="/issues/fix">
        <input type="hidden" name="note" value="${esc(note.id)}">
        <input type="hidden" name="target" value="${esc(target)}">
        <input type="hidden" name="to" value="${esc(candidate.id)}">
        <div class="btn-row">
          <button class="btn danger" type="submit">Apply and commit</button>
          <a class="btn" href="${issueHref("broken")}">Cancel</a>
          <span class="note">Rewrites this one file and creates one git commit. Undo with git if needed.</span>
        </div>
      </form>
    </div>`;

  return c.html(
    layout({
      title: "Fix link",
      body,
      vault,
      active: "issues",
      crumb: crumb(`<a href="/">Library</a>`, `<a href="${issueHref("broken")}">Issues</a>`, `<span>Fix link</span>`),
    }),
  );
});

app.post("/issues/fix", async (c) => {
  const form = await c.req.parseBody();
  const note = vault.byId.get(String(form.note ?? ""));
  const candidate = vault.byId.get(String(form.to ?? ""));
  const target = String(form.target ?? "");
  if (!note || !candidate || candidate.id === note.id || !note.brokenLinks.includes(target)) {
    return c.text("Invalid or stale fix request.", 400);
  }

  const file = path.join(VAULT_PATH, note.path);
  const raw = fs.readFileSync(file, "utf8");
  const { text, count } = replaceLink(raw, target, candidate);
  if (!count) return c.text("Link not found in the file.", 400);

  fs.writeFileSync(file, text, "utf8");
  let committed = false;
  try {
    execFileSync("git", ["-C", VAULT_PATH, "add", "--", note.path], { stdio: "pipe" });
    execFileSync("git", ["-C", VAULT_PATH, "commit", "-m", `Fix broken link in ${note.path}`, "--", note.path], {
      stdio: "pipe",
    });
    committed = true;
  } catch {
    // The file change is still valid; the user may need to commit manually.
  }
  reload();
  return c.redirect(`/issues?tab=broken&fixed=${committed ? "1" : "saved"}`);
});

// ---------------------------------------------------------------- graph

const graphData = () => {
  const nodes = vault.notes.map((note) => ({
    id: note.id,
    title: note.title,
    category: note.category,
    url: noteUrl(note),
    moc: note.moc,
    degree: note.edges.length + note.backlinks.length,
  }));
  const seen = new Set<string>();
  const links: { source: string; target: string }[] = [];
  for (const note of vault.notes) {
    for (const target of note.edges) {
      if (target === note.id) continue;
      const pair = [note.id, target].sort().join("\u0000");
      if (seen.has(pair)) continue;
      seen.add(pair);
      links.push({ source: note.id, target });
    }
  }
  return {
    nodes,
    links,
    categories: vault.stats.categories.map(([name, count]) => ({ name, count })),
  };
};

app.get("/graph", (c) => {
  const data = graphData();
  const body = `<div class="graph-page">
    <div class="graph-bar">
      <div class="graph-title"><strong>Knowledge graph</strong><span>${data.nodes.length} nodes · ${data.links.length} links</span></div>
      <div class="graph-actions">
        <button class="gbtn" id="zoom-out" type="button" title="Zoom out">−</button>
        <button class="gbtn" id="zoom-in" type="button" title="Zoom in">+</button>
        <button class="gbtn" id="labels" type="button">Labels</button>
        <button class="gbtn" id="reset" type="button">Reset</button>
      </div>
    </div>
    <div class="graph-stage">
      <canvas id="graph"></canvas>
      <div class="graph-tip" id="tip" hidden></div>
      <div class="graph-legend" id="legend"></div>
    </div>
    <p class="graph-help">Drag to pan · Scroll or pinch to zoom · Click a node to open it · Hover for details</p>
  </div>
  <script>window.__GRAPH__ = ${JSON.stringify(data).replace(/</g, "\\u003c")};</script>
  <script src="/assets/graph.js" defer></script>`;

  return c.html(
    layout({
      title: "Graph",
      body,
      vault,
      active: "graph",
      wide: true,
      crumb: crumb(`<a href="/">Library</a>`, `<span>Graph</span>`),
      topbarRight: `<span>${data.nodes.length} nodes · ${data.links.length} links</span>`,
    }),
  );
});

app.get("/assets/graph.js", (c) => {
  const file = fs.readFileSync(path.join(import.meta.dirname, "public/graph.js"), "utf8");
  return c.body(file, 200, {
    "Content-Type": "text/javascript; charset=utf-8",
    "Cache-Control": "no-store",
  });
});

app.get("/favicon.svg", (c) => {
  const file = fs.readFileSync(path.join(import.meta.dirname, "public/favicon.svg"), "utf8");
  return c.body(file, 200, {
    "Content-Type": "image/svg+xml; charset=utf-8",
    "Cache-Control": "public, max-age=86400",
  });
});
app.get("/favicon.ico", (c) => c.redirect("/favicon.svg"));

// ---------------------------------------------------------------- api

app.get("/api/bootstrap", (c) =>
  c.json({
    stats: vault.stats,
    notes: vault.notes.map((note) => ({
      id: note.id,
      url: noteUrl(note),
      title: note.title,
      category: note.category,
      platform: note.platform,
      contentType: note.contentType,
      rating: note.rating,
      tags: note.tags,
      source: note.source,
      dateSaved: note.dateSaved,
      summary: note.summary,
      legacy: note.legacy,
      moc: note.moc,
      contentStatus: note.contentStatus,
      links: note.links,
      brokenLinks: note.brokenLinks,
      backlinks: note.backlinks,
      edges: note.edges,
    })),
  }),
);

app.get("/api/graph", (c) => c.json(graphData()));
app.get("/api/healthz", (c) => c.json({ status: "ok", notes: vault.stats.total }));

app.notFound((c) =>
  c.html(
    layout({
      title: "Not found",
      body: `<div class="empty-state"><strong>That page is not here.</strong><a href="/">Return to the library</a>.</div>`,
      vault,
      active: "library",
    }),
    404,
  ),
);

serve({ fetch: app.fetch, port: PORT, hostname: HOST }, () => {
  console.log(`Second Brain dashboard: http://${HOST === "0.0.0.0" ? "localhost" : HOST}:${PORT}`);
  console.log(`Vault: ${VAULT_PATH} · ${vault.stats.total} notes · ${vault.stats.brokenLinks} broken links`);
});
