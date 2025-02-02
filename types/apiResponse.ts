export interface ApiResponse<T> {
	data: T;
	meta: Pagination;
}

export interface Pagination {
	totalCount: number;
	page: number;
	size: number;
}
