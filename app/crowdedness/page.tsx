// app/(home)/crowdedness/page.tsx
import { cookies } from "next/headers";
import { fetchWarehouses } from '../../utils/api';
import CrowdednessStatusServer from '../../components/CrowdednessStatusServer';

export async function generateMetadata() {
  return {
    title: "現在の混雑状況 - コストコプラス＋",
    description: "リアルタイムの混雑状況をチェック。混雑を避けた賢い買い物のために。",
  };
}

export default async function CrowdednessPage() {
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
      <CrowdednessStatusServer warehouseId={warehouseId} />
    </div>
  );
}
