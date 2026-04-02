import type { NextConfig } from "next";

/**
 * Keep bundler project root as apps/web (default cwd) so `@tanstack/react-query`
 * resolves to a single instance for both `Providers` and `@lilo-hub/clients`.
 * Setting `turbopack.root` to the monorepo root can duplicate peer deps across graphs.
 */

const nextConfig: NextConfig = {
  /**
   * Em dev, `http://localhost:3000` e `http://127.0.0.1:3000` são origens diferentes.
   * Sem isto, o Next bloqueia `/_next/*` (RSC, chunks, HMR) para `127.0.0.1` e o client fica partido.
   * @see https://nextjs.org/docs/app/api-reference/config/next-config-js/allowedDevOrigins
   */
  allowedDevOrigins: ["127.0.0.1", "::1", "localhost"],
  transpilePackages: ["@lilo-hub/ui", "@lilo-hub/clients", "@lilo-hub/contracts"],
  async rewrites() {
    const api =
      process.env.API_INTERNAL_URL ??
      process.env.NEXT_PUBLIC_API_URL ??
      "http://127.0.0.1:4000/api";
    const target = api.replace(/\/$/, "");
    return [{ source: "/api/:path*", destination: `${target}/:path*` }];
  },
};

export default nextConfig;
