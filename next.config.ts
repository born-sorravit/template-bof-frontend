import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev-only overlay; its default bottom-left position sits exactly on top of
  // the sidebar footer avatar.
  devIndicators: {
    position: "bottom-right",
  },
};

export default nextConfig;
