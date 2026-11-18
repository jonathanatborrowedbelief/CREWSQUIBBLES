# Upstream features CREW hides or turns off (reminder)

Jon, 11-18: hide them for now. If we ever turn one back on, we need our own server for it first. Never point CREW at upstream's servers.

| Feature | Upstream server it talks to | What we'd need to bring it back |
|---|---|---|
| MausBot Cloud sign-in, plans, buy menus, Cloud intro, What's new | `cloud.openmausbot.com`, `accounts.openmausbot.com` | Our own accounts + billing service (`cloudflare/control-plane/` source is in the repo) |
| Team Cloud (invite people, shared bots) | upstream's Admin service (closed source) | A different sharing path; see `sharing-research.md` (self-hosted server + pairing codes) |
| Boat cloud computers offer | Boat's referral program | Our own deal with Boat, or drop it |
| ModelGo offer | upstream's partner deal | Our own deal, or drop it |
| Product Hunt / GitHub star nudges | upstream's launch pages | Our own launch pages |
| `@devs` bug reports | `cloud.openmausbot.com/api/bug-reports`, emailed to upstream's founders | An endpoint of ours (`OMB_BUG_REPORT_URL`) that emails Jon |
| Announcements cards | upstream repo `main` | Our own feed file in our fork |
| PostHog analytics | `us.i.posthog.com`, upstream's project key | Our own PostHog project + key |

## Before any client or public release: learn from upstream's analytics
Jon wants to know why upstream had analytics on and what it sent.
1. Read `docs/analytics.md` (lists the events).
2. Read `src/lib/analytics.ts` and `src/lib/usage-snapshot.ts` (the daily snapshot of what's set up).
3. Write down which events would help us support clients, then decide: our own key, or keep it off.
