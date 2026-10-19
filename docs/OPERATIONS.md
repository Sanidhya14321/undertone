# Operations

## Production

- Public site: https://undertone-voice-workspace.vercel.app
- Vercel project: `undertone-voice-workspace`
- Project ID: `prj_6srLCJBALhiCF04OCNez3XALS8lJ`
- Team ID: `team_24L9YCHfs3FU3CHYdzALBD2l`
- Source: https://github.com/Sanidhya14321/undertone (`main`)

These identifiers are routing context, not credentials. Use your own authenticated Vercel CLI session. Never paste a provider token into a command argument or public log.

The first deployment was uploaded through the CLI. GitHub-triggered Vercel deployments require a GitHub Login Connection in the Vercel owner account; do not assume they are configured because this public repository exists.

## Deploy

```sh
npm ci
npm test
npm run build
npm run check:site -- --start
vercel project inspect undertone-voice-workspace --scope team_24L9YCHfs3FU3CHYdzALBD2l --non-interactive
vercel deploy --prod --project prj_6srLCJBALhiCF04OCNez3XALS8lJ --scope team_24L9YCHfs3FU3CHYdzALBD2l --non-interactive --yes
npm run check:site -- https://undertone-voice-workspace.vercel.app
```

Verify the intended project/team before deployment. Confirm `READY`, the production alias, and commit metadata afterward. The default canonical origin comes from `VERCEL_PROJECT_PRODUCTION_URL`; use `NEXT_PUBLIC_SITE_URL` only for an intentionally selected production domain. Node is pinned to 22.x.

Search verification values are optional and require redeployment because public pages are built statically. No shared Fish Audio key is required or supported as a deployment secret.

## After deployment

Check the public homepage, a guide, studio connection dialog, extension download, sitemap, robots, share image, and unauthenticated API boundary. A provider check needs an authorized key and may consume credit; keep any script short and never log credentials. For the extension, verify its native playback after installation when you have a valid key.

For failures, inspect build/runtime logs in Vercel and preserve only sanitized error information. Do not put request bodies, keys, recordings, or private scripts into public issues. No automated uptime monitor or background maintainer agent is implied by this repository.

## Rollback

Open the Vercel project's deployment history, identify a known-good deployment for this same project/team, and restore/promote it through Vercel. Confirm its commit, production alias, and smoke check afterward. A Git revert alone does not change the deployed site unless another deployment runs. Do not delete the failing deployment as a substitute for rollback.

## Maintenance

Review Dependabot update PRs and alerts, run the quality checks, and merge reviewed updates. Automatic merging is not enabled. Keep the provider docs, permission explanations, and help pages consistent with the actual application. Export browser projects and audio before origin changes; there is no server-side backup to restore local data.
