// app/components/HeaderServer.tsx

import { Warehouse } from "../types/warehouse";
import HeaderClient from "./HeaderClient";

interface HeaderServerProps {
  warehouses: Warehouse[];
  initialWarehouseId: number | null;
}

export default async function HeaderServer({ warehouses, initialWarehouseId }: HeaderServerProps) {
  return (
    <HeaderClient
      warehouses={warehouses}
      initialWarehouseId={initialWarehouseId}
    />
  );
}
