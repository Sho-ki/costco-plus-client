export interface Reaction {
	id: number;
	name: string;
	color: string;
	count: number;
}

export interface PostWithCount {
	id: number;
	content: string;
	warehouseId: number;
	postTypeId: number;
	postType: {
		id: number;
		name: string;
		createdAt: string;
	};
	createdAt: string;
	reactions: Reaction[];
	commentCounts: number;
}
