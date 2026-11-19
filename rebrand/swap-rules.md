# Brand swap rules (phase 1 of `full-rebrand-plan.md`)

Goal: no MausBot / OpenMausBot anywhere a person or a bot reads it. Check your area with `rebrand/census.sh <paths>` (whole repo: no args). Re-use these rules after every upstream merge.

## Replace (user-visible text only: string literals, locale VALUES, HTML text, plist/permission text, script echo output, agent prompts, skill text)
| Old | New |
|---|---|
| OpenMausBot, MausBot, OpenMaus, SupaMaus (as the product) | CREW |
| OpenMausBot's, MausBot's | CREW's |
| MausBot Cloud / MausBot Relay / MausBot account | CREW Cloud / CREW Relay / CREW account (Cloud screens get hidden later; the text just has to be clean) |
| "the MausBot team" | "the CREW team" |
| Maus / Mauses as a word for a bot ("any compatible Maus") | bot / bots |
| The starter bot's NAME: `DEFAULT_BOT_NAME`, `?? "MausBot"` fallbacks for a bot name, bot-name placeholders, the persona "You are MausBot" | Squibbles |
| The phone app: "the MausBot app", "MausBot phone app", "Update MausBot on your phone" | "the phone app", "Update the app on your phone". Never claim a CREW phone app or a CREW App Store listing exists. |
| Upstream founders by name (Milind, Omkar) in user text | drop the names, neutral wording ("Sent as bug report {report}.") |
| UI doc links `https://github.com/milind-soni/OpenMausBot/blob/main/docs/…` and `APP_REPOSITORY` | `https://github.com/jonathanatborrowedbelief/CREWSQUIBBLES/blob/rebrand/docs/…` / `https://github.com/jonathanatborrowedbelief/CREWSQUIBBLES` |

Keep grammar right after a swap ("a CREW server", not "an CREW server"). CREW is always all caps.

## Never change
- Wire/protocol ids: `openmausbot://`, `_openmausbot._tcp`, `x-openmausbot-*` and `X-OpenMausBot-*` headers, `/.well-known/openmausbot/…`, `app: "openmausbot"` in health replies, `PHONE_SECRET_INFO` and any crypto/HPKE/Noise info strings, relay host patterns.
- Lowercase ids: the `openmausbot` CLI command and binary, package names (`@openmausbot/*`), `~/.openmausbot`, `OMB_*` env vars, file paths, `com.openmausbot.*` labels and bundle ids, AppArmor names, `omb-*` storage keys.
- Code identifiers: variable/function/type/file/component names (`MausAvatar`, `MAUSBOT_PERSONA`) and locale KEYS (`mausbotWelcome.*`). Change values, never keys or names.
- Comments, in any language.
- LICENSE, NOTICE, LICENSING.md, CLA.md.
- Phase-4 items: leave them and LIST them in your report. electron-builder.yml `productName`, `artifactName`, `appId`, `publish`, `executableName`, `shortcutName`, `Name:`; `server/update-check.ts`; `shared/announcements.ts`; `server/model-manifest/`; bug-report URLs in `server/devs-report-send.ts`; `src/lib/analytics.ts`; any `ghcr.io/milind-soni/…` image; any host `*.openmausbot.com`, `mausbot.com`, `mausbot.si`, `mausbot.page`, `*.workers.dev`; `.github/`; repo URLs in `server/team-library.ts`; User-Agent strings; OAuth `client_name`; MCP `clientInfo`.

## Coupled strings (server text that client code parses)
`server/peer-provenance.ts`, `server/index.ts`, `server/container-computer.ts`, `server/live-fish.ts`, `electron/companion-account-messages.mjs` write text that `src/lib/peer-message.ts:16`, `src/lib/phone-setup.ts:459`, `src/lib/computer-messages.ts:16`, `src/lib/live-call-fish.ts` (`FISH_UPDATE_PREFIX`) match. Server owners swap the text to CREW. The src owner changes each regex/lookup to accept BOTH the old and the new text, so old transcripts still parse.

## Tests
In your own paths, update the test, fixture and golden expectations that assert a string you (or the locale agent, same rules) changed. Run the unit tests for the files you touched: `pnpm exec vitest run <test files> --maxWorkers=2`. Skip `*.e2e.test.ts` (run later). Ignore failures caused by the deleted `enterprise/` folder. Don't loop more than twice on one failure: report it.

## Shared working tree
Other agents edit other folders at the same time. Do NOT run git commands that change state (commit, add, stash, checkout, restore, reset). `git diff` / `git status` are fine. Edit only inside your own paths.

## Report (≤25 lines)
census count before → after for your paths · files changed · lines left on purpose, grouped with the reason · tests run and results · anything that needs a human call.
