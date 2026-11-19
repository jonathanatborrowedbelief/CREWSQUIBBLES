FINDING
Updater, CI gates and server update check now point at our fork. Patched, not yet verified end to end (our fork has no release; see Needs Jon).

Census (`rebrand/census.sh electron-builder.yml server/update-check.ts electron/updater* scripts/{verify-linux-package,defender-check-win,smoke-linux-update,stable-channel,regenerate-mac-feed}.mjs`): 37 -> 31. The 6 gone are the feed lines. The 31 left are productName/artifactName/appId/Name= (phase 3) and test-fixture file names. `electron/updater*` had no owner/repo in code: it reads the baked app-update.yml. `.github/` is outside census.sh: its feed lines with milind-soni went 21 -> 0 (release.yml, package-win.yml, sync-published-release.yml, prepare-release.yml).

Now points at `jonathanatborrowedbelief/CREWSQUIBBLES`:
- electron-builder.yml publish block (owner, repo) only. Nothing else touched.
- Gates that assert app-update.yml: release.yml (mac, windows, linux: 3 owner + 3 repo greps), package-win.yml (repo gate; added the missing owner gate), scripts/verify-linux-package.mjs.
- server/update-check.ts: LATEST_RELEASE_URL, STABLE_CHANNEL_URL (the `channels` branch that promote-stable.yml already writes via $GITHUB_REPOSITORY), User-Agent now `crew-update-check`. A 404 from releases/latest now means "no release yet": returns available:false, no error. Other statuses still throw.
- scripts/defender-check-win.mjs: Zone.Identifier HostUrl owner/repo only (simulated download source, no network).
- Legacy updater bridge (mirror of every release to milind-soni/openmausbot-releases, needs RELEASES_PAT): now off by default. New workflow var `LEGACY_RELEASES_REPO` (repo variable, unset); every legacy step is gated on it in release.yml, sync-published-release.yml, prepare-release.yml. Code kept.

Tests (all after changes):
- vitest server/update-check.test.ts, server/routes/update-check.test.ts, server/server-update.test.ts, scripts/ci-workflow.test.ts, scripts/ci-scope.test.ts: 5 files, 270 passed. `pnpm exec tsc -b`: clean.
- Added 2 tests (fork-only URLs; no release = no update, 500 still errors). Negative control: with the 404 line removed, the new test fails ("GitHub answered 404"); restored, 12/12 pass.
- Gate greps + the verify-linux-package regex: pass on a new-style app-update.yml, fail on the old milind-soni one. All edited `run:` blocks pass `bash -n`; all edited YAML parses. No node-test changed (no electron test asserts the owner).

Left on purpose, not the update feed: .github/CODEOWNERS, FUNDING.yml, contributors.yml (CLA links + allowlist), docker.yml / connector-release.yml ghcr names, npm-package.yml comment, ci-retry-list.json owners, electron-builder.yml `maintainer:` (phase 3).

Needs Jon / other parts:
1. `deploy/update.sh` + `deploy/install.sh` (self-hosted servers) still read milind-soni feeds and ghcr.io/milind-soni/openmausbot. Outside my paths; promote-stable.yml will publish to ghcr.io/jonathanatborrowedbelief/crewsquibbles, so the names will not match until someone updates deploy/.
2. `updateCommand()` in update-check.ts still says `npm install -g openmausbot@...` (upstream's npm package). Package name is a never-change id, so I left it; a CREW npm install would pull upstream code. Decide: publish our own package or hide that command.
3. Mac updates: no release exists, so electron-updater "no update found" is untested until the first CREWSQUIBBLES release. Repo visibility matters: private repo = the app's feed reads 404 for every client.
4. docs/releasing.md still describes the legacy bridge and milind-soni (docs/ not mine).
