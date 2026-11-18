// The crew as finished pictures, face included: src/assets/mausbot-steel/<body>[-<color>]-<px>.webp, square, framing the
// mascot's whole SVG viewBox, at <px> device pixels. A file with no color is the chrome one. A body and color with no
// pictures keeps the drawn finish.
import type { MausColor } from "../../shared/wire";

const files = import.meta.glob<string>("../assets/mausbot-steel/*.{webp,png}", { eager: true, query: "?url", import: "default" });

export interface SteelImage { body: string; color: MausColor; px: number; url: string }

export const STEEL_IMAGES: readonly SteelImage[] = Object.entries(files)
  .flatMap(([path, url]) => {
    const match = /\/([a-z]+)(?:-([a-z]+))?-(\d+)\.(?:webp|png)$/.exec(path);
    return match ? [{ body: match[1]!, color: (match[2] ?? "chrome") as MausColor, px: Number(match[3]), url }] : [];
  })
  .sort((a, b) => a.px - b.px);

/** The crew members a bot can be: the cursor body in a color that has its own picture. Squibbles is the default. */
export const CREW_LOOKS = [
  { id: "squibbles", color: "chrome" },
  { id: "builder", color: "coral" },
  { id: "qa", color: "yellow" },
  { id: "coder", color: "blue" },
] as const satisfies ReadonlyArray<{ id: string; color: MausColor }>;

/** The smallest image that still has a device pixel for every pixel drawn, or the largest there is; null when this body
 * and color have none. */
export function steelBodyImage(
  body: string,
  color: MausColor,
  size: number,
  density: number,
  images: readonly SteelImage[] = STEEL_IMAGES,
): string | null {
  const own = images.filter((image) => image.body === body && image.color === color);
  if (!own.length) return null;
  const wanted = size * Math.max(1, density);
  return (own.find((image) => image.px >= wanted) ?? own.at(-1)!).url;
}
