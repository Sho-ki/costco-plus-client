// app/components/ReactionButtons.tsx
"use client";

import React, { useEffect, useState, useRef } from "react";
import { PostWithCount } from "../types/post-with-count";
import {
  ThumbsUp,
  Check,
  HelpCircle,
  X,
  Laugh,
  GraduationCap,
} from "lucide-react";
import { postReactionRecord, updateReactionRecord } from "../utils/api";
import { PostReactionRecord } from "../types/reaction-record";

// ローカルストレージに各投稿のユーザー反応を保存する型（reactionRecordId を追加）
interface ReactionData {
  postId: number;
  reactionId: number;
  reactionRecordId: number;
}

// localStorageに保存するデータの形式
interface StoredReactions {
  records: ReactionData[];
  timestamp: number;
}

const LOCAL_STORAGE_KEY = "postReactions";
const EXPIRATION_TIME = 5 * 24 * 60 * 60 * 1000; // 5日

// localStorageからデータを取得するヘルパー関数
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

// API呼び出し：POSTの場合（新規作成）
async function sendReaction(
  postId: number,
  reactionTypeId: number
): Promise<PostReactionRecord> {
  const response = await postReactionRecord(postId, reactionTypeId);
  return response.data;
}

// API呼び出し：PUTの場合（更新）
async function updateReaction(
  postId: number,
  reactionTypeId: number,
  reactionRecordId: number,
): Promise<PostReactionRecord> {
  const response = await updateReactionRecord(postId, reactionTypeId, reactionRecordId);
  return response.data;
}

/**
 * ReactionButtons コンポーネント
 * - post.reactions に既にある各反応（countが0でも）をそのまま利用して表示する
 * - localStorage からユーザーの選択を読み込み、選択状態の場合はボタンの背景色を reaction.color（Tailwindクラス）にする
 * - ユーザーがアイコンをクリックしたら、すぐに count を楽観的更新する
 *   ※API コール中はロック（useRef）で重複クリックを防ぎます
 */
interface ReactionButtonsProps {
  post: PostWithCount;
  onReaction?: (postId: number, reactionId: number) => void;
}

export function ReactionButtons({ post, onReaction }: ReactionButtonsProps) {
  const [selectedReactionId, setSelectedReactionId] = useState<number | null>(null);
  // ローカル状態として reaction 情報を保持（count 等を更新するため）
  const [reactions, setReactions] = useState(post.reactions);
  // API コール中かどうかのフラグ
  const [isUpdating, setIsUpdating] = useState(false);
  // 複数クリックを防ぐためのロック（useRef は即時更新可能）
  const updatingLock = useRef(false);

  // ローカルストレージから、既に選択された反応を読み込む
  useEffect(() => {
    const stored = getStoredReactions();
    const saved = stored.find((r) => r.postId === post.id);
    if (saved) {
      setSelectedReactionId(saved.reactionId);
    }
    setReactions(post.reactions);
  }, [post.id, post.reactions]);

  const handleReactionClick = async (
    reaction: typeof post.reactions[number]
  ) => {
    // すでに API コール中なら何もしない
    if (updatingLock.current) return;
    // 同じ反応が選択されているなら無視
    if (selectedReactionId === reaction.id) return;

    updatingLock.current = true;
    setIsUpdating(true);
    setSelectedReactionId(reaction.id);

    // 楽観的更新：前回選択していた反応があれば count を減らし、新たな反応の count を増やす
    setReactions((prev) =>
      prev.map((r) => {
        if (r.id === reaction.id) {
          return { ...r, count: r.count + 1 };
        }
        if (selectedReactionId && r.id === selectedReactionId) {
          return { ...r, count: Math.max(r.count - 1, 0) };
        }
        return r;
      })
    );

    try {
      const stored = getStoredReactions();
      const exists = stored.find((r) => r.postId === post.id);
      let newRecord: PostReactionRecord;
      if (exists) {
        // PUT リクエスト
        newRecord = await updateReaction(post.id, reaction.id, exists.reactionRecordId);
      } else {
        // POST リクエスト
        newRecord = await sendReaction(post.id, reaction.id);
      }
      // localStorage の更新：reactionId と reactionRecordId を保存する
      const updated = stored.filter((r) => r.postId !== post.id);
      updated.push({
        postId: post.id,
        reactionId: reaction.id,
        reactionRecordId: newRecord.id,
      });
      updateStoredReactions(updated);
      if (onReaction) onReaction(post.id, reaction.id);
    } catch (error) {
      console.error("Failed to send/update reaction", error);
      // エラー時に楽観的更新を元に戻す処理を追加してもよい
    } finally {
      setIsUpdating(false);
      updatingLock.current = false;
    }
  };

  const getIconForReaction = (name: string) => {
    switch (name) {
      case "LIKE":
        return <ThumbsUp className="w-5 h-5" />;
      case "AGREE":
        return <Laugh className="w-5 h-5" />;
      case "UNDERSTAND":
        return <GraduationCap className="w-5 h-5" />;
      case "WANT":
        return <HelpCircle className="w-5 h-5" />;
      case "IN_STOCK":
        return <Check className="w-5 h-5" />;
      case "OUT_OF_STOCK":
        return <X className="w-5 h-5" />;
      default:
        return <HelpCircle className="w-5 h-5" />;
    }
  };

  const getLabelForReaction = (name: string) => {
    switch (name) {
      case "LIKE":
        return "ありがとう";
      case "AGREE":
        return "共感した";
      case "UNDERSTAND":
        return "役に立った";
      case "WANT":
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
    <div className="flex justify-around items-center space-x-4">
      {reactions.map((reaction) => (
        <div key={reaction.id} className="flex flex-col items-center space-y-1">
          <span className="text-[8px] sm:text-[12px]">
            {getLabelForReaction(reaction.name)}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleReactionClick(reaction);
            }}
            className={`flex items-center justify-center w-7 h-7 rounded-full transition ${
              selectedReactionId === reaction.id
                ? `bg-${reaction.color}-300 text-${reaction.color}-700`
                : `bg-gray-100 hover:bg-${reaction.color}-400 text-gray-400`
            }`}
            aria-label={reaction.name}
          >
            {getIconForReaction(reaction.name)}
          </button>
          <span className="text-[8px] sm:text-[12px]">{reaction.count}</span>
        </div>
      ))}
    </div>
  );
}
