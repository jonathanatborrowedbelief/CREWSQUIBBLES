import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
import { HIDE_UPSTREAM } from "./upstream-hidden.mjs";

const origin = "http://127.0.0.1:48993";
const CLOUD_BRIDGES = ["cloudAccount", "cloudSendPage", "accounts", "accountSheet", "cloudPlan", "organization"];
const source = name => readFileSync(new URL(name, import.meta.url), "utf8").replace(/\r\n/g, "\n");
function preload(extra = []) {
  let bridge;
  vm.runInNewContext(source("./preload.cjs"), {
    process: { platform: "fixture", argv: [`--omb-local-origin=${origin}`, "--omb-company-desktop=1", ...extra] },
    location: { origin }, TextEncoder, localStorage: { getItem: () => null },
    require: () => ({ webUtils: {}, contextBridge: { exposeInMainWorld: (_name, value) => { bridge = value; } },
      ipcRenderer: { on() {}, removeListener() {}, send() {}, invoke: () => Promise.resolve({}) } }),
  });
  return bridge;
}

test("CREW ships with upstream's Cloud hidden", () => {
  assert.equal(HIDE_UPSTREAM, true);
});

test("main passes the hide flag to both windows' pages, and the Cloud menu items wait on it", () => {
  const main = source("./main.mjs");
  assert.equal(main.match(/\.\.\.\(HIDE_UPSTREAM \? \["--omb-upstream-hidden=1"\] : \[\]\)/g)?.length, 2, "this computer's window and the rail's page");
  assert.match(main, /function cloudOffersAllowed\(\) \{\n  return !HIDE_UPSTREAM && /);
  assert.match(main, /\.\.\.\(HIDE_UPSTREAM \? \{\} : \{ onOrganizationSignIn:/);
  assert.match(main, /account: !HIDE_UPSTREAM && !desktopRemoteAccess && Boolean\(accounts\.view\(\)\.active\)/);
});

test("the preload leaves out the Cloud's bridges when main says so, and keeps every other one (the control: without the flag they are all there)", () => {
  const shown = preload(), hidden = preload(["--omb-upstream-hidden=1"]);
  for (const key of CLOUD_BRIDGES) {
    assert.ok(shown[key], `${key} without the flag`);
    assert.equal(hidden[key], undefined, `${key} with it`);
  }
  for (const key of Object.keys(shown).filter(key => !CLOUD_BRIDGES.includes(key))) assert.equal(typeof hidden[key], typeof shown[key], `${key} is untouched`);
  assert.ok(hidden.placesTogether && hidden.companyBackups && hidden.companion, "phone, backups and places stay");
});
