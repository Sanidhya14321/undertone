# Your excuses translate beautifully

A buildless, responsive motion microsite for the multilingual owl concept. Original SVG artwork, CSS animation, and vanilla JavaScript; no generated imagery or framework runtime.

## Run

```sh
npm run dev
```

Open http://localhost:5173. `npm run check` checks JavaScript syntax. Static assets live in `dist/` and can be served from any static host.

## Playback

The 30-second timeline includes English, Spanish, French, Japanese, an English payoff, and an interactive end card. Play/pause, seek, chapter selection, replay, mute, captions, fullscreen, script download, and a local soundtrack loader are included. Space toggles playback; arrow keys seek five seconds when focus is outside an interactive control. Leaving the tab pauses playback. Reduced-motion preferences are respected.

Browser speech is a preview, not Fish Audio output. Where a matching language voice is unavailable, that chapter plays with captions. Open **Behind the voice** to load a finished 30-second audio take (29.5–30.5 seconds). It remains local to the browser and becomes the playback clock. No API key or voice generation service is bundled. No user files are uploaded.

Google Fonts are optional; local system fallbacks keep the experience usable offline.

Independent parody concept, not affiliated with Duolingo. Not an official Fish Audio site.
