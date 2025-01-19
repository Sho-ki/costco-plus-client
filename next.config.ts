import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	eslint: {
		ignoreDuringBuilds: true,
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'wp.com',
			},
			{
				protocol: 'https',
				hostname: 'ikkoss.com',
			},
			{
				protocol: 'https',
				hostname: 'cds2.costcojapan.jp',
			},
		],
	},
};

export default nextConfig;
