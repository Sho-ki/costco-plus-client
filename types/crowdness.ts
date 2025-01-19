export interface CrowdData {
	updatedAt: string;
	warehouseId: number;
	weeklyData: WeeklyData[];
}

export interface WeeklyData {
	day: string;
	dayData: DayData[];
}

export interface DayData {
	hour: number;
	value: number;
}
