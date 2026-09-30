import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { Marked } from 'marked';

const CONTENT_DIR = path.join(process.cwd(), 'content');

function slugify(text) {
  return text.toLowerCase().replace(/<[^>]+>/g, '').replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');
}

export function getAllSlugs() {
  const walk = (dir) =>
    fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) return walk(full);
      return e.name.endsWith('.md') ? [path.relative(CONTENT_DIR, full).replace(/\.md$/, '')] : [];
    });
  return walk(CONTENT_DIR);
}

export function getMeta(slug) {
  const file = fs.readFileSync(path.join(CONTENT_DIR, `${slug}.md`), 'utf8');
  return matter(file).data;
}

export function getPage(slug) {
  const file = path.join(CONTENT_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const { data, content } = matter(fs.readFileSync(file, 'utf8'));

  const toc = [];
  const marked = new Marked({
    renderer: {
      heading({ tokens, depth, text }) {
        const html = this.parser.parseInline(tokens);
        const id = slugify(text);
        if (depth === 2 || depth === 3) toc.push({ id, text: html.replace(/<[^>]+>/g, ''), depth });
        return `<h${depth} id="${id}"><a class="anchor" href="#${id}">${html}</a></h${depth}>\n`;
      },
      link({ href, tokens }) {
        const text = this.parser.parseInline(tokens);
        if (/^https?:/.test(href)) return `<a href="${href}" target="_blank" rel="noreferrer">${text}</a>`;
        if (href.startsWith('#')) return `<a href="${href}">${text}</a>`;
        // Content links are written relative to the source file (./other.md, ../api/flags.md#x).
        // Resolve them to absolute /docs/ URLs so trailing slashes can't break them.
        const [file, hash] = href.split('#');
        const target = path.posix.join(path.posix.dirname(slug), file).replace(/\.md$/, '');
        const url = target === 'index' ? '/docs/' : `/docs/${target}/`;
        return `<a href="${url}${hash ? `#${hash}` : ''}">${text}</a>`;
      },
      blockquote({ tokens }) {
        const body = this.parser.parse(tokens);
        const m = body.match(/^<p>\s*\[!(NOTE|TIP|WARNING)\]\s*/);
        if (!m) return `<blockquote>${body}</blockquote>`;
        return `<div class="callout callout-${m[1].toLowerCase()}"><p>${body.slice(m[0].length)}</div>`;
      },
    },
  });

  return { meta: data, html: marked.parse(content), toc };
}
