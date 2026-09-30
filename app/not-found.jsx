import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="home">
      <section className="hero">
        <h1>That page isn’t here.</h1>
        <p>It may have moved when the docs were reorganised.</p>
        <Link className="button" href="/docs/">Go to the docs home</Link>
      </section>
    </main>
  );
}
