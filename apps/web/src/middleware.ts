import { parseHost } from "./lib/parse-host";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

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
  matcher: [
    "/",
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
