import { describe, expect, it } from "vitest";

import { DEVS_CHOICE, devsChoices } from "./MentionMenu";

describe("the @devs row of the @ list", () => {
  it("is there unless the server says bug reports are off, and a server that never said keeps it", () => {
    expect(devsChoices({ bugReports: true })).toEqual([DEVS_CHOICE]);
    expect(devsChoices({})).toEqual([DEVS_CHOICE]);
    expect(devsChoices(null)).toEqual([DEVS_CHOICE]);
    expect(devsChoices(undefined)).toEqual([DEVS_CHOICE]);
  });

  it("is left out when the server says bug reports are off (OMB_BUG_REPORT_URL unset, CREW's default)", () => {
    expect(devsChoices({ bugReports: false })).toEqual([]);
  });
});
