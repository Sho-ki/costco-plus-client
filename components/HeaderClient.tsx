"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Cookies from "js-cookie"; // a small library to simplify cookie writing in the browser
import CustomSelect from "./CustomSelect";
import { Warehouse } from "../types/warehouse";

interface HeaderClientProps {
  warehouses: Warehouse[];
  initialWarehouseId: number | null;
}

export default function HeaderClient({
  warehouses,
  initialWarehouseId,
}: HeaderClientProps) {
  // We'll store current selection in state so we can show it
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<number | null>(
    initialWarehouseId
  );
  const currentWarehouse = warehouses.find((w) => w.id === selectedWarehouseId);

  const handleChange = (value: number) => {
    setSelectedWarehouseId(value);

    // 2) Write the cookie for 5 years in the browser
    // 5 years in seconds = 5 * 365 * 24 * 60 * 60 ≈ 157680000
    Cookies.set("warehouseId", value.toString(), {
      path: "/",
      expires: 365 * 7, // 5 years
    });

    // Then reload so SSR can read the cookie on next page load
    window.location.reload();
  };

  const handleReset = () => {
    // Remove the cookie
    Cookies.remove("warehouseId", { path: "/" });
    setSelectedWarehouseId(null);
  };

  return (
    <header className="bg-black shadow-lg">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col items-center md:items-start">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative w-48 h-16"
            >
              <Image
                src="https://ikkoss.com/wp-content/uploads/2022/03/Costco-Hacker-1-2.png"
                alt="Costco Hacker Logo"
                fill
                style={{ objectFit: "contain" }}
                priority
                sizes="(max-width: 640px) 100px, 200px"
              />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-blue-300 text-xl md:text-2xl font-bold mt-2 md:mt-4"
            >
              もっとコストコ！
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.5,
                  delay: 0.4,
                  type: "spring",
                  stiffness: 200,
                }}
                className="text-red-500"
              >
                <p>コストコハッカープラス＋</p>
              </motion.span>
            </motion.h1>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col items-center mt-4"
          >
            {/* If we have a selected warehouse ID, show it. Else show a select. */}
            {selectedWarehouseId ? (
              <div className="flex items-center justify-center space-x-2">
                <p className="text-white text-md">
                  倉庫店：
                  <strong>{currentWarehouse?.name || "未選択"}</strong>
                </p>
                <button
                  className="bg-gray-500 text-white text-xs px-2 py-1 rounded"
                  onClick={handleReset}
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
                value={selectedWarehouseId?.toString() || ""}
                onChange={(v) => handleChange(parseInt(v, 10))}
              />
            )}
          </motion.div>
        </div>
      </div>
    </header>
  );
}
