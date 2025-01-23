'use client';

import { useState, useEffect } from 'react';
import { fetchWeeklyBuys } from '../utils/api';
import ProductCard from './ProductCard';
import { ProductForUsers } from '../types/product';

interface WeeklyBuysClientProps {
  warehouseId: number;
  field: 'price' | 'discountPercentage';
  order: 'asc' | 'desc';
}

export default function WeeklyBuysClient({
  warehouseId,
  field,
  order,
}: WeeklyBuysClientProps) {
  // ----------------------------
  // ① 初回のみデータをfetch
  // ----------------------------
  const [products, setProducts] = useState<ProductForUsers[]>([]);
  const [sortedProducts, setSortedProducts] = useState<ProductForUsers[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    fetchWeeklyBuys(warehouseId)
      .then((weeklyBuysData) => {
        if (!isMounted) return;

        // fetchで受け取ったデータをそのまま保持
        setProducts(weeklyBuysData.data);
        setLoading(false);
      })
      .catch((err) => {
        if (isMounted) {
          setError('Error loading products');
          setLoading(false);
        }
      });

    // Cleanup
    return () => {
      isMounted = false;
    };
    // [warehouseId] のみ依存 → 倉庫店が変わった時にだけ fetch
  }, [warehouseId]);

  // ----------------------------
  // ② ソート順が変わったら再ソート
  // ----------------------------
  useEffect(() => {
    if (!products.length) return;

    // もとの products を複製してソート（破壊的変更を避ける）
    const newSorted = [...products].sort((a, b) => {
      if (field === 'price') {
        return order === 'asc' ? a.price - b.price : b.price - a.price;
      } else {
        // field === 'discountPercentage'
        const discountA =
          a.price && a.discount ? (a.discount / a.price) * 100 : 0;
        const discountB =
          b.price && b.discount ? (b.discount / b.price) * 100 : 0;
        return order === 'asc' ? discountA - discountB : discountB - discountA;
      }
    });

    setSortedProducts(newSorted);
    // products, field, order が変わったらソートし直す
  }, [products, field, order]);

  // ----------------------------
  // レンダリング
  // ----------------------------
  if (loading) return <div>データを取得中...</div>;
  if (error) return <div>{error}</div>;

  return (
    <> 
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sortedProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
    <div className="text-xs text-gray-500 mt-4">
    <p>
        ※ 在庫状況はユーザーの皆さまからの報告に基づいており、在庫を保証するものではありません。
    </p>
    <p>
        ※ 一部画像は{" "}コストコ公式サイト{" "}
        <a
          href="https://www.costco.co.jp/"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://www.costco.co.jp/
        </a>{" "}
        から引用しています。
      </p>
    </div>
    </>
  );
}
