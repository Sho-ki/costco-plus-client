import { ApiResponse } from '../types/apiResponse';
import { CrowdData } from '../types/crowdness';
import { GasPrice } from '../types/gasPrice';
import { ProductForUsers } from '../types/product';
import { Warehouse } from '../types/warehouse';

export async function fetchWarehouses(): Promise<ApiResponse<Warehouse[]>> {
	const response = await fetch('https://api.ikkoss.com/v1/warehouses/');
	if (!response.ok) {
		throw new Error('Failed to fetch warehouses');
	}
	return await response.json();
}

export async function fetchGasPrice(warehouseId: number): Promise<ApiResponse<GasPrice>> {
	const response = await fetch(`https://api.ikkoss.com/v1/warehouses/${warehouseId}/gas_price`);
	if (!response.ok) {
		throw new Error('Failed to fetch gas price');
	}
	return await response.json();
}

export async function fetchWeeklyBuys(warehouseId: number): Promise<ApiResponse<ProductForUsers[]>> {
	const response = await fetch(`https://api.ikkoss.com/v1/products/weekly_buys?warehouseId=${warehouseId}`);
	if (!response.ok) {
		throw new Error('Failed to fetch weekly buys');
	}
	return await response.json();
}

export async function fetchCrowdData(warehouseId: number): Promise<ApiResponse<CrowdData>> {
	const response = await fetch(`https://api.ikkoss.com/v1/warehouses/${warehouseId}/crowd`);
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
	const response = await fetch('https://api.ikkoss.com/v1/product_availability_records', {
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
	const response = await fetch(`https://api.ikkoss.com/v1/product_availability_records/${recordId}`, {
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
