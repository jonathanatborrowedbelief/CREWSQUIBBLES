FINDING (my 5 items done and tested; 3 phone-home leftovers outside my paths, below)
Census (my paths, `rebrand/census.sh`): 8 -> 2. Left on purpose: devs-report-send.ts:11 PRODUCTION_CLOUD_ORIGIN (kept, host-doctor imports it), devs-reports.ts:147 old "MausBot" marker (reads old transcripts).
Switches (default now -> how to turn on):
1. PostHog: no key, nothing loads/sends, Settings row hidden. src/lib/analytics.ts:9 `analyticsKey()` reads build var `VITE_CREW_POSTHOG_KEY` (empty). On: build with that var set to our phc_ key. usage-snapshot.ts needed no edit (already gated by analyticsEnabled()). AnalyticsRow.tsx returns null; setAnalyticsEnabled is a no-op without a key.
2. @devs bug reports: OFF. server/devs-report-send.ts:27 `bugReportEndpoint` returns "" unless `OMB_BUG_REPORT_URL` is a valid https/loopback URL (Cloud-origin/staging/production defaults removed). devs-reports.ts:217 `off` = nothing tagged, queued, sent, retried or asked; report_bug answers "turned off". On: set OMB_BUG_REPORT_URL.
3. Announcements: OFF. server/announcements/feed.ts:72 off unless `OMB_DISABLE_ANNOUNCEMENTS=0`. Feed URL + image prefix now our fork (shared/announcements.ts:15,17, rebrand branch).
4. Model list: still fetches, now from OUR fork: manifest.ts:14 (rebrand branch copy exists, repo is public). Off: `OMB_DISABLE_MODEL_MANIFEST_FETCH=1` (bundled list is the fallback either way). models.dev (catalog.ts, third party, not upstream) left as is.
5. User-Agent "OpenMausBot" -> "CREW": feed.ts:171, manifest.ts:171, catalog.ts:267.
Tests (vitest, 21 files, 290 pass) + `tsc -b`: new negative controls for each (key vs no key at unit, wire and snapshot level; sender on vs off; switch 0 vs unset; URL). devs-reports.e2e (URL set) passes. Mocks in SettingsModal.i18n/SettingsWindow tests got `analyticsAvailable`. Updated check-announcements test URL.
tsc: `tsc -b` 1 error src/components/app/PageTools.tsx:299 and `tsc -p tsconfig.server.json` 1 error server/update-check.test.ts:118; both other agents' files, none in mine.
Docs: docs/analytics.md got a "CREW builds send nothing" paragraph; mirrored in apps/docs/content/docs/security/analytics.mdx because analytics-docs.test requires them identical.
Needs Jon / other agents:
- server/headless/host-doctor.ts:294 sends a HEAD to cloud.openmausbot.com (clock check). Not mine; point at our host or drop.
- "@devs" still shows in the @ menu (MentionMenu.tsx, DEVS_CHOICE) and is plain text now. Hiding it needs a server flag; say if you want it.
- server/app-settings/registry-window.ts:43 still advertises "Usage analytics (PostHog)" to bots; settings-places/settings-index still list the hidden Analytics block.
- docs/announcements.md, docs/self-hosting.md still say to set OMB_DISABLE_ANNOUNCEMENTS=1 to turn off (now the default).
