// app/components/ImageCarouselServer.tsx
// SSR時に最低限のDOMを生成し、
// ハイドレーション後にクライアントコンポーネントで切り替え可能にする

import Image from "next/image";
import ImageCarouselClient from './ImageCarouselClient';

interface ImageCarouselServerProps {
  images: string[];
  alt: string;
}

// サーバーコンポーネント (デフォルト) でエクスポート
export default function ImageCarouselServer({
  images,
  alt,
}: ImageCarouselServerProps) {
  if (!images || images.length === 0) {
    // 画像がない場合もSSRで静的にHTMLを返す
    return (
      <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
        <span className="text-gray-500">画像がありません</span>
      </div>
    );
  }

  // 1. SSRとして表示される「初期画像」部分
  //    - JavaScript無効環境では1枚目のみ表示されるが、それでもSEO上メリットがある
  // 2. クライアントコンポーネントを呼び出すことで、JS有効環境ではカルーセルに差し替え

  return (
    <div>
      {/* SSRフォールバック（1枚目のみ） */}
      <noscript>
        {/* JSが無効な場合だけnoscript内を表示してユーザーに1枚目だけ見せる */}
        <div className="relative w-full h-64 bg-gray-100 overflow-hidden">
          <Image
            src={images[0]}
            alt={`${alt} (fallback)`}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 640px) 100vw, 50vw"
          />
        </div>
      </noscript>

      {/* JS有効時にはハイドレーションでクライアントコンポーネントが適用 */}
      <ImageCarouselClient images={images} alt={alt} />
    </div>
  );
}
