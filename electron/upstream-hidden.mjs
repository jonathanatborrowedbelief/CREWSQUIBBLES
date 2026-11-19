/**
 * Hides everything that needs upstream's account or Cloud (sign-in, plans, promos, Feedback, @devs, Anywhere and the free
 * web address) and keeps CREW from calling upstream's servers. The renderer reads this same constant
 * (src/lib/upstream-hidden.ts). The code stays; turn it off only once those run on our own servers, whose origins are
 * empty on purpose in cloud-account.mjs, companion-account-service.mjs and desktop-companion-client.mjs.
 */
export const HIDE_UPSTREAM = true;
