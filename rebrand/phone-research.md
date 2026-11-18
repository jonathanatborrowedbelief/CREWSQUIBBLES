# CREW phone research (2026-11-18, branch `rebrand`, read-only investigation by a Sonnet agent; not tested on a real iPhone)

## 0. Bottom line
- MausBot ships a real iPhone app ("MausBot: Private AI Agents", App ID 6803387923, bundle `com.openmausbot.app`, free, seller Supamaus Software Private Limited, iOS 16+) and an Android app (`com.openmausbot.companion`). Store: https://apps.apple.com/us/app/mausbot-private-ai-agents/id6803387923
- Our fork should pair with it over **Wi-Fi or Tailscale with no code changes** (protocol untouched since upstream b832de7). It will look like MausBot, not CREW. Not verified on a phone.
- "Anywhere" access, closed-app push and the hosted HTTPS address depend on upstream's servers/accounts (`accounts.openmausbot.com`, `relayN.openmausbot.com`).
- Our own CREW iPhone app = a **new client**, not a rebrand: the phone app source is closed and lives in another repo. We do have the protocol package, the wire spec and a reference Node client.
- The text "Install CREW on your phone from the App Store" is false today: no CREW app exists.

## 1. Where the UI text lives
No App Store URL, app ID or TestFlight link anywhere in the repo. The text is generic with `{app}` = `productName()` (`src/lib/brand.ts:19` `PRODUCT_NAME = "CREW"`).
- `src/locales/en.json:4925` "Install {app} on your phone from the App Store or Google Play, then scan this code in the app."
- `src/locales/en.json:4926` "Scan it from inside the {app} app, not the camera."
- `src/locales/en.json:10970` "Install {app} on your phone from the App Store or Google Play, then pair it here."
- Rendered in `src/components/PhonePairingQr.tsx:51`, `PhoneSetupFlow.tsx:1044`, `ServerPairingCard.tsx:225` (title `phone.pair.dialogTitle` at :166, also `PhoneDevicesSection.tsx:313`), `PhoneDevicesSection.tsx:535`. Menu "Connect your phone" = `sidebar.menu.connectPhone` (`en.json:2448`).
- Dead keys (no component uses them): `phone.pair.installLine` (`en.json:10817`), `getIphone`, `getAndroid`, `downloadIphone`, `downloadAndroid`, `scanToDownload`, `getApp`, `forPhones` (`en.json:10666-10685`).
- `mausbot.com/download` says the phone apps come via Discord (iOS 17+). Looks stale vs the App Store listing, or a beta channel.

## 2. How pairing works
Desktop runs a companion sidecar (`companion/`, started by `electron/companion.mjs`), per `docs/ios-companion.md`:
- Harness `127.0.0.1:8799` (app API); Companion `0.0.0.0:8810` (paired phones, default-deny allowlist `companion/src/routes.ts`); Control `127.0.0.1:8811`; Hosted gateway `127.0.0.1:8812` (Cloudflare tunnel target).

QR = `openmausbot://pair?address=&token=omb_pair_…&code=&name=&hosts=&endpoints=…&secretKey=…&e2e=…` (builder `packages/phone-protocol/src/pairing-link.ts:165`). Single-use token, QR renews every 100 s (`PhonePairingQr.tsx:12`). Phone calls `POST /api/pair` → `{token, device, serverName, hosts, endpoints, e2e}`. Mac stores only a SHA-256 of the device token in `~/.openmausbot/devices.json`.

No phone account. Device token in iOS Keychain; Noise `NKpsk0` E2E session over WebSocket (`companion/src/e2e/README.md`); a second P-256 key for HPKE credential entry (`electron/phone-secret-identity.mjs`).

Phone endpoints: `POST /api/pair`, `GET /api/companion/endpoints`, `GET /api/events` (SSE), `GET /api/bots?messages=50`, `GET /api/threads/:id/messages`, send/interrupt/approve/read, `PUT /api/push/device`, `PUT /api/phones/self` + long-poll `/api/phones/self/jobs`, WS `/v1/e2e`.

| Route | Address | Upstream dependency |
|---|---|---|
| Same Wi-Fi | `http://<ip>:8810`, Bonjour `_openmausbot._tcp` | None |
| Tailscale | `http://<name>.ts.net:8810` | None |
| Anywhere via relay | `wss://relayN.openmausbot.com/v1/phone` | Yes: upstream account + relay token |
| Hosted HTTPS | Cloudflare tunnel → `127.0.0.1:8812` | Yes: upstream account, tunnel, connector token |

- Relay host pinned by regex at `pairing-link.ts:21`; `electron/desktop-companion-client.mjs:50` allow-lists `openmausbot.com` and `mausbot.si`.
- `electron/companion-account-service.mjs:53` `DEFAULT_COMPANION_CONTROL_PLANE_URL = "https://accounts.openmausbot.com"` when packaged; `OMB_CONTROL_PLANE_URL` overrides (`:101-104`). That service does email-OTP sign-in, a 90-day install credential, tunnel/relay provisioning and push relay; it stores account email + computer name/OS/version (`docs/ios-privacy.md`).
- Control plane (`cloudflare/control-plane/`) and relay (`relay/`) source ARE in the repo → self-hostable, but our domain would need the pinned hosts changed.
- Push is off unless `features.phonePush` / `OMB_PHONE_PUSH=1` (`server/phone-push.ts:4`) and needs an APNs key for the app's bundle id. Without it, alerts only while the app is open (+~25 s background).

## 3. Would the upstream App Store app work with our fork?
Yes for Wi-Fi and Tailscale, on the code evidence. Keep these wire identifiers unchanged or it breaks: `openmausbot://` scheme, `_openmausbot._tcp`, relay host pattern, `x-openmausbot-*` headers, `/.well-known/openmausbot/environment`, `/api/health {app:"openmausbot"}`, `PHONE_SECRET_INFO`.
- Phone would show: MausBot name/icon/welcome; our computer name, bot names and colors (data); probably MausBot's own mascot art, not Squibbles/crew (inference: mascot art is compiled into the phone app). Custom avatar images may carry over.
- Risks: closed source owned by Supamaus (can change protocol or require Cloud sign-in); phones auto-update while we ship upstream changes late (version skew); telling clients to install "MausBot" for CREW is a brand mismatch. Do NOT tap "Anywhere" — it signs the Mac in to upstream's account service.

## 4. Our own CREW app
- No `ios/` in this repo (only `apps/docs`). Current upstream phone app is Expo/React Native in a separate, non-public repo (`docs/phone-push.md`).
- Build from: `packages/phone-protocol/` (Apache-2.0), `companion/src/e2e/README.md` + vectors `companion/src/e2e/vectors/v1.json`, reference client `companion/src/e2e/phone.ts`, `companion/src/routes.ts`.
- Minimum viable client: scan/paste pairing link → `POST /api/pair` → Keychain; LAN + Tailscale over HTTP (ATS exceptions, Bonjour); bots/rooms, transcripts, send, approvals over SSE. Skip relay, push, Live Activities, voice, credential entry. In-app scanner; don't register `openmausbot://` (collides with upstream app). Rough size: a few weeks basic, months for parity (agent's scoping, not measured).
- Apple costs: free Apple ID = own devices via Xcode only, 7-day re-sign, 3 apps/device. TestFlight, App Store and push need the paid program (~$99/yr — verify). Paid path: enroll → own bundle id → TestFlight (internal no review; external needs beta review; builds expire in 90 days) → App Store review → APNs `.p8` + our own control-plane Worker for push.
- Android: no project here. APK sideload free; Google Play one-time $25.

### No-app option: phone web app (PWA)
- Web UI is already responsive; `public/manifest.webmanifest`, `index.html` (`apple-mobile-web-app-capable`, `apple-touch-icon`) exist (`docs/phone-web-app.md`).
- Needs an HTTPS link (Tailscale, own proxy or Cloudflare tunnel). Open in Safari → pair → Add to Home Screen. Limits: no offline, no push, no native phone control.
- Web UI comes from the harness or `serve` mode (`docs/self-hosting.md:26-30`: `--public-url`, `--tailscale`, `--lan`); the companion port serves no HTML.
- To brand: `public/manifest.webmanifest` (`name`, `short_name`), `index.html:9,13`, icon PNGs.
- 5-minute test still needed: phone Safari opens the host's `https://<name>.ts.net` and pairs.

## 5. Recommended order
1. Now, $0: reword `en.json:4925`, `:4926`, `:10970` to stop implying a CREW store app (e.g. "Open CREW on your phone"); re-record locale hashes (`node scripts/generate-locale.mjs --record-hashes`).
2. This week, $0: brand + test the PWA over Tailscale for Jon and the buddy. MausBot's App Store app on Wi-Fi/Tailscale as a stopgap for testing.
3. Before real clients: decide PWA-only vs $99/yr + custom client (weeks).
4. Before shipping: point `OMB_CONTROL_PLANE_URL` at nothing or our own deployment so clients are never silently signed in to `accounts.openmausbot.com`.

## 6. Not verified
Real-iPhone pairing with the store app; how bot art renders there; whether the store app gates on server version/brand; Apple fee and paid-only rows; PWA reachability over Tailscale from phone Safari; why `mausbot.com/download` says Discord.

Sources: Apple lookup API (`bundleId=com.openmausbot.app`), the App Store page above, https://mausbot.com/download, https://play.google.com/store/apps/details?id=com.openmausbot.companion, https://developer.apple.com/support/compare-memberships/
