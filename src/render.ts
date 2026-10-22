import MarkdownIt from "markdown-it";
import type { Note, Vault } from "./vault.ts";

const md = new MarkdownIt({ html: false, linkify: true, typographer: false });

const baseLink = md.renderer.rules.link_open ?? ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options));
md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
  const href = tokens[idx].attrGet("href") ?? "";
  if (/^https?:/i.test(href)) {
    tokens[idx].attrSet("target", "_blank");
    tokens[idx].attrSet("rel", "noopener noreferrer");
  }
  return baseLink(tokens, idx, options, env, self);
};

export function noteUrl(note: Note): string {
  return `/note/${Buffer.from(note.id).toString("base64url")}`;
}

export function renderMarkdown(vault: Vault, text: string): string {
  const linked = text.replace(
    /\[\[([^\]|#]+)(?:#[^\]|]*)?(?:\|([^\]]*))?\]\]/g,
    (_match, target: string, alias?: string) => {
      const note = vault.resolve(target);
      return note ? `[${alias?.trim() || note.title}](${noteUrl(note)})` : `**[[${target.trim()}]]**`;
    },
  );
  return md.render(linked);
}
