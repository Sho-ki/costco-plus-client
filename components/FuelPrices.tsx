import React from 'react';
import { motion } from 'framer-motion';
import { FuelPrice } from '../types/fuelPrice';

interface FuelPricesProps {
  initialFuelPrices: FuelPrice[];
}

export default function FuelPrices({ initialFuelPrices }: FuelPricesProps) {
  const colorClasses: { [key in FuelPrice['color']]: string } = {
    red: 'bg-red-500',
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    yellow: 'bg-yellow-500',
};

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">今日のガソリン代</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {initialFuelPrices.map((fuel, index) => (
          <motion.div
            key={fuel.type}
            className={`${colorClasses[fuel.color]} p-6 rounded-lg shadow-md text-white`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <h3 className="text-xl font-semibold mb-2">{fuel.type}</h3>
            <motion.div
              className="text-3xl font-bold"
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 10 }}
            >
              (
                {
                  fuel?.price && fuel?.price > 0 ?
                    `¥${fuel?.price.toFixed(2)}/L` :
                    '-'
                }
              )
            </motion.div>
          </motion.div>
        ))}
      </div>
      <motion.div
        className="mt-8 text-center text-gray-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        ※ 価格は定期的に更新されます
      </motion.div>
    </div>
  );
}

