// app/post/page.tsx
import Head from "next/head";
import { cookies } from "next/headers";
import { fetchPostById, fetchPosts, fetchWarehouses } from "../../utils/api";
import PostListClient from '../../components/PostListClient';

export async function generateMetadata() {
  return {
    title: "在庫状況・質問 - コストコプラス＋",
    description:
      "ユーザー投稿に基づく最新の在庫状況や質問をリアルタイムにチェックできます。",
  };
}

interface PageProps {
  searchParams:Promise< {
    postId?: string;
    slug?: string;
  }>;
}

export default async function PostPage({ searchParams }: PageProps) {
  const { postId } = await searchParams;
  // 初期の warehouseId を cookies から取得（なければ適当なデフォルト値）
  const { data: warehouses } = await fetchWarehouses();
  const cookieStore = cookies();
  const warehouseIdCookie = (await cookieStore).get("warehouseId");
  let initialWarehouseId: number = warehouses?.[0]?.id ?? null;

  if (warehouseIdCookie?.value) {
    const parsed = parseInt(warehouseIdCookie.value, 10);
    if (!isNaN(parsed)) {
      initialWarehouseId = parsed;
    }
  } 

  // SSRで初回ページ（page=1, size=10）の投稿一覧を取得
  const postsResponse = await fetchPosts(initialWarehouseId, {
    page: 1,
    size: 10,
    sortField: "createdAt",
    order: "desc",
    typeFilter: "all",
  });

  let initialSelectedPostDetail = null;
  if (postId) {
    const numberPostId = parseInt(postId, 10);
    if (!isNaN(numberPostId)) {
      initialSelectedPostDetail = (await fetchPostById(numberPostId)).data;
    }
  }

  return (
    <>
      {/* Although the global layout already renders a <Head> with global metadata,
          you can add route-specific meta here if needed */}
      <Head>
        <title>在庫状況・質問 - コストコプラス＋</title>
        <meta
          name="description"
          content="ユーザー投稿に基づく最新の在庫状況や質問をリアルタイムにチェックできます。"
        />
      </Head>
      <h1 className="text-3xl font-bold mb-4 ml-1">みんなの在庫速報・質問</h1>
      <div className="text-sm leading-6 ml-1">
        <p>匿名で商品の在庫状況や質問、感想を投稿できます。</p>
        <p>ご自身の倉庫店を選択してからご利用ください。</p>
      </div>
      <PostListClient
        warehouseId={initialWarehouseId}
        initialPosts={postsResponse.data}
        initialPagination={{
          totalCount: postsResponse.meta.totalCount,
          page: postsResponse.meta.page,
          size: postsResponse.meta.size,
        }}
        initialSelectedPostDetail={initialSelectedPostDetail}
      />
      <div className="mt-2 text-sm leading-6 ml-1">
        <p>注意事項：</p>
        <ul className="list-disc list-inside">
          <li>誹謗中傷や公序良俗に反する内容の投稿、個人情報や特定の個人を特定できる情報の記載は禁止です。</li>
          <li>投稿内容に関する問題が発生した場合、管理者は投稿内容を削除することがあります。</li>
        </ul>
      </div>
    </>
  );
  
}
