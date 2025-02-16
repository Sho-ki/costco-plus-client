// app/(home)/products/page.tsx
import { cookies } from "next/headers";
import { fetchWarehouses } from '../../utils/api';
import WeeklyBuysServer from '../../components/WeeklyBuysServer';

export async function generateMetadata() {
  return {
    title: "今週のセール情報 - コストコプラス＋",
    description: "最新のセール情報をチェック。コストコでのショッピングをより便利に、よりお得に。",
  };
}

export default async function ProductsPage() {
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
      <WeeklyBuysServer warehouseId={warehouseId} field="discountPercentage" order="desc" />
    </div>
  );
}
