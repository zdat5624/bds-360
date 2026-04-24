// @/features/posts/components/manage-post-detail.modal.tsx
'use client';

import { AppModal } from '@/components/base/app.modal';
import { GENDER_LABEL, USER_ROLE_COLOR, USER_ROLE_LABEL, VIP_PACKAGES } from '@/constants';
import { useGetUserById } from '@/features/users';
import { useAppTheme } from '@/hooks/use-app-theme';
import { formatCurrency, formatDateTime } from '@/utils';
import { CheckCircleFilled, CloseCircleFilled, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Avatar, Button, Descriptions, Divider, Flex, Image, Skeleton, Tag, Typography } from 'antd';
import { useState } from 'react';
import { useGetPostById } from '../api/posts.queries';
import {
    COMPASS_DIRECTION_LABEL,
    FURNISHING_LABEL,
    LEGAL_STATUS_LABEL,
    POST_STATUS_COLOR,
    POST_STATUS_LABEL,
    USER_POST_STATUS_DISPLAY
} from '../posts.constant';
import { formatPostPrice, getFullAddress } from '../posts.util';
import { PostViewStatistics } from './post-view-statistics';
import { PropertyMap } from './property-map';

const { Title, Paragraph, Text } = Typography;

interface ManagePostDetailModalProps {
    isOpen: boolean;
    postId: number | null;
    onClose: () => void;
}

export function ManagePostDetailModal({ isOpen, postId, onClose }: ManagePostDetailModalProps) {
    const {
        colorPrimary,
        colorTextSecondary,
        colorBorder,
        colorBgContainer,
        colorError,
        colorBgMask,
        colorTextLightSolid,
        colorFillAlter
    } = useAppTheme();

    const [activeIndex, setActiveIndex] = useState(0);

    // 1. Fetch Post Detail
    const { data: post, isFetching: isFetchingPost } = useGetPostById(postId as number, !!postId && isOpen);

    // 2. Lấy ID của User từ Post (hỗ trợ cả trường hợp BE trả về object user hoặc userId)
    const userId = post?.user?.id || (post as any)?.userId;

    // 3. Fetch User Detail dựa trên userId của Post
    const { data: userDetail, isFetching: isFetchingUser } = useGetUserById(userId as number, !!userId && isOpen);

    const getVipTag = (vip?: { id: number; name?: string }) => {
        if (!vip?.id) return <Text type="secondary">Chưa có</Text>;

        const pkg = VIP_PACKAGES.find((p) => p.id === Number(vip.id));

        return (
            <Tag color={pkg?.tagColor || 'default'} variant="filled">
                {pkg?.name || vip.name || 'Không xác định'}
            </Tag>
        );
    };

    const fallbackImage = 'https://placehold.co/600x400?text=No+Image';
    const formattedImages = post?.images?.length
        ? [...post.images].sort((a, b) => a.orderIndex - b.orderIndex).map(img => img.url)
        : [fallbackImage];

    const handlePrevImage = () => setActiveIndex((prev) => (prev > 0 ? prev - 1 : formattedImages.length - 1));
    const handleNextImage = () => setActiveIndex((prev) => (prev < formattedImages.length - 1 ? prev + 1 : 0));

    return (
        <AppModal
            title={`Chi tiết tin đăng ${postId ? `#${postId}` : ''}`}
            isOpen={isOpen}
            onClose={onClose}
            width={1000}
            style={{ top: 20 }}
        >
            {isFetchingPost ? (
                <div className="p-4"><Skeleton active avatar paragraph={{ rows: 8 }} /></div>
            ) : !post ? (
                <div className="text-center p-8" style={{ color: colorTextSecondary }}>Không tìm thấy dữ liệu tin đăng.</div>
            ) : (
                <div className="flex flex-col gap-6 pt-2">
                    {/* PHẦN 1: ẢNH */}
                    <div className="flex flex-col gap-2">
                        <Image.PreviewGroup>
                            <div className="relative w-full h-[380px] rounded-lg overflow-hidden flex items-center justify-center bg-gray-900">
                                <Image
                                    src={formattedImages[activeIndex]}
                                    alt="Main Post Image"
                                    styles={{ root: { width: '100%', height: '100%' } }}
                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                />
                                {formattedImages.length > 1 && (
                                    <>
                                        <div className="absolute top-1/2 left-4 -translate-y-1/2 z-10">
                                            <Button shape="circle" icon={<LeftOutlined />} onClick={handlePrevImage} className="opacity-70 hover:opacity-100" />
                                        </div>
                                        <div className="absolute top-1/2 right-4 -translate-y-1/2 z-10">
                                            <Button shape="circle" icon={<RightOutlined />} onClick={handleNextImage} className="opacity-70 hover:opacity-100" />
                                        </div>
                                        <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm z-10" style={{ backgroundColor: colorBgMask, color: colorTextLightSolid }}>
                                            {activeIndex + 1} / {formattedImages.length}
                                        </div>
                                    </>
                                )}
                            </div>
                            {formattedImages.length > 1 && (
                                <div className="flex items-center gap-2 overflow-x-auto py-1" style={{ scrollbarWidth: 'none' }}>
                                    {formattedImages.map((url, idx) => (
                                        <div
                                            key={idx}
                                            className="flex-shrink-0 cursor-pointer rounded overflow-hidden border-2 transition-all w-16 h-16 flex items-center justify-center"
                                            style={{ borderColor: activeIndex === idx ? colorPrimary : 'transparent', opacity: activeIndex === idx ? 1 : 0.6, backgroundColor: colorFillAlter }}
                                            onClick={() => setActiveIndex(idx)}
                                        >
                                            <Image src={url} alt="Thumb" preview={false} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Image.PreviewGroup>
                    </div>

                    <Divider style={{ margin: 0 }} />

                    {/* PHẦN 2: THÔNG TIN NGƯỜI ĐĂNG (DÀNH CHO QUẢN TRỊ VIÊN) */}
                    <div>
                        <Title level={5} className="!mb-4">Thông tin người đăng</Title>
                        {isFetchingUser ? (
                            <Skeleton active avatar paragraph={{ rows: 2 }} />
                        ) : userDetail ? (
                            <Descriptions bordered column={{ xs: 1, sm: 2 }} size="small" labelStyle={{ width: '140px', backgroundColor: colorFillAlter }}>
                                <Descriptions.Item label="Người dùng" span={2}>
                                    <Flex align="center" gap={12}>
                                        <Avatar src={userDetail.avatar}>{userDetail.name.charAt(0)}</Avatar>
                                        <Flex vertical>
                                            <Text strong>{userDetail.name}</Text>
                                            <Text type="secondary" className="text-[12px]">{userDetail.email}</Text>
                                        </Flex>
                                    </Flex>
                                </Descriptions.Item>
                                <Descriptions.Item label="Số điện thoại">{userDetail.phone || '--'}</Descriptions.Item>
                                <Descriptions.Item label="Giới tính">{userDetail.gender ? GENDER_LABEL[userDetail.gender] : '--'}</Descriptions.Item>
                                <Descriptions.Item label="Vai trò">
                                    <Tag color={USER_ROLE_COLOR[userDetail.role]} className="border-none m-0">
                                        {USER_ROLE_LABEL[userDetail.role]}
                                    </Tag>
                                </Descriptions.Item>
                                <Descriptions.Item label="Trạng thái xác thực">
                                    {userDetail.isVerified ? (
                                        <Text type="success"><CheckCircleFilled /> Đã xác thực</Text>
                                    ) : (
                                        <Text type="secondary"><CloseCircleFilled /> Chưa xác thực</Text>
                                    )}
                                </Descriptions.Item>
                                <Descriptions.Item label="Số dư tài khoản">
                                    <Text strong className="text-green-600">{formatCurrency(userDetail.balance)}</Text>
                                </Descriptions.Item>
                                <Descriptions.Item label="Ngày tham gia">
                                    {formatDateTime(userDetail.createdAt)}
                                </Descriptions.Item>
                            </Descriptions>
                        ) : (
                            <Text type="secondary">Không tìm thấy thông tin người đăng.</Text>
                        )}
                    </div>

                    <Divider style={{ margin: 0 }} />

                    {/* PHẦN 3: THÔNG TIN CHI TIẾT TIN ĐĂNG */}
                    <div>
                        <Title level={4} className="!mb-4">{post.title}</Title>
                        <Paragraph ellipsis={{ rows: 3, expandable: true, symbol: 'Xem thêm' }} style={{ color: colorTextSecondary, whiteSpace: 'pre-wrap' }}>
                            {post.description}
                        </Paragraph>

                        <Descriptions bordered column={{ xs: 1, sm: 2 }} size="small" className="mt-6" labelStyle={{ width: '140px' }}>
                            <Descriptions.Item label="Loại giao dịch">
                                <Text strong>{post.type === 'SALE' ? 'Bán' : 'Cho thuê'}</Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="Danh mục">{post.category.name}</Descriptions.Item>

                            <Descriptions.Item label="Mức giá">
                                <Text strong style={{ color: colorError }}>{formatPostPrice(post.price, post.type)}</Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="Diện tích">{post.area} m²</Descriptions.Item>

                            <Descriptions.Item label="Trạng thái">
                                {(() => {
                                    const displayKey = USER_POST_STATUS_DISPLAY[post.status];
                                    return (
                                        <Tag color={POST_STATUS_COLOR[displayKey]} variant="filled" className="!mr-0">
                                            {POST_STATUS_LABEL[displayKey]}
                                        </Tag>
                                    );
                                })()}
                            </Descriptions.Item>
                            <Descriptions.Item label="Gói hiển thị">{getVipTag(post.vip)}</Descriptions.Item>

                            <Descriptions.Item label="Ngày đăng">{formatDateTime(post.createdAt)}</Descriptions.Item>
                            <Descriptions.Item label="Lượt xem">{post.view.toLocaleString()} lượt</Descriptions.Item>

                            <Descriptions.Item label="Địa chỉ" span={2}>{getFullAddress(post)}</Descriptions.Item>

                            {/* HIỂN THỊ CHI TIẾT BỔ SUNG (LISTING DETAIL) */}
                            {post.listingDetail?.bedrooms !== undefined && (
                                <Descriptions.Item label="Phòng ngủ">{post.listingDetail.bedrooms} PN</Descriptions.Item>
                            )}
                            {post.listingDetail?.bathrooms !== undefined && (
                                <Descriptions.Item label="Phòng tắm">{post.listingDetail.bathrooms} WC</Descriptions.Item>
                            )}

                            {post.listingDetail?.houseDirection && (
                                <Descriptions.Item label="Hướng nhà">
                                    {COMPASS_DIRECTION_LABEL[post.listingDetail.houseDirection]}
                                </Descriptions.Item>
                            )}
                            {post.listingDetail?.balconyDirection && (
                                <Descriptions.Item label="Hướng ban công">
                                    {COMPASS_DIRECTION_LABEL[post.listingDetail.balconyDirection]}
                                </Descriptions.Item>
                            )}

                            {post.listingDetail?.legalStatus && (
                                <Descriptions.Item label="Pháp lý">
                                    {LEGAL_STATUS_LABEL[post.listingDetail.legalStatus]}
                                </Descriptions.Item>
                            )}
                            {post.listingDetail?.furnishing && (
                                <Descriptions.Item label="Nội thất">
                                    {FURNISHING_LABEL[post.listingDetail.furnishing]}
                                </Descriptions.Item>
                            )}
                        </Descriptions>
                    </div>

                    {/* PHẦN 4: BẢN ĐỒ & THỐNG KÊ */}
                    {post.latitude && post.longitude && (
                        <div>
                            <Title level={5}>Vị trí trên bản đồ</Title>
                            <PropertyMap
                                latitude={post.latitude}
                                longitude={post.longitude}
                                height={280}
                                className="shadow-sm border rounded-lg"
                                style={{ borderColor: colorBorder, backgroundColor: colorBgContainer }}
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