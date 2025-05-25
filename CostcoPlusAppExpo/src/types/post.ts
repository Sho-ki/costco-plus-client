export interface Post {
  id: number;
  content: string;
  warehouseId: number;
  postTypeId: number;
  createdAt: string;
  updatedAt: string;
}

export interface PostType {
  id: number;
  name: string;
  description?: string;
}

export interface PostComment {
  id: number;
  postId: number;
  comment: string;
  createdAt: string;
}

export interface PostWithComments extends Post {
  comments: PostComment[];
  postType: PostType;
}

export interface PostWithCount extends Post {
  commentCount: number;
  reactionCount: number;
  postType: PostType;
}

export interface PostReactionType {
  id: number;
  name: string;
  emoji: string;
}

export interface PostReactionRecord {
  id: number;
  postId: number;
  postReactionTypeId: number;
  createdAt: string;
}
