"use client";

import React from "react";
import { X } from "lucide-react";
import { PostWithComments } from "../types/post-with-comments";

interface PostModalProps {
  post: PostWithComments;
  onClose: () => void;
}

export default function PostModal({ post, onClose }: PostModalProps) {
  // post.comments が存在しない場合に備え、空配列を使用
  const comments = post.comments || [];
  const topLevelComments = comments.filter((c) => c.parentId === null);
  const getReplies = (parentId: number) =>
    comments.filter((c) => c.parentId === parentId);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4">
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold mb-4">{post.content}</h2>
        <section>
          <h3 className="text-xl font-semibold mb-2">コメント</h3>
          {topLevelComments.length === 0 ? (
            <p className="text-gray-500">コメントはありません</p>
          ) : (
            <div className="space-y-4">
              {topLevelComments.map((comment) => (
                <div key={comment.id} className="border p-2 rounded">
                  <p>{comment.content}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(comment.createdAt).toLocaleString()}
                  </p>
                  {getReplies(comment.id).map((reply) => (
                    <div key={reply.id} className="ml-4 border-l pl-2 mt-2">
                      <p>{reply.content}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(reply.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
