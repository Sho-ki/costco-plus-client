// API Configuration
export const API_CONFIG = {
	// Change this to your actual API base URL
	// BASE_URL: __DEV__
	//   ? 'http://localhost:3000/api' // Development
	//   : 'https://api.costco-plus.com', // Production

	// BASE_URL: 'https://api.costco-plus.com', // Production
	BASE_URL: 'http://localhost:8100', // Development - matching the logs

	TIMEOUT: 10000, // 10 seconds

	// Cache times
	CACHE_TIMES: {
		WAREHOUSES: 30 * 60 * 1000, // 30 minutes
		POSTS: 2 * 60 * 1000, // 2 minutes
		PRODUCTS: 5 * 60 * 1000, // 5 minutes
		CROWD_DATA: 2 * 60 * 1000, // 2 minutes
		GAS_PRICE: 10 * 60 * 1000, // 10 minutes
		POST_TYPES: 30 * 60 * 1000, // 30 minutes
		REACTION_TYPES: 30 * 60 * 1000, // 30 minutes
	},

	// Auto-refresh intervals
	REFRESH_INTERVALS: {
		CROWD_DATA: 5 * 60 * 1000, // 5 minutes
		GAS_PRICE: 15 * 60 * 1000, // 15 minutes
	},
};
