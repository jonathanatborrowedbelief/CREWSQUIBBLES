CLEAN (no stray swaps left; every line is deliberate or owned by a later phase) + 1 FINDING for Jon (group E)

Census after phase 1: 221 lines (`rebrand/census.sh`). Reviewed line by line 2026-11-18.

## A. Keep forever (allowlist): ~40
Wire/internal ids: `PHONE_SECRET_INFO`, `X-OpenMausBot-*` headers and the `X-OpenMausBot-Lending` mark, `openmausbot.*` browser-storage keys (sidebar-preferences, preload, workspace-backup-client, new-look), tool id `openmausbot.sign-in-check`, `com.openmausbot.companion` package, `PRE_REBRAND_FAILED_MARKER`. Accept-both regexes (peer-message, phone-setup, peer-provenance, cloud-health, mausbot-notifications) and the old-text key in computer-messages. `public/novnc-NOTICE.txt` (license).

## B. Comments the filter misses (trailing `//`, CSS block, JSON "comment"): ~8
styles.css:814, seccomp-omb-home.json, request-auth ×2, browser/config, drivers/claude, index.ts:1268. Comments stay by rule.

## C. Phase 3 (all move together with productName): ~90
electron-builder.yml (17); `/opt/OpenMausBot` paths (build/linux-*, apparmor, deploy, scripts smoke/verify); `server/service-unit.ts` app paths (must learn `/Applications/CREW.app`); `OpenMausBot Speech.app` helper (shows in the mic/speech permission prompt); `open-at-login` "OpenMausBot at login"; `Documents › MausBot` (cloud-sync.mjs:66, en.json files.outputs.help, system-prompt.ts:228); after-pack, defender-check, package.json author/homepage; Cua licenses page title (generate-cua-sbom). Dev-only test titles ("Isolated OpenMaus Threads") can go with it.

## D. Phase 4 (upstream servers, images, ids sent to others): ~70
cloud/accounts/admin/docs/www.openmausbot.com, mausbot.page, mausbot.si, `openmausbot-composio.milindsoni201.workers.dev` (managed-composio.mjs: add to phase 4 list), ghcr.io/milind-soni images (compose.yaml, connector/), browser-engine-release, share-card COMMUNITY_REPOSITORY_URL, computer-ask DESKTOP_DOWNLOAD_URL (the "Get CREW" button), widget-samples mausbot.com, CloudCancelPlan cal.com, RemoteComputerSection placeholder "…openmausbot.com", User-Agents, MCP clientInfo + OAuth client_name (shows on OAuth consent screens), 1Password integrationName, x-openrouter-title, verify-linux-package update owner.

## E. FINDING: our own fork's URL contains "OpenMausBot": ~13
`github.com/jonathanatborrowedbelief/OpenMausBot/...` (app-links APP_REPOSITORY, 8 in-app doc links, build-npm-package, openmausbot-docs SKILL.md). Done-criterion 1 can never pass while the repo is named OpenMausBot, and the allowlist doesn't list it. Options: (1) rename the GitHub repo to CREW (GitHub redirects old URLs and clones), then swap the URLs; (2) add our fork URL to the allowlist (changes a frozen criterion: Jon's call).
