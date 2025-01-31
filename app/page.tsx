import { Suspense } from "react";
import { Provider } from "jotai";
import { fetchWarehouses } from '../utils/api';
import HeaderServer from '../components/HeaderServer';
import HomeServer from '../components/HomeServer';
import { cookies } from 'next/headers';
import { Tabs } from '../lib/tabs';

// So that each query-param change triggers fresh SSR
export const dynamic = "force-dynamic";

interface PageProps {
  searchParams?: Promise<{
    [key: string]: Tabs;
  }>;
}

export const metadata = {
  title: "コストコハッカープラス＋ | もっとコストコ！",
  description:
    "コストコの最新セール情報、リアルタイム混雑状況、ガソリン価格をチェック。コストコでのショッピングをより便利に、よりお得に。",
};

export default async function Home({ searchParams }: PageProps ) {
  const param = await searchParams;
  const tab = param?.tab;
  const { data: warehouses } = await fetchWarehouses();
  const cookieStore = cookies();
  const warehouseIdCookie = (await cookieStore).get("warehouseId");
  let initialWarehouseId: number | null = null;

  if (warehouseIdCookie?.value) {
    const parsed = parseInt(warehouseIdCookie.value, 10);
    if (!isNaN(parsed)) {
      initialWarehouseId = parsed;
    }
  } else {
    initialWarehouseId = warehouses?.[0]?.id ?? null;
  }

  return (
    <Provider>
      <div className="min-h-screen bg-gray-100">
        <Suspense fallback={<div>Loading header...</div>}>
          <HeaderServer warehouses={warehouses} initialWarehouseId={initialWarehouseId}/>
        </Suspense>

        {/* 
          HomeServer is a server component that:
           - Renders the tab content based on `currentTab`
           - We'll still show a client-based tab bar 
             that can do a local "Loading" state.
        */}
        <HomeServer
          currentTab={tab ?? Tabs.Products}
          selectedWarehouseId={initialWarehouseId}
        />
      </div>
    </Provider>
  );
}
