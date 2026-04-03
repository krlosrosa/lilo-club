/** Mesma lógica que `packages/clients/src/parse-host.ts` (middleware Edge + Webpack). */
export function parseHost(hostHeader: string | null | undefined): {
  domain: string;
  subdomain: string;
} {
  if (!hostHeader) {
    return { domain: "", subdomain: "" };
  }
  const host = (hostHeader.split(":")[0] ?? hostHeader).toLowerCase();
  const parts = host.split(".").filter(Boolean);

  if (parts.length <= 1) {
    return { domain: host, subdomain: "" };
  }

  if (parts.length === 2) {
    return { domain: host, subdomain: "" };
  }

  const subdomain = parts[0] ?? "";
  const domain = parts.slice(1).join(".");
  return { domain, subdomain };
}
