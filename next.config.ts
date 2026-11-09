import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Las fotos del alta pasan por una server action, de a una: 5 MB por archivo más el
      // sobrante del multipart. Igual que `max-request-size` del back. El valor por defecto es 1 MB.
      bodySizeLimit: "6mb",
    },
  },
};

export default nextConfig;
