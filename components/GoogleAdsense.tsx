import Script from "next/script";

type Props = {
  pId?: string;
};

const GoogleAdsense: React.FC<Props> = ({ pId }) => {
  if (process.env.NODE_ENV !== "production" || !pId) {
    return null;
  }
  return (
    <>
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${pId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
    <ins className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-format="fluid"
          data-ad-layout-key="+3m+pw-l-78+mx"
          data-ad-client={`ca-pub-${pId}`}
          data-ad-slot="8854020173">
    </ins>
    <Script>
          (adsbygoogle = window.adsbygoogle || []).push({});
    </Script>
      </>
  );
};

export default GoogleAdsense;
