import type { NextConfig } from 'next';

const nextConfig = {
    experimental: {
        serverActions: {
            allowedOrigins: ['cleavest.space', 'localhost:3001'],
        },
    },
};

export default nextConfig;
