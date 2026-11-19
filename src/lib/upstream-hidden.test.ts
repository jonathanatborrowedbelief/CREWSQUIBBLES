import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  accountSheetBridge, accountsBridge, cloudAccountBridge, cloudPlanBridge, cloudSendBridge, HIDE_UPSTREAM, managedRemoteHidden,
  organizationBridge, promosHidden, setUpstreamHidden, updatesConsentWindowBridge, upstreamHidden,
} from "./upstream-hidden";

const bridges = {
  cloudAccount: { state: vi.fn() }, cloudPlan: { state: vi.fn() }, cloudSendPage: { notice: vi.fn() }, accounts: { list: vi.fn() },
  accountSheet: { open: vi.fn() }, organization: { state: vi.fn() }, updatesConsent: { state: vi.fn() },
};

beforeEach(() => { vi.stubGlobal("window", { ogb: bridges }); });
afterEach(() => { setUpstreamHidden(false); vi.unstubAllGlobals(); });

describe("the switch that hides upstream's Cloud and promos", () => {
  it("ships on: CREW hides them until its own servers exist", () => {
    expect(HIDE_UPSTREAM).toBe(true);
  });

  it("with it on, every Cloud bridge reads as absent, which is how each surface already reads a build with no Cloud", () => {
    setUpstreamHidden(true);
    expect(upstreamHidden()).toBe(true);
    expect(managedRemoteHidden()).toBe(true);
    for (const bridge of [cloudAccountBridge, cloudPlanBridge, cloudSendBridge, accountsBridge, accountSheetBridge, organizationBridge, updatesConsentWindowBridge]) {
      expect(bridge()).toBeUndefined();
    }
  });

  it("with it off, they are the preload's own (the control)", () => {
    setUpstreamHidden(false);
    expect(managedRemoteHidden()).toBe(false);
    expect(cloudAccountBridge()).toBe(bridges.cloudAccount);
    expect(cloudPlanBridge()).toBe(bridges.cloudPlan);
    expect(cloudSendBridge()).toBe(bridges.cloudSendPage);
    expect(accountsBridge()).toBe(bridges.accounts);
    expect(accountSheetBridge()).toBe(bridges.accountSheet);
    expect(organizationBridge()).toBe(bridges.organization);
    expect(updatesConsentWindowBridge()).toBe(bridges.updatesConsent);
  });

  it("is absent without a window or a bridge, either way", () => {
    vi.stubGlobal("window", { });
    expect(cloudAccountBridge()).toBeUndefined();
    vi.unstubAllGlobals();
    expect(cloudAccountBridge()).toBeUndefined();
  });

  it("hides promos for this switch or for a white-label build, and for nothing else", () => {
    setUpstreamHidden(false);
    expect(promosHidden({ source: "default" })).toBe(false);
    expect(promosHidden({ source: "file" })).toBe(true);
    setUpstreamHidden(true);
    expect(promosHidden({ source: "default" })).toBe(true);
  });
});
