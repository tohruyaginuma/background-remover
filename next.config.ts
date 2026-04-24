import type { NextConfig } from "next";

const buildDate = new Date();
const mm = String(buildDate.getMonth() + 1).padStart(2, "0");
const dd = String(buildDate.getDate()).padStart(2, "0");
const yyyy = buildDate.getFullYear();

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_BUILD_VERSION: `v${mm}.${dd}.${yyyy}`,
  },
};

export default nextConfig;
