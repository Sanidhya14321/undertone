# Operations

## Production

- Public site: https://undertone.vercel.app
- Vercel project: `undertone`
- Project ID: `prj_6srLCJBALhiCF04OCNez3XALS8lJ`
- Team ID: `team_24L9YCHfs3FU3CHYdzALBD2l`
- Source: https://github.com/Sanidhya14321/undertone (`main`)

These identifiers are routing context, not credentials. Use your own authenticated Vercel CLI session. Never paste a provider token into a command argument or public log.

The Vercel project is connected to `Sanidhya14321/undertone`, with `main` as its production branch. Git pushes use the native Vercel integration. Use the CLI flow below for intentional manual deployment or recovery rather than duplicating an active Git deployment.

The repository requires the `check` status for ordinary changes to `main`, prevents force pushes and branch deletion, and uses squash merges. Administrators retain their standard bypass; the owner should still wait for passing CI. Dependency updates open reviewable PRs and are not automatically merged.

## Deploy

```sh
npm ci
npm test
npm run build
npm run check:site -- --start
vercel project inspect undertone --scope team_24L9YCHfs3FU3CHYdzALBD2l --non-interactive
vercel deploy --prod --project prj_6srLCJBALhiCF04OCNez3XALS8lJ --scope team_24L9YCHfs3FU3CHYdzALBD2l --non-interactive --yes
npm run check:site -- https://undertone.vercel.app
```

Verify the intended project/team before deployment. Confirm `READY`, the production alias, and commit metadata afterward. Production sets `NEXT_PUBLIC_SITE_URL=https://undertone.vercel.app`. `vercel.json` assigns the short and legacy aliases to production deployments; verify both after deployment. Public pages on the old host permanently redirect to the short host, while `/studio` and `/api` remain on the old origin for existing browser-local work. Self-hosted deployments can use `VERCEL_PROJECT_PRODUCTION_URL` or explicitly set their own `NEXT_PUBLIC_SITE_URL`. Node is pinned to 22.x.

Search verification values are optional and require redeployment because public pages are built statically. No shared Fish Audio key is required or supported as a deployment secret.

## After deployment

Check the public homepage, a guide, studio connection dialog, extension download, sitemap, robots, share image, and unauthenticated API boundary. A provider check needs an authorized key and may consume credit; keep any script short and never log credentials. For the extension, verify its native playback after installation when you have a valid key.

For failures, inspect build/runtime logs in Vercel and preserve only sanitized error information. Do not put request bodies, keys, recordings, or private scripts into public issues. No automated uptime monitor or background maintainer agent is implied by this repository.

## Rollback

Open the Vercel project's deployment history, identify a known-good deployment for this same project/team, and restore/promote it through Vercel. Confirm its commit, production alias, and smoke check afterward. A Git revert alone does not change the deployed site unless another deployment runs. Do not delete the failing deployment as a substitute for rollback.

## Maintenance

Review Dependabot update PRs and alerts, run the quality checks, and merge reviewed updates. Automatic merging is not enabled. Keep the provider docs, permission explanations, and help pages consistent with the actual application. Export browser projects and audio before origin changes; there is no server-side backup to restore local data.
