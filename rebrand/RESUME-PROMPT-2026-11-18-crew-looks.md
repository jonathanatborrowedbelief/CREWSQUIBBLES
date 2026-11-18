# RESUME: CREW rebrand, crew looks pushed (2026-11-18, ~00:50 CST)

Paste into a fresh session: "Read ~/Workspace/OpenMausBot/rebrand/RESUME-PROMPT-2026-11-18-crew-looks.md and continue."

## Where we are
- Product: **CREW** (all caps), "by AI Systems by Jon". Rebrand of the OpenMausBot fork. Repo `~/Workspace/OpenMausBot`, branch `rebrand`, fork `jonathanatborrowedbelief/OpenMausBot` (public). **Everything is pushed** (f47e9b2 name, 81d4d28 mascot, 0803306 caps, crew-looks commit).
- Mascot: **Squibbles** (sage green, headset) = Director = logo + app icon + default bot. Crew: Builder (coral, hard hat + wrench), QA (cream, clipboard), Coder (navy, laptop). Art in `rebrand/mascots/final/`, rules in `rebrand/bot-format.md`.
- **Crew looks (11-18):** a "Crew" row at the top of the bot look picker. A pick = cursor body + crew color: chrome = Squibbles, coral = Builder, yellow = QA, blue = Coder. Pictures in `src/assets/mausbot-steel/cursor[-color]-<px>.webp`; lookup in `src/lib/steel-body.ts` (`CREW_LOOKS`). Chosen so the phone-protocol body enum and the iOS app stay untouched. Side effect: picking cursor + coral by hand also gives Builder. Separate crew bodies = protocol + iOS change, ~2 h, only if Jon asks.
- Reset in the picker returns to Squibbles (was the old green cursor).
- **Installer art:** `build/dmg/background.svg` shows Builder (bottom left), Coder (by the door), QA (bottom right); pictures in `build/dmg/crew/`, inlined by `node build/dmg/render.mjs`.

## Open items (also rebrand/TODO.md)
1. Jon is looking at the launched app; take his notes first.
2. 4 brand tests expect "MausBot" (known since f47e9b2); fix during the full rebrand.
3. Still says MausBot/OpenMausBot: default bot name ("Hey! I'm MausBot"), menu bar/app name, DMG file name, productName in `electron-builder.yml`. Part of the full ~32 h rebrand (`census.md`).
4. Parked: high-contrast palette, updater feed → our fork, PostHog off (`update-pipeline.md`).

## How to launch and check
- Preview server (web UI + API, isolated data): port 18797, HOME/data under `/private/tmp/claude-502/-Users-jonathan/a053e4e6-ef02-4aa0-af7d-fd416a5c9225/scratchpad/omb-preview/`. After UI changes run `pnpm exec vite build` (server serves `dist/`). If it is gone: `HOME=<that>/home OMB_DATA_DIR=<that>/data OMB_PORT=18797 OMB_STATIC_DIR=$PWD/dist node --experimental-strip-types server/dev-server.ts`.
- Desktop window for Jon: `ELECTRON_START_URL=http://127.0.0.1:18797 OMB_DATA_DIR=<scratch>/crew-desktop/data ./node_modules/.bin/electron . --user-data-dir=<scratch>/crew-desktop/userdata --use-mock-keychain`. The separate user-data dir + mock keychain matter: the official v0.1.169 app at /Applications uses the same `openmausbot` data name and keychain item, so a plain `electron .` would hit its single-instance lock or prompt for the keychain.
- Headless screenshots: small Node CDP script (Chrome `--headless=new --remote-debugging-port`, isolated `--user-data-dir`). A fresh profile shows the welcome screen; set `localStorage['omb-email-gate']='skipped'` and reload. Bot panel: click `[data-chathead-pill]`, then `[data-panel-avatar]` opens the picker. Never use Jon's browser or mouse.

## Tools
- Sogni MCP (free): `qwen_image_2512_fp8`, `qwen_image_edit_2511_fp8` (master as reference), `remove_background`. Reject green→teal drift. GPT Image costs money: ask first.
- No ImageMagick/PIL. Use ffmpeg, `sips`, `iconutil`, `cwebp`.

## Jon's rules that bite here
- Short replies, next action first, one ask at the end.
- Creative calls: pick + reason + what would change it.
- Commit only on Jon's word; push only on "push".
