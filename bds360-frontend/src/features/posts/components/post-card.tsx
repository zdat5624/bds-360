// @/features/posts/components/post-card.tsx
'use client';

import { BathIcon, BedIcon } from '@/components/icons/custom-icons';
import { VIP_COLOR_MAP } from '@/constants/vip-packages.constant'; //  Import màu định nghĩa sẵn
import { Post } from '@/features/posts/api/types';
import { formatPostPrice } from '@/features/posts/posts.util';
import { getSmartRelativeTime } from '@/utils/date.util';
import {
    EnvironmentOutlined,
    HeartOutlined,
    PhoneOutlined,
    PictureOutlined
} from '@ant-design/icons';
import { Avatar, Button, Typography } from 'antd';
import Link from 'next/link';

const { Text } = Typography;

interface PostCardProps {
    post: Post;
}

export function PostCard({ post }: PostCardProps) {
    // 1. Tiền xử lý Hình ảnh
    const sortedImages = post.images ? [...post.images].sort((a, b) => a.orderIndex - b.orderIndex) : [];
    const imageCount = sortedImages.length;

    const displayImages = [...sortedImages.map(img => img.url)];
    while (displayImages.length < 4) {
        displayImages.push('https://placehold.co/400x300?text=No+Image');
    }

    // 2. Tiền xử lý VIP
    const vipId = post.vip?.id;
    const vipName = post.vip?.name || '';

    //  LOGIC: Bật cờ (flag) hiển thị nếu có VIP và KHÔNG PHẢI Gói Tiêu Chuẩn (id = 1)
    const shouldShowVipBadge = !!vipId && vipId !== 1;
    // Lấy màu từ file constant, fallback về màu xám nếu không tìm thấy
    const badgeColor = vipId ? VIP_COLOR_MAP[vipId] : '#8c8c8c';

    // Lấy thông tin phòng
    const bedrooms = post.listingDetail?.bedrooms || 0;
    const bathrooms = post.listingDetail?.bathrooms || 0;

    return (
        <Link href={`/posts/${post.id}`} target="_blank" className="block w-full">
            <div className="group flex flex-col w-full bg-white rounded-xl border border-gray-100 shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_8px_rgba(0,0,0,0.06)] transition-all duration-300 overflow-hidden min-h-[420px]">

                {/* ==============================================================
                    KHU VỰC HÌNH ẢNH (Đã sửa Ảnh Trái - Phải)
                ============================================================== */}
                <div className="relative flex flex-row gap-0.5 w-full h-[240px] shrink-0 bg-white border-b border-gray-100">

                    {/*  THIẾT KẾ BADGE RIBBON Ở BÊN TRÁI */}
                    {shouldShowVipBadge && (
                        <div
                            className="absolute top-3 left-0 z-20 flex items-center pl-3 pr-5 py-1.5 text-[0.75rem] font-bold text-white shadow-sm"
                            style={{
                                backgroundColor: badgeColor,
                                // Dùng polygon cắt lõm chữ V ở cạnh phải (tạo dải đuôi nheo của Ribbon)
                                clipPath: 'polygon(0 0, 100% 0, calc(100% - 10px) 50%, 100% 100%, 0 100%)'
                            }}
                        >
                            <span className="drop-shadow-md tracking-wide uppercase">{vipName}</span>
                        </div>
                    )}

                    {imageCount <= 1 ? (
                        <img src={displayImages[0]} alt={post.title} className="w-full h-full object-cover" />
                    ) : (
                        <>
                            {/* Ảnh chính bên trái (chiếm 60%) */}
                            <img src={displayImages[0]} alt={post.title} className="w-[60%] h-full object-cover" />

                            {/* Khối 3 ảnh phụ bên phải */}
                            <div className="flex-1 h-full flex flex-col gap-0.5 min-w-0">
                                {/* Ảnh phụ 1 (nửa trên) */}
                                <img src={displayImages[1]} alt="Sub 1" className="w-full flex-1 object-cover min-h-0" />

                                {/* Khối 2 ảnh phụ (nửa dưới xếp ngang) */}
                                <div className="w-full flex-1 flex flex-row gap-0.5 min-h-0">
                                    <img src={displayImages[2]} alt="Sub 2" className="flex-1 h-full object-cover min-w-0" />
                                    <img src={displayImages[3]} alt="Sub 3" className="flex-1 h-full object-cover min-w-0" />
                                </div>
                            </div>
                        </>
                    )}

                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/40 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

                    <div className="absolute bottom-2.5 right-2.5 z-10">
                        <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-black/70 text-white text-[0.8rem] shadow-sm backdrop-blur-sm">
                            <PictureOutlined /> {imageCount}
                        </span>
                    </div>
                </div>

                {/* ==============================================================
                    KHU VỰC THÔNG TIN
                ============================================================== */}
                <div className="flex-1 flex flex-col p-2 md:p-3">

                    {/*  Title: Đã giảm từ text-[1.05rem] md:text-[1.15rem] xuống text-[0.95rem] md:text-[1rem] */}
                    <h3 className="text-[0.85rem] md:text-[0.95] font-semibold text-gray-800 uppercase leading-snug line-clamp-2 mb-1.5 group-hover:text-blue-600 transition-colors">
                        {post.title}
                    </h3>

                    {/*  Hàng thông tin chính: Đã giảm từ text-[0.85rem] md:text-[0.9rem] xuống text-[0.8rem] */}
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1.5 text-[0.8rem] text-gray-600">

                        {/*  Giá: Đã giảm từ text-base md:text-[1.1rem] xuống text-[0.9rem] md:text-[0.95rem] */}
                        <span className="text-[#e74c3c] font-bold text-[0.80rem] md:text-[0.85rem]">
                            {formatPostPrice(post.price, post.type)}
                        </span>

                        <span className="text-gray-300">·</span>

                        <span className="font-medium text-gray-700">{post.area} m²</span>

                        {bedrooms > 0 && (
                            <>
                                <span className="text-gray-300">·</span>
                                <span className="flex items-center gap-1 font-medium text-gray-700">
                                    {/*  Đã thu nhỏ icon BedIcon */}
                                    <BedIcon className="w-3.5 h-3.5 text-gray-400" /> {bedrooms}
                                </span>
                            </>
                        )}

                        {bathrooms > 0 && (
                            <>
                                <span className="text-gray-300">·</span>
                                <span className="flex items-center gap-1 font-medium text-gray-700">
                                    {/*  Đã thu nhỏ icon BathIcon */}
                                    <BathIcon className="w-3.5 h-3.5 text-gray-400" /> {bathrooms}
                                </span>
                            </>
                        )}

                        <span className="text-gray-300">·</span>
                        <span className="flex items-center gap-1 line-clamp-1 flex-1 min-w-[150px]">
                            {/*  Đã thu nhỏ icon Environment */}
                            <EnvironmentOutlined className="text-blue-400 shrink-0 text-[0.8rem]" />
                            {post.provinceName}
                        </span>
                    </div>

                    {/*  Description: Đã giảm từ text-[0.85rem] md:text-[0.9rem] xuống text-[0.75rem] md:text-[0.8rem] */}
                    <div className="flex items-start gap-1.5 text-[0.75rem] md:text-[0.8rem] text-gray-500 mt-auto mb-1.5">
                        {/* <InfoCircleOutlined className="mt-0.5 shrink-0 text-gray-400" /> */}
                        <span className="line-clamp-2">{post.description}</span>
                    </div>

                    {/* Footer của Card (Thông tin User và Nút Action giữ nguyên theo yêu cầu) */}
                    <div className="pt-2.5 mt-auto border-t border-gray-100 flex flex-row justify-between items-center gap-3 shrink-0 min-w-0">

                        <div className="flex items-center gap-2.5 flex-1 min-w-0">
                            <Avatar src={post.user?.avatar} size={36} className="bg-gray-100 border border-gray-100 shrink-0">
                                {!post.user?.avatar && post.user?.name?.charAt(0)}
                            </Avatar>
                            <div className="flex flex-col min-w-0">
                                <Text className="font-semibold text-gray-800 text-[0.88rem] truncate">
                                    {post.user?.name || 'Người dùng ẩn danh nhưng tên rất dài dài dài'}
                                </Text>
                                <Text className="text-gray-400 text-[0.75rem] md:text-[0.8rem] truncate">
                                    {getSmartRelativeTime(post.createdAt)}
                                </Text>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                            <Button
                                shape="circle"
                                size="large"
                                icon={<HeartOutlined />}
                                className="text-gray-400 border-gray-200 hover:!text-red-500 hover:!border-red-500 shadow-none flex items-center justify-center"
                                onClick={(e) => {
                                    e.preventDefault();
                                    alert('Đã lưu tin!');
                                }}
                            />

                            <Button
                                type="primary"
                                shape="round"
                                size="large"
                                icon={<PhoneOutlined />}
                                className="bg-[#17a2b8] hover:!bg-[#138496] border-none font-semibold px-4 md:px-5 shadow-none text-[0.85rem] md:text-[0.9rem]"
                                onClick={(e) => {
                                    e.preventDefault();
                                    alert('Đang kết nối tới người đăng...');
                                }}
                            >
                                0987... · Gọi
                            </Button>
                        </div>

                    </div>
                </div>


            </div>
        </Link>
    );
}