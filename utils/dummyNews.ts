// app/utils/dummyNews.ts

export type Article = {
	id: string;
	title: string;
	thumbnail: string;
	url: string;
};

export type Pagination = {
	currentPage: number;
	totalPages: number;
};

export type ArticleDetail = {
	title: string;
	thumbnail: string;
	contentsHTML: string;
	relatedArticles: {
		title: string;
		thumbnail: string;
		url: string;
	}[];
};

/**
 * ニュース一覧用の仮データを返す関数
 * 1ページあたり15件、全体で10ページ分のデータを用意
 */
export async function fetchDummyArticles(page: number): Promise<{ articles: Article[]; pagination: Pagination }> {
	// API呼び出し時のように少し待つ（300ms）
	await new Promise((resolve) => setTimeout(resolve, 300));
	const totalPages = 10;
	const articles: Article[] = Array.from({ length: 15 }, (_, i) => {
		const index = (page - 1) * 15 + i + 1;
		return {
			id: index.toString(),
			title: `ニュース記事のタイトル ${index}`,
			thumbnail: `https://via.placeholder.com/300x200?text=Thumbnail+${index}`,
			url: `/${encodeURIComponent(`news-title-${index}-20250204`)}`,
		};
	});
	return { articles, pagination: { currentPage: page, totalPages } };
}

/**
 * 記事詳細用の仮データを返す関数
 */
export async function fetchDummyArticleDetail(articleSlug: string): Promise<ArticleDetail> {
	await new Promise((resolve) => setTimeout(resolve, 300));
	return {
		title: `ニュース記事のタイトル (${articleSlug})`,
		thumbnail: 'https://via.placeholder.com/600x400?text=Article+Thumbnail',
		contentsHTML: `<p>この記事の本文です。<br/>記事識別子: ${articleSlug}</p>`,
		relatedArticles: [
			{
				title: '関連記事タイトル1',
				thumbnail: 'https://via.placeholder.com/150?text=Related+1',
				url: '/related-article-1',
			},
			{
				title: '関連記事タイトル2',
				thumbnail: 'https://via.placeholder.com/150?text=Related+2',
				url: '/related-article-2',
			},
		],
	};
}
