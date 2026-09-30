import Link from 'next/link';
import './globals.css';

export const metadata = {
  title: { default: 'Flagpole docs', template: '%s · Flagpole docs' },
  description: 'Feature flags and remote config for teams that ship daily.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="topbar">
          <Link href="/" className="brand">
            <span className="brand-mark" aria-hidden>⚑</span> Flagpole <span className="brand-sub">docs</span>
          </Link>
          <nav className="topnav">
            <Link href="/docs/">Docs</Link>
            <Link href="/docs/api/overview/">API</Link>
            <Link href="/docs/faq/">FAQ</Link>
            <a href="https://github.com/harshil-paperkraft/flagpole-docs" target="_blank" rel="noreferrer">GitHub</a>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
