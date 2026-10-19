# Security policy

## Supported versions

Security fixes target the latest published release and `main`. Undertone is currently a public beta. Older beta snapshots are not maintained as separate release lines.

## Report a vulnerability privately

Use [GitHub private vulnerability reporting](https://github.com/Sanidhya14321/undertone/security/advisories/new). Do not disclose an unpatched vulnerability in a public issue or PR.

Include the affected version or commit, reproducible steps, the expected boundary, and a description of impact. Use a harmless demonstration and synthetic data. Never send real API keys, private recordings, personal transcripts, or unrelated account information. Maintainer response times are not guaranteed; there is no published bounty program.

## Important boundaries

- Remembered website keys use localStorage; remembered extension keys use `chrome.storage.local` restricted to trusted extension contexts. Both offer session-only use and removal on disconnect. Saved keys are unencrypted and should only be used on trusted devices.
- The website's same-origin proxy forwards the current request to an allowlisted Fish Audio endpoint.
- Generated projects and audio are browser-local. They are not end-to-end encrypted cloud backups.
- The extension reads explicit selections and grants host access only to Fish Audio.
- Hosting and Fish Audio operate under their respective policies; provider requests use the user's API credit.

Maintainers should keep dependency alerts enabled, review dependency update PRs, and verify a production build before publishing. Never copy a production credential into a test or CI variable when a controlled response can verify the behavior.

## Development-tool dependency alerts

At this beta release, the production dependency audit is clean. A full audit still reports upstream advisories in the development-only lint/glob stack, Drizzle CLI tooling, and optional Sites/Vinext tooling, including transitive packages without a compatible published fix. These are not the native Next.js production serving path. Do not expose development servers publicly or process untrusted inputs with development tools.

CI gates high/critical production advisories with `npm audit --omit=dev --audit-level=high`. Dependabot also tracks development dependencies. Review upstream fixes and their compatibility rather than forcing the old major-version downgrades suggested by some audit output. This is a recorded limitation, not a claim that every development dependency is advisory-free.
