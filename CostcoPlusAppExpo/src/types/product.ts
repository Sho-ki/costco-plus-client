import { Warehouse } from './warehouse';

export interface ProductImage {
	id: number;
	productId: number;
	url: string;
	createdAt: string;
	updatedAt: string;
}

export interface Product {
	itemNumber: string | null;
	perUnit: string | null;
	name: string;
	id: number;
	createdAt: string;
	updatedAt: string;
	nameEn: string | null;
	description: string | null;
	price: number;
	altImageUrl: string | null;
}

export interface ProductForUsers extends Product {
	discount: number | null;
	images: ProductImage[];
	saleStartDate?: string;
	saleEndDate?: string;
	warehouse: Warehouse;
	availabilityRecords: {
		date: string;
		value: 'IN_STOCK' | 'OUT_OF_STOCK' | 'UNKNOWN';
	}[];
	// Legacy properties for backward compatibility
	originalPrice?: number;
	discountPercentage?: number;
	imageUrl?: string;
	warehouseId?: number;
	isAvailable?: boolean;
	lastUpdated?: string;
}

export interface WeeklyBuysResponse {
	data: ProductForUsers[];
}

export interface ProductAvailabilityRecord {
	id: number;
	productId: number;
	warehouseId: number;
	status: 'IN_STOCK' | 'OUT_OF_STOCK' | 'UNKNOWN';
	createdAt: string;
	updatedAt: string;
}
