"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { ProductForUsers } from "../types/product";
import GoogleAdsense from "./GoogleAdsense";
import { IN_FEED_SLOTS } from "../lib/inFeedSlots";
import ProductCardClient from "./ProductCardClient";
import { fetchWeeklyBuys } from "../utils/api";
import { Pagination } from "../types/apiResponse";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
import loadingAnimation from "../public/loading.json";

type SortField = "price" | "discountPercentage";
type SortOrder = "asc" | "desc";

interface WeeklyBuysClientProps {
  warehouseId: number;
  initialProducts: ProductForUsers[];
  initialPagination: Pagination;
  defaultField: SortField;
  defaultOrder: SortOrder;
}

/**
 * クライアントコンポーネント
 * - 初回のページはSSRから受け取る
 * - ユーザーのスクロールに応じて次ページを取得（無限スクロール）
 * - ソートが変更された場合はリセットして再取得
 * - 広告を一定の間隔で挿入
 */
export default function WeeklyBuysClient({
  warehouseId,
  initialProducts,
  initialPagination,
  defaultField,
  defaultOrder,
}: WeeklyBuysClientProps) {
  // ソート対象 & オーダーを保持
  const [sortField, setSortField] = useState<SortField>(defaultField);
  const [sortOrder, setSortOrder] = useState<SortOrder>(defaultOrder);

  // ページネーション用の状態（製品一覧、現在のページ情報、ページサイズ、ロード状態）
  const [products, setProducts] = useState<ProductForUsers[]>(initialProducts);
  const [pagination, setPagination] = useState<Pagination>(initialPagination);
  const pageSize = initialPagination.size; // fixed page size
  const [readMoreLoading, setReadMoreLoading] = useState<boolean>(false);
  const [sortUpdateLoading, setSortUpdateLoading] = useState<boolean>(false);


  // A ref to track whether this is the initial render for the sort effect.
  const initialSortRender = useRef(true);

  // Get current tab from the URL search parameters.
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab");

  // ------------------------------------------------
  // Reset initialSortRender when tab changes.
  // ------------------------------------------------
  useEffect(() => {
    // When the tab changes, reset the flag so that if the user returns
    // to the products tab, the sort effect does not immediately fetch sorted data.
    initialSortRender.current = true;
  }, [currentTab]);

  // ------------------------------------------------
  // Fetch more products when user scrolls past 70% of the page
  // ------------------------------------------------
  const loadMore = useCallback(async () => {
    // Do not fetch if already loading or if all products are loaded
    if (readMoreLoading || products.length >= pagination.totalCount) return;
    setReadMoreLoading(true);
    try {
      const nextPage = pagination.page + 1;
      const response = await fetchWeeklyBuys(warehouseId, {
        page: nextPage,
        size: pageSize,
        sortField,
        sortOrder,
      });
      // Append new products and update pagination meta
      setProducts((prev) => [...prev, ...response.data]);
      setPagination(response.meta);
    } catch (error) {
      console.error("Error loading more products:", error);
    } finally {
      setReadMoreLoading(false);
    }
  }, [readMoreLoading, products, pagination, warehouseId, pageSize, sortField, sortOrder]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const totalHeight = document.body.offsetHeight;
      const scrollPercent = (scrollPosition / totalHeight) * 100;
      // If scrolled past 65% and not currently loading, trigger loadMore
      if (scrollPercent >= 65) {
        loadMore();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadMore]);

  // ------------------------------------------------
  // When sort options change, reset and fetch page 1
  // ------------------------------------------------
  useEffect(() => {
    // Skip on the very first render OR when the tab has just changed.
    if (initialSortRender.current) {
      initialSortRender.current = false;
      return;
    }
    async function fetchSorted() {
      setSortUpdateLoading(true);
      try {
        const response = await fetchWeeklyBuys(warehouseId, {
          page: 1,
          size: pageSize,
          sortField,
          sortOrder,
        });
        // Replace the product list and reset pagination
        setProducts(response.data);
        setPagination(response.meta);
      } catch (error) {
        console.error("Error fetching sorted products:", error);
      } finally {
        setSortUpdateLoading(false);
      }
    }
    fetchSorted();
  }, [sortField, sortOrder, warehouseId, pageSize]);

  // ------------------------------------------------
  // Deduplicate products (by product.id)
  // ------------------------------------------------
  const uniqueProducts = useMemo(() => {
    const seen = new Set<number>();
    return products.filter((product) => {
      if (seen.has(product.id)) return false;
      seen.add(product.id);
      return true;
    });
  }, [products]);

  // ------------------------------------------------
  // Insert ads every AD_INTERVAL products
  // ------------------------------------------------
  const AD_INTERVAL = 10;
  const productsWithAds = useMemo(() => {
    const items: JSX.Element[] = [];
    uniqueProducts.forEach((product, index) => {
      items.push(
        <ProductCardClient key={`product_${product.id}`} product={product} />
      );
      if ((index + 1) % AD_INTERVAL === 0) {
        const adSlot = IN_FEED_SLOTS[(index + 1) / AD_INTERVAL - 1];
        items.push(
          <div
            key={`ad_${index}`}
            className="col-span-2 md:col-span-2 lg:col-span-3"
          >
            <GoogleAdsense
              type="fluid"
              slotId={adSlot?.dataAdSlot}
              dataLayoutKey={adSlot?.dataLayoutKey}
            />
          </div>
        );
      }
    });
    return items;
  }, [uniqueProducts]);

  // ------------------------------------------------
  // JSX Rendering
  // ------------------------------------------------
  return (
    <>
      {/* ソートのセレクトボックス */}
      <div className="flex justify-end mb-4">
        <select
          aria-label="並び替えオプション"
          value={`${sortField}_${sortOrder}`}
          onChange={(e) => {
            const [field, order] = e.target.value.split("_") as [SortField, SortOrder];
            setSortField(field);
            setSortOrder(order);
          }}
          className="border border-gray-300 rounded p-2 text-gray-900"
        >
          <option value="discountPercentage_desc">割引率が高い順</option>
          <option value="discountPercentage_asc">割引率が低い順</option>
          <option value="price_asc">価格が安い順</option>
          <option value="price_desc">価格が高い順</option>
        </select>
      </div>

      {/* 商品+広告のグリッド */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {productsWithAds}
      </div>
        
        {/* Display a loading text without the loading animation and the overlay */}
      {readMoreLoading && (
        <div className="text-center text-gray-900 mt-4">
          データ取得中...
        </div>
      )}

      {sortUpdateLoading && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-900 bg-opacity-80" style={{ zIndex: 1000 }}>
          <div className="flex items-center mb-4" style={{ width: 150, height: 150 }}>
            <Lottie animationData={loadingAnimation} loop />
          </div>
          <div className="text-white text-2xl">データ取得中...</div>
        </div>
      )}

      <div className="text-xs text-gray-900 mt-4">
        <p>
          ※ 在庫状況はユーザーの皆さまからの報告に基づいており、在庫を保証するものではありません。
        </p>
        <p>
          ※ 一部画像は{" "}
          <a
            href="https://www.costco.co.jp/"
            target="_blank"
            rel="noopener noreferrer"
          >
            コストコ公式サイト
          </a>{" "}
          から引用しています。
        </p>
      </div>
    </>
  );
}
