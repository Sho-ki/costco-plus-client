'use client';

import { useState } from 'react';
import { useAtom } from 'jotai';
import { motion, AnimatePresence } from 'framer-motion';
import CrowdednessStatus from './CrowdednessStatus';
import { Warehouse } from '../types/warehouse';
import { warehouseIdAtom } from '../atom/warehouseAtom';
import WeeklyBuysClient from './WeeklyBuysClient';
import GasPricesClient from './GasPricesClient';

type SortOptionValue =
  | 'price_asc'
  | 'price_desc'
  | 'discountPercentage_asc'
  | 'discountPercentage_desc';

interface SortOption {
  field: 'price' | 'discountPercentage';
  order: 'asc' | 'desc';
}

type TabOption = 'products' | 'crowdedness' | 'fuel';

interface HomeClientProps {
  initialWarehouses: Warehouse[];
}

export default function HomeClient({ initialWarehouses }: HomeClientProps) {
  const [sortBy, setSortBy] = useState<SortOption>({
    field: 'discountPercentage',
    order: 'desc',
  });
    const [warehouseId] = useAtom(warehouseIdAtom);
  const [activeTab, setActiveTab] = useState<TabOption>('products');

  const selectedWarehouseId = warehouseId ?? initialWarehouses[0]?.id ?? null;

  if (!selectedWarehouseId) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-500">データ取得中...</p>
      </div>
    );
  }
  const onChangeSortBy = (value: SortOptionValue) => {
    const [field, order] = value.split('_'); // ["price", "asc"] etc.
    setSortBy({
      field: field as 'price' | 'discountPercentage',
      order: order as 'asc' | 'desc',
    });
  };

  return (
    <div className="max-w-7xl mx-auto py-4 sm:px-6 lg:px-8">
      {/* Tabs */}
      <div className="flex justify-center mb-4">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'products'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('products')}
          >
            今週の<br />セール情報
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'crowdedness'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('crowdedness')}
          >
            現在の<br />混雑状況
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
              activeTab === 'fuel'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('fuel')}
          >
            今日の<br />ガソリン代
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'products' ? (
            <div className="px-4 py-4 sm:px-0">
              {/* Sort Select */}
              <div className="mb-4 flex justify-end">
                <select
                  value={`${sortBy.field}_${sortBy.order}`}
                  onChange={(e) => onChangeSortBy(e.target.value as SortOptionValue)}
                  className="block w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="discountPercentage_desc">割引率が高い順</option>
                  <option value="discountPercentage_asc">割引率が低い順</option>
                  <option value="price_asc">価格が安い順</option>
                  <option value="price_desc">価格が高い順</option>
                  
                </select>
              </div>

              {/* WeeklyBuysClient */}
              <WeeklyBuysClient
                warehouseId={selectedWarehouseId}
                field={sortBy.field}
                order={sortBy.order}
              />
            </div>
          ) : activeTab === 'crowdedness' ? (
            <CrowdednessStatus warehouseId={selectedWarehouseId.toString()} />
          ) : (
            <GasPricesClient warehouseId={selectedWarehouseId} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
