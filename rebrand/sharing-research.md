# Sharing one CREW workspace: what the code supports

2026-11-18, branch `rebrand`, enterprise/ deleted. Read-only research by a Sonnet agent: code and docs read, nothing executed. Verify before relying on any "works" below.

## Bottom line
1. The only sharing that works for us is the **plain self-hosted server** in the open-source edition. One server holds one data set (bots, chats, routines). Any number of devices pair to it (one-time code → session cookie) and all see the same bots and chats live over SSE. Docs: `docs/self-hosting.md:22-36` ("Pick a way in").
2. Everything labelled Team, Cloud, Organization or Boat is a client for upstream's closed "Admin" service (cloud./admin./accounts.openmausbot.com), not in this repo. Do not build on it.
3. Do NOT set `OMB_ADMIN_URL` / `OMB_ADMIN_WORKSPACE` / `OMB_ADMIN_MEMBERSHIP`: with no enterprise layer every remote session gets 503 "Workspace sign-in is unavailable." (`server/index.ts:12379, 12647`; `server/enterprise.ts:71, :108`).

## How the gate behaves with enterprise/ gone
- `server/enterprise.ts:119` finds no layer → edition "oss", `entitled()` (:193) always false.
- `server/brand.ts:62-86`: brand.json ignored without `whitelabel` (:81). CREW branding is compiled-in defaults; untouched.
- `entitled(` only gates admin, billing and hosted-Slack. No recommended sharing path touches it.
- `scripts/bundle-server.mjs:131` skips the missing layer, so Docker and `pnpm build:server` still build.

## Path by path
| # | Path | Key files | Upstream/enterprise dependency | Work |
|---|---|---|---|---|
| 1 | Self-hosted server + pairing, own HTTPS (`serve --public-url`/`--domain`, Docker + Caddy) | `server/cli.ts:157-176, 604-614, 709-722`; `deploy/docker-compose.yml`; `deploy/Caddyfile`; `docs/self-hosting.md:230-251, 732-873`; `server/request-auth.ts` | None (Caddy binary from GitHub, Let's Encrypt) | ~half a day |
| 2 | Self-hosted + Tailscale (`serve --tailscale`) | `server/tailnet-listener.ts:53, 63`; `server/tailscale.ts`; `docs/self-hosting.md:241-251` | None | ~2-3 h; friend needs Tailscale |
| 3 | Desktop as host over Tailscale ("Your other computers" → Pair a computer) | `electron/main.mjs:680, 1790`; `electron/tailnet-share.mjs`; `docs/desktop-companion.md` | None | ~30 min, no VPS; host Mac must stay awake |
| 4 | "Connect to a server" / environments (client side of 1-3) | `electron/main.mjs:1413, 1554, 1790-1800`; `electron/environments.cjs` | None; friend can just use a browser | Works |
| 5 | Email sign-in + People + invite link | `server/account-signin.ts:57, 62-67`; `src/components/PeopleSection.tsx:26`; `docs/self-hosting.md:970-1035` | Default sends codes via upstream accounts.openmausbot.com; `OMB_SIGNIN_SMTP_URL` avoids it | Low with SMTP, else use pairing codes |
| 6 | `--tunnel`, `openmausbot login`, `--relay`, managed `c-*.openmausbot.com` | `server/tunnel.ts`; `electron/companion-account-service.mjs:53, 97`; `electron/desktop-companion-client.mjs:50`; `electron/relay-token.mjs:12` | Hard dependency on upstream control plane | Days to self-host; not worth it |
| 7 | Our own cloudflared tunnel → `serve --public-url` | `docs/self-hosting.md:84-98`; `docs/deploy-vps.md` | None | Low; alternative to opening 80/443 |
| 8 | Team Cloud (`config.team`, `useTeamPeople`, `mayRename`, `openmausbot://team/<uuid>`) | `src/state/team-people.ts:32, 89, 183`; `server/cloud-home.ts:87-123`; `server/cloud-team-roster.ts`; `electron/team-join.mjs:6` | Needs upstream Admin | Weeks; don't |
| 9 | MausBot Cloud / `ensureCloudAccount` | `electron/main.mjs:798`; `electron/cloud-account.mjs:10` | Upstream Admin + payments | Not feasible |
| 10 | Organization sign-in / `OMB_ADMIN_*` | `electron/main.mjs:878`; `server/enterprise.ts:71-110` | Upstream Admin + deleted enterprise code; license-restricted | Not feasible; a trap |
| 11 | `desktopRemoteAccess` | `electron/main.mjs:361, 2417-2433` | Upstream; retired | Ignore |
| 12 | Cloud computers (Boat/box/vps) | `server/boat.ts`; `docs/byo-vps.md` | Per-bot compute, not sharing | Skip |
| 13 | `server/dev-server.ts` | `server/dev-server.ts:3-4`; `server/request-auth.ts:146-150` | Sets `OMB_DEV_TRUST_LOCAL_BROWSER=1` | Never expose it |
| 14 | Template share / backup export-import | `docs/team-sharing.md`; `docs/self-hosting.md:816-820` | "Publish to community" uses upstream | Fallback snapshot only |

`viewer` flags (`src/lib/onboarding.ts:38-47`): `canSave` = admin scope (pairing codes give admin, so both of you can save); `hosted` and `cloudHome` stay false for us. A browser never gets loopback trust; pairing is the only login.

## How two people share on a plain self-hosted server
- Each paired device = own session, admin scope by default (`pair --phone` = client scope: chat/approve/read only). 5 wrong codes in 5 min locks an address.
- State is server-side; events broadcast to all clients. `useTeamPeople`/`mayRename` stay inert (only lit by `OMB_CLOUD_ROLE=team`).
- Names: with no sign-in list both admin devices may show Jon's profile name (`server/own-home.ts:35`). Fix: each sets a display name (Settings → Bots → About you, `PUT /api/me`), or put two admin emails in the sign-in list. NOT VERIFIED that admin-scoped paired sessions may use `/api/me`.
- Multi-person features (activity log, who may answer a card, bot visibility) turn on when the sign-in list names >1 person (`docs/self-hosting.md:1044-1135, 1455-1500`).

## Gotchas specific to our fork
a. **Upstream installers deploy upstream's image, not CREW** (`deploy/install.sh`, `deploy/update.sh`, root `compose.yaml` → `ghcr.io/milind-soni/openmausbot:latest`). Don't run them. Use `deploy/docker-compose.yml` with `docker compose up -d --build` (context = our checkout). Build needs ~6 GB RAM or swap. Updates: `git pull && docker compose up -d --build`.
b. `rebrand/` (81 MB) is not in `.dockerignore`; add it.
c. Don't set `OMB_ADMIN_*`.
d. Don't use `dev-server.ts` remotely (no static dir, trusts local browser). Use `pnpm omb serve ...` or Docker; `pnpm exec vite build` first.
e. **One engine login is shared**: both of you spend one Claude/Codex subscription's limits. Check the provider's terms on two people sharing a subscription; alternative is a workspace API key (per-token billing, per-person usage).
f. An admin friend = effectively server owner (bot shells run as the same OS user). Lower trust: `pair --phone` + `OMB_LOOPBACK_TRUST=service`.
g. "Make <server> my home" (moving Jon's local bots) is only offered while the server has one owner; do it before pairing the friend.
h. Quiet upstream calls remain: update check, announcements (`OMB_DISABLE_ANNOUNCEMENTS=1`), team template library, bug reports; connected apps need our own Composio key.
i. No edit locking: last write wins; two people in one bot chat share one transcript.
j. Nothing was run: no Docker build, no VPS, no two-device test.

## Ranked recommendation
### 1. VPS + our Docker build + own domain + pairing codes (durable)
```
# VPS: Ubuntu 24.04, >=4 GB RAM (+swap), DNS A crew.<domain> -> VPS, ports 80/443
git clone https://github.com/jonathanatborrowedbelief/OpenMausBot && cd OpenMausBot && git checkout rebrand
cd deploy && cp .env.example .env   # DOMAIN=crew.<domain>; ENGINES="@anthropic-ai/claude-code @openai/codex"
docker compose up -d --build
docker compose exec omb claude      # sign engines in (or Settings -> Engines)
docker compose exec omb openmausbot pair --label "Jon"
docker compose exec omb openmausbot pair --label "Friend" --ttl 24h
```
Friend opens the printed `https://crew.<domain>/pair#code=...` link. Optional `basic_auth` in `deploy/Caddyfile`. No-public variant: same VPS with `--tailscale`. ~2-4 h; cost = VPS + domain.

### 2. Jon's Mac as host over Tailscale (no VPS; best first trial)
CREW desktop → Settings → Phone & devices → Your other computers → Pair a computer; friend joins the tailnet and uses Connect to a server. ~30 min. Catch: Mac must stay on and awake.

### Don't pursue
Team Cloud, My Cloud, Organization sign-in, Boat, `--tunnel`/`--relay`, desktopRemoteAccess (all need upstream's Admin/control plane).
