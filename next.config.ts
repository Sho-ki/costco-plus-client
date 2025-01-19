import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	/* config options here */
	images: {
		remotePatterns: [
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
