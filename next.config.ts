import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	productionBrowserSourceMaps: true,
	eslint: {
		ignoreDuringBuilds: true,
	},
	env: {
		NEXT_PUBLIC_GOOGLE_ADSENSE_PUBLISHER_ID: process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_PUBLISHER_ID,
		GA_ID: process.env.GA_ID,
		NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'storage.googleapis.com',
			},
		],
	},
};

export default nextConfig;
