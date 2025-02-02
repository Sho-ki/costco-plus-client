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
 * - 初回のページ（例：page 1, size 8）をSSRで取得
 * - クライアントコンポーネントへ渡す
 */
export default async function WeeklyBuysServer({
  warehouseId,
  field,
  order,
}: WeeklyBuysServerProps) {
  try {
    // Fetch first page only (adjust page/size as needed)
    const response = await fetchWeeklyBuys(warehouseId, {
      page: 1,
      size: 10,
      sortField: field,
      sortOrder: order,
    });

    const { data: products, meta } = response;
    if (!products.length) {
      return <div>データがありません</div>;
    }
    return (
      <WeeklyBuysClient
        warehouseId={warehouseId}
        initialProducts={products}
        initialPagination={meta}
        defaultField={field}
        defaultOrder={order}
      />
    );
  } catch (error) {
    console.error("Error loading products:", error);
    return <div>エラーが発生しました</div>;
  }
}
