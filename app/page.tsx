// app/page.tsx
import { Suspense } from "react";
import { Provider } from "jotai";
import { fetchWarehouses } from "../utils/api";
import { cookies } from "next/headers";
import { Tabs } from "../lib/tabs";
import Head from "next/head";
import WeeklyBuysServer from '../components/WeeklyBuysServer';

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const currentDate = new Date();
  const options: Intl.DateTimeFormatOptions = { month: "numeric", day: "numeric" };
  let formattedDate = currentDate.toLocaleDateString("ja-JP", options);
  // 例："10/20" → "10月20日"
  formattedDate = formattedDate.replace("/", "月") + "日";

  return {
    title: "もっとコストコ！コストコプラス＋",
    description:
      `${formattedDate}更新！コストコの最新セール情報、リアルタイム混雑状況、ガソリン価格をチェック。` +
      `コストコでのショッピングをより便利に、よりお得に。最終更新日: ${formattedDate}`,
    openGraph: {
      title: "もっとコストコ！コストコプラス＋",
      description: `コストコの最新セール情報、リアルタイム混雑状況、ガソリン価格をチェック。最新更新日: ${formattedDate}`,
      url: "https://costco-plus.com/",
      siteName: "コストコプラス＋",
      images: [
        {
          url: "https://costco-plus.com/costco-plus-logo.webp",
          width: 1200,
          height: 630,
          alt: "コストコプラス＋のロゴ",
        },
      ],
      locale: "ja_JP",
      type: "website",
      updatedTime: new Date().toISOString(),
    },
    alternates: {
      canonical: "https://costco-plus.com/",
    },
  };
}

export default async function Home() {
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
  // JSON‑LD 構造化データ（SEO用）
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "コストコプラス＋",
    url: "https://costco-plus.com/",
    logo: "https://costco-plus.com/costco-plus-logo.webp",
    sameAs: [
      "https://www.instagram.com/costco_hacker",
      "https://news.yahoo.co.jp/expert/creators/costcohacker",
      "https://www.youtube.com/@costco_hacker",
      "https://www.facebook.com/costco.hacker/"
    ],
    description:
      "コストコの最新セール情報、リアルタイム混雑状況、ガソリン価格をチェック。コストコでのショッピングをより便利に、よりお得に。",
  };

  return (
    <Provider>
      <Head>
        {/* 構造化データの挿入 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>
      <div className="min-h-screen">
        <Suspense fallback={<div>データを取得中...</div>}>
          <div className="py-4 sm:px-0">
          <WeeklyBuysServer warehouseId={warehouseId} field="discountPercentage" order="desc" />
          </div>
        </Suspense>
      </div>
    </Provider>
  );
}
