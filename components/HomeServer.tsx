// app/components/HomeServer.tsx
import WeeklyBuysServer from "./WeeklyBuysServer";
import GasPricesServer from "./GasPricesServer";
import CrowdednessStatusServer from "./CrowdednessStatusServer";
import { Tabs } from '../lib/tabs';
import TabsClient from './TabClient';

interface HomeServerProps {
  currentTab: Tabs;
  selectedWarehouseId: number | null;
}

export default function HomeServer({
  currentTab,
  selectedWarehouseId,
}: HomeServerProps) {
  // If no warehouses, show a fallback
  if (!selectedWarehouseId) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-500">データ取得中...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-4 sm:px-6 lg:px-8">
      {/* The tab bar is a client component 
         - lets us show "Loading..." immediately on click 
         - also triggers SSR route changes in the background
      */}
      <TabsClient currentTab={currentTab} />

      {/* SSR tab content. Will be updated once the page is re-fetched 
          with the new `?tab=...`.
      */}
      {currentTab === Tabs.Products && (
        <div className="px-4 py-4 sm:px-0">
          <WeeklyBuysServer
            warehouseId={selectedWarehouseId}
            field="discountPercentage"
            order="desc"
          />
        </div>
      )}
      {currentTab === Tabs.Crowdedness && (
        <CrowdednessStatusServer warehouseId={selectedWarehouseId} />
      )}
      {currentTab === Tabs.Fuel && <GasPricesServer warehouseId={selectedWarehouseId} />}
    </div>
  );
}
