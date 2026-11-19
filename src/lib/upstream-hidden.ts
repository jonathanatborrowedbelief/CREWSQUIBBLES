import { HIDE_UPSTREAM } from "../../electron/upstream-hidden.mjs";

/** The switch is electron/upstream-hidden.mjs's, so the main process and this renderer read one constant. */
export { HIDE_UPSTREAM };

let hidden = HIDE_UPSTREAM;

export function upstreamHidden(): boolean {
  return hidden;
}

/** For tests: the shared test setup shows everything, a test of the hidden state sets it back. */
export function setUpstreamHidden(next: boolean): void {
  hidden = next;
}

/** No promo, nudge or Cloud card: this switch, or a white-label build (`brandStatus()`'s source is a file), which has always had none. */
export function promosHidden(brand: { source: string }): boolean {
  return hidden || brand.source === "file";
}

type Ogb = NonNullable<Window["ogb"]>;

function bridge<Key extends keyof Ogb>(key: Key): Ogb[Key] | undefined {
  return hidden || typeof window === "undefined" ? undefined : window.ogb?.[key];
}

/** The desktop's CREW Cloud sign-in, plans and checkout. Absent while hidden, which every Cloud surface already reads as "this build has no Cloud". */
export const cloudAccountBridge = () => bridge("cloudAccount");
/** The plan on a Cloud's own page. */
export const cloudPlanBridge = () => bridge("cloudPlan");
/** The one-time move to a Cloud. */
export const cloudSendBridge = () => bridge("cloudSendPage");
/** The accounts signed in on this device (the Cloud's), and the sheet that manages them. */
export const accountsBridge = () => bridge("accounts");
export const accountSheetBridge = () => bridge("accountSheet");
/** The work sign-in against an organization's Admin portal. */
export const organizationBridge = () => bridge("organization");
/** The product-updates email question, kept on the Cloud account. */
export const updatesConsentWindowBridge = () => bridge("updatesConsent");

/** Anywhere (CREW Relay) and the free web address need upstream's account service: hidden with it. */
export function managedRemoteHidden(): boolean {
  return hidden;
}
