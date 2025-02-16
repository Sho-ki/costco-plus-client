"use client";

import { useState, useCallback, useEffect } from "react";
import { fetchPosts, fetchPostById } from "../utils/api";
import PostsGrid from "./PostsGrid";
import { slugify } from "../utils/slugify";
import PostModal from "./PostModal";

interface PostListClientProps {
  warehouseId: number;
  initialPosts: any[]; // adjust with your PostWithCount type
  initialPagination: {
    totalCount: number;
    page: number;
    size: number;
  };
  initialSelectedPostDetail: any | null; // adjust with your PostWithComments type
}

export default function PostListClient({
  warehouseId,
  initialPosts,
  initialPagination,
  initialSelectedPostDetail,
}: PostListClientProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [pagination, setPagination] = useState(initialPagination);
  const [loadingMore, setLoadingMore] = useState(false);

  const [selectedPostDetail, setSelectedPostDetail] = useState(initialSelectedPostDetail);
  const [selectedPostId, setSelectedPostId] = useState(
    initialSelectedPostDetail ? initialSelectedPostDetail.id : null
  );
  const [isModalOpen, setIsModalOpen] = useState(!!initialSelectedPostDetail);

  // Load more posts when scrolling near bottom
  const loadMore = useCallback(async () => {
    if (loadingMore || posts.length >= pagination.totalCount) return;
    setLoadingMore(true);
    try {
      const nextPage = pagination.page + 1;
      const response = await fetchPosts(warehouseId, {
        page: nextPage,
        size: pagination.size,
        sortField: "createdAt",
        sortOrder: "desc",
        typeFilter: "all",
      });
      setPosts((prev) => [...prev, ...response.data]);
      setPagination(response.meta);
    } catch (error) {
      console.error("Error loading more posts:", error);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, posts, pagination, warehouseId]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight * 0.8) {
        loadMore();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadMore]);

  // Listen for back/forward navigation to close the modal if needed
  useEffect(() => {
    const onPopState = () => {
      const searchParams = new URLSearchParams(window.location.search);
      if (!searchParams.get("postId")) {
        // If there is no postId in the URL, close the modal.
        closeModal(false);
      }
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const handleClickPost = (post: any) => {
    const slugPart = slugify(post.content.slice(0, 50));
    // Update URL without triggering a full re-render.
    window.history.pushState({}, "", `/post?postId=${post.id}&slug=${slugPart}`);
    setSelectedPostId(post.id);
    setIsModalOpen(true);

    // If the same post is already loaded, do nothing.
    if (selectedPostId === post.id && selectedPostDetail) return;

    fetchPostById(post.id)
      .then((detail) => {
        setSelectedPostDetail(detail.data);
      })
      .catch((error) => {
        console.error("Error fetching post detail:", error);
      });
  };

  const closeModal = (updateURL = true) => {
    setIsModalOpen(false);
    setSelectedPostDetail(null);
    setSelectedPostId(null);
    if (updateURL) {
      window.history.pushState({}, "", `/post`);
    }
  };

  return (
    <div>
      <PostsGrid posts={posts} onClickPost={handleClickPost} />
      {loadingMore && <p className="text-center mt-4 text-gray-700">Loading...</p>}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          {selectedPostDetail ? (
            <PostModal post={selectedPostDetail} onClose={closeModal} />
          ) : (
            <div className="bg-white p-6 rounded shadow-lg max-w-3xl w-full">
              <p>データを取得中...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
