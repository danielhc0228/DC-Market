import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
};

// next.config.js
module.exports = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "avatars.githubusercontent.com",
                port: "",
                pathname: "/**",
            },
        ],
    },
};

export default nextConfig;
