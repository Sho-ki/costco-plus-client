// app/components/CreatePostModal.tsx
"use client";

import { useState, useEffect } from "react";
import Modal from "react-modal";
import { useRouter } from "next/navigation";
import { createPost, fetchPostTypes } from '../utils/api';

// 型定義（例）
export interface PostType {
  id: number;
  name: string;
}

interface CreatePostModalProps {
  warehouseId: number;
  isOpen: boolean;
  onClose: () => void;
}

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
  const router = useRouter();

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
       await createPost(
          warehouseId,
          content,
           selectedPostTypeId,
      );
      // 成功したらフォームをクリアしモーダルを閉じ、ページを再レンダリング
      setContent("");
      onClose();
      router.refresh();
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
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">新規投稿</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1" htmlFor="content">
              内容
            </label>
            <textarea
              id="content"
              className="w-full border border-gray-300 p-2 rounded"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1" htmlFor="postType">
              投稿タイプ
            </label>
            <select
              id="postType"
              className="w-full border border-gray-300 p-2 rounded"
              value={selectedPostTypeId ?? ""}
              onChange={(e) =>
                setSelectedPostTypeId(parseInt(e.target.value, 10))
              }
              required
            >
              {postTypes.map((pt) => (
                <option key={pt.id} value={pt.id}>
                  {pt.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
              disabled={loading}
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
              disabled={loading}
            >
              {loading ? "投稿中..." : "投稿"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
