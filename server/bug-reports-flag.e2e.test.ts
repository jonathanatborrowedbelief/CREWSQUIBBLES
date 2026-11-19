// The client offers @devs only where bug reports go somewhere: /api/config says so with one boolean. (The verification
// server always names a loopback report address, so only "on" can be launched here; the empty address that means "off" is
// bugReportEndpoint's, tested in devs-report-send.test.ts, and the one comparison that turns it into the flag is below.)
import { expect, it } from "vitest";
import { launchVerificationServer } from "../scripts/control-omb.ts";
import { request } from "../scripts/mcp-server.ts";
import { bugReportEndpoint } from "./devs-report-send.ts";

it("says bug reports are on once an address is named, and the same comparison says off for none", async () => {
  const session = await launchVerificationServer({ ...process.env, OMB_BUG_REPORT_URL: "http://127.0.0.1:9/api/bug-reports" }, undefined, undefined, undefined, undefined, { scripted: true });
  try { expect(((await request("/api/config", {}, session.info.url)) as { bugReports?: unknown }).bugReports).toBe(true); }
  finally { await session.close(); }
  expect(bugReportEndpoint({}) !== "", "unset (CREW's default)").toBe(false);
  expect(bugReportEndpoint({ OMB_BUG_REPORT_URL: "http://192.0.2.1/api/bug-reports" }) !== "", "an address that is not allowed").toBe(false);
});
