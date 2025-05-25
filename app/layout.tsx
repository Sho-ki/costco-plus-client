// app/layout.tsx
// import type { Metadata } from "next";
import { Gabarito, Radio_Canada } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import Footer from "../components/Footer";
import HeaderServer from "../components/HeaderServer";
import { fetchWarehouses } from "../utils/api";
import { cookies, headers } from "next/headers";
import TabsClient from '../components/TabClient';
import { Tabs } from '../lib/tabs';
import GoogleAdsense from '../components/GoogleAdsense';

const geistSans = Gabarito({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Radio_Canada({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export  function generateMetadata() {
  const currentDate = new Date();
  const options: Intl.DateTimeFormatOptions = { month: "numeric", day: "numeric" };
  let formattedDate = currentDate.toLocaleDateString("ja-JP", options);
  // 例："10/20" → "10月20日"
  formattedDate = formattedDate.replace("/", "月") + "日";

  return {
    title: `毎週更新！${formattedDate}のコストコセール情報 | コストコプラス＋`,
    description:
      `${formattedDate}更新！コストコの最新セール情報、リアルタイム混雑状況、ガソリン価格をチェック。` +
      `コストコでのショッピングをより便利に、よりお得に。最終更新日: ${formattedDate}`,
  };
}


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gaId = process.env.GA_ID || "";
  const pId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_PUBLISHER_ID;
  const headersList = await headers();
  const path:Tabs = headersList.get('x-pathname')?.replace('/', '') as Tabs || Tabs.Sale
  // サーバー側で倉庫データを取得
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

  return (
    <html lang="ja">
      <head>
        {/* Google AdSense */}
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${pId}`}
          crossOrigin="anonymous"
        />
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
          strategy="afterInteractive"
          async
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}');
          `}
        </Script>
        <meta
          name="google-site-verification"
          content="Byjs180Nm0Blg3-FQOSdsQPuE0ndxU0S4BNlxeM583E"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* グローバルヘッダー：サーバー側で取得した warehouses と initialWarehouseId を渡す */}
        <HeaderServer warehouses={warehouses} initialWarehouseId={initialWarehouseId} />
        <div className="max-w-7xl mx-auto py-2 sm:px-6 lg:px-8">
        <TabsClient currentTab={path} />
        </div>
        <main className="max-w-7xl mx-auto sm:px-6 lg:px-8">{children}</main>
        <GoogleAdsense />
        <Footer />
      </body>
    </html>
  );
}
