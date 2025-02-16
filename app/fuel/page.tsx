// app/(home)/fuel/page.tsx
import { cookies } from "next/headers";
import GasPricesServer from '../../components/GasPricesServer';
import { fetchWarehouses } from '../../utils/api';

export async function generateMetadata() {
  return {
    title: "今日のガソリン代 - コストコプラス＋",
    description: "最新のガソリン価格をチェック。賢い買い物のために。",
  };
}

export default async function FuelPage() {
  const cookieStore = cookies();
  const warehouseCookie = (await cookieStore).get("warehouseId");
  let warehouseId: number | null = null;
  if (warehouseCookie?.value) {
    const parsed = parseInt(warehouseCookie.value, 10);
    if (!isNaN(parsed)) warehouseId = parsed;
  }
  if (!warehouseId) {
    const { data: warehouses } = await fetchWarehouses();
    warehouseId = warehouses?.[0]?.id ?? null;
  }
  
  return (
    <div className="px-4 py-4 sm:px-0">
      <GasPricesServer warehouseId={warehouseId} />
    </div>
  );
}
