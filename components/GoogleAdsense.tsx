'use client';

import Script from 'next/script';
import { useEffect } from "react";

declare global {
  var adsbygoogle: any[];
}

const GoogleAdsense: React.FC = () => {
  const pId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_PUBLISHER_ID;
  if(!pId) return null;
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={`ca-pub-${pId}`}
        data-ad-slot="8854020173"
        data-ad-format="fluid"
        data-ad-layout-key="+3m+pw-l-78+mx"
        data-full-width-responsive="true"
      ></ins>
      <ins className="adsbygoogle"
        style={{display: 'block'}}
        data-ad-format="autorelaxed"
        data-ad-client={`ca-pub-${pId}`}
        data-ad-slot="6986135231"></ins>
      <Script>
     (adsbygoogle = window.adsbygoogle || []).push({});
      </Script>
    </>
  );
};

export default GoogleAdsense;
