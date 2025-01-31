import { GetServerSideProps } from 'next';

const Sitemap = () => {};

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
	const baseUrl = 'https://app.ikkoss.com';

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>${baseUrl}/</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <priority>1.00</priority>
    </url>
    <url>
      <loc>${baseUrl}?tab=products</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <priority>0.80</priority>
    </url>
    <url>
      <loc>${baseUrl}?tab=crowdedness</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <priority>0.80</priority>
    </url>
    <url>
      <loc>${baseUrl}?tab=fuel</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <priority>0.80</priority>
    </url>
    <url>
      <loc>${baseUrl}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <priority>0.80</priority>
    </url>
  </urlset>
  `;

	res.setHeader('Content-Type', 'text/xml');
	res.write(sitemap);
	res.end();

	return {
		props: {},
	};
};

export default Sitemap;
