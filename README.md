# Undertone — Fish Audio workspace

A functional voice studio and a Manifest V3 browser extension companion. Built with React, TypeScript, Vinext/Vite, and a narrowly scoped Fish Audio API proxy. All visual assets are code-native; no generated imagery.

## Run locally

```sh
npm install
npm run dev -- --port 5174
```

Open `http://127.0.0.1:5174`. The default starter port is 5173 if no override is passed. Node 22.13+ is required. The preview uses the portable Sites runtime.

## Use the studio

Click **Connect Fish Audio** and enter your API key. Connection checks use a read-only voice-library request. Your key lives only in React memory for that tab, is sent over a same-origin API request to Fish Audio, and is not stored with projects. Reload to disconnect. API operations use your own Fish Audio credit.

- **Voice studio:** editable scripts, direction cues, selected-word delivery/language tags, pronunciation replacements, speed, expressiveness, model, and MP3/WAV/Opus output.
- **Dialogue:** assign voice IDs to speakers and edit turns. The app sends one `reference_id` array with matching native speaker tags.
- **Voice library:** curated documented voices without a connection; live search and private-voice loading with your key. Custom voice IDs are supported.
- **Voice cloning:** upload a permissioned recording, optionally provide its transcript, and create a private fast voice model.
- **Voice design:** generate 1–4 WAV auditions from a prompt; download candidates and create reusable models through cloning.
- **Transcription:** upload audio, receive text and optional speaker turns, edit the transcript, export TXT/SRT/VTT, and open text in the studio. Subtitle timing comes from the original transcript; edits affect TXT only.
- **My audio:** generated takes persist as real audio blobs in IndexedDB. Playback, real decoded waveforms, seeking, and downloads are included. Browser storage failures offer direct downloads.

Projects autosave in localStorage. Local storage is device- and browser-specific; clearing site data deletes projects and takes. Export important work. Audio uploads are capped at 24 MB in the UI (25 MB server limit). Each synthesis is capped at 20,000 characters. There is no automatic translation: language settings guide pronunciation/normalization; language tags are experimental.

## Browser extension

The source is in `extension/`. A ready-to-install developer ZIP is served at `/downloads/undertone-extension.zip`.

```sh
npm run package:extension
```

Unzip, enable Developer mode at `chrome://extensions` or `edge://extensions`, and choose **Load unpacked**. See `extension/README.md` for setup. Installation is user-controlled; this project does not install itself or publish to a browser store.

The extension captures explicit selections via `activeTab` and a context menu, supports Fish Audio listening in an offscreen document, and hands text to the web studio via a Unicode-safe URL fragment. The studio immediately removes the import fragment. Keys are never included in those URLs. Source query strings and fragments are removed. Extension keys use `chrome.storage.session`, and its API requests go directly to Fish Audio. It has no browsing-history permission or persistent all-page content script.

## API boundaries

`app/api/fish/[...path]/route.ts` uses `lib/fish-proxy.mjs`. Only TTS, ASR, voice design, voice listing/creation, and API-credit reads are permitted. The proxy requires a per-request key, checks origin, validates exact model headers, caps upload size, uses timeouts, returns non-cacheable responses, and redacts the key from provider errors. There is no server-side key database or bundled secret.

This app implements the documented hosted endpoints; it does not claim experimental self-hosted continuation editing, telephony, agent hosting, or automatic dubbing/translation.

## Validation

```sh
npm run check
npm test
node /home/sanidhya/.codex/plugins/cache/openai-curated-remote/sites/1.0.0/scripts/build-site.mjs
```

Tests cover request construction, speaker mappings, pronunciation validation, subtitle time boundaries, proxy authentication/origin/model/size restrictions, multipart forwarding, binary output, error redaction, extension permissions, Unicode handoff, URL restrictions, background routing, and offscreen runtime messaging. Browser QA covers editing/persistence, connection gating, navigation, extension download, and mobile widths. Live billable Fish Audio calls require a user-provided key; they cannot be verified without one. Extension behavior is unit-tested and packaged; native browser installation and live playback require user installation and a valid key.

## Sources

- [Drama 3 direction and multi-speaker guide](https://docs.fish.audio/features/text-to-speech/drama-3)
- [Fish Audio OpenAPI](https://docs.fish.audio/api-reference/openapi.json)
- [Speech to text](https://docs.fish.audio/features/speech-to-text)
- [Voice design](https://docs.fish.audio/features/voice-design)
- [Chrome offscreen API](https://developer.chrome.com/docs/extensions/reference/api/offscreen)

Independent tool powered by Fish Audio. Not an official Fish Audio product. The owl concept from the first iteration remains an optional multilingual script template, and the original showcase is recoverable in Git history.
