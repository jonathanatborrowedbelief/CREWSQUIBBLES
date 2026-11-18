# Rebrand TODO

- [ ] **New contrast palette** (Jon, 11-17): gold #d4a745 on near-black reads flat next to other brands. Pick a higher-contrast set later; current colors are placeholders.
- [x] Mascot set (11-18): Squibbles + Builder, QA, Coder in `mascots/final/`; format in `bot-format.md`. App icons, favicon, welcome logo and the default bot avatar now show Squibbles.
- [x] Builder / QA / Coder pickable (11-18): a "Crew" row in the bot look picker. Picture files are keyed by body + color (`cursor-coral-*` = Builder, `cursor-yellow-*` = QA, `cursor-blue-*` = Coder, plain `cursor-*` = Squibbles on chrome). Reset now returns to Squibbles (was green).
- [x] DMG install art (11-18): Maus family swapped for Builder, QA, Coder (`build/dmg/crew/*.png`, inlined by `render.mjs`). The app icon is Squibbles, so he is the one you drag in.
- [ ] Full suite (11-18): ~106 tests expect old brand text, 12 test deleted enterprise/ code; 34 more fail on upstream too (this Mac). Breakdown: `rebrand/test-triage-2026-11-18.md`. Fix the 118 during the full rebrand.
- [ ] Full rebrand: plan in `full-rebrand-plan.md` (Jon's 4 calls made 11-18: hide Cloud promos, Squibbles default bot, @devs off, PostHog off but kept). ~24-32 h, 6 phases. Waiting on Jon's go for phase 1.
- [ ] Before any client/public release: read `hidden-upstream-features.md` (what each hidden feature needs, and why upstream had analytics on).

## Jon, 11-18 (after seeing the app: "so fucking baller")
- [ ] Share one workspace with his buddy, both working remotely on the same project (research: `sharing-research.md`).
- [ ] Phone: "Pair a phone" says "Install CREW from the App Store". Find out if MausBot's App Store app works with our fork, or what our own CREW iPhone app takes (research: `phone-research.md`).
- [ ] Finish the rebrand: still says MausBot / OpenMausBot / Electron in places.
