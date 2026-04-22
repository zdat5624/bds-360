// @/features/posts/components/related-posts.tsx
'use client';

import { useGetRelatedPosts } from '@/features/posts/api/posts.queries';
import { Post } from '@/features/posts/api/types';
import { cn } from '@/lib/utils';
import { Skeleton, Typography } from 'antd';
import { useEffect, useMemo } from 'react';
import { ListingCard } from './listing-card';

const { Title } = Typography;

interface RelatedPostsProps {
    currentPost: Post;
    className?: string;
    onDataLoaded?: (ids: number[]) => void;
}

export function RelatedPosts({ currentPost, className, onDataLoaded }: RelatedPostsProps) {
    const { data, isLoading } = useGetRelatedPosts(currentPost.id, { size: 4 });

    const sortedPosts = useMemo(() => {
        const posts = data?.content || [];
        return [...posts].sort((a, b) => (b.vip?.vipLevel ?? 0) - (a.vip?.vipLevel ?? 0));
    }, [data?.content]);

    useEffect(() => {
        if (sortedPosts.length > 0 && onDataLoaded) {
            onDataLoaded(sortedPosts.map(p => p.id));
        }
    }, [sortedPosts, onDataLoaded]);

    if (!isLoading && sortedPosts.length === 0) return null;

    return (
        <div className={cn("flex flex-col gap-4", className)}>
            <Title level={4} className="!m-0 !text-xl font-bold text-gray-800 tracking-tight">
                Bất động sản tương tự
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
                    sortedPosts.map((post) => (
                        <ListingCard key={post.id} post={post} />
                    ))
                )}
            </div>
        </div>
    );
}