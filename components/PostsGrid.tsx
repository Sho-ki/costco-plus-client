"use client";

import React from "react";
import { PostWithCount } from "../types/post-with-count";
import { ReactionButtons } from './ReactionButtons';

/**
 * PostsGrid コンポーネント
 * - 各投稿をグリッド形式のカードとして表示。
 * - 上部に投稿内容（120文字を超える場合は"..."で切り詰め）。
 * - 中段に ReactionButtons（ユーザーがいつでも反応できる状態）。
 * - 下部に返信エリアを表示。
 */
interface PostsGridProps {
  posts: PostWithCount[];
  onClickPost?: (post: PostWithCount) => void;
}

export default function PostsGrid({ posts, onClickPost }: PostsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {posts.map((post) => {
        const truncatedContent =
          post.content.length > 40
            ? post.content.slice(0, 40) + "..."
            : post.content;

        return (
            <div
                key={post.id}
                className="bg-white rounded-lg shadow-md cursor-pointer hover:shadow-lg transition flex flex-col w-full h-48 sm:h-40"
                onClick={() => onClickPost?.(post)}
                >
                {/* 上部のテキストエリア（残りのスペースを使用） */}
                <div className="p-4 flex-1 overflow-hidden content-center">
                    <h3 className="text-xs sm:text-sm font-medium text-gray-900 overflow-hidden text-ellipsis leading-tight">
                    {truncatedContent}
                    </h3>
                </div>
                {/* ReactionButtons（高さを固定） */}
                <div className="w-full px-4 h-14 flex justify-center items-center">
                    <div className="w-full sm:max-w-[300px]">
                    <ReactionButtons post={post} />
                    </div>
                </div>
                {/* 下部の返信エリア（高さを固定） */}
                <div className="bg-gray-800 flex items-center justify-between px-4 rounded-b-lg h-10">
                    <div className="text-xs sm:text-sm text-white font-medium">返信 ({post.commentCounts})</div>
                    <div className="text-white">›</div>
                </div>
            </div>
        );
      })}
    </div>
  );
}
