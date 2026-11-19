import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

// CREW has no free web address and no CREW Relay (upstream's account service is hidden): the two texts that used to
// point at them say Tailscale and Same Wi-Fi only, in English and in every pack that has them.
const folder = dirname(fileURLToPath(import.meta.url));
const KEYS = ["remote.client.companion.hint", "remote.serverPairing.sameWifiOnly"] as const;
const packs = readdirSync(folder).filter((name) => name.endsWith(".json") && name !== "source-hashes.json" && name !== "index.json");

describe("the remote access texts that named upstream's account service", () => {
  it.each(packs)("%s: the companion hint has no HTTPS address, and neither text names the app's Relay or takes {app}", (name) => {
    const pack = JSON.parse(readFileSync(join(folder, name), "utf8")) as Record<string, string>;
    for (const key of KEYS) if (key in pack) expect(pack[key], `${name} ${key}`).not.toMatch(/\{app\}|Relay/);
    if ("remote.client.companion.hint" in pack) expect(pack["remote.client.companion.hint"], name).not.toMatch(/HTTPS/);
  });

  it("English keeps Tailscale and the HTTPS-address-of-your-own wording", () => {
    const en = JSON.parse(readFileSync(join(folder, "en.json"), "utf8")) as Record<string, string>;
    expect(en["remote.client.companion.hint"]).toContain("full Tailscale name ending in .ts.net");
    expect(en["remote.serverPairing.sameWifiOnly"]).toBe("This link works only on the same Wi-Fi as this computer. To use it away from home, give this computer an HTTPS address, for example with Tailscale.");
  });
});
