'use client';

import { VIP_COLOR_MAP, VIP_TAG_COLOR_MAP } from '@/constants/vip-packages.constant'; // Đảm bảo đúng đường dẫn
import { Post } from '@/features/posts/api/types';
import { formatDate } from '@/utils';
import {
    CalendarOutlined,
    IdcardOutlined,
    TagOutlined
} from '@ant-design/icons';
import { Tag, Typography } from 'antd';
import React from 'react';

const { Text } = Typography;

interface PostMetaProps {
    post: Post;
    className?: string;
    style?: React.CSSProperties;
}

export function PostMeta({ post, className, style }: PostMetaProps) {
    // Logic lấy màu sắc từ Map dựa trên vipId
    const vipColor = post.vip ? VIP_COLOR_MAP[post.vip.id] : '#8c8c8c';
    const tagPresetColor = post.vip ? VIP_TAG_COLOR_MAP[post.vip.id] : 'default';
    return (
        <div className={className} style={style}>
            <div className="grid border-y border-gray-100 grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4 py-4">
                <PostMetaItem
                    icon={<CalendarOutlined />}
                    label="Ngày đăng"
                    value={formatDate(post.createdAt)}
                />
                <PostMetaItem
                    icon={<CalendarOutlined />}
                    label="Ngày hết hạn"
                    value={post.expireDate ? formatDate(post.expireDate) : 'Không xác định'}
                />
                <PostMetaItem
                    icon={<TagOutlined />}
                    label="Gói tin"
                    value={
                        <Tag
                            color={tagPresetColor}
                            variant="filled" // 🌟 QUAN TRỌNG: Dùng cái này để màu hiện đặc, chữ trắng rõ nét
                            className="m-0 border-none font-bold text-[11px] px-2 leading-5 uppercase rounded-sm"
                        >
                            {post.vip?.name || 'Tin thường'}
                        </Tag>
                    }
                />
                <PostMetaItem
                    icon={<IdcardOutlined />}
                    label="Mã tin"
                    value={<span className="text-gray-700 font-bold">{post.id}</span>}
                />
            </div>
        </div>
    );
}

// Cập nhật value sang kiểu React.ReactNode để nhận Tag
function PostMetaItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-1.5">
            <span className="text-[12px] flex items-center gap-1.5 text-gray-400 font-medium">
                {icon} {label}
            </span>
            <div className="text-[14px]">
                {/* Nếu value là string thì bọc Text strong, nếu là Node thì render trực tiếp */}
                {typeof value === 'string' ? (
                    <Text strong className="text-gray-700">{value}</Text>
                ) : (
                    value
                )}
            </div>
        </div>
    );
}