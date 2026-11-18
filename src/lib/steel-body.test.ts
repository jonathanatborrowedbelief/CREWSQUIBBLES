import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { CursorAvatar } from "@/components/CursorAvatar";
import { MASCOT_BODIES } from "../../shared/mascot-bodies";
import { CREW_LOOKS, STEEL_IMAGES, steelBodyImage, type SteelImage } from "./steel-body";

const images: SteelImage[] = [40, 56, 88, 128, 192, 256].map((px) => ({ body: "cursor", color: "chrome", px, url: `/steel/cursor-${px}.webp` }));
const builder: SteelImage[] = [40, 256].map((px) => ({ body: "cursor", color: "coral", px, url: `/steel/cursor-coral-${px}.webp` }));

describe("MausBot's rendered steel body", () => {
  it("picks the smallest image with a device pixel for every pixel drawn, from the popup down to the cursor", () => {
    expect(steelBodyImage("cursor", "chrome", 20, 2, images)).toBe("/steel/cursor-40.webp");
    expect(steelBodyImage("cursor", "chrome", 28, 2, images)).toBe("/steel/cursor-56.webp");
    expect(steelBodyImage("cursor", "chrome", 44, 1, images)).toBe("/steel/cursor-56.webp");
    expect(steelBodyImage("cursor", "chrome", 96, 2, images)).toBe("/steel/cursor-192.webp");
    expect(steelBodyImage("cursor", "chrome", 112, 3, images)).toBe("/steel/cursor-256.webp");
    expect(steelBodyImage("cursor", "chrome", 28, 0, images)).toBe("/steel/cursor-40.webp");
  });

  it("keeps the drawn steel for a body with no images", () => {
    expect(steelBodyImage("circle", "chrome", 44, 2, images)).toBeNull();
    expect(steelBodyImage("cursor", "chrome", 44, 2, [])).toBeNull();
  });

  it("gives each crew color its own picture and keeps the drawn body for a color with none", () => {
    expect(steelBodyImage("cursor", "coral", 44, 2, [...images, ...builder])).toBe("/steel/cursor-coral-256.webp");
    expect(steelBodyImage("cursor", "chrome", 20, 2, [...images, ...builder])).toBe("/steel/cursor-40.webp");
    expect(steelBodyImage("cursor", "green", 44, 2, [...images, ...builder])).toBeNull();
  });

  it("ships all six sizes for every crew member", () => {
    for (const { color } of CREW_LOOKS) {
      expect(STEEL_IMAGES.filter((image) => image.body === "cursor" && image.color === color).map((image) => image.px)).toEqual([40, 56, 88, 128, 192, 256]);
    }
  });

  it("draws the picture over the whole avatar frame instead of the body and the face", () => {
    const svg = (picture?: string) => renderToStaticMarkup(createElement(CursorAvatar, { size: 112, silhouette: MASCOT_BODIES.cursor, picture }));
    const withPicture = svg("/steel/cursor-256.webp");
    expect(withPicture).toContain('<image href="/steel/cursor-256.webp" x="-15" y="-15" width="258.541" height="258.541" preserveAspectRatio="none"');
    expect(withPicture).not.toMatch(/fill="url\(#[^)]+-grad\)"/);
    expect(withPicture).toMatch(/<g clip-path="url\(#[^)]+-clip\)" visibility="hidden">/);
    expect(svg()).toMatch(/fill="url\(#[^)]+-grad\)"/);
    expect(svg()).not.toContain("<image");
    expect(svg()).not.toContain('visibility="hidden"');
  });
});
