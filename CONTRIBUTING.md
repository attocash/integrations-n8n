# Contributing

Thanks for helping improve the Atto nodes for n8n.

## Development setup

You need Node.js 22.22.0 or newer, npm, and Git.

```bash
git clone https://github.com/attocash/integrations-n8n.git
cd integrations-n8n
npm ci --ignore-scripts
```

Build the package and run the standard checks:

```bash
npm run build
npm run lint
npm test
```

`npm test` runs the unit, smoke, trigger, and integration test files in sequence. The integration file skips its container tests when neither Docker nor a local Podman socket is available. Require that path with:

```bash
ATTO_TEST_INTEGRATION=1 npm run test:integration
```

Run a local n8n development instance with:

```bash
npm run dev
```

For package-boundary changes, also pack the package and test the generated tarball in a clean n8n instance.

## Commit messages

This repository uses conventional commits. Changes that should publish a new package version must use the `n8n-node` scope:

```bash
git commit -m "fix(n8n-node): describe the fix"
git commit -m "feat(n8n-node): describe the feature"
```

Documentation-only or maintenance changes that do not need a release may use the usual `docs:` or `chore:` types.

## Release process

Do not update `package.json` or `package-lock.json` versions by hand.

When a release-producing commit reaches `main`, GitHub Actions:

1. Calculates the next version from the `n8n-node-vX.Y.Z` tags.
2. Builds, lints, tests, and packs the attempted release.
3. Creates `release/n8n-node-vX.Y.Z` with the updated manifests.
4. Opens a protected release pull request.
5. Publishes the tested tarball after that pull request is merged and the `release` environment is approved.

The repository must allow GitHub Actions to create pull requests. Configure npm Trusted Publishing for `.github/workflows/n8n-node-package.yml`; releases use provenance and do not use an `NPM_TOKEN` fallback.

After publication, confirm the GitHub manifests, npm latest version, provenance, and the official n8n community-package scan all agree.
