"use client";

import Script from "next/script";
import { useEffect } from "react";

declare global {
  var adsbygoogle: any[];
}

type Props = {
  pId?: string;
};

const GoogleAdsense: React.FC<Props> = ({ pId }) => {
  if (!pId) return null;

  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <>
      <Script
        async
        strategy="afterInteractive"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${pId}`}
        crossOrigin="anonymous"
      />
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={`ca-pub-${pId}`}
        data-ad-slot="8854020173"
        data-ad-format="fluid"
        data-ad-layout-key="+3m+pw-l-78+mx"
        data-full-width-responsive="true"
      ></ins>
    </>
  );
};

export default GoogleAdsense;
