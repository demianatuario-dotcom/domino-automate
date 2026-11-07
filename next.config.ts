import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['firebase-admin', 'pg'],
  /* Routing handled by src/middleware.ts for full UTF-8 / percent-encoded support */
};

export default nextConfig;
