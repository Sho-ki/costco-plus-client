import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
	return [
		{
			url: 'https://app.ikkoss.com/',
			lastModified: new Date(),
			changeFrequency: 'daily',
			priority: 1,
		},
		{
			url: 'https://app.ikkoss.com/?tab=products',
			lastModified: new Date(),
			changeFrequency: 'daily',
			priority: 0.8,
		},
		{
			url: 'https://app.ikkoss.com/?tab=crowdedness',
			lastModified: new Date(),
			changeFrequency: 'weekly',
			priority: 0.8,
		},
		{
			url: 'https://app.ikkoss.com/?tab=fuel',
			lastModified: new Date(),
			changeFrequency: 'daily',
			priority: 0.8,
		},
	];
}
