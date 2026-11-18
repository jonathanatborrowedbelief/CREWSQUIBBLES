# Rebrand TODO

- [ ] **New contrast palette** (Jon, 11-17): gold #d4a745 on near-black reads flat next to other brands. Pick a higher-contrast set later; current colors are placeholders.
- [x] Mascot set (11-18): Squibbles + Builder, QA, Coder in `mascots/final/`; format in `bot-format.md`. App icons, favicon, welcome logo and the default bot avatar now show Squibbles.
- [x] Builder / QA / Coder pickable (11-18): a "Crew" row in the bot look picker. Picture files are keyed by body + color (`cursor-coral-*` = Builder, `cursor-yellow-*` = QA, `cursor-blue-*` = Coder, plain `cursor-*` = Squibbles on chrome). Reset now returns to Squibbles (was green).
- [x] DMG install art (11-18): Maus family swapped for Builder, QA, Coder (`build/dmg/crew/*.png`, inlined by `render.mjs`). The app icon is Squibbles, so he is the one you drag in.
- [ ] 4 brand tests fail since the rename commit f47e9b2 (they expect "MausBot" and the old page titles); part of the full rebrand.
- [ ] Full ~32 h rebrand (census.md), updater feed to our fork, PostHog off.
