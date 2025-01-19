'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Smile, Meh, Frown } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { fetchCrowdData } from '../utils/api';

interface CrowdData {
  day: string;
  dayData: {
    hour: number;
    value: number;
  }[];
}

const daysOfWeek = ['日', '月', '火', '水', '木', '金', '土'];
// 9am to 20pm
const hoursOfDay = Array.from({ length: 12 }, (_, i) => i + 9);

const getCrowdednessColor = (level: number) => {
  return `rgba(255, 0, 0, ${level / 100})`;
};

const getCrowdednessDescription = (level: number): [string, React.ReactNode] => {
  if (level < 50) return ['空いています', <Smile key="smile" className="text-green-500" size={24} />];
  if (level < 70) return ['やや混んでいます', <Meh key="meh" className="text-yellow-500" size={24} />];
  return ['混雑しています', <Frown key="frown" className="text-red-500" size={24} />];
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-300 rounded shadow">
        <p className="text-sm">{`${label}時 : 混雑レベル ${payload[0].value}%`}</p>
      </div>
    );
  }
  return null;
};

export default function CrowdednessStatus({ warehouseId }: { warehouseId: string }) {
  const [crowdednessData, setCrowdednessData] = useState<CrowdData[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchCrowdData(parseInt(warehouseId));
        setCrowdednessData(response.data.weeklyData);
      } catch (error) {
        console.error('Error fetching crowd data:', error);
      }
    };

    fetchData();
    const timeInterval = setInterval(() => setCurrentTime(new Date()), 1000);

    return () => {
      clearInterval(timeInterval);
    };
  }, [warehouseId]);

  if (crowdednessData.length === 0) return <div>データを取得中...</div>;

  const currentDay = daysOfWeek[currentTime.getDay()];
  const currentHour = currentTime.getHours();
  const currentDayData = crowdednessData.find((data) => data.day === currentDay);
  const currentCrowdedness = currentDayData?.dayData.find((data) => data.hour === currentHour)?.value || 0;
  const [crowdednessDesc, crowdednessIcon] = getCrowdednessDescription(currentCrowdedness);

  const dailyTrendData = currentDayData?.dayData.map((data) => ({
    hour: `${data.hour}:00`,
    crowdedness: data.value,
  })) || [];

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">リアルタイム混雑状況</h2>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          {crowdednessIcon}
          <span className="ml-2 text-lg font-semibold">
            {crowdednessDesc} {currentCrowdedness}%
          </span>
        </div>
        <div className="text-lg font-semibold">
          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">{currentDay}曜日の混雑度予測</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={dailyTrendData}>
            <XAxis
              dataKey="hour"
              interval={0}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => value.split(':')[0]}
            />
            <YAxis domain={[0, 100]} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="crowdedness" fill="#567bf5">
              {dailyTrendData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.hour.split(':')[0] === currentHour.toString() ? '#ff7300' : '#567bf5'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <div className="grid grid-cols-8 gap-0.5">
            <div className="col-span-1"></div>
            {daysOfWeek.map((day, index) => (
              <motion.div
                key={day}
                className={`text-center font-bold py-1 text-xs ${
                  day === currentDay ? 'bg-blue-500 text-white rounded-t' : ''
                }`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                {day}
              </motion.div>
            ))}
            {hoursOfDay.map((hour) => (
              <React.Fragment key={hour}>
                <motion.div
                  className={`text-right pr-1 text-xs ${hour === currentHour ? 'font-bold text-blue-500' : ''}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: hour * 0.02 }}
                >
                  {hour}
                </motion.div>
                {daysOfWeek.map((day) => {
                  const dayData = crowdednessData.find((data) => data.day === day);
                  const crowdedness = dayData?.dayData.find((data) => data.hour === hour)?.value || 0;
                  const isCurrentTimeSlot = day === currentDay && hour === currentHour;
                  return (
                    <motion.div
                      key={`${day}-${hour}`}
                      className={`w-8 h-3 rounded-sm ${isCurrentTimeSlot ? 'ring-2 ring-blue-500' : ''}`}
                      style={{
                        backgroundColor: getCrowdednessColor(crowdedness),
                        ...(isCurrentTimeSlot && { position: 'relative', overflow: 'hidden' }),
                      }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: (hour * 7 + daysOfWeek.indexOf(day)) * 0.005 }}
                    >
                      {isCurrentTimeSlot && (
                        <motion.div
                          className="absolute inset-0 bg-blue-300"
                          animate={{ opacity: [0.3, 0.7, 0.3] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                        />
                      )}
                    </motion.div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <div className="flex items-center">
          <span className="mr-2 text-sm">混雑度:</span>
          <div className="w-24 h-3 bg-gradient-to-r from-white to-red-500 rounded-full"></div>
        </div>
        <div className="flex items-center">
          <Smile className="text-green-500 mr-1" size={16} />
          <span className="text-xs mr-2">空いている</span>
          <Meh className="text-yellow-500 mr-1" size={16} />
          <span className="text-xs mr-2">やや混雑</span>
          <Frown className="text-red-500 mr-1" size={16} />
          <span className="text-xs">混雑</span>
        </div>
      </div>
    </div>
  );
}
