// CREW hides upstream's Cloud and promo surfaces by default (src/lib/upstream-hidden.ts). The code stays, so its tests keep
// running with the switch off; a test of the hidden state turns it back on with setUpstreamHidden(true).
import { setUpstreamHidden } from "../lib/upstream-hidden.ts";

setUpstreamHidden(false);
