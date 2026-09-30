import Link from 'next/link';

const cards = [
  { href: '/docs/getting-started/quickstart/', title: 'Quickstart', body: 'Create a flag and read it from your app in five minutes.' },
  { href: '/docs/concepts/targeting-rules/', title: 'Targeting rules', body: 'Decide who sees what, by attribute, segment or percentage.' },
  { href: '/docs/guides/progressive-delivery/', title: 'Progressive delivery', body: 'Roll out from 1% to 100% with a plan to roll back.' },
  { href: '/docs/api/overview/', title: 'API reference', body: 'Every endpoint for managing flags and evaluating them.' },
];

export default function Home() {
  return (
    <main className="home">
      <section className="hero">
        <h1>Ship the code today. Turn it on when you are ready.</h1>
        <p>Flagpole is feature flags and remote config for teams that deploy many times a day. These docs cover the SDKs, the concepts behind targeting, and the REST API.</p>
        <Link className="button" href="/docs/getting-started/quickstart/">Start the quickstart →</Link>
      </section>
      <section className="cards">
        {cards.map((c) => (
          <Link key={c.href} href={c.href} className="card">
            <h2>{c.title}</h2>
            <p>{c.body}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
