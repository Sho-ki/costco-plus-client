// app/components/PostModal.tsx
"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import dynamic from "next/dynamic";
import { PostWithComments } from "../types/post-with-comments";
import { timeAgo } from "../utils/timeAgo";

// Lottie を動的インポート（クライアント専用）
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
import loadingAnimation from "../public/loading.json";
import { createComment } from '../utils/api';

interface PostModalProps {
  post: PostWithComments;
  onClose: () => void;
}

export default function PostModal({ post, onClose }: PostModalProps) {
  // 初期コメントが存在しない場合は空配列を利用
  const initialComments = post.comments || [];
  const [commentsState, setCommentsState] = useState(initialComments);
  const topLevelComments = commentsState.filter((c) => c.parentId === null);
  const getReplies = (parentId: number) =>
    commentsState.filter((c) => c.parentId === parentId);

  // コメント入力の状態と送信中フラグ
  const [commentText, setCommentText] = useState("");
  const [isSending, setIsSending] = useState(false);

  // 送信処理
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = commentText.trim();
    if (!trimmed) return;

    setIsSending(true);
    try {
      const response = await createComment(post.id, trimmed);
      const newComment = response.data;
      // 新規コメントをリストに追加
      setCommentsState((prev) => [...prev, newComment]);
      setCommentText("");
    } catch (error) {
      console.error(error);
      // 必要に応じてエラーメッセージの表示などを実装
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4">
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold mb-4">{post.content}</h2>
        <section className="flex-1">
          <h3 className="text-xl font-semibold mb-2">コメント</h3>
          {topLevelComments.length === 0 ? (
            <p className="text-gray-500">コメントはありません</p>
          ) : (
            <div className="space-y-4">
              {topLevelComments.map((comment) => (
                <div key={comment.id} className="border p-2 rounded">
                  <p>{comment.content}</p>
                  <p className="text-xs text-gray-500 text-right">
                    {timeAgo(comment.createdAt)}
                  </p>
                  {getReplies(comment.id).map((reply) => (
                    <div key={reply.id} className="ml-4 border-l pl-2 mt-2">
                      <p>{reply.content}</p>
                      <p className="text-xs text-gray-500 text-right">
                        {timeAgo(reply.createdAt)}
                      </p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* コメント送信フォーム */}
        <div className="mt-4 pt-4 border-t relative">
          <form onSubmit={handleSubmit} className="flex items-center">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="コメントを入力..."
              className="flex-1 border rounded px-3 py-2 focus:outline-none"
              disabled={isSending}
            />
            <button
              type="submit"
              disabled={isSending || commentText.trim() === ""}
              className="ml-2 bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              送信
            </button>
          </form>
          {/* 送信中オーバーレイ */}
          {isSending && (
            <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center">
              <Lottie animationData={loadingAnimation} loop className="w-16 h-16" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
