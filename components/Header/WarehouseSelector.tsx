"use client";

import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { motion } from "framer-motion";
import CustomSelect from "../CustomSelect";
import { Warehouse } from "@/types/warehouse";
import { warehouseIdAtom } from "@/atom/warehouseAtom";

interface WarehouseSelectorProps {
  warehouses: Warehouse[];
}

export default function WarehouseSelector({
  warehouses,
}: WarehouseSelectorProps) {
  const [warehouseId, setWarehouseId] = useAtom(warehouseIdAtom);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedWarehouseId = localStorage.getItem("warehouseId");
    if (savedWarehouseId) {
      setWarehouseId(parseInt(savedWarehouseId, 10));
    }
    setIsLoaded(true);
  }, [setWarehouseId]);

  const onChange = (value: number) => {
    setWarehouseId(value);
    localStorage.setItem("warehouseId", value.toString());
  };

  const currentWarehouse = warehouses.find((w) => w.id === warehouseId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="flex flex-col items-center mt-4"
    >
      {isLoaded && warehouseId ? (
        <div className="flex items-center justify-center space-x-2">
          <p className="text-white text-md">
            倉庫店：<strong>{currentWarehouse?.name || "未選択"}</strong>
          </p>
          <button
            className="bg-gray-500 text-white text-xs px-2 py-1 rounded"
            onClick={() => {
              localStorage.removeItem("warehouseId");
              setWarehouseId(null as any); // もともと number | null の場合に対応
            }}
          >
            変更
          </button>
        </div>
      ) : (
        <CustomSelect
          options={warehouses.map((w) => ({
            value: w.id.toString(),
            label: w.name,
          }))}
          value={warehouseId?.toString() || ""}
          onChange={(value) => onChange(parseInt(value, 10))}
        />
      )}
    </motion.div>
  );
}
