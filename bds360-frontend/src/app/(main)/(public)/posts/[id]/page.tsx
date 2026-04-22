// @/app/(main)/(public)/posts/[id]/page.tsx
'use client';

import { Breadcrumb, Result, Skeleton, Typography } from 'antd';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import { useGetPostById, useGetPosts } from '@/features/posts/api/posts.queries';
import { PropertyMap } from '@/features/posts/components/property-map';
import { PostAnalytics } from './post-analytics';
import { PostBasicInfo } from './post-basic-info';
import { PostCharacteristics } from './post-characteristics'; // Import mới
import { PostGallery } from './post-gallery';
import { PostMeta } from './post-meta'; // Import mới
import { PostSellerSidebar } from './post-seller-sidebar';
import { RelatedPostsSidebar } from './related-posts-sidebar';

const { Title } = Typography;

export default function PublicPostDetailPage() {
    const params = useParams();
    const postId = Number(params.id);

    const { data: post, isLoading, isError } = useGetPostById(postId);
    const { data: relatedData, isLoading: isLoadingRelated } = useGetPosts('public', {
        categoryId: post?.category?.id as number,
        size: 5,
        page: 0
    });

    if (isLoading) return <DetailSkeleton />;
    if (isError || !post) return <Result status="404" title="404" subTitle="Bài đăng không tồn tại." />;

    return (
        <div className="bg-white min-h-screen pb-12 font-sans">
            <div className="max-w-[1000px] mx-auto px-4 py-4">

                <Breadcrumb separator="/" className="mb-3 text-[13px] text-gray-500">
                    <Breadcrumb.Item><Link href="/">Trang chủ</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <Link href={post.type === 'SALE' ? '/sale' : '/rent'}>
                            {post.type === 'SALE' ? 'Mua bán' : 'Cho thuê'}
                        </Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item className="text-gray-400">{post.category.name}</Breadcrumb.Item>
                </Breadcrumb>

                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-1 min-w-0">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <PostGallery post={post} />

                            <PostBasicInfo post={post} />


                            <PostCharacteristics post={post} />

                            <div className="py-4">
                                <Title level={4} className="!text-lg font-bold !mb-4  tracking-wide">
                                    Xem trên bản đồ
                                </Title>
                                <div className="h-[350px] w-full rounded-md overflow-hidden bg-gray-50 border border-gray-100">
                                    <PropertyMap latitude={post.latitude ?? 0} longitude={post.longitude ?? 0} />
                                </div>
                            </div>

                            {/* Component Thông số tin đăng nằm dưới bản đồ */}
                            <PostMeta post={post} />

                            <PostAnalytics className='!mt-4' post={post} />

                        </motion.div>
                    </div>

                    <div className="lg:w-[320px] flex flex-col gap-6">
                        <PostSellerSidebar user={post.user} />

                        <RelatedPostsSidebar
                            posts={relatedData?.content || []}
                            isLoading={isLoadingRelated}
                            currentPostId={postId}
                        />
                    </div>
                </div>
            </div>
            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
}

function DetailSkeleton() {
    return <div className="max-w-[1000px] mx-auto px-4 py-12"><Skeleton active avatar paragraph={{ rows: 12 }} /></div>;
}