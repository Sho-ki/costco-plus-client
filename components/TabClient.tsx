// app/components/TabsClient.tsx
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Tabs } from '../lib/tabs';

interface TabsClientProps {
  currentTab: Tabs;
}

/**
 * Using React's `useTransition` to show a loading overlay 
 * while we wait for the new route (SSR) to be fetched.
 */
export default function TabsClient({ currentTab }: TabsClientProps) {
  const router = useRouter();

  // Local state for instant highlight
  const [activeTab, setActiveTab] = useState<Tabs>(currentTab);

  // useTransition provides `isPending` and a `startTransition` function
  const [isPending, startTransition] = useTransition();

  const handleTabClick = (tab: Tabs) => {
    if (tab === activeTab) return; // no change

    // Update the highlight right away
    setActiveTab(tab);

    // Start a transition for the route change
    startTransition(() => {
      // Next.js will fetch the new SSR data
      router.push(`/?tab=${tab}`);
    });
  };

  return (
    <>
      {/* Tab Buttons */}
      <div className="flex justify-center mb-4">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            onClick={() => handleTabClick(Tabs.Products)}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === Tabs.Products
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            今週の<br />
            セール情報
          </button>
          <button
            onClick={() => handleTabClick(Tabs.Crowdedness)}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === Tabs.Crowdedness
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            現在の<br />
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
            今日の<br />
            ガソリン代
          </button>
        </div>
      </div>

      {/* Loading Overlay during transition */}
      {isPending && (
                <div
          className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-80 flex-col"
          style={{ zIndex: 1000 }}
        >
          <div className="flex items-center">
            <video
              autoPlay
              loop
              muted
              playsInline
              width={150}
              height={150}
            >
              <source src="/load.webm" type="video/webm" />
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="text-white text-2xl">データ取得中...</div>
        </div>

      )}
      
    </>
  );
}
