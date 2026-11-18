# Update pipeline: upstream → our brand → in-house → clients (Jon's design, 11-17)

## Flow
1. **Daily watcher** (GitHub Action on our fork): is there a new upstream release tag? If not, log "checked, nothing new" (live control).
2. **Merge + rebrand:** merge the upstream tag into `rebrand`, then run `rebrand/apply.mjs` (a re-runnable script, NOT hand edits).
3. **Gate:** run typecheck, tests, and the census re-run command, which must give 0 user-visible MausBot hits. If the gate fails, nothing is released and Jon gets an alert.
4. **Publish to the `beta` channel** on our fork's releases. In-house (Jon + buddy) runs beta as the canary.
5. **Promote to `latest` after 24 h** if no problem was reported. Client installs only read `latest`, so they get it one day late and correctly branded.

## Required changes
- `electron-builder.yml` publish owner → `jonathanatborrowedbelief`, so the updater reads our feed. Fix the 4 CI/script gates that assert the upstream owner (see census F).
- PostHog: remove it, or swap in our own key (census risk 2).
- `apply.mjs` does the name, icons and mascot. Rebrand effort is about 32 h (census), mostly mechanical, which suits Codex.

## Mac updates without an Apple Developer ID (Jon, 11-17: skip the $99/yr)
- Built-in auto-update is off on client Macs. Updates are swapped in by hand.
- **The updater runs outside the app as a launchd job, not as a bot.** The bots run inside the app, so a bot that quits the app to swap it kills itself mid-update. The job runs daily:
  1. Check our `latest` release.
  2. Download it with `curl`, which adds no quarantine flag, so Gatekeeper doesn't block it.
  3. Verify its sha256.
  4. Wait until no bot turn is running, then quit the app, replace `/Applications/<Brand>.app` and relaunch.
  5. Write a result file (CLEAN/FINDING/DOWN). A bot in the app can read that file and report it to us.
- **Sign builds with a free self-signed certificate**, not ad-hoc. Ad-hoc signatures change on every build, so macOS drops the Accessibility/Screen Recording grants on each update and someone would have to re-grant them on the client Mac. A stable self-signed identity keeps those grants.
- Windows/Linux: electron-updater works without paid signing.
- The builds run on GitHub Actions macOS runners, which are free on a public repo.

## In-house today
The official v0.1.169 is installed at `/Applications/OpenMausBot.app` (notarized, upstream). It uses `~/.openmausbot`, the same data dir our build will use, so bots carry over when we switch.
