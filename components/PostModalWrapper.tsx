"use client";

import React from "react";
import PostModal from "./PostModal";
import { useRouter } from "next/navigation";
import { PostWithComments } from "../types/post-with-comments";

interface PostModalWrapperProps {
  post: PostWithComments;
}

export default function PostModalWrapper({ post }: PostModalWrapperProps) {
  const router = useRouter();

  // onClose はクライアント側で定義し、URL を /post に戻す
  const onClose = () => {
    router.push("/post");
  };

  return <PostModal post={post} onClose={onClose} />;
}
