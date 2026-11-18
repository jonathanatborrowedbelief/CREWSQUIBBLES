# Crew bot format

Every Crew bot follows this format. The master image is `mascots/final/crew-master.png`.

## One bot = one job + one color + one tool
- **Role:** one job, said in a word or two (Director, Coder, QA, Builder).
- **Color:** a velvet color no other bot uses.
- **Tool:** one prop that is right for that job. If a viewer can't guess the job from the tool, swap the tool.

## The core crew (Jon, 11-17)
| Bot | Role | Color (sampled) | Tool |
|---|---|---|---|
| **Squibbles** (far left, the logo) | Director: runs everything | sage green #6a7858 | headset with mic |
| Back, tall | Builder | coral #f1856f | yellow hard hat + wrench |
| Middle, front | QA | cream #f5efdf | clipboard with checklist |
| Far right | Coder | navy #324776 | laptop, blank lid |

Business bots (receptionist, bookkeeper, etc.) get built per client using this same format.

## Body (same for every bot)
- Round, lumpy blob/potato body, smooth flocked velvet (short pile, soft sheen; never wool or fuzz)
- Glossy black bead eyes with a white star highlight, pink cheeks, big happy open smile
- Stubby feet, **exactly two arms**
- Mood: happy and excited, never annoyed

## Never
- Spots, holes or potato "eyes" on the body
- Yellow pill body or goggle/rimmed eyes (looks like Minions)
- Extra hands or limbs, real brand logos (no Apple on laptops), text
- Two bots with the same tool or color

## Making a new bot (Sogni, free on the plan)
1. Edit model `qwen_image_edit_2511_fp8`, reference = the master image.
2. Prompt: "Show only a new character in the same style as these: [color] smooth velvet blob body, same bead eyes, cheeks and smile, exactly two arms, holding [tool]. Alone, full body, facing camera, plain warm cream background. No logos, no text."
3. Count the arms, check the tool and logos, then shrink to 32px and check that the face still reads.

## Sizes to match the old MausBot files
- App icon: 1024 (`build/icon-1024.png`, `electron/resources/app-icon.png`) → `.icns` iconset 16–1024 + `.ico`
- Web: 512 + 192 (PWA), 180 (apple-touch), favicon (`public/app-icon.svg`)
- Bot avatar (was the chrome cursor): 40, 56, 88, 128, 192, 256, with a white outline on every bot (2 px at 40–56, up to 6 px at 256) (`src/assets/mausbot-steel/cursor-*.webp`)
- DMG install art: `build/background.png` + `@2x`
