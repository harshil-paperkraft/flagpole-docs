import Link from 'next/link';
import { notFound } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { getAllSlugs, getMeta, getPage } from '@/lib/content';
import { nav, flatNav } from '@/lib/nav';

const toSlug = (parts) => (parts?.length ? parts.join('/') : 'index');
const toHref = (slug) => (slug === 'index' ? '/docs/' : `/docs/${slug}/`);

export function generateStaticParams() {
  return getAllSlugs().map((s) => ({ slug: s === 'index' ? [] : s.split('/') }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = getPage(toSlug(slug));
  return page ? { title: page.meta.title, description: page.meta.description } : {};
}

export default async function DocPage({ params }) {
  const { slug: parts } = await params;
  const slug = toSlug(parts);
  const page = getPage(slug);
  if (!page) notFound();

  const groups = nav.map((g) => ({ group: g.group, pages: g.pages.map((s) => ({ slug: s, title: getMeta(s).sidebar_label || getMeta(s).title })) }));
  const i = flatNav.indexOf(slug);
  const prev = i > 0 ? flatNav[i - 1] : null;
  const next = i >= 0 && i < flatNav.length - 1 ? flatNav[i + 1] : null;
  const group = nav.find((g) => g.pages.includes(slug))?.group;

  return (
    <div className="docs">
      <Sidebar groups={groups} />
      <main className="doc">
        {group && <p className="eyebrow">{group}</p>}
        <h1>{page.meta.title}</h1>
        {page.meta.description && <p className="lede">{page.meta.description}</p>}
        <article className="prose" dangerouslySetInnerHTML={{ __html: page.html }} />
        <nav className="pager">
          {prev ? <Link href={toHref(prev)}>← {getMeta(prev).title}</Link> : <span />}
          {next && <Link href={toHref(next)}>{getMeta(next).title} →</Link>}
        </nav>
        <p className="edit">
          <a href={`https://github.com/harshil-paperkraft/flagpole-docs/edit/main/content/${slug}.md`} target="_blank" rel="noreferrer">Edit this page on GitHub</a>
        </p>
      </main>
      {page.toc.length > 1 && (
        <aside className="toc">
          <p className="sidebar-heading">On this page</p>
          <ul>
            {page.toc.map((t) => (
              <li key={t.id} className={`toc-${t.depth}`}><a href={`#${t.id}`}>{t.text}</a></li>
            ))}
          </ul>
        </aside>
      )}
    </div>
  );
}
