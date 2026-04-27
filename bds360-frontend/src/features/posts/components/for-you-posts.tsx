// @/features/posts/components/for-you-posts.tsx
'use client';

import { useGetForYouPosts } from '@/features/posts/api/posts.queries';
import { ForYouPostParams, Post } from '@/features/posts/api/types';
import { cn } from '@/lib/utils';
import { Skeleton, Typography } from 'antd';
import { useMemo } from 'react';
import { ListingCard } from './listing-card';

const { Title } = Typography;

interface ForYouPostsProps {
    type?: 'SALE' | 'RENT';
    currentPost?: Post;
    className?: string;
    title?: string;
    excludePostIds?: number[];
}

export function ForYouPosts({
    type,
    currentPost,
    className,
    title = "Bất động sản dành cho bạn",
    excludePostIds = []
}: ForYouPostsProps) {

    const queryParams = useMemo((): ForYouPostParams => {
        const excludes = new Set<number>(excludePostIds);

        // Khởi tạo object với type chuẩn
        const params: ForYouPostParams = {
            size: 4
        };

        if (type) {
            params.type = type;
        }

        if (currentPost) {
            params.type = currentPost.type;
            excludes.add(currentPost.id);
        }

        if (excludes.size > 0) {
            // Chuyển Set thành chuỗi "id1,id2,id3" đúng với kiểu string trong interface
            params.excludeIds = Array.from(excludes).join(',');
        }

        return params;
    }, [type, currentPost, excludePostIds]);

    const { data, isLoading } = useGetForYouPosts(queryParams);

    const posts = data?.content || [];

    if (!isLoading && posts.length === 0) return null;

    return (
        <div className={cn("flex flex-col gap-4", className)}>
            <Title level={4} className="!m-0 !text-xl font-bold text-gray-800 tracking-tight">
                {title}
            </Title>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {isLoading ? (
                    Array.from({ length: 4 }).map((_, idx) => (
                        <div key={idx} className="border border-gray-100 rounded-lg p-4 bg-white shadow-sm h-[320px]">
                            <Skeleton.Image active className="!w-full !h-40 mb-4 rounded-md" />
                            <Skeleton active paragraph={{ rows: 2 }} title={{ width: '80%' }} />
                        </div>
                    ))
                ) : (
                    posts.map((post) => (
                        <ListingCard key={post.id} post={post} />
                    ))
                )}
            </div>
        </div>
    );
}