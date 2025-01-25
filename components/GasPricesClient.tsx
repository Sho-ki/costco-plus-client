'use client';

import { useState, useEffect } from 'react';
import { fetchGasPrice } from '../utils/api';
import FuelPrices from './FuelPrices';
import { FuelPrice } from '../types/fuelPrice';
import GoogleAdsense from './GoogleAdsense';

interface GasPricesClientProps {
  warehouseId: number;
}

export default function GasPricesClient({ warehouseId }: GasPricesClientProps) {
  const [fuelPrices, setFuelPrices] = useState<FuelPrice[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    fetchGasPrice(warehouseId)
      .then(gasPriceData => {
        if (!isMounted) return;
        const { kerosene, regular, diesel, premium } = gasPriceData.data;

        const prices: FuelPrice[] = [
          { type: '軽油', price: diesel, color: 'green' },
          { type: 'レギュラー', price: regular, color: 'red'},
          { type: 'ハイオク', price: premium, color: 'yellow' },
          { type: '灯油', price: kerosene, color: 'blue' },

        ];

        setFuelPrices(prices);
        setLoading(false);
      })
      .catch(err => {
        if (!isMounted) return;
        console.error(err);
        setError('Failed to load fuel prices');
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [warehouseId]);

  if (loading) return <div>データを取得中...</div>;
  if (error) return <div>{error}</div>;
  if (!fuelPrices) return <div>データがありません</div>;

  return <><FuelPrices initialFuelPrices={fuelPrices} /><GoogleAdsense type='autorelaxed'/></>;
}
