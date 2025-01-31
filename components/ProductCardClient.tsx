// app/components/ProductCardClient.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DateTime } from "luxon";
import { ProductForUsers } from "../types/product";
import ImageCarouselClient from "./ImageCarouselClient"; // クライアント側のカルーセル
import ProductModal from "./ProductModal"; // 詳細モーダル
import AvailabilityHistory from "./AvailabilityHistory";
import StockConfirmation from "./StockConfirmation";

interface ProductCardClientProps {
  product: ProductForUsers;
}

/**
 * クライアントコンポーネント
 * - クリックでモーダルを開く
 * - アニメーションなど useState/useEffect が使える
 */
export default function ProductCardClient({ product }: ProductCardClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const discountPercentage = product.discount
    ? Math.round((product.discount / product.price) * 100)
    : 0;

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <motion.div
        className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer
                   transition transform hover:scale-105"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.05 }}
        onClick={openModal}
      >
        {/* 画像カルーセル(クライアントサイド) */}
        {product.images && product.images.length > 0 ? (
          <ImageCarouselClient
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

        {/* コンテンツエリア */}
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
              {product.saleEndDate &&
                ` ${DateTime.fromISO(product.saleEndDate)
                  .toISODate()
                  ?.split("-")
                  .slice(1)
                  .join("/")} `}
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

          {/* 在庫確認 */}
          <StockConfirmation
            productId={product.id}
            warehouseId={product.warehouse.id}
            // Card全体にonClickを付けているので、ここではイベントを伝播しないように注意が必要ならstopPropagation
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </motion.div>

      {/* モーダル */}
      <ProductModal product={product} isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
}
