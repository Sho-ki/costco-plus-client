'use client';

import { useState, useEffect } from 'react';
import { Check, X, HelpCircle } from 'lucide-react';
import {
  createProductAvailabilityRecord,
  updateProductAvailabilityRecord,
  type StorageRecord,
  type AvailabilityStatus,
} from '../utils/api';

interface StockConfirmationProps {
  productId: number;
  warehouseId: number;
  onClick?: (e: React.MouseEvent) => void;
}

interface StorageData {
  records: StorageRecord[];
  timestamp: number;
}

export default function StockConfirmation({ productId, warehouseId, onClick }: StockConfirmationProps) {
  const [status, setStatus] = useState<AvailabilityStatus | null>(null);
  const [recordId, setRecordId] = useState<number | null>(null);

  // ---------------------------
  // 1) localStorage から読み込み
  // ---------------------------
  useEffect(() => {
    const storedData = localStorage.getItem('availabilityRecords');
    if (storedData) {
      const data: StorageData = JSON.parse(storedData);
      const currentTime = new Date().getTime();
      const isExpired = currentTime - data.timestamp > 24 * 60 * 60 * 1000;
      
      if (!isExpired) {
        const record = data.records.find(
          r => r.productId === productId && r.warehouseId === warehouseId
        );
        if (record) {
          setStatus(record.status);
          setRecordId(record.id);
        }
      } else {
        localStorage.removeItem('availabilityRecords');
      }
    }
  }, [productId, warehouseId]);

  // ---------------------------
  // 2) localStorage を更新
  // ---------------------------
  const updateLocalStorage = (newRecord: StorageRecord) => {
    const storedData = localStorage.getItem('availabilityRecords');
    const currentTime = new Date().getTime();
    let data: StorageData = storedData
      ? JSON.parse(storedData)
      : { records: [], timestamp: currentTime };

    const existingRecordIndex = data.records.findIndex(
      (r) => r.productId === newRecord.productId && r.warehouseId === newRecord.warehouseId
    );

    if (existingRecordIndex !== -1) {
      data.records[existingRecordIndex] = newRecord;
    } else {
      data.records.push(newRecord);
    }

    data.timestamp = currentTime;
    localStorage.setItem('availabilityRecords', JSON.stringify(data));
  };

  // ---------------------------
  // 3) 在庫状況を送信する関数
  // ---------------------------
  const handleConfirmation = async (newStatus: AvailabilityStatus) => {
    try {
      let newRecord: StorageRecord;

      if (recordId) {
        // PUT
        newRecord = (await updateProductAvailabilityRecord(recordId, newStatus)).data;
      } else {
        // POST
        newRecord = (await createProductAvailabilityRecord(productId, warehouseId, newStatus)).data;
      }

      // localStorage 更新 & state 更新
      updateLocalStorage(newRecord);
      setStatus(newRecord.status);
      setRecordId(newRecord.id);
    } catch (error) {
      console.error('Error submitting availability record:', error);
    }
  };

  // ---------------------------
  // 4) 描画
  // ---------------------------
  return (
    <div className="mt-4" onClick={onClick}>
      <h3 className="text-xs font-semibold mb-2">今日はこの商品を見ましたか？</h3>
      <div className="flex space-x-2">
        <button
          onClick={() => handleConfirmation('IN_STOCK')}
          className={`p-2 rounded-full ${
            status === 'IN_STOCK' ? 'bg-green-100' : 'bg-gray-100'
          } hover:bg-green-200 transition-colors`}
          aria-label="在庫あり"
        >
          <Check
            className={`w-6 h-6 ${
              status === 'IN_STOCK' ? 'text-green-500' : 'text-gray-400'
            }`}
          />
        </button>
        <button
          onClick={() => handleConfirmation('OUT_OF_STOCK')}
          className={`p-2 rounded-full ${
            status === 'OUT_OF_STOCK' ? 'bg-red-100' : 'bg-gray-100'
          } hover:bg-red-200 transition-colors`}
          aria-label="在庫なし"
        >
          <X
            className={`w-6 h-6 ${
              status === 'OUT_OF_STOCK' ? 'text-red-500' : 'text-gray-400'
            }`}
          />
        </button>
        <button
          onClick={() => handleConfirmation('UNKNOWN')}
          className={`p-2 rounded-full ${
            status === 'UNKNOWN' ? 'bg-yellow-100' : 'bg-gray-100'
          } hover:bg-yellow-200 transition-colors`}
          aria-label="不明"
        >
          <HelpCircle
            className={`w-6 h-6 ${
              status === 'UNKNOWN' ? 'text-yellow-500' : 'text-gray-400'
            }`}
          />
        </button>
      </div>
    </div>
  );
}
