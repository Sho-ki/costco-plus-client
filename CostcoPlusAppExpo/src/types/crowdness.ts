export interface CrowdData {
	id: number;
	warehouseId: number;
	level: number; // 0.0 to 1.0 representing crowd level percentage
	crowdLevel?: 'LOW' | 'MEDIUM' | 'HIGH'; // Legacy property for backward compatibility
	timestamp: string;
	lastUpdated?: string;
	description?: string;
}

export interface CrowdLevel {
	level: 'LOW' | 'MEDIUM' | 'HIGH';
	label: string;
	color: string;
}
