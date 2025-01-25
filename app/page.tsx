import { Suspense } from 'react';
import { Provider } from 'jotai';
import { fetchWarehouses } from '../utils/api';
import HomeClient from '../components/HomeClient';
import HeaderServer from '../components/HeaderServer';
import { AdUnit } from 'next-google-adsense';

export const InFeedAd = () => {
  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-format="fluid"
      data-ad-layout-key="<AD_LAYOUT_KEY>"
      data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
      data-ad-slot="XXXXXXXXXX"
    />
  );
};



export const metadata = {
  title: 'コストコハッカープラス＋ | もっとコストコ！',
  description: 'コストコの最新セール情報、リアルタイム混雑状況、ガソリン価格をチェック。コストコでのショッピングをより便利に、よりお得に。',
};

export default async function Home() {
  const warehousesData = await fetchWarehouses();
  const warehouses = warehousesData.data;
  const pId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_PUBLISHER_ID;
  return (
    <Provider>
       <AdUnit
        publisherId={`pub-${pId}`}
        slotId="8854020173"
        layout="display"
        // customLayout={InFeedAd()}
        />
      <div className="min-h-screen bg-gray-100">
        <Suspense fallback={<div>Loading...</div>}>
          <HeaderServer warehouses={warehouses} />
        </Suspense>
        <HomeClient initialWarehouses={warehouses} />
      </div>
    </Provider>
  );
}

