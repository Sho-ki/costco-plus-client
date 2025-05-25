export interface GasPrice {
  id: number;
  warehouseId: number;
  regularPrice: number;
  premiumPrice?: number;
  dieselPrice?: number;
  lastUpdated: string;
}

export interface FuelPrice {
  id: number;
  warehouseId: number;
  fuelType: string;
  price: number;
  lastUpdated: string;
}
