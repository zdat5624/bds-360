// @/features/posts/components/listing-card.tsx
'use client';

import { VIP_TAG_COLOR_MAP } from '@/constants/vip-packages.constant';
import { Post } from '@/features/posts/api/types';
import { formatPostPrice, getShortAddress } from '@/features/posts/posts.util';
import { cn } from '@/lib/utils';
import { DATE_FORMAT, getSmartRelativeTime } from '@/utils/date.util';
import { EnvironmentOutlined } from '@ant-design/icons';
import { Card, Tag, Typography } from 'antd';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { SavePostButton } from './save-post-button';

const { Paragraph } = Typography;

interface ListingCardProps {
    post: Post;
    className?: string;
}

const cardVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.02, y: -4 },
};

export function ListingCard({ post, className }: ListingCardProps) {
    const tagColor = post.vip?.id ? VIP_TAG_COLOR_MAP[post.vip.id] : 'default';
    const isVip = (post.vip?.vipLevel ?? 0) > 0;

    const thumbnailUrl = post.images && post.images.length > 0
        ? post.images[0].url
        : 'https://via.placeholder.com/300x200';

    return (
        <Link href={`/posts/${post.id}`}>
            <motion.div
                variants={cardVariants}
                initial="initial"
                whileHover="hover"
                transition={{ duration: 0.3 }}
                className={className}
            >
                <Card
                    className={cn(
                        "rounded-lg overflow-hidden h-full cursor-pointer bg-white",
                        "!border-0 shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.05)]"
                    )}
                    styles={{ body: { padding: '16px 8px' } }}
                    cover={
                        <div className="relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                alt={post.title}
                                src={thumbnailUrl}
                                className="w-full h-40 object-cover"
                            />

                            {isVip && (
                                <Tag
                                    color={tagColor}
                                    style={{
                                        position: 'absolute',
                                        top: 8,
                                        left: 8,
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        fontSize: '12px',
                                        fontWeight: 'bold',
                                        zIndex: 10,
                                        border: 'none',
                                    }}
                                >
                                    {post.vip.name}
                                </Tag>
                            )}
                        </div>
                    }
                >
                    <div className="flex flex-col justify-between h-auto min-h-[120px]">
                        <div>
                            {/* Tiêu đề tin */}
                            <Paragraph
                                ellipsis={{ rows: 2 }}
                                className={cn(
                                    "text-gray-800 font-semibold text-sm !m-0 !mb-1.5 leading-[1.3]"
                                )}
                            >
                                {post.title}
                            </Paragraph>

                            {/* Giá & Diện tích */}
                            <div className="flex items-center mb-1.5">
                                <span className="text-red-500 font-semibold whitespace-nowrap">
                                    {formatPostPrice(post.price, post.type)}
                                </span>
                                <span className="text-gray-600  ml-2 whitespace-nowrap">
                                    • {post.area} m²
                                </span>
                            </div>

                            {/* Địa chỉ */}
                            <div className="text-gray-600 flex items-start mb-2">
                                <EnvironmentOutlined className="mr-1.5 mt-0.5 text-gray-400 " />
                                <span className="leading-[1.2] line-clamp-1">
                                    {getShortAddress(post)}
                                </span>
                            </div>
                        </div>

                        {/* Hàng dưới cùng: Ngày đăng & Nút lưu */}
                        <div className="flex justify-between items-center mt-1">
                            <div className="text-gray-400 text-[11px]">
                                {getSmartRelativeTime(post.createdAt, DATE_FORMAT.DEFAULT, 7)}
                            </div>
                            <SavePostButton
                                postId={post.id}
                                className="!p-2 text-[20px]"
                            />
                        </div>
                    </div>
                </Card>
            </motion.div>
        </Link>
    );
}