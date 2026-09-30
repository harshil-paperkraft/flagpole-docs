'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar({ groups }) {
  const pathname = usePathname();
  return (
    <nav className="sidebar" aria-label="Documentation">
      {groups.map((g) => (
        <div key={g.group} className="sidebar-group">
          <p className="sidebar-heading">{g.group}</p>
          <ul>
            {g.pages.map((p) => {
              const href = p.slug === 'index' ? '/docs/' : `/docs/${p.slug}/`;
              return (
                <li key={p.slug}>
                  <Link href={href} className={pathname === href ? 'active' : undefined}>
                    {p.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
