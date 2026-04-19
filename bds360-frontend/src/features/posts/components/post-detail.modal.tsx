// @/features/posts/components/post-detail.modal.tsx
'use client';

import { AppModal } from '@/components/base/app.modal';
import { VIP_PACKAGES } from '@/constants';
import { useAppTheme } from '@/hooks/use-app-theme';
import { formatDateTime, formatPostPrice } from '@/utils';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Button, Descriptions, Divider, Image, Skeleton, Tag, Typography } from 'antd';
import { useState } from 'react';
import { useGetPostById } from '../api/posts.queries';
import { POST_STATUS_COLOR, POST_STATUS_LABEL } from '../posts.constant';
import { PostViewStatistics } from './post-view-statistics';
import { PropertyMap } from './property-map';

const { Title, Paragraph, Text } = Typography;

interface PostDetailModalProps {
    isOpen: boolean;
    postId: number | null;
    onClose: () => void;
}

export function PostDetailModal({ isOpen, postId, onClose }: PostDetailModalProps) {
    const {
        colorPrimary,
        colorTextSecondary,
        colorBorder,
        colorBgContainer,
        colorError,
        colorBgMask,           // 🌟 Thêm: Màu nền mờ cho số đếm (thay bg-black/60)
        colorTextLightSolid,   // 🌟 Thêm: Màu chữ trắng (thay text-white)
        colorFillAlter         // 🌟 Thêm: Màu nền xám nhạt (thay bg-gray-100)
    } = useAppTheme();

    const [activeIndex, setActiveIndex] = useState(0);

    const { data: post, isFetching } = useGetPostById(postId as number, !!postId && isOpen);

    // Truyền thẳng object vip vào, tìm theo ID (1, 2, 3...)
    const getVipTag = (vip?: { id: number; name: string; vipLevel: number }) => {
        if (!vip) return <Text type="secondary">Chưa có</Text>;

        // Tìm trực tiếp theo ID dạng số
        const pkg = VIP_PACKAGES.find((p) => p.id === vip.id);

        return (
            <Tag color={pkg?.tagColor || 'default'} variant="filled">
                {pkg?.name || vip.name}
            </Tag>
        );
    };

    const fallbackImage = 'https://placehold.co/600x400?text=No+Image';
    const formattedImages = post?.images?.length
        ? [...post.images].sort((a, b) => a.orderIndex - b.orderIndex).map(img => img.url)
        : [fallbackImage];

    const handlePrevImage = () => {
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : formattedImages.length - 1));
    };

    const handleNextImage = () => {
        setActiveIndex((prev) => (prev < formattedImages.length - 1 ? prev + 1 : 0));
    };

    return (
        <AppModal
            title={`Chi tiết tin đăng ${postId ? `#${postId}` : ''}`}
            isOpen={isOpen}
            onClose={onClose}
            width={1000}
            style={{ top: 20, paddingBottom: 24 }}
        >
            {isFetching ? (
                <div className="p-4">
                    <Skeleton active avatar paragraph={{ rows: 8 }} />
                </div>
            ) : !post ? (
                <div className="text-center p-8" style={{ color: colorTextSecondary }}>
                    Không tìm thấy dữ liệu tin đăng.
                </div>
            ) : (
                <div className="flex flex-col gap-6 pt-2">
                    <div className="flex flex-col gap-2">
                        <Image.PreviewGroup>
                            {/* KHUNG ẢNH CHÍNH */}
                            <div
                                className="relative w-full h-[350px] rounded-lg overflow-hidden flex items-center justify-center"
                                style={{ background: 'radial-gradient(circle, rgb(147, 143, 143) 0%, rgb(55, 54, 54) 100%)' }}
                            >
                                <Image
                                    src={formattedImages[activeIndex]}
                                    alt={`Ảnh chính ${activeIndex + 1}`}
                                    styles={{ root: { width: '100%', height: '100%' } }}
                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                />

                                {formattedImages.length > 1 && (
                                    <>
                                        {/* 🌟 FIX: Bọc nút bằng thẻ div thuần để Tailwind định vị tuyệt đối */}
                                        <div className="absolute top-1/2 left-4 -translate-y-1/2 z-10">
                                            <Button
                                                shape="circle"
                                                icon={<LeftOutlined />}
                                                onClick={handlePrevImage}
                                                className="opacity-70 hover:opacity-100"
                                            />
                                        </div>

                                        {/* 🌟 FIX: Bọc nút bằng thẻ div thuần để Tailwind định vị tuyệt đối */}
                                        <div className="absolute top-1/2 right-4 -translate-y-1/2 z-10">
                                            <Button
                                                shape="circle"
                                                icon={<RightOutlined />}
                                                onClick={handleNextImage}
                                                className="opacity-70 hover:opacity-100"
                                            />
                                        </div>

                                        {/* Đếm số */}
                                        <div
                                            className="absolute bottom-3 right-3 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm z-10"
                                            style={{ backgroundColor: colorBgMask, color: colorTextLightSolid }}
                                        >
                                            {activeIndex + 1} / {formattedImages.length}
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* DẢI THUMBNAIL */}
                            {formattedImages.length > 1 && (
                                <div
                                    className="flex items-center gap-2 overflow-x-auto snap-x py-1 px-1"
                                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                                >
                                    {formattedImages.map((url, idx) => (
                                        <div
                                            key={idx}
                                            // 🌟 FIX: Gỡ bỏ bg-gray-100 của Tailwind
                                            className={`flex-shrink-0 snap-start cursor-pointer rounded overflow-hidden border-2 transition-all duration-200 box-border w-16 h-16 flex items-center justify-center`}
                                            style={{
                                                borderColor: activeIndex === idx ? colorPrimary : 'transparent',
                                                opacity: activeIndex === idx ? 1 : 0.6,
                                                backgroundColor: colorFillAlter // Dùng Token nền thay thế
                                            }}
                                            onClick={() => setActiveIndex(idx)}
                                        >
                                            <Image
                                                src={url}
                                                alt={`Thumbnail ${idx + 1}`}
                                                preview={false}
                                                className="w-full h-full object-cover"
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Image.PreviewGroup>
                    </div>

                    <Divider style={{ margin: 0 }} />

                    {/* ... (Các phần Descriptions giữ nguyên) ... */}
                    <div>
                        <Title level={5} style={{ marginBottom: 16 }}>{post.title}</Title>

                        <Paragraph
                            ellipsis={{ rows: 3, expandable: true, symbol: 'Xem thêm' }}
                            style={{ color: colorTextSecondary, whiteSpace: 'pre-wrap' }}
                        >
                            {post.description}
                        </Paragraph>

                        <Descriptions bordered column={{ xs: 1, sm: 2 }} size="small" style={{ marginTop: 24 }}>
                            <Descriptions.Item label="Loại tin">
                                <Text strong>{post.type === 'SALE' ? 'Bán' : 'Cho thuê'}</Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="Danh mục">
                                {post.category.name}
                            </Descriptions.Item>
                            <Descriptions.Item label="Mức giá">
                                <Text strong style={{ color: colorError }}>
                                    {formatPostPrice(post.price)} {post.type === 'RENT' && post.price > 0 && '/ tháng'}
                                </Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="Diện tích">
                                {post.area} m²
                            </Descriptions.Item>
                            <Descriptions.Item label="Trạng thái">
                                <Tag color={POST_STATUS_COLOR[post.status]} variant="filled" className="!mr-0">
                                    {POST_STATUS_LABEL[post.status]}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Gói hiển thị">
                                {getVipTag(post.vip)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Lượt xem">
                                {post.view.toLocaleString()} lượt
                            </Descriptions.Item>
                            <Descriptions.Item label="Ngày đăng">
                                {formatDateTime(post.createdAt)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Địa chỉ" span={2}>
                                {post.streetAddress}
                            </Descriptions.Item>

                            {post.listingDetail?.bedrooms !== undefined && (
                                <Descriptions.Item label="Phòng ngủ">
                                    {post.listingDetail.bedrooms} PN
                                </Descriptions.Item>
                            )}
                            {post.listingDetail?.bathrooms !== undefined && (
                                <Descriptions.Item label="Phòng tắm">
                                    {post.listingDetail.bathrooms} WC
                                </Descriptions.Item>
                            )}
                        </Descriptions>
                    </div>

                    {post.latitude && post.longitude && (
                        <div>
                            <Title level={5}>Vị trí trên bản đồ</Title>

                            {/* Không cần thẻ div bọc ngoài nữa, truyền thẳng vào PropertyMap */}
                            <PropertyMap
                                latitude={post.latitude}
                                longitude={post.longitude}
                                height={250}
                                // Truyền class của Tailwind
                                className="shadow-sm hover:shadow-md transition-shadow"
                                // Truyền style của Ant Design Theme
                                style={{
                                    borderColor: colorBorder,
                                    backgroundColor: colorBgContainer
                                }}
                            />
                        </div>
                    )}

                    {post.id && (
                        <div className="mt-2">
                            <PostViewStatistics postId={post.id} />
                        </div>
                    )}


                </div>
            )}
        </AppModal>
    );
}