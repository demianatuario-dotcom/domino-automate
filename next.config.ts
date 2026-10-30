import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/Atuaria",
        destination: "/Atu%C3%A1ria",
      },
      {
        source: "/atuaria",
        destination: "/Atu%C3%A1ria",
      },
      {
        source: "/atu%C3%A1ria",
        destination: "/Atu%C3%A1ria",
      },
      {
        source: "/Estudios",
        destination: "/Est%C3%BAdios",
      },
      {
        source: "/estudios",
        destination: "/Est%C3%BAdios",
      },
      {
        source: "/est%C3%BAdios",
        destination: "/Est%C3%BAdios",
      },
    ];
  },
};

export default nextConfig;

