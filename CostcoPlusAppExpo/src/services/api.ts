import { ApiResponse } from '../types/apiResponse';
import { CrowdData } from '../types/crowdness';
import { GasPrice } from '../types/gasPrice';
import {
	Post,
	PostType,
	PostComment,
	PostWithComments,
	PostWithCount,
	PostReactionType,
	PostReactionRecord,
} from '../types/post';
import { ProductForUsers, ProductAvailabilityRecord } from '../types/product';
import { Warehouse } from '../types/warehouse';
import { API_CONFIG } from '../config/api';

class ApiService {
	private async request<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
		try {
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

			const url = `${API_CONFIG.BASE_URL}${endpoint}`;
			console.log('API Request:', url);
			const response = await fetch(url, {
				...options,
				headers: {
					'Content-Type': 'application/json',
					...options?.headers,
				},
				signal: controller.signal,
			});

			clearTimeout(timeoutId);

			console.log('API Response status:', response.status);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			console.log('API Response data:', data);
			return data;
		} catch (error) {
			console.error('API request failed:', error);
			throw error;
		}
	}

	// Warehouses
	async fetchWarehouses(): Promise<ApiResponse<Warehouse[]>> {
		return this.request<Warehouse[]>('/v1/warehouses/');
	}

	// Gas Prices
	async fetchGasPrice(warehouseId: number): Promise<ApiResponse<GasPrice>> {
		return this.request<GasPrice>(`/v1/warehouses/${warehouseId}/gas_price`);
	}

	// Weekly Buys
	async fetchWeeklyBuys(
		warehouseId: number,
		options: {
			page: number;
			size: number;
			sortField: 'price' | 'discountPercentage';
			sortOrder: 'asc' | 'desc';
		}
	): Promise<ApiResponse<ProductForUsers[]>> {
		const params = new URLSearchParams({
			warehouseId: warehouseId.toString(),
			page: options.page.toString(),
			size: options.size.toString(),
			sortField: options.sortField,
			order: options.sortOrder,
		});

		return this.request<ProductForUsers[]>(`/v1/products/weekly_buys?${params.toString()}`);
	}

	// Crowd Data
	async fetchCrowdData(warehouseId: number): Promise<ApiResponse<CrowdData>> {
		return this.request<CrowdData>(`/v1/warehouses/${warehouseId}/crowd`);
	}

	// Posts
	async fetchPosts(
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

		return this.request<PostWithCount[]>(`/v1/posts?${params.toString()}`);
	}

	async fetchPostById(postId: number): Promise<ApiResponse<PostWithComments>> {
		return this.request<PostWithComments>(`/v1/posts/${postId}`);
	}

	async fetchPostTypes(): Promise<ApiResponse<PostType[]>> {
		return this.request<PostType[]>('/v1/post_types');
	}

	async createPost(warehouseId: number, content: string, postTypeId: number): Promise<ApiResponse<Post>> {
		return this.request<Post>('/v1/posts', {
			method: 'POST',
			body: JSON.stringify({ warehouseId, content, postTypeId }),
		});
	}

	// Comments
	async createComment(postId: number, comment: string): Promise<ApiResponse<PostComment>> {
		return this.request<PostComment>(`/v1/posts/${postId}/comments`, {
			method: 'POST',
			body: JSON.stringify({ comment }),
		});
	}

	// Reactions
	async fetchPostReactionTypes(): Promise<ApiResponse<PostReactionType[]>> {
		return this.request<PostReactionType[]>('/v1/post_reaction_types');
	}

	async postReactionRecord(postId: number, postReactionTypeId: number): Promise<ApiResponse<PostReactionRecord>> {
		return this.request<PostReactionRecord>(`/v1/posts/${postId}/reaction_records`, {
			method: 'POST',
			body: JSON.stringify({ postReactionTypeId }),
		});
	}

	async updateReactionRecord(
		postId: number,
		postReactionTypeId: number,
		reactionRecordId: number
	): Promise<ApiResponse<PostReactionRecord>> {
		return this.request<PostReactionRecord>(`/v1/posts/${postId}/reaction_records/${reactionRecordId}`, {
			method: 'PUT',
			body: JSON.stringify({ postReactionTypeId }),
		});
	}

	// Product Availability
	async createProductAvailabilityRecord(
		productId: number,
		warehouseId: number,
		status: 'IN_STOCK' | 'OUT_OF_STOCK' | 'UNKNOWN'
	): Promise<ApiResponse<ProductAvailabilityRecord>> {
		return this.request<ProductAvailabilityRecord>('/v1/product_availability_records', {
			method: 'POST',
			body: JSON.stringify({ productId, warehouseId, status }),
		});
	}

	async updateProductAvailabilityRecord(
		recordId: number,
		status: 'IN_STOCK' | 'OUT_OF_STOCK' | 'UNKNOWN'
	): Promise<ApiResponse<ProductAvailabilityRecord>> {
		return this.request<ProductAvailabilityRecord>(`/v1/product_availability_records/${recordId}`, {
			method: 'PUT',
			body: JSON.stringify({ status }),
		});
	}
}

export const apiService = new ApiService();
