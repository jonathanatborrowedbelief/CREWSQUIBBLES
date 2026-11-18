# RESUME: CREW rebrand, after the mascot swap (2026-11-18, ~00:30 CST)

Paste into a fresh session: "Read ~/Workspace/OpenMausBot/rebrand/RESUME-PROMPT-2026-11-18-crew-next.md and continue."

## Where we are
- Product name: **CREW** (all caps, Jon 11-18), tagline "by AI Systems by Jon". Rebrand of the OpenMausBot fork. Repo `~/Workspace/OpenMausBot`, branch `rebrand`. Fork `jonathanatborrowedbelief/OpenMausBot` is public.
- Commits on `rebrand`: f47e9b2 (name preview, pushed), 81d4d28 (mascot swap), plus the CREW-caps commit after it. **The last two are NOT pushed.** Push only when Jon says "push".
- Mascot is done. **Squibbles** (sage green, headset) = Director = the logo. Crew: Builder (coral, hard hat + wrench), QA (cream, clipboard), Coder (navy, laptop with a blank lid). White outline on every bot. Final art is in `rebrand/mascots/final/`. The rules for new bots are in `rebrand/bot-format.md`.
- Squibbles is live in: app icons (`build/icon*`, `electron/resources/app-icon.png`), web icons (`public/*`), welcome logo + favicon (`CREW_LOGO`/`CREW_FAVICON` in `server/brand.ts`), and the default bot avatar (`src/assets/mausbot-steel/cursor-*.webp`). Onboarding shows him as "your Chief of Staff".
- Exploration images (r2/, r4/, round 1) stay local and are excluded in `.git/info/exclude`.

## Open items (also in rebrand/TODO.md)
1. Push the 2 local commits (waiting on Jon).
2. Make Builder / QA / Coder pickable as bot looks. The assets are ready in `mascots/final/avatars/`. The avatar pictures only show for body `cursor` + color `chrome` (`src/components/Avatar.tsx:204`, `src/lib/steel-body.ts`), so this needs a small code change.
3. Mac installer art `build/dmg/background.svg` still shows the old Maus family (re-render: `node build/dmg/render.mjs`).
4. 4 brand tests have failed since f47e9b2 because they expect "MausBot". They fail the same without the mascot changes. Fix them during the full rebrand.
5. Parked: new high-contrast palette, full ~32 h rebrand (`census.md`), updater feed → our fork, PostHog off (`update-pipeline.md`).

## How to check work
- Preview server: port 18797, isolated HOME/data under `/private/tmp/claude-502/-Users-jonathan/a053e4e6-ef02-4aa0-af7d-fd416a5c9225/scratchpad/omb-preview/` (pid file there). After changes: `pnpm exec vite build`, then restart `node --experimental-strip-types server/dev-server.ts` with that HOME, `OMB_DATA_DIR`, `OMB_PORT=18797`, `OMB_STATIC_DIR=$PWD/dist`.
- Screenshots: `chrome --headless --screenshot` hangs on this app. Use a small Node CDP script (launch Chrome with `--remote-debugging-port`, `Page.navigate`, wait, `Page.captureScreenshot`) and an isolated `--user-data-dir`. Never use Jon's browser or mouse.

## Tools
- Sogni MCP, free on Jon's plan: `qwen_image_2512_fp8` (new images), `qwen_image_edit_2511_fp8` (edits with the master as reference, ~2 min), `remove_background` (birefnet). Edits sometimes drift green to teal: reject those. GPT Image costs money: ask first.
- No ImageMagick or PIL here. Use ffmpeg (geq for rounded corners, alpha dilation for outlines), `sips`, `iconutil`, `cwebp`.

## Jon's rules that bite here
- Replies ≤110 words, next action first, one ask at the end.
- Creative calls: give a pick, the reason, and what would change it.
- Commit only on Jon's word; never push without "push".
