// app/components/WeeklyBuysServer.tsx
import { fetchWeeklyBuys } from "../utils/api";
import { ProductForUsers } from "../types/product";
import WeeklyBuysClient from "./WeeklyBuysClient";

interface WeeklyBuysServerProps {
  warehouseId: number;
  field: "price" | "discountPercentage";
  order: "asc" | "desc";
}

/**
 * サーバーサイドコンポーネント
 * - SSRでデータを取得
 * - クライアントコンポーネントへ渡す
 */
export default async function WeeklyBuysServer({
  warehouseId,
  field,
  order,
}: WeeklyBuysServerProps) {
  let products: ProductForUsers[] = [];

  // (1) サーバーサイドでデータ取得
  try {
    const weeklyBuysData = await fetchWeeklyBuys(warehouseId);
    products = weeklyBuysData.data;
  } catch (error) {
    console.error("Error loading products:", error);
    return <div>エラーが発生しました</div>;
  }

  if (!products.length) {
    return <div>データがありません</div>;
  }

  // (2) クライアントコンポーネントにproductsを渡し、ソート・モーダル等を実装してもらう
  return (
    <WeeklyBuysClient
      initialProducts={products}
      defaultField={field}
      defaultOrder={order}
    />
  );
}
