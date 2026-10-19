import Link from 'next/link';

export default function NotFound() {
  return <main className="not-found">
    <Link className="not-found-brand" href="/">undertone<span>.</span></Link>
    <p className="mono">404 / A MISSED CUE</p>
    <h1>Let’s find<br/>the right page.</h1>
    <p>This address doesn’t lead to a page. Your next take is still waiting in the studio.</p>
    <nav aria-label="Find your way"><Link href="/studio">Open the studio ↗</Link><Link href="/guides">Read a guide ↗</Link><Link href="/">Back home ↗</Link></nav>
  </main>;
}
