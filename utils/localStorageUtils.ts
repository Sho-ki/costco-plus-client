export const getOrSetWarehouseId = (warehouseId: string): string => {
	const existingWarehouseId = localStorage.getItem('warehouseId');
	if (existingWarehouseId) {
		return existingWarehouseId;
	}
	localStorage.setItem('warehouseId', warehouseId);
	return warehouseId;
};
