export interface PostComment {
	id: number;
	content: string;
	parentId: number | null;
	createdAt: string;
}

export interface PostWithComments {
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
	reactions: {
		id: number;
		name: string;
		color: string;
		count: number;
	}[];
	comments: PostComment[];
}
