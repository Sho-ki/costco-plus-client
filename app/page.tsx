import { Suspense } from "react";
import { Provider } from "jotai";
import { fetchWarehouses } from '../utils/api';
import HeaderServer from '../components/HeaderServer';
import HomeServer from '../components/HomeServer';
import { cookies } from 'next/headers';
import { Tabs } from '../lib/tabs';
import Head from 'next/head';

// So that each query-param change triggers fresh SSR
export const dynamic = "force-dynamic";

interface PageProps {
  searchParams?: Promise<{
    [key: string]: Tabs;
  }>;
}

export async function generateMetadata() {
  const currentDate = new Date();
  const options: Intl.DateTimeFormatOptions = { month: 'numeric', day: 'numeric' };
  let formattedDate = currentDate.toLocaleDateString('ja-JP', options);
  
  // toLocaleDateString with 'ja-JP' might return "10/20". Replace "/" with "月" and append "日"
  formattedDate = formattedDate.replace('/', '月') + '日';

  return {
  title: "もっとコストコ！コストコプラス＋",
  description:
    `${formattedDate}更新！コストコの最新セール情報、リアルタイム混雑状況、ガソリン価格をチェック。コストコでのショッピングをより便利に、よりお得に。最終更新日: ${formattedDate}`,
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

export default async function Home({ searchParams }: PageProps ) {
  const param = await searchParams;
  const tab = param?.tab;
  const { data: warehouses } = await fetchWarehouses();
  const cookieStore = cookies();
  const warehouseIdCookie = (await cookieStore).get("warehouseId");
  let initialWarehouseId: number | null = null;

  if (warehouseIdCookie?.value) {
    const parsed = parseInt(warehouseIdCookie.value, 10);
    if (!isNaN(parsed)) {
      initialWarehouseId = parsed;
    }
  } else {
    initialWarehouseId = warehouses?.[0]?.id ?? null;
  }

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
        {/* 構造化データ（JSON-LD）の追加 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>
      <div className="min-h-screen bg-gray-100">
        <Suspense fallback={<div>Loading header...</div>}>
          <HeaderServer warehouses={warehouses} initialWarehouseId={initialWarehouseId}/>
        </Suspense>

        {/* 
          HomeServer is a server component that:
           - Renders the tab content based on `currentTab`
           - We'll still show a client-based tab bar 
             that can do a local "Loading" state.
        */}
        <HomeServer
          currentTab={tab ?? Tabs.Products}
          selectedWarehouseId={initialWarehouseId}
        />
      </div>
    </Provider>
  );
}
