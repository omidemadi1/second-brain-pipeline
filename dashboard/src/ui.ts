import type { Vault } from "./vault.ts";

export type NavKey = "library" | "tags" | "issues" | "graph";

export const esc = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export const tagHref = (tag: string) => `/?tag=${encodeURIComponent(tag)}`;
export const categoryHref = (category: string) => `/?category=${encodeURIComponent(category)}`;
export const issueHref = (tab: "broken" | "frontmatter") => `/issues?tab=${tab}`;

const paths: Record<string, string> = {
  library:
    '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
  tags:
    '<path d="M20.59 13.41 13.42 20.58a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><circle cx="7" cy="7" r="1.5"/>',
  alert:
    '<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  graph:
    '<circle cx="5.5" cy="18" r="2.5"/><circle cx="18.5" cy="5.5" r="2.5"/><circle cx="11.5" cy="11.5" r="2.5"/><path d="m7.7 16.5 2.3-3M13.7 10.2l2.8-3.2"/>',
  folder:
    '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  external:
    '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  link:
    '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
};

export const icon = (name: keyof typeof paths, size = 16) =>
  `<svg class="icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]}</svg>`;

const logo = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
  <rect x="2.5" y="2.5" width="19" height="19" rx="5" stroke="currentColor" stroke-width="1.4"/>
  <circle cx="8" cy="9" r="1.7" fill="currentColor"/><circle cx="16" cy="8" r="1.4" fill="currentColor"/>
  <circle cx="12" cy="16" r="1.7" fill="currentColor"/>
  <path d="M9.3 10.2 11 14.4M14.8 9.1 12.5 14.4M9.6 8.7l4.8-.5" stroke="currentColor" stroke-width="1.1"/>
</svg>`;

export const css = `
  :root {
    color-scheme: dark;
    --bg:#0e1116; --bg-soft:#11151c; --surface:#171b23; --surface-2:#1d222c;
    --border:#2a303b; --border-soft:#222833;
    --text:#e8e5de; --text-2:#a2a8b4; --text-3:#737a87;
    --primary:#d4b06a; --primary-hover:#e3c485; --primary-soft:rgba(212,176,106,.11);
    --accent:#9d8cff; --accent-soft:rgba(157,140,255,.10);
    --success:#7fb08a; --warning:#d9a441; --error:#d97b7b; --info:#7ea6c9;
    --sans:"Inter",ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;
    --serif:"Source Serif 4","Iowan Old Style","Palatino Linotype",Georgia,serif;
    --mono:"JetBrains Mono",ui-monospace,SFMono-Regular,Consolas,monospace;
    --sidebar:248px; --topbar:56px;
  }
  * { box-sizing:border-box; }
  html { background:var(--bg); }
  body { margin:0; background:var(--bg); color:var(--text); font:15px/1.55 var(--sans); -webkit-font-smoothing:antialiased; }
  a { color:inherit; text-decoration:none; }
  button, input, select { font:inherit; }
  button { cursor:pointer; }
  :focus-visible { outline:2px solid var(--primary); outline-offset:2px; }
  .icon { flex:0 0 auto; vertical-align:-2px; }

  .app { display:grid; grid-template-columns:var(--sidebar) minmax(0,1fr); min-height:100vh; }
  .sidebar { position:sticky; top:0; height:100vh; display:flex; flex-direction:column; gap:22px; padding:20px 14px; background:var(--bg-soft); border-right:1px solid var(--border-soft); overflow:auto; }
  .brand { display:flex; align-items:center; gap:10px; padding:4px 8px 2px; color:var(--primary); }
  .brand-name { font-size:14px; font-weight:600; letter-spacing:.01em; color:var(--text); }
  .nav { display:flex; flex-direction:column; gap:2px; }
  .nav-item { display:flex; align-items:center; gap:10px; padding:8px 10px; border-radius:8px; color:var(--text-2); font-size:14px; transition:background .14s ease,color .14s ease; }
  .nav-item:hover { background:var(--surface); color:var(--text); }
  .nav-item.active { background:var(--primary-soft); color:var(--primary); }
  .nav-count { margin-left:auto; font:11px/1 var(--mono); color:var(--text-3); }
  .nav-item.active .nav-count { color:var(--primary); opacity:.8; }
  .sidebar-block { min-height:0; }
  .sidebar-label { padding:0 10px 7px; color:var(--text-3); font-size:10.5px; font-weight:600; letter-spacing:.09em; text-transform:uppercase; }
  .cat-list { display:flex; flex-direction:column; gap:1px; }
  .cat-link { display:flex; align-items:center; gap:8px; padding:5px 10px; border-radius:6px; color:var(--text-2); font-size:12.5px; }
  .cat-link:hover { background:var(--surface); color:var(--text); }
  .cat-link.active { color:var(--primary); }
  .cat-link .count { margin-left:auto; color:var(--text-3); font:11px var(--mono); }
  .sidebar-foot { margin-top:auto; padding:10px 10px 2px; border-top:1px solid var(--border-soft); color:var(--text-3); font:11px var(--mono); display:flex; justify-content:space-between; gap:8px; }

  .content { min-width:0; display:flex; flex-direction:column; }
  .topbar { position:sticky; top:0; z-index:5; height:var(--topbar); display:flex; align-items:center; justify-content:space-between; gap:16px; padding:0 32px; border-bottom:1px solid var(--border-soft); background:rgba(14,17,22,.88); backdrop-filter:blur(8px); }
  .crumb { display:flex; align-items:center; gap:8px; min-width:0; color:var(--text-3); font-size:12.5px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .crumb a { color:var(--text-2); } .crumb a:hover { color:var(--primary); }
  .crumb .sep { color:var(--border); }
  .topbar-right { display:flex; align-items:center; gap:14px; color:var(--text-3); font:11px var(--mono); white-space:nowrap; }
  .dot { width:6px; height:6px; border-radius:50%; background:var(--success); display:inline-block; margin-right:6px; }

  .main { width:100%; max-width:1080px; margin:0 auto; padding:32px; }
  .main.wide { max-width:none; padding:0; }
  .page-head { display:flex; align-items:flex-end; justify-content:space-between; gap:24px; margin-bottom:24px; }
  .page-head h1 { margin:0; font:600 28px/1.15 var(--sans); letter-spacing:-.025em; }
  .page-head p { margin:6px 0 0; color:var(--text-2); font-size:13.5px; }
  .page-head .head-action { flex:0 0 auto; }

  .stats { display:grid; grid-template-columns:repeat(auto-fit,minmax(148px,1fr)); gap:12px; margin-bottom:26px; }
  .stat { display:block; background:var(--surface); border:1px solid var(--border); border-radius:12px; padding:15px 16px; min-height:78px; transition:border-color .14s ease; }
  a.stat:hover { border-color:var(--primary); }
  a.stat:hover .num { color:var(--primary); }
  .stat .num { display:block; font:600 27px/1.15 var(--sans); letter-spacing:-.025em; color:var(--text); }
  .stat .lbl { display:block; margin-top:5px; color:var(--text-3); font-size:10.5px; font-weight:600; letter-spacing:.085em; text-transform:uppercase; }
  .stat.warn .num { color:var(--warning); }
  .stat.bad .num { color:var(--error); }
  .stat.good .num { color:var(--success); }

  .toolbar { display:flex; align-items:center; gap:12px; margin:0 0 14px; flex-wrap:wrap; }
  .search-wrap { position:relative; flex:1 1 280px; }
  .search-wrap .icon { position:absolute; left:12px; top:50%; transform:translateY(-50%); color:var(--text-3); pointer-events:none; }
  .search { width:100%; padding:10px 13px 10px 36px; border-radius:9px; border:1px solid var(--border); background:var(--surface); color:var(--text); font-size:13.5px; }
  .search::placeholder { color:var(--text-3); }
  .search:focus { outline:none; border-color:var(--primary); box-shadow:0 0 0 3px var(--primary-soft); }
  .result-count { color:var(--text-3); font:11px var(--mono); white-space:nowrap; }

  .chips { display:flex; gap:7px; flex-wrap:wrap; margin:0 0 18px; }
  .chip { display:inline-flex; align-items:center; gap:6px; border:1px solid var(--border); border-radius:9999px; padding:4px 10px; color:var(--text-2); font-size:12px; background:transparent; }
  .chip:hover { border-color:var(--primary); color:var(--primary); }
  .chip.active { border-color:var(--primary); color:var(--primary); background:var(--primary-soft); }
  .chip .count { color:var(--text-3); font:10.5px var(--mono); }
  .chip.active .count { color:var(--primary); }

  .note-list { border-top:1px solid var(--border-soft); }
  .row { display:grid; grid-template-columns:minmax(0,1fr) 170px 108px 88px; gap:14px; align-items:baseline; padding:12px 5px; border-bottom:1px solid var(--border-soft); transition:background .12s ease; }
  .row:hover { background:var(--surface); }
  .row:hover .row-title { color:var(--primary); }
  .row[hidden] { display:none; }
  .row-title { font-size:14.5px; font-weight:500; color:var(--text); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .row-cat, .row-platform { color:var(--text-2); font-size:12.5px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .row-date { color:var(--text-3); font:11.5px var(--mono); text-align:right; }
  .badge { display:inline-block; margin-left:6px; padding:1px 5px; border:1px solid var(--border); border-radius:4px; color:var(--text-3); font:9.5px var(--mono); text-transform:uppercase; letter-spacing:.04em; vertical-align:1px; }

  .empty-state { padding:34px 0; color:var(--text-2); font-size:14px; }
  .empty-state strong { display:block; color:var(--text); font-weight:500; margin-bottom:4px; }
  .empty-state[hidden] { display:none; }

  .notice { border:1px solid var(--border); background:var(--surface); border-radius:10px; padding:13px 15px; color:var(--text-2); font-size:13px; line-height:1.65; }
  .notice.warn { border-color:rgba(217,164,65,.38); background:rgba(217,164,65,.06); color:#e5cd96; }
  .notice.error { border-color:rgba(217,123,123,.38); background:rgba(217,123,123,.06); color:#ebb2b2; }
  .notice.success { border-color:rgba(127,176,138,.38); background:rgba(127,176,138,.07); color:#b8d9c0; }
  .notice a { color:var(--primary); text-decoration:underline; text-underline-offset:2px; }
  .notice strong { color:var(--text); }
  .side { color:var(--text-3); font-size:13px; }

  .breadcrumbs { display:flex; align-items:center; gap:8px; margin-bottom:18px; color:var(--text-3); font-size:12.5px; }
  .breadcrumbs a:hover { color:var(--primary); }
  .breadcrumbs .sep { color:var(--border); }

  article.note { max-width:740px; }
  article.note h1 { margin:0 0 16px; font:600 34px/1.18 var(--serif); letter-spacing:-.02em; color:var(--text); }
  .meta-grid { display:grid; grid-template-columns:repeat(5,minmax(0,1fr)); gap:1px; margin:0 0 16px; border:1px solid var(--border); border-radius:10px; overflow:hidden; background:var(--border); }
  .meta-item { background:var(--surface); padding:10px 12px; }
  .meta-item .k { display:block; color:var(--text-3); font-size:9.5px; font-weight:600; letter-spacing:.08em; text-transform:uppercase; }
  .meta-item .v { display:block; margin-top:3px; color:var(--text-2); font-size:12.5px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .meta-item .v a { color:var(--primary); }
  .meta-item .v a:hover { text-decoration:underline; }
  .tag-row { display:flex; flex-wrap:wrap; gap:6px; margin:0 0 26px; }
  .tag { display:inline-flex; align-items:center; padding:2px 8px; border:1px solid rgba(157,140,255,.24); border-radius:9999px; background:var(--accent-soft); color:#b9adff; font-size:11.5px; }
  .tag:hover { border-color:var(--accent); color:#d4ccff; }
  .tag::before { content:"#"; opacity:.55; margin-right:1px; }

  .summary-panel { margin:0 0 30px; padding:16px 18px; border:1px solid var(--border); border-left:2px solid var(--primary); border-radius:0 10px 10px 0; background:var(--surface); }
  .summary-panel .label { color:var(--text-3); font-size:9.5px; font-weight:600; letter-spacing:.09em; text-transform:uppercase; margin-bottom:5px; }
  .summary-panel p:last-child { margin-bottom:0; }
  article.note h2 { margin:34px 0 10px; padding-top:18px; border-top:1px solid var(--border-soft); font:600 20px/1.3 var(--serif); letter-spacing:-.01em; }
  article.note h3 { margin:24px 0 8px; font:600 16px/1.35 var(--sans); }
  article.note p, article.note li { color:#d4d1c9; font:16.5px/1.75 var(--serif); }
  article.note li { margin:4px 0; }
  article.note a { color:var(--primary); text-decoration:underline; text-decoration-color:rgba(212,176,106,.3); text-underline-offset:3px; }
  article.note a:hover { text-decoration-color:var(--primary); }
  article.note code { padding:1px 5px; border-radius:4px; background:var(--surface-2); color:#d9d4c8; font:12.5px var(--mono); }
  article.note pre { padding:14px 16px; border:1px solid var(--border); border-radius:9px; background:var(--bg-soft); overflow:auto; }
  article.note pre code { padding:0; background:none; font-size:12.5px; }
  article.note blockquote { margin:16px 0; padding:2px 0 2px 16px; border-left:2px solid var(--border); color:var(--text-2); }
  article.note hr { border:0; border-top:1px solid var(--border-soft); margin:28px 0; }
  .note-foot { max-width:740px; margin-top:36px; padding-top:18px; border-top:1px solid var(--border-soft); color:var(--text-3); font:11px/1.7 var(--mono); }
  .backlink-list { display:flex; flex-direction:column; gap:7px; }
  .backlink-list a { color:var(--text-2); font-size:13.5px; }
  .backlink-list a:hover { color:var(--primary); }
  .broken-list { display:flex; flex-wrap:wrap; gap:6px; }
  .broken-link { display:inline-flex; align-items:center; gap:5px; padding:3px 8px; border:1px solid rgba(217,123,123,.3); border-radius:6px; background:rgba(217,123,123,.06); color:#e6a1a1; font:11.5px var(--mono); }
  .broken-link:hover { border-color:var(--error); color:#f0b8b8; }

  .tabs { display:flex; gap:4px; margin:0 0 22px; border-bottom:1px solid var(--border-soft); }
  .tab { padding:8px 12px; margin-bottom:-1px; border-bottom:2px solid transparent; color:var(--text-2); font-size:13px; }
  .tab:hover { color:var(--text); }
  .tab.active { color:var(--primary); border-bottom-color:var(--primary); }
  .tab .count { margin-left:6px; color:var(--text-3); font:10.5px var(--mono); }
  .tab.active .count { color:var(--primary); }

  .issue-group { padding:16px 0; border-bottom:1px solid var(--border-soft); }
  .issue-source { display:flex; align-items:baseline; justify-content:space-between; gap:12px; margin-bottom:10px; }
  .issue-source a { font-size:14px; font-weight:500; color:var(--text); }
  .issue-source a:hover { color:var(--primary); }
  .issue-source .path { color:var(--text-3); font:10.5px var(--mono); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .issue-line { display:grid; grid-template-columns:minmax(0,1fr) auto; gap:14px; align-items:start; padding:7px 0 7px 14px; border-left:1px solid var(--border); }
  .issue-target { color:#e6a1a1; font:12px var(--mono); overflow-wrap:anywhere; }
  .issue-target .arrow { color:var(--text-3); margin:0 6px; }
  .suggestions { display:flex; flex-wrap:wrap; gap:6px; margin-top:6px; }
  .suggest { display:inline-flex; align-items:center; gap:5px; padding:2px 7px; border:1px solid var(--border); border-radius:5px; background:var(--surface); color:var(--text-2); font-size:11.5px; }
  .suggest:hover { border-color:var(--primary); color:var(--primary); }
  .suggest .score { color:var(--text-3); font:9.5px var(--mono); }
  .fix-hint { color:var(--text-3); font-size:11.5px; margin-top:5px; }
  .fix-hint code { font-family:var(--mono); font-size:11px; color:var(--text-2); }
  .issue-empty { padding:18px 0; color:var(--text-2); font-size:13.5px; }

  .field-list { display:flex; flex-wrap:wrap; gap:5px; }
  .field { padding:1px 6px; border:1px solid var(--border); border-radius:4px; color:var(--text-3); font:10px var(--mono); }
  .field.missing { border-color:rgba(217,164,65,.28); color:#c9ae72; }

  .tags-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(168px,1fr)); gap:8px; margin-top:18px; }
  .tag-tile { display:flex; align-items:center; justify-content:space-between; gap:10px; padding:8px 11px; border:1px solid var(--border); border-radius:8px; background:var(--surface); color:var(--text-2); font-size:12.5px; }
  .tag-tile:hover { border-color:var(--accent); color:#c9c0ff; }
  .tag-tile .count { color:var(--text-3); font:10.5px var(--mono); }
  .tag-tile[hidden] { display:none; }

  .diff { margin:14px 0 0; border:1px solid var(--border); border-radius:9px; background:var(--bg-soft); overflow:auto; font:12px/1.7 var(--mono); }
  .diff div { padding:3px 12px; white-space:pre-wrap; overflow-wrap:anywhere; }
  .diff .del { background:rgba(217,123,123,.08); color:#e6a1a1; }
  .diff .add { background:rgba(127,176,138,.08); color:#b5d7bd; }
  .diff .ctx { color:var(--text-3); }
  .fix-card { max-width:760px; padding:18px 20px; border:1px solid var(--border); border-radius:12px; background:var(--surface); }
  .fix-card h2 { margin:0 0 6px; font-size:16px; }
  .fix-card p { color:var(--text-2); font-size:13.5px; }
  .fix-card .link-preview { margin:14px 0; padding:10px 12px; border:1px solid var(--border); border-radius:8px; background:var(--bg-soft); font:12px var(--mono); color:var(--text-2); overflow-wrap:anywhere; }
  .fix-card .link-preview b { color:var(--primary); }
  .btn { display:inline-flex; align-items:center; gap:7px; padding:8px 13px; border:1px solid var(--border); border-radius:7px; background:var(--surface-2); color:var(--text); font-size:12.5px; font-weight:500; }
  .btn:hover { border-color:var(--primary); color:var(--primary); }
  .btn.primary { border-color:rgba(212,176,106,.45); background:var(--primary-soft); color:var(--primary); }
  .btn.primary:hover { border-color:var(--primary); background:rgba(212,176,106,.17); }
  .btn.danger { border-color:rgba(217,123,123,.35); color:#e6a1a1; background:rgba(217,123,123,.06); }
  .btn.danger:hover { border-color:var(--error); }
  .btn-row { display:flex; align-items:center; gap:10px; margin-top:16px; flex-wrap:wrap; }
  .btn-row .note { color:var(--text-3); font-size:11.5px; }

  .graph-page { display:flex; flex-direction:column; height:calc(100vh - var(--topbar)); min-height:520px; }
  .graph-bar { display:flex; align-items:center; justify-content:space-between; gap:16px; padding:12px 20px; border-bottom:1px solid var(--border-soft); background:var(--bg-soft); }
  .graph-title { display:flex; align-items:baseline; gap:10px; }
  .graph-title strong { font-size:14px; font-weight:600; }
  .graph-title span { color:var(--text-3); font:10.5px var(--mono); }
  .graph-actions { display:flex; gap:6px; }
  .gbtn { padding:5px 9px; border:1px solid var(--border); border-radius:6px; background:var(--surface); color:var(--text-2); font-size:11.5px; }
  .gbtn:hover { border-color:var(--primary); color:var(--primary); }
  .gbtn.on { border-color:var(--primary); color:var(--primary); background:var(--primary-soft); }
  .graph-stage { position:relative; flex:1; min-height:0; background-color:var(--bg); background-image:radial-gradient(circle,rgba(232,229,222,.07) 1px,transparent 1px); background-size:24px 24px; overflow:hidden; }
  #graph { display:block; width:100%; height:100%; touch-action:none; cursor:grab; }
  #graph.dragging { cursor:grabbing; }
  .graph-tip { position:absolute; z-index:3; max-width:280px; padding:8px 10px; border:1px solid var(--border); border-radius:8px; background:var(--surface-2); box-shadow:0 8px 24px rgba(0,0,0,.35); pointer-events:none; }
  .graph-tip .t { font-size:12.5px; font-weight:500; color:var(--text); line-height:1.35; }
  .graph-tip .m { margin-top:2px; color:var(--text-3); font:10px var(--mono); }
  .graph-tip[hidden] { display:none; }
  .graph-legend { position:absolute; left:14px; bottom:14px; z-index:2; display:flex; flex-wrap:wrap; gap:5px 10px; max-width:calc(100% - 28px); padding:8px 10px; border:1px solid var(--border); border-radius:8px; background:rgba(17,21,28,.86); backdrop-filter:blur(6px); }
  .legend-item { display:inline-flex; align-items:center; gap:5px; color:var(--text-2); font-size:10.5px; }
  .legend-dot { width:7px; height:7px; border-radius:50%; }
  .graph-help { margin:0; padding:7px 20px; border-top:1px solid var(--border-soft); color:var(--text-3); font:10.5px var(--mono); background:var(--bg-soft); }

  @media (max-width:900px) {
    .app { display:block; }
    .sidebar { position:static; height:auto; flex-direction:row; align-items:center; gap:14px; padding:10px 14px; border-right:0; border-bottom:1px solid var(--border-soft); overflow-x:auto; }
    .brand { padding:0; flex:0 0 auto; }
    .brand-name { display:none; }
    .nav { flex-direction:row; gap:2px; flex:1 1 auto; }
    .nav-item { padding:6px 9px; white-space:nowrap; }
    .nav-item .nav-count { display:none; }
    .sidebar-block, .sidebar-foot { display:none; }
    .topbar { top:0; padding:0 18px; }
    .main { padding:20px 18px; }
    .main.wide { padding:0; }
    .page-head h1 { font-size:24px; }
    .row { grid-template-columns:minmax(0,1fr) 74px; gap:10px; }
    .row-cat, .row-platform { display:none; }
    .row-date { font-size:10.5px; }
    .meta-grid { grid-template-columns:repeat(2,minmax(0,1fr)); }
    .meta-item:last-child { grid-column: span 2; }
    article.note h1 { font-size:28px; }
    article.note p, article.note li { font-size:16px; }
    .graph-page { height:calc(100vh - 104px); }
    .graph-legend { display:none; }
    .graph-title span { display:none; }
    .graph-title strong { white-space:nowrap; font-size:13px; }
    .graph-bar { padding:10px 14px; gap:10px; }
    .issue-line { grid-template-columns:1fr; gap:6px; }
    .topbar-right { display:none; }
  }
  @media (prefers-reduced-motion:reduce) { * { transition:none !important; scroll-behavior:auto !important; } }
`;

export type LayoutOptions = {
  title: string;
  body: string;
  vault: Vault;
  active: NavKey;
  category?: string;
  wide?: boolean;
  crumb?: string;
  topbarRight?: string;
};

export function layout({ title, body, vault, active, category, wide, crumb, topbarRight }: LayoutOptions): string {
  const stats = vault.stats;
  const nav = [
    { key: "library" as const, label: "Library", href: "/", icon: "library" as const, count: stats.total },
    { key: "tags" as const, label: "Tags", href: "/tags", icon: "tags" as const, count: stats.tags },
    { key: "issues" as const, label: "Issues", href: "/issues?tab=broken", icon: "alert" as const, count: stats.brokenLinks },
    { key: "graph" as const, label: "Graph", href: "/graph", icon: "graph" as const, count: 0 },
  ]
    .map(
      (item) =>
        `<a class="nav-item ${active === item.key ? "active" : ""}" href="${item.href}">${icon(item.icon, 17)}<span>${item.label}</span>${
          item.count ? `<span class="nav-count">${item.count}</span>` : ""
        }</a>`,
    )
    .join("");

  const categories = stats.categories
    .map(
      ([name, count]) =>
        `<a class="cat-link ${category === name ? "active" : ""}" href="${categoryHref(name)}" title="${esc(name)}"><span>${esc(name)}</span><span class="count">${count}</span></a>`,
    )
    .join("");

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<title>${esc(title)} · Second Brain</title><style>${css}</style></head>
<body><div class="app">
  <aside class="sidebar">
    <a class="brand" href="/" aria-label="Second Brain home"><span class="brand-mark">${logo}</span><span class="brand-name">Second Brain</span></a>
    <nav class="nav" aria-label="Main">${nav}</nav>
    <div class="sidebar-block"><div class="sidebar-label">Categories</div><div class="cat-list">${categories}</div></div>
    <div class="sidebar-foot"><span>${stats.total} notes</span><span>${stats.mocs} MOCs</span></div>
  </aside>
  <div class="content">
    <header class="topbar">
      <div class="crumb">${crumb ?? `<a href="/">Library</a>`}</div>
      <div class="topbar-right">${topbarRight ?? `<span><span class="dot"></span>local vault</span>`}</div>
    </header>
    <main class="main ${wide ? "wide" : ""}">${body}</main>
  </div>
</div></body></html>`;
}
