FINDING (2 brand-text leftovers, fixed; nothing else new)

Full suite on f241c86 (phase 1), 2026-11-18, ~3 h: 52 of 40,668 tests fail, in 38 files. Log: `/private/tmp/crew-tests/vitest-f241c86.txt`.

| Group | Tests | What |
|---|---|---|
| Fail on upstream too (`test-triage-2026-11-18.md`) | 34 | browser engine, timing on this Mac. `phone-relay` is the same test, renamed MausBot Relay → CREW Relay |
| Brand text left in e2e tests | 4 | `cloud-team-onepassword` ×3 (fixture vault still "Shared with OpenMausBot", `scripts/testing/cloud-send-fixture.ts:178`), `opencode-provider-keys` ×1 (expected "OpenMaus keeps"). Both fixed, re-run green (uncommitted) |
| enterprise/ deleted | 11 + 1 file | `hosted-access` ×9, `hosted-models-api`, `worker-port`, `verification-docs` (reads enterprise source). Drop or trim in phase 6 |
| Flaky, not ours | 3 | `memory-order` passed on re-run. `one-workspace-ui` "signs in again" also failed on upstream base (1 of 2 runs, negative control). `browser-evidence` "page health": Browser connection closed (engine) |

Upstream base worktree for negative controls: `/private/tmp/claude-502/-Users-jonathan/f76f0019-6fd5-4523-8121-a53390b391b5/scratchpad/upstream-wt` (detached at `base-upstream-0.1.169`).
