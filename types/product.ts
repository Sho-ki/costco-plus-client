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
}

export interface WeeklyBuysResponse {
	data: ProductForUsers[];
}
