import { Suspense } from 'react';
import { Provider } from 'jotai';
import { fetchWarehouses } from '../utils/api';
import HomeClient from '../components/HomeClient';
import HeaderServer from '../components/HeaderServer';

export const metadata = {
  title: 'コストコハッカープラス＋ | もっとコストコ！',
  description: 'コストコの最新セール情報、リアルタイム混雑状況、ガソリン価格をチェック。コストコでのショッピングをより便利に、よりお得に。',
};

export default async function Home() {
  const warehousesData = await fetchWarehouses();
  const warehouses = warehousesData.data;

  return (
    <Provider>
      <div className="min-h-screen bg-gray-100">
        <Suspense fallback={<div>Loading...</div>}>
          <HeaderServer warehouses={warehouses} />
        </Suspense>
        <HomeClient initialWarehouses={warehouses} />
      </div>
    </Provider>
  );
}

