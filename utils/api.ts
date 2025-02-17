import { ApiResponse } from '../types/apiResponse';
import { CommentToPost } from '../types/comment-to-post';
import { CrowdData } from '../types/crowdness';
import { GasPrice } from '../types/gasPrice';
import { Post } from '../types/post';
import { PostReactionType } from '../types/post-reaction-type';
import { PostType } from '../types/post-type';
import { PostComment, PostWithComments } from '../types/post-with-comments';
import { PostWithCount } from '../types/post-with-count';
import { ProductForUsers } from '../types/product';
import { PostReactionRecord } from '../types/reaction-record';
import { Warehouse } from '../types/warehouse';

const baseUrl = 'https://api.costco-plus.com';
export async function fetchWarehouses(): Promise<ApiResponse<Warehouse[]>> {
	const response = await fetch(`${baseUrl}/v1/warehouses/`);
	if (!response.ok) {
		throw new Error('Failed to fetch warehouses');
	}
	return await response.json();
}

export async function fetchGasPrice(warehouseId: number): Promise<ApiResponse<GasPrice>> {
	const response = await fetch(`${baseUrl}/v1/warehouses/${warehouseId}/gas_price`);
	if (!response.ok) {
		throw new Error('Failed to fetch gas price');
	}
	return await response.json();
}

export async function fetchWeeklyBuys(
	warehouseId: number,
	options: {
		page: number;
		size: number;
		sortField: 'price' | 'discountPercentage';
		sortOrder: 'asc' | 'desc';
	}
): Promise<ApiResponse<ProductForUsers[]>> {
	const response = await fetch(
		`${baseUrl}/v1/products/weekly_buys?warehouseId=${warehouseId}&page=${options.page}&size=${options.size}&sortField=${options.sortField}&order=${options.sortOrder}`
	);
	if (!response.ok) {
		throw new Error('Failed to fetch weekly buys');
	}
	return await response.json();
}

export async function fetchCrowdData(warehouseId: number): Promise<ApiResponse<CrowdData>> {
	const response = await fetch(`${baseUrl}/v1/warehouses/${warehouseId}/crowd`);
	if (!response.ok) {
		throw new Error('Failed to fetch crowd data');
	}
	return await response.json();
}

export type AvailabilityStatus = 'IN_STOCK' | 'OUT_OF_STOCK' | 'UNKNOWN';

export interface StorageRecord {
	id: number;
	createdAt: Date;
	updatedAt: Date;
	productId: number;
	warehouseId: number;
	status: AvailabilityStatus;
}

export async function createProductAvailabilityRecord(
	productId: number,
	warehouseId: number,
	status: AvailabilityStatus
): Promise<ApiResponse<StorageRecord>> {
	const response = await fetch(`${baseUrl}/v1/product_availability_records`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ productId, warehouseId, status }),
	});

	if (!response.ok) {
		throw new Error('Failed to create availability record');
	}
	const data: ApiResponse<StorageRecord> = await response.json();
	return data;
}

export async function updateProductAvailabilityRecord(
	recordId: number,
	status: AvailabilityStatus
): Promise<ApiResponse<StorageRecord>> {
	const response = await fetch(`${baseUrl}/v1/product_availability_records/${recordId}`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ status }),
	});

	if (!response.ok) {
		throw new Error('Failed to update availability record');
	}
	const data: ApiResponse<StorageRecord> = await response.json();
	return data;
}

export async function fetchPosts(
	warehouseId: number,
	options: {
		page: number;
		size: number;
		sortField: string;
		order: string;
		typeFilter: string;
	}
): Promise<ApiResponse<PostWithCount[]>> {
	const params = new URLSearchParams({
		warehouseId: warehouseId.toString(),
		page: options.page.toString(),
		size: options.size.toString(),
		sortField: options.sortField,
		order: options.order,
		typeFilter: options.typeFilter,
	});
	const res = await fetch(`${baseUrl}/v1/posts?${params.toString()}`, {
		cache: 'no-store',
	});
	if (!res.ok) {
		throw new Error('Failed to fetch posts');
	}
	return await res.json();
}

export async function fetchPostById(postId: number): Promise<ApiResponse<PostWithComments>> {
	const res = await fetch(`${baseUrl}/v1/posts/${postId}`, {
		cache: 'no-store',
	});
	if (!res.ok) {
		throw new Error('Failed to fetch post details');
	}
	return await res.json();
}

export async function fetchPostTypes(): Promise<ApiResponse<PostType[]>> {
	const res = await fetch(`${baseUrl}/v1/post_types`, {});
	if (!res.ok) {
		throw new Error('Failed to fetch post details');
	}
	return await res.json();
}

export async function createPost(warehouseId: number, content: string, postTypeId: number): Promise<ApiResponse<Post>> {
	const res = await fetch(`${baseUrl}/v1/posts`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ warehouseId, content, postTypeId }),
	});
	if (!res.ok) {
		throw new Error('Failed to create post');
	}
	return await res.json();
}

export async function fetchPostReactionTypes(): Promise<ApiResponse<PostReactionType[]>> {
	const res = await fetch(`${baseUrl}/v1/post_reaction_types`, {});
	if (!res.ok) {
		throw new Error('Failed to fetch post details');
	}
	return await res.json();
}

export async function createComment(postId: number, comment: string): Promise<ApiResponse<PostComment>> {
	const res = await fetch(`${baseUrl}/v1/posts/${postId}/comments`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ comment }),
	});
	if (!res.ok) {
		throw new Error('Failed to create post');
	}
	return await res.json();
}

export async function postReactionRecord(
	postId: number,
	postReactionTypeId: number
): Promise<ApiResponse<PostReactionRecord>> {
	const res = await fetch(`${baseUrl}/v1/posts/${postId}/reaction_records`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ postReactionTypeId }),
	});
	if (!res.ok) {
		throw new Error('Failed to post reaction');
	}
	return await res.json();
}

export async function updateReactionRecord(
	postId: number,
	postReactionTypeId: number,
	reactionRecordId: number
): Promise<ApiResponse<PostReactionRecord>> {
	const res = await fetch(`${baseUrl}/v1/posts/${postId}/reaction_records/${reactionRecordId}`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ postReactionTypeId }),
	});
	if (!res.ok) {
		throw new Error('Failed to post reaction');
	}
	return await res.json();
}
