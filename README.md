# Flagpole docs

Documentation for **Flagpole** — feature flags and remote config for teams that ship daily.
Custom Next.js (App Router) site. Sample content for testing.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # static export to ./out
```

## Layout

- `content/` — every page, as Markdown with frontmatter (`title`, `description`).
- `lib/nav.js` — sidebar order and grouping. A page not listed here still builds, it just isn't in the sidebar.
- `lib/content.js` — reads and renders Markdown, builds the table of contents.
- `app/docs/[[...slug]]/page.jsx` — the single docs route.
