// @/app/(main)/(public)/posts/[id]/post-seller-sidebar.tsx
'use client';

import { RevealPhoneButton } from '@/components/composite';
import { ChevronRightIcon, ZaloIcon } from '@/components/icons/custom-icons';
import { PostAuthor } from '@/features/posts/api/types';
import { cn } from '@/lib/utils';
import { CheckCircleFilled } from '@ant-design/icons';
import { Tooltip } from 'antd';
import Link from 'next/link';
import React, { useState } from 'react';

// Mở rộng interface nếu PostAuthor gốc chưa có trường isVerified
interface PostSellerSidebarProps {
    user: PostAuthor & { isVerified?: boolean }; // Thêm isVerified từ Backend
    className?: string;
    postId?: number
}

export const PostSellerSidebar: React.FC<PostSellerSidebarProps> = ({ user, className, postId }) => {
    const [showPhone, setShowPhone] = useState(false);

    // Xử lý logic hiển thị số điện thoại an toàn
    const safePhone = user?.phone || '';

    // Link chuyển hướng Zalo (Zalo hỗ trợ link zalo.me/SĐT)
    const zaloLink = safePhone ? `https://zalo.me/${safePhone}` : '#';

    // GIẢ LẬP: Mặc định cho true để bạn xem UI, thực tế lấy từ user.isVerified
    const isVerified = user?.isVerified ?? true;

    return (
        <div className={cn(
            // Giảm padding tổng thể xuống p-3 md:p-4
            "bg-white p-3 md:p-4 rounded-2xl flex flex-col items-center shadow-[0_0_10px_rgba(0,0,0,0.1)] border border-gray-100/50",
            "lg:sticky lg:top-[55px]",
            className
        )}>
            {/* --- AVATAR --- */}
            {/* Giảm kích thước avatar xuống w-14 h-14 và margin bottom */}
            <div className="relative w-14 h-14 mb-2">
                {user?.avatar ? (
                    <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-full h-full rounded-full object-cover border border-gray-100 shadow-sm"
                    />
                ) : (
                    <div className="w-full h-full rounded-full bg-blue-50 border border-gray-100 shadow-sm flex items-center justify-center">
                        <span className="text-lg font-bold !text-blue-600">
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                    </div>
                )}
                {/* Đã gỡ bỏ dấu chấm online màu xanh lá cây theo yêu cầu */}
            </div>

            {/* --- USER INFO & VERIFIED UI --- */}
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">
                Được đăng bởi
            </span>

            {/* Giảm margin bottom của cụm Tên */}
            <div className="flex items-center gap-1.5 justify-center mb-1.5">
                <h3 className="text-base font-bold text-gray-900 line-clamp-1 text-center">
                    {user?.name || 'Người dùng ẩn danh'}
                </h3>

                {/* Tích xanh xác thực có Tooltip */}
                {isVerified && (
                    <Tooltip title="Đã xác thực">
                        <CheckCircleFilled
                            className="!text-[#0068FF] !text-[13px] shrink-0"
                        />
                    </Tooltip>
                )}

            </div>
            {isVerified && (
                <span className="mb-1.5 text-[10px] font-medium text-[#0068FF] bg-[#e5f0ff] px-2.5 py-0.5 rounded-full border border-[#b3d4ff]">
                    Tài khoản đã xác thực
                </span>
            )}

            {/* --- ACTIONS --- */}
            <div className="w-full flex flex-col gap-2">

                {/* Nút Gọi điện (Giảm chiều cao xuống h-10) */}
                <RevealPhoneButton postId={postId} phone={safePhone} />

                {/* Nút Nhắn Zalo (Giảm chiều cao xuống h-10) */}
                <a
                    href={zaloLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-1.5 h-10 bg-white border border-[#0068FF] hover:bg-blue-50 text-[#0068FF] rounded-xl font-semibold transition-all duration-200 active:scale-[0.98]"
                    onClick={(e) => {
                        if (!safePhone) {
                            e.preventDefault();
                            alert('Người dùng này chưa cung cấp số điện thoại.');
                        }
                    }}
                >
                    <ZaloIcon className="w-[18px] h-[18px]" />
                    <span className="text-[14px]">Chat qua Zalo</span>
                </a>
            </div>

            {/* --- XEM THÊM TIN KHÁC --- */}
            {/* Thu nhỏ khoảng cách phân cách phía trên */}

            {!postId && (
                <div className="w-full mt-3 pt-2.5 border-t border-gray-100">
                    <Link
                        href={`#`}
                        className="group w-full flex items-center justify-center gap-1 text-[12px] font-medium text-gray-500 hover:text-[#0068FF] transition-colors"
                    >
                        Xem thêm tin khác
                        <ChevronRightIcon className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                </div>
            )}


        </div>
    );
};