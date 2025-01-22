import type { Metadata } from "next";
import { Gabarito, Radio_Canada } from "next/font/google";
import "./globals.css";
import GoogleAdsense from '../components/GoogleAdsense';
import Head from 'next/head';
import Script from 'next/script';

const geistSans = Gabarito({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Radio_Canada({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.GA_ID || '';
  return (
    <html lang="en">
      <head>
      <GoogleAdsense pId={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_PUBLISHER_ID} />
      <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
          strategy='afterInteractive'
          async
        />
      <Script id='google-analytics' strategy='afterInteractive'>
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
      </body>
    </html>
  );
}
