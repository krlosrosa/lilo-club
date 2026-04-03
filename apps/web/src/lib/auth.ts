import { createApiClient, parseHost } from "@lilo-hub/clients";

function browserHostContext() {
  if (typeof window === "undefined") {
    return { domain: "", subdomain: "" };
  }
  return parseHost(window.location.host);
}

/**
 * Base `/api` do app.
 * No browser: caminho relativo `/api` (rewrite em `next.config.ts`) → mesma origem sempre,
 * sem depender de `window` nem de CORS. No servidor: URL absoluta para o Nest.
 */
export function getApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    return "/api";
  }
  return (
    process.env.API_INTERNAL_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    "http://localhost:3000/api"
  );
}

/** Cliente browser: cookie HttpOnly + `credentials: 'include'` (sem Bearer). */
export function createBrowserApiClient() {
  return createApiClient({
    baseUrl: getApiBaseUrl(),
    credentials: "include",
    getHostContext: browserHostContext,
  });
}
