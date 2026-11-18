# RESUME: Crew mascots + logo (2026-11-17, 23:40 CST)

Paste this into a fresh session: "Read ~/Workspace/OpenMausBot/rebrand/RESUME-PROMPT-2026-11-17-crew-mascots.md and continue."

## Where we are
- Product: **Crew by AI Systems by Jon**, a rebrand of the OpenMausBot fork. Repo `~/Workspace/OpenMausBot`, branch `rebrand`, pushed to `jonathanatborrowedbelief/OpenMausBot` (commit f47e9b2). The fork is public.
- Done: `enterprise/` removed. Name, gold accent and `$_` logo are set in `server/brand.ts` + `src/lib/brand.ts`, and the welcome screen shows "Meet Crew". Official v0.1.169 is installed in-house at /Applications/OpenMausBot.app.
- Not committed: `rebrand/TODO.md`, `rebrand/mascots/` (12 test images + 3 sheets), this file. Commit only when Jon says.
- Preview server may still be running (port 18797, pid in the scratchpad `omb-preview/pid`). To restart it, rebuild with `pnpm exec vite build`, then run `server/dev-server.ts` with an isolated HOME/OMB_DATA_DIR plus `OMB_STATIC_DIR=$PWD/dist`.

## Next task: iterate on the mascots
Jon's picks from round 1 (`rebrand/mascots/sheet-d1..d3.jpg`):
- **D2 "potato crew"**: he likes them because they look like little potatoes. Fix: yellow pill body + big eyes looks like Minions, so change color/shape enough to clear that.
- **D3 "mid-action"**: he likes the energy. Swap the checkmark for each bot's own job tool (headset, hard hat, clipboard, laptop), as in D2.
- Ambiguity: he later typed "iterate on both one and two", but the sentence before said D2 + D3. Confirm in one line ("D2 + D3, right?") before generating.
- Push for a smoother velvet/flocked finish. Round 1 came out fuzzy, like wool.
- Make the bots happy and enthusiastic, never annoyed. Style reference = Angus Sewell's felt critters (screenshot on Jon's Desktop, 11.17.09 PM). Take only the general feel (clay, velvet, big eyes). Never copy his characters, and never feed his image to an edit model.
- Main bot name idea: **Squibbles**.

## Then: the mascot becomes the logo
Jon wants the mascot to be the logo, the way the Maus mouse is for OpenMausBot. It needs a version that reads at app-icon/favicon size (a simple head + eyes). Test it at 32px and 512px.

## Tools (all verified 11-17)
- **Sogni MCP** (`mcp__sogni__*`, key in ~/.zshenv). Free on the Unlimited Pro plan (`covered_by_subscription: true`): `qwen_image_2512_fp8` (used in round 1, ~60 s for 4 images), `flux3_image_klein_sd_int8_convrot`, `krea2_turbo_fp8_scaled`. GPT Image 2.6 is NOT covered ($0.057 each): ask Jon first.
- Flow: `quote` (include a request_id) → `generate_image` (billing_mode subscription, count 4) → `get_job` → curl the URLs into `rebrand/mascots/` → ffmpeg xstack 2x2 sheet → `open` the sheets for Jon.
- Higgsfield has 0 credits. HeyGen gens are on HOLD.

## Round-1 prompts (base for iteration)
- D2: "A family of four cheerful little robot critters standing side by side, all sharing the same rounded pebble-shaped body made of soft clay covered in gold velvety felt flocking, big round glossy cartoon eyes with white sparkle highlights, happy open smiles, tiny stubby arms waving. Each one wears a different job prop: a headset with microphone, a tiny hard hat, a clipboard, a tiny laptop. Handmade stop-motion puppet look, matte texture, slightly imperfect hand-sculpted edges. Seamless deep teal backdrop, soft studio lighting, gentle soft shadows, product photography, 3D render."
- D3: "A single cheerful little robot critter caught mid-jump with joy, both tiny arms raised holding up a big gold checkmark sign, big round glossy cartoon eyes squeezed happily, wide open delighted smile, small felt confetti pieces floating around it. Rounded square body made of soft clay covered in gold velvety felt flocking, handmade stop-motion puppet look, matte texture, slightly imperfect hand-sculpted edges. Seamless soft coral backdrop, soft studio lighting, sense of motion, product photography, 3D render."

## Parked (in rebrand/TODO.md)
- New high-contrast palette (Jon: current gold/dark "looks flat").
- Full ~32 h rebrand (census.md), updater feed → our fork, PostHog off, update pipeline (update-pipeline.md).

## Jon's rules that bite here
- Replies ≤12 lines, next action first.
- On "let's iterate": state the job + 2-3 directions, no "my pick".
- Image subagents run on Sonnet, not Opus.

## Round 2 (2026-11-17, ~23:50 CST) — in rebrand/mascots/r2/
- Jon confirmed D2 + D3.
- D2 de-Minion, 3 directions: `sheet-d2a-russet` (brown potato + sprout), `sheet-d2b-sweet` (coral sweet potato), `sheet-d2c-mixed` (sage/coral/cream/navy crew). Fix: bead eyes, no rims/goggles. Prompt line that got the smoother velvet: "Smooth flocked velvet finish like a flocked vinyl toy: short dense even pile with a soft sheen, no loose fibers, not wool, not fuzzy felt."
- D3: one bot per job tool (headset, hard hat + wrench, clipboard, laptop), `sheet-d3-tools-1/2`.
- Known flaw: laptops show an Apple-style logo. Next round add "blank laptop lid, no logo".
- Waiting on Jon's pick, then: logo head test at 32px + 512px.

## Round 3 (2026-11-17, ~23:55 CST)
- Jon picked D2C mixed crew, image `r2/d2c-mixed-3.png` (blobs on cream). Wants no artifacts, no extra limbs, no potato holes.
- Cleaned with Sogni `qwen_image_edit_2511_fp8` (subscription-covered, ~2 min): blank laptop lid, cream bot's duplicate hard hat removed, navy's third hand removed. Master = `r2/crew-master-v1.png` (= clean-2). clean-4 still had the Apple logo.
- Logo test `r2/logo-head-test.png`: all 4 heads read at 32px. Next: Jon picks which bot is the logo / "Squibbles", then generate that bot solo on a plain background for the app icon.

## Round 4 (2026-11-18, ~00:05 CST) — rebrand/mascots/r4/
- Jon locked roles + colors: **Squibbles = green headset = Director + the logo**; navy laptop = Coder; cream clipboard = QA; coral hard hat = Builder. Business bots get built per client. Tools must be right for the job. Assets must match the old MausBot sizes.
- `rebrand/bot-format.md` = the format for building any bot (role/color/tool, body rules, never-list, Sogni prompt, old asset sizes).
- Icon: `r4/squibbles-icon-{1024,512,192,180,64,32,16}.png` from `green-head-1.png` (rounded square, cream bg, 100px transparent pad like macOS). `r4/icon-size-test.png` shows it reads at 16px on dark + light.
- Solos (edit model, master ref): green-solo-1, navy-solo-1, cream-solo-2 are the keepers (2 arms, blank laptop, checklist). green-head-4 / green-solo-2 drifted teal: reject. Coral solo (hard hat + wrench) job wf_durable_workflow_0378612d… was slow.
- Sogni `remove_background` (birefnet) is covered by the subscription → transparent cutouts for the avatar sizes 40–256.
- Not done: swapping files into build/, public/, src/assets/ (that is part of the deferred ~32 h rebrand; the cursor avatar is a generated body system, see census §5D).
- Round 4 finished: keepers = green-solo-1, coral-solo-2, cream-solo-2, navy-solo-1 (`r4/crew-lineup.jpg`). Transparent cutouts: green-cut, navy-cut, cream-cut (coral not cut yet). Avatars at old sizes: `r4/avatars/{squibbles,coder}-{40..256}.{png,webp}` (cwebp; ffmpeg has no libwebp). `r4/avatar-size-test.png`: navy is low-contrast on dark bg at 40px.
- Next: Jon's OK on the icon + lineup → swap the files into build/, public/, electron/resources/, src/assets/ on branch `rebrand` (no commit until Jon says).
- Outline (11-18): Jon wants the same outline on every bot, white or black. Test `r4/outline-test.png`: white makes all 4 pop on dark and disappears on light; black hides navy on dark. Went with white. `r4/avatars/white-outline/{squibbles,builder,qa,coder}-{40,56,88,128,192,256}.{png,webp}` (outline 2–6 px by size; script = ffmpeg alpha dilation). Bases are `r4/avatars/*-base.png`.
