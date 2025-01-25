import type { Metadata } from "next";
import { Gabarito, Radio_Canada } from "next/font/google";
import "./globals.css";
import GoogleAdsense from "../components/GoogleAdsense";
import Script from "next/script";

import Footer from "../components/Footer";

const geistSans = Gabarito({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Radio_Canada({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "コストコハッカープラス＋ | もっとコストコ！",
  description:
    "コストコの最新セール情報、リアルタイム混雑状況、ガソリン価格をチェック。コストコでのショッピングをより便利に、よりお得に。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gaId = process.env.GA_ID || "";
  const pId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_PUBLISHER_ID;
  // if (process.env.NODE_ENV !== "production" || !pId) {
  //   return null;
  // }
  return (
    <html lang="ja">
      <head>
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${pId}`}
          crossOrigin="anonymous"
          // strategy="afterInteractive"
        />
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
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <GoogleAdsense />
        <Footer />
      </body>
    </html>
  );
}
