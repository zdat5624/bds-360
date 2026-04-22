// @/app/(main)/(public)/posts/[id]/post-characteristics.tsx
'use client';

import { Post } from '@/features/posts/api/types';
import {
    COMPASS_DIRECTION_LABEL,
    FURNISHING_LABEL,
    LEGAL_STATUS_LABEL
} from '@/features/posts/posts.constant';
import { formatPostPrice } from '@/features/posts/posts.util';
import {
    AreaChartOutlined,
    CompassOutlined,
    DollarCircleOutlined,
    HomeOutlined,
    InfoCircleOutlined,
    SafetyCertificateOutlined,
    UserOutlined
} from '@ant-design/icons';
import { Typography } from 'antd';
import React from 'react';

const { Title, Text } = Typography;

interface PostCharacteristicsProps {
    post: Post;
    className?: string;
    style?: React.CSSProperties;
}

export function PostCharacteristics({ post, className, style }: PostCharacteristicsProps) {
    return (
        <div className={className} style={style}>
            <Title level={4} className="!text-lg font-bold !mb-4  tracking-wide">
                Đặc điểm bất động sản
            </Title>
            <div className=" grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-5">
                <DetailItem icon={<AreaChartOutlined />} label="Diện tích" value={`${post.area} m²`} />
                <DetailItem icon={<DollarCircleOutlined />} label="Mức giá" value={formatPostPrice(post.price, post.type)} />

                {post.listingDetail?.bedrooms && (
                    <DetailItem icon={<UserOutlined />} label="Số phòng ngủ" value={`${post.listingDetail.bedrooms} PN`} />
                )}
                {post.listingDetail?.bathrooms && (
                    <DetailItem icon={<HomeOutlined />} label="Số phòng tắm" value={`${post.listingDetail.bathrooms} WC`} />
                )}
                {post.listingDetail?.houseDirection && (
                    <DetailItem
                        icon={<CompassOutlined />}
                        label="Hướng nhà"
                        value={COMPASS_DIRECTION_LABEL[post.listingDetail.houseDirection]}
                    />
                )}
                {post.listingDetail?.legalStatus && (
                    <DetailItem
                        icon={<SafetyCertificateOutlined />}
                        label="Giấy tờ pháp lý"
                        value={LEGAL_STATUS_LABEL[post.listingDetail.legalStatus]}
                    />
                )}
                {post.listingDetail?.furnishing && (
                    <DetailItem
                        icon={<InfoCircleOutlined />}
                        label="Nội thất"
                        value={FURNISHING_LABEL[post.listingDetail.furnishing]}
                    />
                )}
            </div>
        </div>
    );
}

function DetailItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
    return (
        <div className="flex justify-between items-center gap-2 border-b border-gray-50 pb-2">
            <span className="flex items-center gap-2 whitespace-nowrap !font-medium">
                {icon}
                <Text className="text-[18px] !font-medium text-gray-500">
                    {label}
                </Text>
            </span>
            <Text className="text-[14px] text-right text-gray-700">{value}</Text>
        </div>
    );
}