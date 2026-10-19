# Search visibility and indexing

SEO makes pages accessible, understandable, and useful. It does not guarantee first place, indexing, a rich result, or a particular time to appear. Google documents that ranking depends on many signals and that even compliant pages are not guaranteed to be indexed.

## Search intent and useful destinations

| Intent | Destination |
| --- | --- |
| Undertone / Undertone Fish Audio studio | `/` |
| Fish Audio text-to-speech workflow | `/features/text-to-speech`, `/guides/fish-audio-text-to-speech` |
| Fish Audio Chrome or Edge extension / read selected text aloud | `/extension`, `/guides/read-webpages-aloud` |
| Fish Audio private voice cloning and design | `/features/voice-cloning` |
| Fish Audio transcription / audio to SRT or VTT | `/features/transcription`, `/guides/audio-to-srt-subtitles` |
| Connection, upload, and extension problems | `/help` |

Feature pages explain capabilities. Guides explain a task with real steps, examples, limitations, and links into the actual workflow. Add original content only when it solves another real user problem. Avoid duplicated keyword pages, fake reviews, invented claims, paid link schemes, and unsupported language variants.

## Implemented

- Server-rendered public content, semantic headings, linked navigation, and a skip link.
- Distinct titles/descriptions, a stable canonical origin, sitemap, robots directives, and social previews.
- Home-page `WebSite` identity and `WebApplication` data; guide `Article` and breadcrumb data. No fabricated reviews, prices, or ratings.
- Visible FAQs remain useful content. FAQ rich-result markup was removed because Google discontinued that search feature in 2026.
- The studio has HTML and response-header `noindex`; API responses also carry `noindex`. The studio is allowed to be crawled so the directive can be seen. Neither appears in the sitemap.
- Self-hosted fonts with swap loading; studio CSS is excluded from public page styling. No application analytics scripts.
- HTTP checks prevent canonical drift, missing metadata, blocked public pages, broken internal links, invalid JSON-LD, soft 404s, and accidental studio indexing.

## Ownership and sitemap submission

1. Sign in to [Google Search Console](https://search.google.com/search-console) using the owner's Google account.
2. Add the **URL-prefix property** `https://undertone-voice-workspace.vercel.app/`. For this hosted subdomain, use URL-prefix verification rather than trying to verify ownership of `vercel.app`.
3. Choose the HTML-tag verification method. Set the tag's `content` value as `GOOGLE_SITE_VERIFICATION` in the Vercel production environment. This is a public verification value, not a password or API token.
4. Redeploy, inspect the public page source for the exact verification tag, and complete verification in Search Console. Keep that tag in place.
5. Submit `https://undertone-voice-workspace.vercel.app/sitemap.xml` under Sitemaps.
6. Use URL Inspection on the homepage, extension page, and useful guides; request indexing if offered. Repeated submissions do not guarantee or accelerate ranking.
7. In [Bing Webmaster Tools](https://www.bing.com/webmasters/), import the verified Search Console property or use the meta-tag method with `BING_SITE_VERIFICATION` and redeploy.

Google and Bing account verification/submission remain owner-account operations until their successful states are confirmed. Adding metadata support alone does not submit or verify a site.

## Custom domain

A memorable owned domain is a branding choice, not a guaranteed ranking boost. When one is selected, configure DNS/TLS in Vercel, set `NEXT_PUBLIC_SITE_URL`, and redeploy. Check canonical URLs, sitemap, share cards, extension targets, and redirects. Verify a new Search Console property. Export local work before moving: browser storage is scoped to the old origin.

## Measure and improve

Once there is enough real data, review Search Console indexing, impressions, clicks, queries, and click-through rates. Compare page-level results over meaningful periods rather than claiming a ranking based on a single personalized search. Use actual Core Web Vitals field data when available; do not invent a Lighthouse or performance score. Update guides when provider behavior changes and keep their modification dates accurate.

Maintain relevant links from the GitHub README and release notes. Share the project through channels the owner chooses; do not post to other communities or send outreach without authorization.

## Official references

- [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [How Google Search works](https://developers.google.com/search/docs/fundamentals/how-search-works)
- [Site names](https://developers.google.com/search/docs/appearance/site-names)
- [Readable noindex directives](https://developers.google.com/search/docs/crawling-indexing/block-indexing)
- [Google search documentation updates](https://developers.google.com/search/updates)
