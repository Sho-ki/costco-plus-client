// app/components/PostCard.tsx
"use client";

import React from "react";
import { PostWithCount } from "../types/post-with-count";

interface PostCardProps {
  post: PostWithCount;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <div className="p-4 bg-white rounded shadow hover:shadow-lg transition duration-200">
      <h2 className="text-xl font-semibold mb-2">
        {post.content.length > 50
          ? post.content.slice(0, 50) + "..."
          : post.content}
      </h2>
      <div className="flex space-x-2">
        {post.reactions.map((reaction) => (
          <div key={reaction.id} className="flex items-center space-x-1">
            <span style={{ color: reaction.color }}>{reaction.name}</span>
            <span>{reaction.count}</span>
          </div>
        ))}
      </div>
      <p className="mt-2 text-sm text-gray-500">
        コメント数: {post.commentCounts}
      </p>
    </div>
  );
}
