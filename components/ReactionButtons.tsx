"use client";

import React, { useEffect, useState } from "react";
import { PostWithCount } from "../types/post-with-count";
import {
  ThumbsUp,
  Check,
  HelpCircle,
  X,
} from "lucide-react";

// ローカルストレージに各投稿のユーザー反応を保存する型
interface ReactionData {
  postId: number;
  reactionId: number;
}

// localStorageに保存するデータの形式
interface StoredReactions {
  records: ReactionData[];
  timestamp: number;
}

const LOCAL_STORAGE_KEY = "postReactions";
const EXPIRATION_TIME = 5 * 24 * 60 * 60 * 1000; // 5日

// localStorageからデータを取得するヘルパー関数（堅牢な実装）
function getStoredReactions(): ReactionData[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!data) return [];
  try {
    const parsed: StoredReactions = JSON.parse(data);
    if (!parsed || !Array.isArray(parsed.records)) return [];
    const currentTime = new Date().getTime();
    if (currentTime - parsed.timestamp > EXPIRATION_TIME) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      return [];
    }
    return parsed.records;
  } catch (error) {
    console.error("Error parsing stored reactions", error);
    return [];
  }
}

// localStorageを更新するヘルパー関数
function updateStoredReactions(records: ReactionData[]) {
  if (typeof window === "undefined") return;
  const data: StoredReactions = {
    records,
    timestamp: new Date().getTime(),
  };
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
}

// ダミーAPI: sendReaction（実際のAPI呼び出しに置き換えてください）
async function sendReaction(
  postId: number,
  reactionId: number
): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 300));
}

/**
 * ReactionButtons コンポーネント
 * - post.reactions に既にある各反応（countが0でも）をそのまま利用して表示する。
 * - localStorage からユーザーの選択を読み込み、選択状態の場合はボタンの背景色を reaction.color（Tailwindクラス）にする。
 */
interface ReactionButtonsProps {
  post: PostWithCount;
  onReaction?: (postId: number, reactionId: number) => void;
}

export function ReactionButtons({ post, onReaction }: ReactionButtonsProps) {
  const [selectedReactionId, setSelectedReactionId] = useState<number | null>(
    null
  );

  // ローカルストレージから、既に選択された反応を読み込む
  useEffect(() => {
    const stored = getStoredReactions();
    const reaction = stored.find((r) => r.postId === post.id);
    if (reaction) {
      setSelectedReactionId(reaction.reactionId);
    }
  }, [post.id]);

  const handleReactionClick = async (
    reaction: typeof post.reactions[number]
  ) => {
    try {
      if (selectedReactionId === reaction.id) return;
      await sendReaction(post.id, reaction.id);
      const stored = getStoredReactions();
      const updated = stored.filter((r) => r.postId !== post.id);
      updated.push({ postId: post.id, reactionId: reaction.id });
      updateStoredReactions(updated);
      setSelectedReactionId(reaction.id);
      if (onReaction) onReaction(post.id, reaction.id);
    } catch (error) {
      console.error("Failed to send reaction", error);
    }
  };

  const getIconForReaction = (name: string) => {
    switch (name) {
      case "LIKE":
        return <ThumbsUp className="w-3 h-3" />;
      case "AGREE":
        return <HelpCircle className="w-3 h-3" />;
      case "IN_STOCK":
        return <Check className="w-3 h-3" />;
      case "OUT_OF_STOCK":
        return <X className="w-3 h-3" />;
      default:
        return <HelpCircle className="w-3 h-3" />;
    }
  };

  const getLabelForReaction = (name: string) => {
    switch (name) {
      case "LIKE":
        return "いいね";
      case "AGREE":
        return "知りたい";
      case "IN_STOCK":
        return "見た";
      case "OUT_OF_STOCK":
        return "なかった";
      default:
        return "不明";
    }
    };

  return (
    <div className="flex justify-between items-center space-x-4">
      {post.reactions.map((reaction) => (
        <div key={reaction.id} className="flex items-center space-x-1 flex-col">
        <span className="text-[7px] sm:text-[10px]">{getLabelForReaction(reaction.name)}</span>

        <button
          key={reaction.id}
          onClick={(e) => {
            e.stopPropagation();
            handleReactionClick(reaction);
          }}
          className={`flex flex-col items-center justify-center p-2 w-5 h-5 rounded-full transition ${
            selectedReactionId === reaction.id
              ? `bg-${reaction.color}-300 text-${reaction.color}-700`
              : `bg-gray-100 hover:bg-${reaction.color}-400 text-gray-400`
          }`}
          aria-label={reaction.name}
        >
          <div>{getIconForReaction(reaction.name)}</div>
        </button>
          <span className="text-[7px] sm:text-[10px]">{reaction.count}</span>
        </div>
      ))}
    </div>
  );
}
