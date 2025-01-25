'use client';

import { useRouter } from 'next/router';
import Script from "next/script";
import { useEffect } from 'react';

declare global {
  var adsbygoogle: unknown[];
}


type Props = {
  pId?: string;
};

const GoogleAdsense: React.FC<Props> = ({ pId }) => {
  if(!pId) return null;
  const { asPath } = useRouter();

  useEffect(() => {
    try {
      (adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error(error);
    }
  }, [asPath]);
  
  return (
    <>
    <ins className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-format="fluid"
          data-ad-layout-key="+3m+pw-l-78+mx"
          data-ad-client={`ca-pub-${pId}`}
          data-ad-slot="8854020173">
    </ins>
    {/* <Script>
          (adsbygoogle = window.adsbygoogle || []).push({});
    </Script> */}
      </>
  );
};

export default GoogleAdsense;
