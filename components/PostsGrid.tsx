"use client";

import React, { useMemo } from "react";
import { PostWithCount } from "../types/post-with-count";
import { ReactionButtons } from "./ReactionButtons";
import { timeAgo } from "../utils/timeAgo";
import { HelpCircle, MessageCircleQuestion, MessageSquareTextIcon } from "lucide-react";
import GoogleAdsense from "./GoogleAdsense";
import { IN_FEED_SLOTS } from '../lib/inFeedSlots';

const AD_INTERVAL: number = 8;

interface PostsGridProps {
  posts: PostWithCount[];
  onClickPost?: (post: PostWithCount) => void;
}

const getIconForCommentType = (value: string): JSX.Element => {
  switch (value) {
    case "question":
      return <MessageCircleQuestion className="w-5 h-5" />;
    case "comment":
      return <MessageSquareTextIcon className="w-5 h-5" />;
    default:
      return <HelpCircle className="w-5 h-5" />;
  }
};

const getColorForCommentType = (value: string): string => {
  switch (value) {
    case "question":
      return "bg-pink-400";
    case "comment":
      return "bg-blue-400";
    default:
      return "bg-gray-400";
  }
};

const PostsGrid: React.FC<PostsGridProps> = ({ posts, onClickPost }) => {
  const postsWithAds = useMemo((): JSX.Element[] => {
    const items: JSX.Element[] = [];

    posts.forEach((post, index) => {
      items.push(
        <div
          key={`post_${post.id}`}
          className="bg-white rounded-lg shadow-md cursor-pointer hover:shadow-lg transition flex flex-col w-full h-52 sm:h-48"
          onClick={() => onClickPost?.(post)}
        >
          <div
            className={`w-8 h-5 rounded-bl-lg flex justify-center items-center relative top-0 right-0 ml-auto ${getColorForCommentType(
              post.postType.value
            )}`}
          >
            <span className="text-white text-xs sm:text-sm font-medium">
              {getIconForCommentType(post.postType.value)}
            </span>
          </div>

          {/* Post content */}
          <div className="p-4 flex-1 overflow-hidden">
            <h3 className="text-md sm:text-md font-medium text-gray-900 leading-tight line-clamp-2 overflow-hidden break-words">
              {post.content}
            </h3>
          </div>

          <div className="w-full px-4 h-14 flex justify-center items-center">
            <div className="w-full sm:max-w-[300px]">
              <ReactionButtons post={post} />
            </div>
          </div>
          <p className="h-3 text-[8px] sm:text-[10px] text-gray-600 text-right pr-4 mb-2">
            {timeAgo(post.createdAt)}
          </p>
          {/* Reply area */}
          <div className="bg-gray-800 flex items-center justify-between px-4 rounded-b-lg h-10">
            <div className="text-xs sm:text-sm text-white font-medium">
              返信 ({post.commentCounts})
            </div>
            <div className="text-white">›</div>
          </div>
        </div>
      );

      // Insert ad after every AD_INTERVAL posts
      if ((index + 1) % AD_INTERVAL === 0) {
        const adSlot = IN_FEED_SLOTS[(index + 1) / AD_INTERVAL - 1];
        items.push(
          <div
            key={`ad_${index}`}
            className="col-span-2 md:col-span-2 lg:col-span-3"
          >
            {adSlot && (
              <GoogleAdsense
                type="fluid"
                slotId={adSlot.dataAdSlot}
                dataLayoutKey={adSlot.dataLayoutKey}
              />
            )}
          </div>
        );
      }
    });
    return items;
  }, [posts, onClickPost]);

  return <div className="grid grid-cols-2 gap-4 p-4">{postsWithAds}</div>;
};

export default PostsGrid;
