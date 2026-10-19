# Undertone

**A voice workspace and browser companion powered by Fish Audio.**

Create expressive speech, direct multi-speaker dialogue, clone a permissioned voice, design voice auditions, and transcribe recordings. This is an independent project, not an official Fish Audio product.

[Open the source](https://github.com/Sanidhya14321/undertone) · [Deploy to Vercel](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FSanidhya14321%2Fundertone)

## Run locally

Requires Node.js 22.13+.

```sh
npm ci
npm run dev
```

Open `http://localhost:3000` for the public site or `/studio` for the workspace.

```sh
npm test        # Request, privacy boundary, extension, and SEO tests
npm run check   # TypeScript
npm run build   # Package the extension and build Next.js
npm start       # Serve the production build
```

## Connect Fish Audio

Open the studio and click **Connect Fish Audio**. Enter your own API key from [Fish Audio](https://fish.audio/app/api-keys). Connection validation reads the voice library. Generation, cloning, design, and transcription use your Fish Audio API credit.

The key is kept in memory for that tab, forwarded by the same-origin API proxy to Fish Audio, and never stored in the project or a server database. Reload to disconnect. No shared provider key is bundled or required as a deployment secret.

## Workflows

| Workflow | What it does |
| --- | --- |
| Voice studio | Edit scripts, insert acting directions, add phrase-level tags, adjust speed/expressiveness, and export MP3/WAV/Opus. |
| Dialogue | Assign voice IDs to speakers and generate the conversation with native speaker tags. |
| Voice library | Browse documented examples, search the live library, load private voices, or enter a custom voice ID. |
| Cloning | Create a private fast voice from a permissioned recording and optional transcript. |
| Voice design | Compare one to four generated WAV auditions from a written brief. |
| Transcription | Get text, word timestamps, and optional speaker turns; export TXT/SRT/VTT or open text as a script. |
| Audio library | Keep generated takes in IndexedDB, play real audio, inspect decoded waveforms, and download files. |
| Browser extension | Capture explicit text selections, listen with Fish Audio, or hand text to the studio. |

Projects autosave in localStorage; generated takes save as blobs in IndexedDB. This is browser-local storage, not cloud synchronization. Download important work before clearing site data. Text edits affect TXT exports; subtitles retain the original word timestamps. Language controls do not translate scripts. Phrase-level language switching is experimental.

## Deploy to Vercel

Import this repository into Vercel and choose **Next.js**. `vercel.json` declares the build, install command, and API duration. The default build works with the project’s public Vercel URL; no API key is needed for deployment.

If using a custom domain, set `NEXT_PUBLIC_SITE_URL` to its HTTPS origin and redeploy. Otherwise the site uses Vercel’s stable `VERCEL_PROJECT_PRODUCTION_URL` automatically. Do not set this to a temporary preview URL.

The deployment includes:

- Static public homepage, feature pages, extension instructions, and privacy information.
- Page-specific titles, descriptions, canonical URLs, Open Graph/Twitter metadata, and a code-rendered share image.
- `sitemap.xml`, `robots.txt`, visible-content-matched structured data, semantic navigation, and a skip link.
- `noindex` rules for `/studio` and API routes; user projects never appear in the sitemap.
- GitHub Actions checks for tests and the production build.

Vercel Functions impose a 4.5 MB request limit. This application accepts files up to 4 MB to leave room for multipart metadata. Transcription requests time out before the 300-second function duration; split long recordings. This deployment does not support the earlier Sites version’s 24 MB uploads.

The previous Sites/Vinext build remains available through `npm run dev:sites` and `npm run build:sites`. It is not the Vercel build target.

## Install the browser companion

Download `/downloads/undertone-extension.zip` from your deployed site. Unzip it, open `chrome://extensions` or `edge://extensions`, enable Developer mode, and choose **Load unpacked**. Select the folder containing `manifest.json`.

Open the extension and add your Fish Audio key. It is kept in `chrome.storage.session`, not permanent local storage. The packaged extension automatically targets the deployment’s `/studio` URL. You can override the studio URL in its settings for local development or another host.

```sh
npm run package:extension
```

Local builds default to `http://localhost:3000/studio`. Set `NEXT_PUBLIC_SITE_URL` before packaging a standalone ZIP for another origin. Extension source lives in `extension/`. The ZIP is an unpacked developer package, not a Chrome Web Store publication. Chrome/Edge 124+ is required.

Only explicitly selected text is read. The extension has no browsing-history permission, persistent all-page content script, or all-sites host permission. Listening calls Fish Audio directly. Studio handoff URLs contain text, title, and source path, but never the API key. Source queries/fragments are stripped; the studio removes the import fragment after reading it. Protected pages and some PDF viewers require pasting text instead of capture.

## Architecture and limits

- Next.js App Router, React, TypeScript, and authored SVG/CSS visuals.
- `app/api/fish/[...path]/route.ts` delegates to `lib/fish-proxy.mjs`.
- Fixed upstream host and endpoint allowlist, per-request key, origin checks, exact model headers, upload limit, cancellation, timeouts, no-store responses, and key redaction in provider errors.
- No application analytics, advertising scripts, account database, or cloud audio storage. Google Fonts and hosting providers receive routine network requests.
- No automatic translation, telephony, agent hosting, or claimed hosted continuation editing.

Live billable API calls require a user-provided key. Tests cover request construction and integration boundaries with controlled upstream responses; native extension playback must also be checked after installation with a valid key.

## Documentation

- [Fish Audio Drama 3](https://docs.fish.audio/features/text-to-speech/drama-3)
- [Fish Audio API schema](https://docs.fish.audio/api-reference/openapi.json)
- [Fish Audio speech to text](https://docs.fish.audio/features/speech-to-text)
- [Chrome offscreen API](https://developer.chrome.com/docs/extensions/reference/api/offscreen)

Report reproducible issues in GitHub. Never post API keys, private recordings, or personal transcripts in a public issue.
