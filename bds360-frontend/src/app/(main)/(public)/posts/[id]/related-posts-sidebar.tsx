// @/app/(main)/(public)/posts/[id]/related-posts-sidebar.tsx
'use client';

import { Post } from '@/features/posts/api/types';
import { formatPostPrice } from '@/features/posts/posts.util';
import { List, Typography } from 'antd';
import Link from 'next/link';
import React from 'react';

const { Title, Text } = Typography;

// --- Sub-component: Item ---
const RelatedPostItem: React.FC<{ item: Post }> = ({ item }) => {
    return (
        <Link href={`/posts/${item.id}`} className="flex gap-3 mb-4 group last:mb-0">
            <div className="w-16 h-14 rounded-sm overflow-hidden flex-shrink-0 bg-gray-100">
                <img
                    src={item.images[0]?.url || ''}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    alt={item.title}
                />
            </div>
            <div className="min-w-0 flex-1">
                <h4 className="text-xs font-semibold text-gray-700 line-clamp-2 leading-tight mb-1 group-hover:text-blue-600 transition-colors">
                    {item.title}
                </h4>
                <Text className="text-[#e03c31] font-bold text-[11px] block">
                    {formatPostPrice(item.price, item.type)}
                </Text>
            </div>
        </Link>
    );
};

// --- Main-component: Sidebar List ---
interface RelatedPostsSidebarProps {
    posts: Post[];
    isLoading: boolean;
    currentPostId: number;
}

export const RelatedPostsSidebar: React.FC<RelatedPostsSidebarProps> = ({
    posts,
    isLoading,
    currentPostId
}) => {
    // Logic lọc bài viết hiện tại và lấy 5 tin đầu tiên
    const displayPosts = posts
        ?.filter((p) => p.id !== currentPostId)
        .slice(0, 5) || [];

    return (
        <div className="bg-white p-4 rounded-md border border-gray-100">
            <Title level={5} className="!mb-4 !text-sm uppercase tracking-wide text-gray-400">
                Tin cùng chuyên mục
            </Title>
            <List
                loading={isLoading}
                dataSource={displayPosts}
                renderItem={(item) => <RelatedPostItem item={item} />}
                locale={{ emptyText: 'Không có tin liên quan' }}
            />
        </div>
    );
};