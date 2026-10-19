# Contributing to Undertone

Thanks for helping make a focused voice workspace. Start with an existing issue, or describe the problem before implementing a large change. Small fixes and documentation improvements can go straight to a pull request.

## Local setup

Use Node.js 22.x, npm, and Python 3 (for the extension ZIP).

```sh
git clone https://github.com/Sanidhya14321/undertone.git
cd undertone
npm ci
npm run dev
```

The public website is at `http://localhost:3000`; the workspace is at `/studio`. No provider secret is required to run or build. For a live provider test, enter your own Fish Audio key in the studio. Never put it in source, a screenshot, a fixture, an issue, or a commit.

## Before opening a pull request

```sh
npm test
npm run build
npm run check:site -- --start
```

The build also checks TypeScript. `npm run check` is available separately. HTTP smoke checks cover the built public pages and API boundary without making billable provider requests.

For UI changes, also check keyboard navigation, readable focus states, and narrow screens. For extension changes, load `extension/` unpacked in Chrome or Edge 124+ and describe the native behavior you tested. Automated tests do not replace installed-extension playback with a valid key.

Keep changes focused. Explain the user-visible problem, the resulting behavior, and what you verified. Update the relevant guide when behavior changes. Add tests for meaningful behavioral boundaries rather than duplicating implementation details.

## Project conventions

- Use TypeScript and server components for public content. Keep browser state in the studio.
- Preserve the authored visual system. Do not introduce generated artwork, invented testimonials, fake usage counters, or unsupported capability claims.
- Keep API keys out of persisted projects, URLs, logs, and generated assets.
- Maintain the fixed Fish Audio upstream and endpoint allowlist. Explain any new permission, endpoint, or data-storage change in the PR.
- Add new public pages to the sitemap and navigation; give each a distinct title, description, H1, and canonical URL.
- Keep studio and API responses out of search results. Allow crawlers to read the studio's `noindex` directive.
- Preserve Apache 2.0 and applicable third-party notices in redistributed code and extension packages.

## Reporting issues

Use the bug or feature-request templates. Include a minimal reproduction, browser/version, and sanitized error. Do not upload someone else's voice or private recordings. Security findings belong in [private vulnerability reporting](https://github.com/Sanidhya14321/undertone/security/advisories/new), as described in [SECURITY.md](SECURITY.md).

## Contribution terms

Contributions intentionally submitted for inclusion are under Apache License 2.0 unless explicitly stated otherwise. Only submit material you have the right to contribute. This project does not ask you to transfer copyright ownership. Existing dependencies and third-party assets keep their own licenses.
