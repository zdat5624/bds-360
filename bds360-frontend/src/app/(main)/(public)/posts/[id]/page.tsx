// @/app/(main)/(public)/posts/[id]/page.tsx
'use client';

import { Breadcrumb, Result, Skeleton, Typography } from 'antd';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useIncrementPostView } from '@/features/posts/api/posts.mutations';
import { useGetPostById } from '@/features/posts/api/posts.queries';
import { ForYouPosts } from '@/features/posts/components/for-you-posts';
import { PropertyMap } from '@/features/posts/components/property-map';
import { RelatedPosts } from '@/features/posts/components/related-posts';
import { NearbyLocationsSidebar } from './nearby-locations-sidebar';
import { PostAnalytics } from './post-analytics';
import { PostBasicInfo } from './post-basic-info';
import { PostCharacteristics } from './post-characteristics';
import { PostGallery } from './post-gallery';
import { PostMeta } from './post-meta';
import { PostSellerSidebar } from './post-seller-sidebar';

const { Title } = Typography;

export default function PublicPostDetailPage() {
    const params = useParams();
    const postId = Number(params.id);

    const { data: post, isLoading, isError } = useGetPostById(postId);
    const [relatedPostIds, setRelatedPostIds] = useState<number[]>([]);

    // Khởi tạo mutation
    const incrementViewMutation = useIncrementPostView();

    // Chạy ngầm API tăng view khi bài đăng được tải xuống thành công
    useEffect(() => {
        if (post?.id) {
            incrementViewMutation.mutate(post.id, {
                onError: (error) => {
                    console.error("Lỗi khi ghi nhận lượt xem:", error);
                }
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [post?.id]);

    if (isLoading) return <DetailSkeleton />;
    if (isError || !post) return <Result status="404" title="404" subTitle="Bài đăng không tồn tại." />;

    return (
        <div className="bg-white min-h-screen pb-10 font-sans">
            <div className="max-w-[960px] mx-auto px-4 py-2 md:py-4">
                <Breadcrumb
                    separator="/"
                    className="mb-3 overflow-hidden whitespace-nowrap text-ellipsis"
                    items={[
                        {
                            title: <Link href="/">Trang chủ</Link>,
                        },
                        {
                            title: (
                                <Link href={post.type === 'SALE' ? '/sale' : '/rent'}>
                                    {post.type === 'SALE' ? 'Mua bán' : 'Cho thuê'}
                                </Link>
                            ),
                        },
                        {
                            title: post.category.name,
                        },
                    ]}
                />

                <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
                    <div className="flex-1 min-w-0">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-2">
                            <PostGallery post={post} />
                            <PostBasicInfo post={post} />
                            <PostCharacteristics post={post} />

                            <div className="py-2">
                                <Title level={4} className="!text-lg font-bold !mb-4 tracking-wide">
                                    Xem trên bản đồ
                                </Title>
                                <div className="h-[250px] md:h-[350px] w-full rounded-md overflow-hidden bg-gray-50 border border-gray-100">
                                    <PropertyMap latitude={post.latitude ?? 0} longitude={post.longitude ?? 0} />
                                </div>
                            </div>

                            <PostMeta post={post} />
                            <PostAnalytics post={post} />
                        </motion.div>
                    </div>

                    <aside className="w-full lg:w-[290px] flex flex-col gap-4">
                        <PostSellerSidebar postId={post.id} user={post.user} />
                        <NearbyLocationsSidebar post={post} />
                    </aside>
                </div>

                <div className="mt-10 flex flex-col gap-10 border-t border-gray-100 pt-10">
                    <RelatedPosts
                        currentPost={post}
                        onDataLoaded={setRelatedPostIds}
                    />
                    <ForYouPosts
                        currentPost={post}
                        excludePostIds={relatedPostIds}
                    />
                </div>
            </div>
        </div>
    );
}

function DetailSkeleton() {
    return <div className="max-w-[1140px] mx-auto px-4 py-12"><Skeleton active avatar paragraph={{ rows: 12 }} /></div>;
}