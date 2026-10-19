import Link from 'next/link';
import { ArrowUpRight, AudioLines, Menu } from 'lucide-react';
import ThemeToggle from '../../components/theme/ThemeToggle';
import './marketing.css';

const navigation = [
  ['Voice studio', '/features/text-to-speech'],
  ['Voices', '/features/voice-cloning'],
  ['Transcription', '/features/transcription'],
  ['Guides', '/guides'],
  ['Extension', '/extension'],
  ['Help', '/help']
];
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <div className="public-site">
    <a className="skip-link" href="#content">Skip to content</a>
    <header className="public-header public-wrap">
      <Link className="public-brand" href="/" aria-label="Undertone home"><AudioLines size={26}/>undertone<span>.</span></Link>
      <nav className="public-desktop-nav" aria-label="Main navigation"><Link href="/features/text-to-speech">Voice studio</Link><Link href="/guides">Guides</Link><Link href="/extension">Extension</Link></nav>
      <div className="public-header-actions">
        <ThemeToggle/>
        <Link className="public-button small public-studio-link" href="/studio" aria-label="Open studio"><span>Open studio</span><ArrowUpRight size={15}/></Link>
        <details className="public-mobile-menu">
          <summary aria-label="Open site navigation"><Menu size={21}/></summary>
          <nav aria-label="Mobile navigation">{navigation.map(([label, href]) => <Link href={href} key={href}>{label}<ArrowUpRight size={14}/></Link>)}</nav>
        </details>
      </div>
    </header>
    <main id="content">{children}</main>
    <footer className="public-footer public-wrap">
      <div><Link className="public-brand" href="/"><AudioLines size={22}/>undertone<span>.</span></Link><p>Independent voice workspace.<br/>Powered by Fish Audio.</p></div>
      <nav aria-label="Footer navigation">{navigation.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}<Link href="/privacy">Privacy & data</Link><a href="https://github.com/Sanidhya14321/undertone" target="_blank" rel="noreferrer">Source on GitHub ↗</a></nav>
      <span>Good words deserve a good voice.</span>
    </footer>
  </div>;
}
