import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { guides, guideSlugs } from '../../../lib/guides';
import { pageMetadata } from '../../../lib/seo';

export const metadata = pageMetadata('Fish Audio guides: speech, browser listening & subtitles', 'Practical Undertone guides for Fish Audio text to speech, reading selected webpage text aloud, and exporting SRT or VTT subtitles.', '/guides');

export default function GuidesPage() {
  return <>
    <section className="feature-hero public-wrap">
      <span className="public-eyebrow">A LITTLE GUIDANCE. A BETTER FIRST TAKE.</span>
      <h1>From an idea<br/>to something useful.</h1>
      <p>Practical ways to use Fish Audio in Undertone. Start with your words, a recording, or a passage from your browser.</p>
    </section>
    <section className="guide-grid public-wrap" aria-label="Workflow guides">
      {guideSlugs.map(slug => <Link className="guide-card" href={`/guides/${slug}`} key={slug}>
        <span className="public-eyebrow">{guides[slug].category}</span>
        <h2>{guides[slug].title}</h2>
        <p>{guides[slug].summary}</p>
        <span className="public-text-link">Read the guide <ArrowRight size={16}/></span>
      </Link>)}
    </section>
    <div className="feature-bottom public-wrap"><p>Need help with a connection, upload, or download?</p><Link href="/help">Help & troubleshooting <ArrowRight size={14}/></Link></div>
  </>;
}
