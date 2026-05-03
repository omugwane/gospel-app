import type { NextConfig } from "next";
import path from "node:path";

/**
 * Monorepo: root `/gospel-app/package-lock.json` (Firebase CLI) causes Turbopack
 * to infer the wrong workspace root unless we pin it to `./web`.
 * Run `next` from the `web/` directory (e.g. `npm run dev`).
 * @see https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack#root-directory
 */
const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(process.cwd()),
  },
};

export default nextConfig;
