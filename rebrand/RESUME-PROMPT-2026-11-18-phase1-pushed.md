# RESUME: CREW rebrand, phase 1 pushed (2026-11-18, midday CST)

Paste into a fresh session: "Read ~/Workspace/OpenMausBot/rebrand/RESUME-PROMPT-2026-11-18-phase1-pushed.md and continue."

## Where we are
- Product **CREW** (all caps), fork `jonathanatborrowedbelief/CREWSQUIBBLES`, branch `rebrand`, repo `~/Workspace/OpenMausBot`. Pushed and verified: **f241c86** (phase 1).
- Plan: `rebrand/full-rebrand-plan.md` (frozen Done criteria + Jon's 4 calls). Rules every swap follows: `rebrand/swap-rules.md`. Scan: `rebrand/census.sh [paths]` (append `| wc -l`).
- Phase 1 (text swap) done by 8 parallel Sonnet agents: census **1,437 → 221 lines**. The 221 should all be deliberate (phase 3/4: upstream hosts/URLs, electron-builder.yml identity keys, `/opt/OpenMausBot` paths, wire ids, accept-both regexes). Not yet reviewed line by line.
- Typecheck passes (`pnpm exec tsc -b`, `tsc -p tsconfig.server.json --noEmit`). Agents ran unit tests per area (green except known environment/enterprise ones). **e2e tests and the full suite not run yet.**
- Full suite started on f241c86 at midday, output `/private/tmp/crew-tests/vitest-f241c86.txt` (~3 h). Compare its failures with the 34 known upstream/environment ones in `rebrand/test-triage-2026-11-18.md`; anything else is ours.
- Jon's calls since the plan: installer marker accepts both old and new text (done); bots' browser download URL (`server/browser-engine-release.ts:49`) stays for phase 4.

## Next, in order
1. DONE: full suite checked, `rebrand/test-run-f241c86.md`. 2 e2e brand leftovers fixed (uncommitted); the rest is upstream/flaky/enterprise-deleted.
2. DONE (uncommitted, `rebrand/phone-wording-result.md`, CLEAN; locale --check valid). Server text "Use CREW on your phone?" left on purpose (true: CREW is used from the phone). Was: fix the false phone claim: `phone.pair.rowLine`, `phone.code.installAndScan` and the other "Install {app} on your phone from the App Store" values in `src/locales/en.json` (+15 packs) → "the phone app"; update the src tests that assert them; `node scripts/generate-locale.mjs --record-hashes`.
3. DONE: `rebrand/census-review-2026-11-18.md`. Repo was already renamed CREWSQUIBBLES on GitHub (Jon); fork URLs swapped, census 206. Add `electron/managed-composio.mjs` workers.dev broker to phase 4.
4. DONE (local commit 3a55146, NOT pushed; earlier local: d3befb6, 9bcc6bf): phase 4. Reports `rebrand/phase4-{1..5}-*-result.md`. Switch: `electron/upstream-hidden.mjs` HIDE_UPSTREAM. Full suite running → `/private/tmp/crew-tests/vitest-3a55146.txt`; compare with `rebrand/test-run-f241c86.md`. Left for later: self-host `deploy/` scripts + docker images still upstream (need our own ghcr images); Windows browser-engine download (needs a release on our repo); Templates library home (Jon); settings search still lists the hidden Analytics place; Done-4 packaged 10-min network run is phase 6.
5. Phase 3: productName CREW (keep the settings folder and bundle id), permission prompts, About + Licenses (Apache NOTICE), `crew` command alias, starter bot "MausBot" → Squibbles one-time rename (`server/default-bot.ts:83` lookup must also match the old name), `Documents › MausBot` folder.
6. Phases 5-6 per the plan; final check by a separate verifier agent.

## Jon's buddy (asked 11-18)
Tailscale is already set up between them. To run CREW from source (no installer needed; a source run never self-updates, `electron/updater.mjs:185`):
1. Install Node 24+, pnpm, and Claude Code (or Codex), signed in.
2. `git clone https://github.com/jonathanatborrowedbelief/CREWSQUIBBLES && cd CREWSQUIBBLES && git checkout rebrand && pnpm install`
3. Three terminals: `pnpm dev:server`, `pnpm dev`, `pnpm dev:desktop`.
4. Settings → General → analytics off (still upstream's PostHog key until phase 4).
His own copy has his own bots. To work on Jon's bots, he connects to Jon's Mac over Tailscale (`rebrand/sharing-research.md`).

## Jon's rules that bite here
- Replies ≤12 lines, next action first, one ask at the end. Subagents on Sonnet, not Opus.
- Commit on Jon's word; push only when he says push.
- Never bypass the `whitelabel` gate in `server/brand.ts`; never copy enterprise/ code. Never use Jon's browser or mouse.
