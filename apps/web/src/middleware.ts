import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

function parseHost(hostHeader: string | null): { domain: string; subdomain: string } {
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

export function middleware(request: NextRequest) {
  const host = request.headers.get("host");
  const { domain, subdomain } = parseHost(host);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-host-domain", domain);
  requestHeaders.set("x-host-subdomain", subdomain);

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: ["/"],
};
