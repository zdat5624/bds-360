'use client';

import { useGetDistricts } from '@/features/addresses/api/addresses.queries';
import { useGetPosts } from '@/features/posts/api/posts.queries';
import { Post } from '@/features/posts/api/types';
import { usePostFilterUrl } from '@/features/posts/hooks/use-post-filter-url';
import { cn } from '@/lib/utils';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import { useState } from 'react';

const { Title } = Typography;

interface DistrictItemProps {
    district: { code: number; name: string };
    post: Post;
    onClick: (code: number) => void;
}

function DistrictItem({ district, post, onClick }: DistrictItemProps) {
    const { data } = useGetPosts('public', {
        type: post.type,
        categoryId: post.category.id,
        districtCode: district.code,
        size: 1,
        page: 0
    });

    const total = data?.totalElements ?? 0;

    return (
        <div>
            <button
                onClick={() => onClick(district.code)}
                className="w-full text-[14px] text-[#2c2c2c]  hover:text-blue-400 transition-colors flex items-center text-left"
            >
                <span className="line-clamp-1">{district.name}</span>
                <span className="text-[#777] ml-1 flex-shrink-0">
                    ({total})
                </span>
            </button>
        </div>
    );
}

interface NearbyLocationsSidebarProps {
    post: Post;
    className?: string;
}

export function NearbyLocationsSidebar({ post, className }: NearbyLocationsSidebarProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const { updateUrl } = usePostFilterUrl(post.type);

    const { data: districts, isLoading } = useGetDistricts(post.provinceCode);

    if (isLoading || !districts || districts.length === 0) return null;

    const displayDistricts = isExpanded ? districts : districts.slice(0, 10);
    const hasMore = districts.length > 10;

    const handleDistrictClick = (districtCode: number) => {
        updateUrl({
            type: post.type,
            categoryId: post.category.id,
            provinceCode: post.provinceCode,
            districtCode: districtCode,
            wardCode: undefined
        });
    };

    return (
        <div className={cn("bg-[#f2f2f2] p-5 rounded-lg border-none", className)}>
            <Title level={5} className="!mb-5 !text-[15px] font-bold text-[#2c2c2c] !mt-0">
                {post.category.name} tại {post.provinceName}
            </Title>

            <div className="flex flex-col gap-3.5">
                {displayDistricts.map((district) => (
                    <DistrictItem
                        key={district.code}
                        district={district}
                        post={post}
                        onClick={handleDistrictClick}
                    />
                ))}
            </div>

            {hasMore && (
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="mt-4 w-full text-[14px] font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1.5"
                >
                    <span>{isExpanded ? 'Thu gọn' : 'Xem thêm'}</span>
                    {isExpanded ? <UpOutlined className="font-bold text-[12px]" /> : <DownOutlined className="text-[12px]" />}
                </button>
            )}
        </div>
    );
}