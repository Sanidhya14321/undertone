# Changelog

## 0.1.1-beta.1 — 2026-10-19

- Shortened the primary address to https://undertone.vercel.app and updated canonical metadata and extension handoff links. The old studio remains accessible for browser-local projects.
- Fixed clipped workspace navigation with a scrollable sidebar and an accessible mobile drawer; public mobile navigation includes all destinations.
- Added system-aware light/dark themes with saved preferences across public pages, studio, and extension popup.
- Added remembered API keys with an explicit session-only option and removal on disconnect, including extension recovery after browser restart.
- Removed unused profile and workspace-switcher controls. Updated privacy, security, and connection guidance.
- Added regression coverage for key persistence, opt-out, malformed storage, extension recovery, and disconnect.

## 0.1.0-beta.1 — 2026-10-19

First public beta of Undertone, an independent Fish Audio workspace and browser companion.

### Added

- Directed speech, multi-speaker dialogue, voice-library browsing, private cloning, and voice-design auditions.
- Transcription with TXT, SRT, and VTT exports; browser-local projects and audio takes.
- Chrome/Edge MV3 extension with explicit selection capture, Fish Audio listening, and studio handoff.
- Public feature pages, practical workflow guides, troubleshooting, and plain-language privacy information.
- Canonical metadata, site-name and article structured data, sitemap, robots rules, and social previews.
- Apache 2.0 license, contribution guidance, issue forms, private security reporting, dependency maintenance, and release packaging.

### Changed

- Self-hosted fonts and isolated studio styles reduce dependencies on the public page's loading path.
- Studio remains excluded from search through readable `noindex` directives.
- Framework and dependency updates address published dependency advisories.

### Beta limits

- Live provider operations require a user's Fish Audio key and API credit.
- Uploads are limited to 4 MB; long requests may require splitting.
- Projects and takes remain local to the current browser and site origin.
- TXT edits do not rewrite timestamped subtitle exports; language controls do not translate text.
- Extension installation is unpacked/developer mode. No browser-store listing is published.
- Automated provider tests use controlled responses. Live billable requests and native extension playback require separate verification with a valid key.
