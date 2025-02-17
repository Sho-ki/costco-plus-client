"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Tabs } from "../lib/tabs";
import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
import loadingAnimation from "../public/loading.json";

interface TabsClientProps {
  currentTab: Tabs;
}

/**
 * タブクリック時にページ遷移しつつ、ローディングを表示
 */
export default function TabsClient({ currentTab }: TabsClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tabs>(currentTab);
  const [isPending, startTransition] = useTransition();

  const handleTabClick = (tab: Tabs) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    startTransition(() => {
      const target = `/${tab}`;
      router.push(target);
    });
  };

  return (
    <>
      {/* タブボタン群 */}
      <div className="flex justify-center mb-4">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            onClick={() => handleTabClick(Tabs.Sale)}
            className={`px-3 py-2 text-sm font-medium ${
              activeTab === Tabs.Sale
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            今週の
            <br />
            セール情報
          </button>
            <button
             onClick={() => handleTabClick(Tabs.Post)}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === Tabs.Post
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              みんなの
              <br />
              在庫速報
            </button>
          <button
            onClick={() => handleTabClick(Tabs.Crowdedness)}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === Tabs.Crowdedness
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            現在の
            <br />
            混雑状況
          </button>
          <button
            onClick={() => handleTabClick(Tabs.Fuel)}
            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
              activeTab === Tabs.Fuel
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            今日の
            <br />
            ガソリン代
          </button>
        </div>
      </div>

      {/* 遷移中のローディングオーバーレイ */}
      {isPending && (
        <div
          className="fixed inset-0 flex flex-col items-center justify-center bg-gray-900 bg-opacity-80"
          style={{ zIndex: 1000 }}
        >
          <div className="flex items-center mb-4" style={{ width: 150, height: 150 }}>
            <Lottie animationData={loadingAnimation} loop />
          </div>
          <div className="text-white text-2xl">データ取得中...</div>
        </div>
      )}
    </>
  );
}
