// @/app/(main)/(public)/posts/[id]/post-basic-info.tsx
'use client';

import { Post } from '@/features/posts/api/types';
import { SavePostButton } from '@/features/posts/components/save-post-button';
import { formatPostPrice, getFullAddress } from '@/features/posts/posts.util';
import { cn } from '@/lib/utils';
import {
    EnvironmentOutlined,
    ShareAltOutlined,
    WarningOutlined
} from '@ant-design/icons';
import { Button, Tooltip, Typography } from 'antd';
import React, { useMemo, useState } from 'react';

const { Title, Text, Paragraph } = Typography;

interface PostBasicInfoProps {
    post: Post;
    className?: string;
    style?: React.CSSProperties;
}

export function PostBasicInfo({ post, className, style }: PostBasicInfoProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    // Tính toán đơn giá/m2 nếu là tin đăng bán
    const pricePerM2 = useMemo(() => {
        if (post.type === 'SALE' && post.area > 0) {
            const value = (post.price / post.area) / 1000000;
            return `~${Number.isInteger(value) ? value : value.toFixed(1)} tr/m²`;
        }
        return null;
    }, [post]);

    return (
        <div className={cn("flex flex-col", className)} style={style}>
            {/* 1. TIÊU ĐỀ BÀI ĐĂNG */}
            <Title
                level={2}
                className="!text-xl md:!text-xl !mb-2 !font-semibold text-gray-800 leading-snug"
            >
                {post.title}
            </Title>

            {/* 2. ĐỊA CHỈ */}
            <div className="flex items-start gap-2 text-gray-500 mb-2">
                <EnvironmentOutlined className="mt-1 flex-shrink-0" />
                <span className="text-sm md:text-base font-normal">
                    {getFullAddress(post)}
                </span>
            </div>

            {/* 3. BOX GIÁ & DIỆN TÍCH + ACTION BUTTONS */}
            <div className="flex justify-between items-center py-3 border-y border-gray-100 mb-4">
                <div className="flex items-center gap-8">
                    <div className="flex flex-col">
                        <Text type="secondary" className="text-[12px] mb-1 font-medium tracking-wide">
                            Mức giá
                        </Text>
                        <div className="flex flex-col">
                            <Text className="!text-[#e03c31] text-xl md:text-2xl font-bold leading-none">
                                {formatPostPrice(post.price, post.type)}
                            </Text>
                            {pricePerM2 && (
                                <Text className="text-gray-400 text-[11px] mt-1 font-normal">
                                    {pricePerM2}
                                </Text>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col self-start">
                        <Text type="secondary" className="text-[12px] mb-1 font-medium tracking-wide">
                            Diện tích
                        </Text>
                        <Text className="text-gray-800 text-xl md:text-2xl font-bold leading-none">
                            {post.area} m²
                        </Text>
                    </div>
                </div>

                {/* CỤM NÚT CHỨC NĂNG */}
                <div className="flex items-center gap-2 md:gap-3">
                    <Tooltip title="Chia sẻ">
                        <Button
                            type="text"
                            icon={<ShareAltOutlined className="text-lg" />}
                            className="flex items-center justify-center text-gray-500 hover:!text-blue-600 hover:!bg-blue-50"
                        />
                    </Tooltip>

                    <Tooltip title="Báo cáo">
                        <Button
                            type="text"
                            icon={<WarningOutlined className="text-lg" />}
                            className="flex items-center justify-center text-gray-500 hover:!text-orange-600 hover:!bg-orange-50"
                        />
                    </Tooltip>

                    {/* NÚT LƯU TIN (ĐÃ TÍCH HỢP COMPONENT ACTIVE) */}
                    <SavePostButton
                        postId={post.id}
                        className="!w-9 !h-9" // Tùy chỉnh kích thước cho khớp với các nút xung quanh
                    />
                </div>
            </div>

            {/* 4. THÔNG TIN MÔ TẢ */}
            <div className="mb-2">
                <Title level={4} className="!text-lg font-bold !mb-4 tracking-wide">
                    Thông tin mô tả
                </Title>
                <div className="relative">
                    <Paragraph
                        className="text-gray-700 leading-relaxed whitespace-pre-wrap text-[15px] !mb-2"
                        ellipsis={!isExpanded ? { rows: 6, expandable: false } : false}
                    >
                        {post.description}
                    </Paragraph>

                    <div className="flex justify-center w-full mt-2">
                        <Button
                            type="link"
                            className="p-0 h-auto font-semibold !text-black hover:!text-blue-700 transition-colors flex items-center gap-1"
                            onClick={() => setIsExpanded(!isExpanded)}
                        >
                            {isExpanded ? "Thu gọn ▲" : "Xem thêm ▼"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}