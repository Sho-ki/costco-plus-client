// app/components/StickyCreatePostButton.tsx
"use client";

import { useState } from "react";
import CreatePostModal from "./CreatePostModal";

interface StickyCreatePostButtonProps {
  warehouseId: number;
}

export default function StickyCreatePostButton({
  warehouseId,
}: StickyCreatePostButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      {/* stickyかつfixedで画面右下に配置 */}
      <button
        onClick={openModal}
        className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded shadow-lg z-50"
      >
        ＋投稿する
      </button>
      <CreatePostModal
        warehouseId={warehouseId}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </>
  );
}
