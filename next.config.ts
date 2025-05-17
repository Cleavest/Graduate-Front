import type { NextConfig } from 'next';

const nextConfig = {
    experimental: {
        allowedDevOrigins: [
            'http://128.140.98.82',
            'http://cleavest.space:3001',
            'http://cleavest.space:3000',
        ], // Ή το domain σου
    },
};

export default nextConfig;
