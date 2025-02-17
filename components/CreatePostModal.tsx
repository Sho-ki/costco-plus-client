// app/components/CreatePostModal.tsx
"use client";

import { useState, useEffect } from "react";
import Modal from "react-modal";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { createPost, fetchPostTypes } from "../utils/api";


interface CreatePostModalProps {
  warehouseId: number;
  isOpen: boolean;
  onClose: () => void;
}

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
import loadingAnimation from "../public/loading.json";
import { PostType } from '../types/post-type';

Modal.setAppElement("body");

export default function CreatePostModal({
  warehouseId,
  isOpen,
  onClose,
}: CreatePostModalProps) {
  const [content, setContent] = useState("");
  const [postTypes, setPostTypes] = useState<PostType[]>([]);
  const [selectedPostTypeId, setSelectedPostTypeId] = useState<number | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  // isRefreshing: 投稿完了後のリフレッシュ中状態
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    async function loadPostTypes() {
      try {
        const res = await fetchPostTypes();
        setPostTypes(res.data);
        if (res.data && res.data.length > 0) {
          setSelectedPostTypeId(res.data[0].id);
        }
      } catch (error) {
        console.error("Failed to load post types", error);
      }
    }
    loadPostTypes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content || !selectedPostTypeId || !warehouseId) {
      alert("必須項目を入力してください");
      return;
    }
    setLoading(true);
    try {
      await createPost(warehouseId, content, selectedPostTypeId);
      // 成功時：フォームクリアし、リフレッシュ状態に切り替える
      setContent("");
      setIsRefreshing(true);
      // 少し待ってからページリフレッシュ＆モーダルを閉じる
      setTimeout(() => {
        window.location.reload();
        onClose();
      }, 1000);
    } catch (error) {
      console.error(error);
      alert("投稿に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="新規投稿"
      className="fixed inset-0 flex items-center justify-center outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      {isRefreshing ? (
        // 投稿成功後のリフレッシュ中表示
        <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg flex flex-col items-center justify-center">
          <Lottie animationData={loadingAnimation} loop className="w-32 h-32" />
          <p className="mt-4 text-blue-600 font-bold">投稿完了。更新中…</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
          <h2 className="text-xl font-bold mb-4">新規投稿</h2>
          <form onSubmit={handleSubmit}>
            {/* 投稿タイプ選択（ラジオボタン） */}
            <div className="mb-4">
              <span className="block text-gray-700 mb-1">投稿タイプ</span>
              <div className="flex flex-wrap gap-2">
                {postTypes.map((pt) => (
                  <label
                    key={pt.id}
                    className="flex items-center cursor-pointer rounded border border-gray-200 px-3 py-1 hover:border-blue-500 transition-colors"
                  >
                    <input
                      type="radio"
                      name="postType"
                      value={pt.id}
                      checked={selectedPostTypeId === pt.id}
                      onChange={() => setSelectedPostTypeId(pt.id)}
                      className="form-radio h-5 w-5 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700 font-medium">
                      {pt.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            {/* 投稿内容 */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-1" htmlFor="content">
                内容
              </label>
              <textarea
                id="content"
                className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                required
              />
            </div>
            {/* ボタン */}
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded hover:bg-gray-100"
                disabled={loading}
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? "投稿中..." : "投稿"}
              </button>
            </div>
          </form>
        </div>
      )}
    </Modal>
  );
}
