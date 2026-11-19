const TOKEN = /^[0-9a-f]{64}$/;

/** No default connected-apps service: CREW never calls upstream's (it was a workers.dev service of OpenMausBot's). Apps connect
 * with the person's own Composio project key (Settings → API keys); a service of our own comes back by setting this URL
 * (cloudflare/composio-broker has its source), or per run with OMB_COMPOSIO_BROKER_URL. */
export const DEFAULT_MANAGED_COMPOSIO_BROKER_URL = "";

/** OMB_COMPOSIO_BROKER=off: nothing reaches the managed service, whatever else is set. */
export function managedComposioBrokerOff(environment = process.env) {
  return /^(off|0|false|no)$/i.test(environment.OMB_COMPOSIO_BROKER?.trim() ?? "");
}

export function ownComposioKey(credentials, environment = process.env) {
  const saved = credentials?.composioApiKey;
  return Boolean((typeof saved === "string" && saved.trim()) || environment.COMPOSIO_API_KEY?.trim());
}

/** An explicit URL wins; otherwise the default (none today), only for a shipped build, so development and tests never register. */
export function managedComposioBrokerUrl(configured, shipped) {
  if (managedComposioBrokerOff()) return "";
  const explicit = typeof configured === "string" ? configured.trim() : "";
  return normalizeManagedComposioBrokerUrl(explicit || (shipped ? DEFAULT_MANAGED_COMPOSIO_BROKER_URL : ""));
}

export function normalizeManagedComposioBrokerUrl(value) {
  if (typeof value !== "string" || !value.trim()) return "";
  let parsed;
  try {
    parsed = new URL(value.trim());
  } catch {
    return "";
  }
  if (parsed.username || parsed.password || parsed.search || parsed.hash) return "";
  const loopback = ["localhost", "127.0.0.1", "[::1]"].includes(parsed.hostname);
  if (parsed.protocol !== "https:" && !(parsed.protocol === "http:" && loopback)) return "";
  return `${parsed.origin}${parsed.pathname.replace(/\/+$/, "")}`;
}

export function managedComposioAccess(brokerUrl, credentials) {
  if (managedComposioBrokerOff()) return null;
  const url = normalizeManagedComposioBrokerUrl(brokerUrl);
  const token = credentials?.composioBrokerToken;
  if (!url || !TOKEN.test(token ?? "")) return null;
  return { url, token };
}

export function managedComposioChildEnvironment(brokerUrl, credentials, environment) {
  const next = { ...environment };
  delete next.OMB_COMPOSIO_BROKER_URL;
  delete next.OMB_COMPOSIO_BROKER_TOKEN;
  // No service named (the default): tell the server it is switched off, so Connected apps asks for the person's own
  // Composio key ("needs setup") instead of reporting a service outage.
  if (!normalizeManagedComposioBrokerUrl(brokerUrl)) next.OMB_COMPOSIO_BROKER = "off";
  const access = managedComposioAccess(brokerUrl, credentials);
  if (access) {
    next.OMB_COMPOSIO_BROKER_URL = access.url;
    next.OMB_COMPOSIO_BROKER_TOKEN = access.token;
  }
  return next;
}

export async function ensureManagedComposioCredentials({
  brokerUrl,
  credentials,
  fetchImpl = globalThis.fetch,
  saveCredentials,
  log = () => {},
  timeoutSignal = (milliseconds) => AbortSignal.timeout(milliseconds),
  existingCredentialTimeoutMs = 8_000,
  registrationTimeoutMs = 15_000,
}) {
  if (managedComposioBrokerOff()) return credentials;
  const url = normalizeManagedComposioBrokerUrl(brokerUrl);
  if (!url) {
    if (brokerUrl) log("connected-apps broker URL rejected: HTTPS or a loopback HTTP URL is required");
    return credentials;
  }
  if (TOKEN.test(credentials.composioBrokerToken ?? "")) {
    try {
      const check = await fetchImpl(`${url}/v1/me`, {
        headers: { authorization: `Bearer ${credentials.composioBrokerToken}` },
        redirect: "error",
        signal: timeoutSignal(existingCredentialTimeoutMs),
      });
      if (check.ok) return credentials;
      // Only a definitive auth failure rotates the credential, so an outage never strands authorized accounts.
      if (check.status !== 401) return credentials;
      delete credentials.composioBrokerToken;
      delete credentials.composioInstallationId;
    } catch {
      return credentials;
    }
  }
  try {
    const response = await fetchImpl(`${url}/v1/installations`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{}",
      redirect: "error",
      signal: timeoutSignal(registrationTimeoutMs),
    });
    const body = await response.json().catch(() => null);
    if (!response.ok) throw new Error(body?.error || `HTTP ${response.status}`);
    if (!TOKEN.test(body?.token ?? "") || typeof body?.installationId !== "string") {
      throw new Error("the connected-apps service returned invalid credentials");
    }
    credentials.composioBrokerToken = body.token;
    credentials.composioInstallationId = body.installationId;
    await saveCredentials(credentials);
    log("connected-apps installation registered");
  } catch (error) {
    log(`connected-apps registration failed: ${error?.message ?? error}`);
  }
  return credentials;
}

export function registerManagedComposio({ brokerUrl, updateCredentials, fetchImpl, log }) {
  if (!brokerUrl) return Promise.resolve();
  return updateCredentials(async (credentials) => {
    if (!ownComposioKey(credentials)) {
      await ensureManagedComposioCredentials({ brokerUrl, credentials, fetchImpl, saveCredentials: async () => {}, log });
    }
    return credentials;
  });
}
