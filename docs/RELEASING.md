# Releasing

The first published line is `0.1.0-beta.1`. Beta status reflects limited live-provider/native-extension verification and is not a promise of stable API compatibility.

## Prepare

1. Update the app version in `package.json` and lockfile. Update `extension/manifest.json`: `version` must be a valid numeric browser version; `version_name` must match the app's full release version.
2. Update `CHANGELOG.md` and write `docs/releases/v<VERSION>.md` with the actual changes, install steps, and known limits.
3. Update affected guides and their real modification date. Preserve license and third-party notices.
4. Run tests, a production build, the HTTP smoke check, and native extension checks when affected. Provider requests require your own key/credit.
5. Merge/push the reviewed commit to `main`, wait for CI and its Vercel Git deployment, and verify the production alias and commit. Use manual deployment only when needed.

## Publish a versioned release

The release workflow runs on a `v*` tag and validates that the tag matches the app version. It builds the project, runs HTTP checks, packages a versioned extension ZIP with its production studio URL and license notices, calculates SHA-256 checksums, and creates the GitHub release. Tags containing `-` are marked prereleases.

```sh
git tag -a v0.1.0-beta.1 -m 'Undertone 0.1.0-beta.1'
git push origin v0.1.0-beta.1
```

Use the new version for subsequent releases. Do not recreate or move an existing published tag. CI and release jobs run on Node 22 and need Python 3 for ZIP packaging. Release publishing uses the workflow's built-in GitHub token; no personal token is stored in the repository.

For local packaging after a production build:

```sh
npm run release:package
```

Artifacts are written to ignored `work/releases/`. When preparing a separate local extension package, set `NEXT_PUBLIC_SITE_URL` to the intended public origin before running the build. Local default builds intentionally point to localhost.

## Verify

Confirm the release is public, the tag resolves to the intended commit, both assets exist, and the downloaded ZIP matches `SHA256SUMS.txt`. Inspect its manifest, studio configuration, license files, and JavaScript syntax. GitHub supplies source archives automatically.

Install a new release into a clean browser profile to test upgrade behavior. Explain any local-storage migration or changed permissions. Publishing a GitHub release does not submit the extension to a browser store or deploy Vercel; those are separate operations.
