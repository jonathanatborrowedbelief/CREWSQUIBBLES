CLEAN
Scope: phone-app wording in locales. 14 keys x 16 packs (en + 15). No call sites changed (extra `app` param is harmless). Not committed.
Keys changed, en before -> after ("the phone app" replaces "{app} app/phone app"):
- phone.pair.rowLine: "Install {app} on your phone from the App Store..." -> "Install the phone app from the App Store or Google Play, then pair it here."
- phone.code.installAndScan: "Install {app} on your phone from..." -> "Install the phone app from ... then scan this code in the app."
- phone.code.notCamera / typeIntro / typeThis: "{app} app" -> "the phone app" (typeThis: "Type this code in the phone app.")
- phone.pair.forPhones: "{app} for iPhone and Android" -> "The phone app for iPhone and Android"
- phone.pair.stepLine / stepLineCloud: "with the {app} app" -> "with the phone app"
- phone.pair.installLine: "On your phone, install {app} from the {appStore}..." -> "Install the phone app from the {appStore}, or download it for {android}."
- remote.devices.retiredShort: "Older {app} app. ..." -> "Older phone app. ..."
- remote.serverPairing.subtitle: "with the {app} app" -> "with the phone app"
- remote.serverPairing.sameWifiOnly: "pair the {app} phone app" -> "pair the phone app" ({app} Relay kept; key exists only in en + pt-br)
- teamPhone.subtitle: "with the {app} phone app" -> "with the phone app"
- pair.openInApp (found extra, shown after "On your phone?" on PairPage): "Open in the {app} app" -> "Open in the phone app"
Packs: en + de es fr hi it ja ko pl pt-br ru tr uk vi zh zh-tw (210 value edits, line-level, keys untouched).
Hashes: --record-hashes recorded 0 (it never replaces existing hashes), so --check showed 196 stale. --accept rewrites key order (50k-line diff), so I updated only the 196 hashes of these keys in source-hashes.json (392-line diff). `node scripts/generate-locale.mjs --check`: valid, 16 languages.
Tests updated: TeamPhoneCard.test.ts, ServerPairingCard.test.ts, PhoneDevicesSection.page.test.ts, PhoneSetupFlow.publicNetwork.test.ts (asserted strings); PairedPhones.test.ts (two stale negative asserts "older MausBot app" -> "Older phone app" so they test the real string).
Run: vitest src/locales, i18n, chat-copy.i18n, server-word-contracts + 9 phone/pair component tests, --maxWorkers=2: 28 files, 737 passed, 3 todo, 0 failed. `pnpm exec tsc -b`: clean.
Negative control: the 4 asserting tests passed on the old strings before the edit and assert the new ones now, so they fail against the old en values by construction (not re-run on reverted en).
Human call: (1) server text outside this task still says CREW on a phone: server/cli-phone-setup.ts:59 "Use CREW on your phone?", server/host/secret-cards (+ index.test) "...from CREW on your phone or computer". Server owner decides. (2) Translations are my drafts, not native-reviewed; pt-br follows its term rules (app, celular).
(3) Unused keys phone.pair.forPhones/stepLine/stepLineCloud/installLine have no call site; edited for safety.
