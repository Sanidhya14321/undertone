import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { pageMetadata } from '../../../lib/seo';

export const metadata = pageMetadata('Help with Fish Audio keys, uploads & browser listening', 'Troubleshoot Fish Audio connections, generation errors, upload limits, subtitle exports, and the Undertone Chrome or Edge extension.', '/help');
const help = [
  ['My key does not connect.', 'Use an API key from your Fish Audio account, rather than a website password or a voice ID. Remove accidental spaces and check that the key is active. The studio validates the connection by requesting the voice library. Reloading the tab disconnects it.'],
  ['Generation is rejected or rate limited.', 'Check your Fish Audio API credit, the selected model, and the voice/reference ID. A voice must be accessible to your account. For a rate-limit response, wait before retrying. Repeated generation attempts can create additional provider usage; keep test scripts short.'],
  ['My upload is too large or times out.', 'This deployment accepts audio uploads up to 4 MB. Compress or split larger recordings before uploading. Long transcription requests can time out before the 300-second hosting limit. Changing the filename does not convert an audio format.'],
  ['The language setting did not translate my script.', 'The language control guides normalization and pronunciation. Write or paste the words in the language you want spoken. Phrase-level switching is experimental, and its result depends on the voice and language pair.'],
  ['The transcript edit is missing from my subtitles.', 'Text corrections apply to the TXT export. SRT and VTT use the original words and timestamps returned by Fish Audio. Editing a transcript does not realign the recording; review and correct caption files before publication.'],
  ['The extension cannot capture this page.', 'Browser settings pages, extension stores, and some PDF viewers block capture. Make a new selection on a normal webpage or paste text into the popup. The extension requires a separate Fish Audio connection from the website.'],
  ['I moved to another browser or domain and my projects disappeared.', 'Projects and generated takes are stored locally for the current site origin. They do not sync across browsers, devices, or domains. Export projects as JSON and download audio before clearing site data or moving to another deployment.'],
  ['Is Undertone free?', 'The project does not charge a separate application fee. Fish Audio operations use your own account and API credit, subject to Fish Audio’s current pricing. Self-hosting may incur hosting costs. No provider credits are included.']
];

export default function HelpPage() {
  return <article className="public-prose public-wrap">
    <span className="public-eyebrow">GET BACK TO THE GOOD PART.</span>
    <h1>A little help<br/>for your next take.</h1>
    <p className="prose-intro">Common questions about the studio and browser companion. Start with a <Link href="/guides">workflow guide</Link> if this is your first visit.</p>
    {help.map(([title, body]) => <section key={title}><h2>{title}</h2><p>{body}</p></section>)}
    <h2>Report a reproducible problem</h2>
    <p>Include your browser version, the steps you followed, and the error text. Remove keys, private scripts, recordings, and personal details from screenshots or logs. Check existing issues before opening a new report.</p>
    <p><a href="https://github.com/Sanidhya14321/undertone/issues/new/choose" target="_blank" rel="noreferrer">Report a bug on GitHub ↗</a></p>
    <p>For a security issue, use <a href="https://github.com/Sanidhya14321/undertone/security/advisories/new" target="_blank" rel="noreferrer">private vulnerability reporting</a> instead of a public issue.</p>
    <Link className="public-text-link" href="/studio">Back to the studio <ArrowRight size={15}/></Link>
  </article>;
}
