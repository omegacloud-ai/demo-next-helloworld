import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { dev }) => {
    /**
     * DEV MODE: reduce watcher scope
     * This helps Webpack dev server memory + CPU.
     */
    if (dev) {
      config.watchOptions = {
        ...(config.watchOptions ?? {}),
        ignored: [
          "**/node_modules/**",
          "**/.next/**",
          "**/.git/**",
          "**/dist/**",
          "**/build/**",
          "**/coverage/**",
          "**/.turbo/**",
          "**/.cache/**",
          "**/.pnpm-store/**",
        ],
      };
      // Reduce memory usage during dev builds
      config.optimization = {
        ...config.optimization,
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false,
      };      
    }
    
    return config;
  },
};

export default nextConfig;
