import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { getGuide, guideSlugs, guideUpdated } from '../../../../lib/guides';
import { jsonLd, pageMetadata, siteUrl } from '../../../../lib/seo';

export function generateStaticParams() { return guideSlugs.map(slug => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuide(slug);
  return guide ? pageMetadata(guide.title, guide.description, `/guides/${slug}`) : {};
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();
  const url = `${siteUrl}/guides/${slug}`;
  return <>
    <article className="public-wrap guide-article">
      <nav className="public-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/guides">Guides</Link></nav>
      <header className="guide-heading">
        <span className="public-eyebrow">{guide.category}</span>
        <h1>{guide.title}</h1>
        <p>{guide.summary}</p>
        <span className="guide-byline">By the Undertone project · Updated <time dateTime={guideUpdated}>19 October 2026</time></span>
      </header>
      <div className="guide-layout">
        <nav className="guide-toc" aria-label="In this guide"><strong>IN THIS GUIDE</strong>{guide.sections.map(section => <a href={`#${section.id}`} key={section.id}>{section.title}</a>)}</nav>
        <div className="guide-body">
          {guide.sections.map(section => <section id={section.id} key={section.id}>
            <h2>{section.title}</h2>
            {section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
            {section.example && <pre><code>{section.example}</code></pre>}
          </section>)}
          <div className="guide-next"><Link href={guide.action.href} className="public-button">{guide.action.label}<ArrowRight size={16}/></Link><Link href={guide.relatedFeature.href}>{guide.relatedFeature.label} ↗</Link><Link href="/help">Help & troubleshooting ↗</Link></div>
          <p className="guide-source">Independent project, powered by Fish Audio. For provider-specific requirements, see the <a href="https://docs.fish.audio/" target="_blank" rel="noreferrer">official Fish Audio documentation</a>.</p>
        </div>
      </div>
    </article>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({ '@context': 'https://schema.org', '@type': 'Article', headline: guide.title, description: guide.description, datePublished: guideUpdated, dateModified: guideUpdated, inLanguage: 'en', mainEntityOfPage: url, author: { '@type': 'Organization', name: 'Undertone project', url: 'https://github.com/Sanidhya14321/undertone' }, image: `${siteUrl}/opengraph-image` }) }}/>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl }, { '@type': 'ListItem', position: 2, name: 'Guides', item: `${siteUrl}/guides` }, { '@type': 'ListItem', position: 3, name: guide.title, item: url }] }) }}/>
  </>;
}
