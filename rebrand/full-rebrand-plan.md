# Full rebrand plan: no MausBot left anywhere a person looks (2026-11-18)

Status: PLAN, nothing built. Baseline now (census command, `census.md` §12): **1,437 source lines** still say MausBot / OpenMausBot / upstream domains, plus ~1,746 mirrored lines in 15 other languages and ~587 test files that assert the old name.

## Done means (frozen before building; the builder may not edit this section)
1. The census command returns only lines on the allowlist below. Negative control: the same command on `base-upstream-0.1.169` returns ≥1,400.
2. Full test suite: every failure is one of the 34 that also fail on upstream (`test-triage-2026-11-18.md`). Nothing new.
3. A packaged `CREW.app` (not a dev launch) shows CREW in the menu bar, Dock, About, Quit, tray, permission prompts, DMG, window titles. A separate verifier agent screenshots ~12 key screens and finds no MausBot / OpenMausBot / Electron.
4. A 10-minute isolated run of the packaged app makes no calls to posthog.com, openmausbot.com, mausbot.com or milind-soni GitHub feeds.
5. `rebrand/apply.mjs` is idempotent: a second run changes nothing; a run on a fresh upstream checkout lands at the same result.

## What stays on purpose (allowlist)
- LICENSE, NOTICE, LICENSING.md. Apache-2.0 requires keeping upstream's NOTICE, shown in About → Licenses ("Based on OpenMausBot, Apache-2.0").
- Wire ids the MausBot phone app needs: `openmausbot://`, `_openmausbot._tcp`, `x-openmausbot-*` headers, `/.well-known/openmausbot/…`, `/api/health {app:"openmausbot"}`, `PHONE_SECRET_INFO`.
- Internal ids nobody sees: code names, `OMB_*` env vars, `~/.openmausbot`, the app's settings folder, the bundle id `com.openmausbot.app`. Keeping them means your bots and permission grants carry over and upstream merges stay cheap. What would change this: wanting MausBot and CREW installed side by side.

## Decisions (Jon, 11-18 morning; frozen)
1. Upstream's paid MausBot Cloud, Team Cloud, Boat, ModelGo, Product Hunt promos → **hide them all** (our own switch; the license gate in `server/brand.ts` stays untouched). What each one would need to come back (our own servers) is in `hidden-upstream-features.md`.
2. Default bot name → **Squibbles**. An existing bot named exactly "MausBot" gets renamed once.
3. Bug reports (`@devs`, today emailed to upstream's founders) → **off**.
4. PostHog analytics → **off for now, code kept** (a default-off switch, not deleted). Before any client or public release: learn why upstream had it on and what it sent (`hidden-upstream-features.md`).
5. Mine, low stakes: add a `crew` command (keep `openmausbot` working) and show `crew …` in instructions; in-app doc links → our fork; rebrand only docs the app links to (~10), not all 180.

## Phases
| # | Work | Hours | Who |
|---|---|---|---|
| 0 | Jon's 4 calls; freeze allowlist | 0.5 | Jon 5 min, me |
| 1 | `apply.mjs` codemod: en.json + 15 languages, string literals in src/server/electron/shared/connector/deploy/scripts, same swap in tests | 8-10 | Codex/Sonnet, I review |
| 2 | Hand pass on text that's more than a name: agent persona + prompts, sign-in email, OAuth pages, "Exported from", meeting-notes intro, the 3 regexes that read server text, founder lines | 3-4 | me |
| 3 | App identity: productName CREW, permission prompts, DMG/exe names, About + Licenses, `crew` command, default bot + rename | 3-4 | me |
| 4 | Phone-home off: updater → our fork (+ 4 CI gates), PostHog out, announcements / model list / update check / bug reports off or ours, Cloud + promos hidden | 4-6 | me |
| 5 | Leftover art: PWA icons, `public/app-icon.svg` title, What's-new Cloud screenshots, Linux icon text | 1-2 | me |
| 6 | Tests green (incl. the 12 enterprise-deleted tests: drop), packaged build, verifier agent runs Done 1-5 | 4-6 | verifier ≠ builder |

**Total ~24-32 h**, about 3 working sessions. Jon's time: 5 min of decisions now, ~15 min looking at the finished app.

## Order and checkpoints
- Each phase is its own commit; push only on Jon's "push".
- After phase 1 the census count must drop below 200; after phase 4 it must be allowlist only.
- "Electron" in the menu bar today comes from the dev launch (unpackaged). Phase 3's packaged build is what fixes it.

## Risks
- Switching Jon's Mac from the official MausBot app to CREW: quit and remove `/Applications/OpenMausBot.app` first, since both use `~/.openmausbot`. Bots carry over.
- Upstream merges: only the files in phase 4 conflict every release; everything else is re-done by `apply.mjs`.
- The MausBot phone app keeps working (wire ids unchanged) but still shows MausBot. A CREW phone app is separate (`phone-research.md`).
