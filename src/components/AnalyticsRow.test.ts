import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AnalyticsRow } from "./AnalyticsRow";

vi.stubGlobal("localStorage", { getItem: () => null, setItem: () => {}, removeItem: () => {} });
afterEach(() => vi.unstubAllEnvs());

describe("the Settings analytics row", () => {
  it("is hidden when the build has no PostHog key (CREW's default)", () => {
    vi.stubEnv("VITE_CREW_POSTHOG_KEY", "");
    expect(renderToStaticMarkup(createElement(AnalyticsRow, { simple: true }))).toBe("");
  });

  it("negative control: shown, as a switch, when a key is supplied", () => {
    vi.stubEnv("VITE_CREW_POSTHOG_KEY", "phc_crew_test_key_not_a_real_project");
    const html = renderToStaticMarkup(createElement(AnalyticsRow, { simple: true }));
    expect(html).toContain("Usage analytics");
    expect(html).toContain("role=\"switch\"");
  });
});
