// app/components/ProductCardServer.tsx

import { DateTime } from "luxon";
import { ProductForUsers } from "../types/product";
// import ImageCarousel from "./ImageCarousel"; // 画像スライダー(SSR対応か要確認)
import AvailabilityHistory from "./AvailabilityHistory";
import StockConfirmation from "./StockConfirmation";
import ImageCarouselServer from './ImageCarouselServer';

// SSR向けのシンプルなカードコンポーネント
// クライアントサイドのuseStateやモーダル開閉のロジックを除去
// フリップアニメーションやホバー拡大などのフロント機能を使わない実装例

interface ProductCardServerProps {
  product: ProductForUsers;
}

export default function ProductCardServer({ product }: ProductCardServerProps) {
  // 割引率計算
  const discountPercentage = product.discount
    ? Math.round((product.discount / product.price) * 100)
    : 0;

  // セール期間の終了日をフォーマット
  let saleEndDateStr = "";
  if (product.saleEndDate) {
    const dt = DateTime.fromISO(product.saleEndDate);
    saleEndDateStr = dt.toISODate()?.split("-").slice(1).join("/") || "";
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* 画像表示エリア */}
      {product.images && product.images.length > 0 ? (
        <ImageCarouselServer
          images={product.images.map((img) => img.url)}
          alt={product.name}
        />
      ) : product?.altImageUrl ? (
        <div className="relative w-full h-0 pb-[90%] overflow-hidden">
          <img
            src={product.altImageUrl}
            alt={product.name}
            className="absolute top-0 left-0 w-full h-full object-cover object-top"
          />
        </div>
      ) : (
        <div className="bg-gray-200 h-40 flex items-center justify-center">
          <span className="text-gray-500">画像がありません</span>
        </div>
      )}

      {/* テキスト・価格など */}
      <div className="p-3 sm:p-4 md:p-6">
        <h2 className="text-md sm:text-lg md:text-2xl font-bold mb-2">
          {product.name}
        </h2>

        <p className="text-sm sm:text-base text-gray-600 mb-3 line-clamp-2 sm:line-clamp-3">
          {product.description}
        </p>

        {/* 割引パーセンテージ */}
        {product.discount && (
          <span
            className="
              bg-red-100
              text-red-800
              text-xs
              sm:text-sm
              font-semibold
              px-2.5 py-0.5
              rounded
            "
          >
            {discountPercentage}%オフ
          </span>
        )}

        {/* 価格表示 */}
        <div className="flex justify-between items-center mb-2">
          <div>
            <span className="text-xl sm:text-2xl md:text-3xl font-bold text-red-600">
              ¥{(product.price - (product.discount || 0)).toLocaleString()}
            </span>
            {product.discount && (
              <span className="text-sm sm:text-base md:text-lg text-gray-500 line-through ml-2">
                ¥{product.price.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* セール期間 */}
        {(product?.saleStartDate || product?.saleEndDate) && (
          <p className="text-xs sm:text-sm text-gray-600">
            セール期間:
            {product.saleStartDate && product.saleEndDate && " ~ "}
            {product.saleEndDate && ` ${saleEndDateStr}`}
          </p>
        )}

        {/* 在庫履歴 */}
        <AvailabilityHistory
          histories={product.availabilityRecords.map((record) => ({
            date: record.date,
            value:
              record.value === "IN_STOCK"
                ? "InStock"
                : record.value === "OUT_OF_STOCK"
                ? "OutOfStock"
                : "Unknown",
          }))}
        />

        {/* 在庫確認（SSR） */}
        <StockConfirmation
          productId={product.id}
          warehouseId={product.warehouse.id}
        />
      </div>
    </div>
  );
}
