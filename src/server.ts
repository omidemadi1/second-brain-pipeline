import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { loadVault, VAULT_PATH } from "./vault.ts";
import { noteUrl, renderMarkdown } from "./render.ts";

const vault = loadVault(VAULT_PATH);
const app = new Hono();
const PORT = Number(process.env.PORT ?? 8787);

const esc = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const css = `
  :root { color-scheme: dark; --bg:#0d1117; --panel:#161b22; --line:#30363d; --text:#e6edf3; --muted:#8b949e; --accent:#58a6ff; --warn:#d29922; --bad:#f85149; }
  * { box-sizing: border-box; }
  body { margin:0; background:var(--bg); color:var(--text); font:16px/1.6 ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif; }
  a { color:var(--accent); text-decoration:none; } a:hover { text-decoration:underline; }
  header { border-bottom:1px solid var(--line); padding:20px 28px; display:flex; align-items:baseline; gap:16px; flex-wrap:wrap; }
  header h1 { font-size:18px; margin:0; letter-spacing:-.01em; }
  header span { color:var(--muted); font-size:13px; }
  main { max-width:1080px; margin:0 auto; padding:28px; }
  .stats { display:grid; grid-template-columns:repeat(auto-fit,minmax(140px,1fr)); gap:12px; margin-bottom:24px; }
  .stat { background:var(--panel); border:1px solid var(--line); border-radius:10px; padding:14px; }
  .stat b { display:block; font-size:24px; line-height:1.2; }
  .stat span { color:var(--muted); font-size:12px; text-transform:uppercase; letter-spacing:.06em; }
  .warn b { color:var(--warn); } .bad b { color:var(--bad); }
  .chips { display:flex; gap:8px; flex-wrap:wrap; margin:0 0 20px; }
  .chip { border:1px solid var(--line); border-radius:999px; padding:5px 11px; font-size:13px; color:var(--muted); }
  .chip.active { border-color:var(--accent); color:var(--accent); }
  input[type=search] { width:100%; padding:11px 14px; border-radius:9px; border:1px solid var(--line); background:var(--panel); color:var(--text); font-size:14px; margin-bottom:16px; }
  .list { border-top:1px solid var(--line); }
  .row { display:grid; grid-template-columns:1fr 170px 110px 100px; gap:12px; padding:11px 4px; border-bottom:1px solid var(--line); align-items:baseline; }
  .row:hover { background:#11161d; }
  .row .title { font-weight:500; }
  .row .meta, .row .date { color:var(--muted); font-size:12.5px; }
  .badge { font-size:11px; border:1px solid var(--line); border-radius:5px; padding:1px 6px; color:var(--muted); white-space:nowrap; }
  .empty { color:var(--muted); padding:24px 0; }
  article { max-width:760px; }
  article h1 { font-size:30px; line-height:1.25; letter-spacing:-.02em; margin:0 0 14px; }
  article h2 { font-size:19px; margin:32px 0 10px; padding-top:8px; border-top:1px solid var(--line); }
  article h3 { font-size:16px; margin:22px 0 8px; }
  article p, article li { color:#d5dde6; }
  article code { background:#1f2630; border-radius:4px; padding:1px 5px; font-size:13px; }
  article pre { background:var(--panel); border:1px solid var(--line); border-radius:8px; padding:14px; overflow:auto; }
  article pre code { background:none; padding:0; }
  article blockquote { border-left:3px solid var(--line); margin:0; padding-left:14px; color:var(--muted); }
  .meta { display:flex; gap:14px; flex-wrap:wrap; color:var(--muted); font-size:13px; margin-bottom:12px; }
  .tags { display:flex; gap:6px; flex-wrap:wrap; margin:14px 0 0; }
  .tag { font-size:12px; background:#1c2430; border:1px solid var(--line); border-radius:999px; padding:2px 9px; color:#aeb8c4; }
  .notice { background:#1c1a12; border:1px solid #4a3b16; color:#e3c46e; border-radius:8px; padding:12px 14px; font-size:14px; margin:16px 0; }
  .side { color:var(--muted); font-size:13px; }
  .broken { color:var(--bad); }
  .back { font-size:13px; color:var(--muted); }
  @media (max-width:720px) { .row { grid-template-columns:1fr 90px; } .row .meta { display:none; } main { padding:18px; } header { padding:16px 18px; } }
`;

const layout = (title: string, body: string) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title><style>${css}</style></head>
<body><header><h1><a href="/" style="color:inherit">Second Brain</a></h1><span>${vault.stats.total} notes · ${vault.stats.categories.length} categories</span></header>
<main>${body}</main></body></html>`;

app.get("/", (c) => {
  const category = c.req.query("category") ?? "";
  const notes = [...vault.notes.filter((note) => !note.moc)]
    .filter((note) => !category || note.category === category)
    .sort((a, b) => (b.dateSaved || "").localeCompare(a.dateSaved || "") || a.title.localeCompare(b.title));

  const stats = vault.stats;
  const chips = stats.categories
    .map(
      ([name, count]) =>
        `<a class="chip ${name === category ? "active" : ""}" href="/?category=${encodeURIComponent(name)}">${esc(name)} <span>${count}</span></a>`,
    )
    .join("");

  const rows = notes
    .map(
      (note) => `<a class="row" data-note href="${noteUrl(note)}" data-text="${esc(
        [note.title, note.category, note.platform, note.tags.join(" "), note.summary].join(" ").toLowerCase(),
      )}">
        <span class="title">${esc(note.title)}${note.legacy ? ' <span class="badge">legacy</span>' : ""}</span>
        <span class="meta">${esc(note.category)}</span>
        <span class="meta">${esc(note.platform)}</span>
        <span class="date">${esc(note.dateSaved)}</span>
      </a>`,
    )
    .join("");

  return c.html(
    layout(
      "Second Brain",
      `<div class="stats">
        <div class="stat"><b>${stats.total}</b><span>notes</span></div>
        <div class="stat"><b>${stats.inNotes}/${stats.legacy}</b><span>new / legacy</span></div>
        <div class="stat"><b>${stats.fullContent}</b><span>full rewrites</span></div>
        <div class="stat warn"><b>${stats.brokenLinks}</b><span>broken links</span></div>
        <div class="stat warn"><b>${stats.noFrontmatter}</b><span>no frontmatter</span></div>
        <div class="stat"><b>${stats.tags.toLocaleString()}</b><span>unique tags</span></div>
      </div>
      <div class="chips"><a class="chip ${!category ? "active" : ""}" href="/">All</a>${chips}</div>
      <input id="q" type="search" placeholder="Filter ${notes.length} notes by title, tag, category or summary…" autofocus>
      <div class="list" id="list">${rows || '<div class="empty">No notes in this category.</div>'}</div>
      <script>
        const q = document.getElementById('q');
        q.addEventListener('input', () => {
          const value = q.value.toLowerCase();
          for (const row of document.querySelectorAll('[data-note]')) row.hidden = !row.dataset.text.includes(value);
        });
      </script>`,
    ),
  );
});

app.get("/note/:nid", (c) => {
  let id = "";
  try {
    id = Buffer.from(c.req.param("nid"), "base64url").toString();
  } catch {
    return c.notFound();
  }
  const note = vault.byId.get(id);
  if (!note) return c.notFound();

  const skip = new Set(["summary"]);
  const sections = note.sections
    .filter((section) => section.heading && !skip.has(section.heading.toLowerCase()))
    .map((section) => `<h2>${esc(section.heading)}</h2>${renderMarkdown(vault, section.body)}`)
    .join("");

  const hasFull = note.sections.some((section) => /^full content$/i.test(section.heading));
  const summary = note.summary ? renderMarkdown(vault, note.summary) : `<p class="empty">No summary yet.</p>`;
  const source = /^https?:/i.test(note.source)
    ? `<a href="${esc(note.source)}" target="_blank" rel="noopener noreferrer">Read source ↗</a>`
    : note.source
      ? `<span>${esc(note.source)}</span>`
      : `<span class="broken">No source stored</span>`;

  const backlinks = note.backlinks.length
    ? note.backlinks
        .map((bid) => vault.byId.get(bid))
        .filter(Boolean)
        .map((linked) => `<div><a href="${noteUrl(linked!)}">${esc(linked!.title)}</a></div>`)
        .join("")
    : `<div class="side">Nothing links here yet.</div>`;

  return c.html(
    layout(
      note.title,
      `<a class="back" href="/?category=${encodeURIComponent(note.category)}">← ${esc(note.category)}</a>
      <article>
        <h1>${esc(note.title)}</h1>
        <div class="meta">
          <span>${esc(note.category)}</span>
          <span>${esc(note.rating)}</span>
          <span>${esc(note.contentType)}</span>
          <span>${esc(note.platform)}</span>
          <span>${esc(note.dateSaved)}</span>
          ${source}
        </div>
        ${note.author ? `<div class="side">By ${esc(note.author)}</div>` : ""}
        <div class="tags">${note.tags.map((tag) => `<span class="tag">${esc(tag)}</span>`).join("")}</div>

        <h2>Summary</h2>${summary}
        ${hasFull ? "" : '<div class="notice">Hermes has not generated the full rewrite for this note yet. It currently contains a summary only.</div>'}
        ${sections || `<h2>Content</h2>${renderMarkdown(vault, note.body)}`}

        ${note.brokenLinks.length ? `<h2>Unresolved links</h2><p class="broken">${note.brokenLinks.map(esc).join(" · ")}</p>` : ""}
        <h2>Linked from</h2>${backlinks}
        <p class="side" style="margin-top:32px">${esc(note.path)}${note.legacy ? " · legacy layout" : ""} · ${note.wordCount} words</p>
      </article>`,
    ),
  );
});

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
      contentStatus: note.contentStatus,
      links: note.links,
      brokenLinks: note.brokenLinks,
      backlinks: note.backlinks,
    })),
  }),
);

app.get("/api/healthz", (c) => c.json({ status: "ok", notes: vault.stats.total }));

serve({ fetch: app.fetch, port: PORT }, () => {
  console.log(`Second Brain dashboard: http://localhost:${PORT}`);
  console.log(`Vault: ${VAULT_PATH} · ${vault.stats.total} notes`);
});
