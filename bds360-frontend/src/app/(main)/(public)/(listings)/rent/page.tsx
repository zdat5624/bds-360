// File: @/app/(main)/(public)/(listings)/rent/page.tsx
'use client';

import { useGetPosts } from '@/features/posts/api/posts.queries';
import { PostFilterParams } from '@/features/posts/api/types';
import { PostCard } from '@/features/posts/components/post-card';
import { FilterOutlined } from '@ant-design/icons';
import { Button, Empty, Input, Pagination, Select, Skeleton } from 'antd';
import { useState } from 'react';

export default function RentPage() {
    // 1. Quản lý State cho Phân trang và Bộ lọc
    const [page, setPage] = useState(1); // Phân trang của Antd bắt đầu từ 1
    const pageSize = 12; // Khớp với backend

    // State chứa các tham số lọc bổ sung (giá, diện tích, location...)
    const [filters, setFilters] = useState<Partial<PostFilterParams>>({});

    // 2. Gọi API bằng React Query
    // Tự động fetch lại data khi 'page' hoặc 'filters' thay đổi
    const { data, isLoading, isError } = useGetPosts('public', {
        type: 'RENT',       // Cố định type là Thuê cho trang này
        page: page - 1,     // Spring Boot API thường nhận page bắt đầu từ 0
        size: pageSize,
        ...filters
    });

    // Bóc tách dữ liệu từ PageResponse (Thay đổi data?.data tùy theo cách customFetch của bạn trả về)
    const posts = (data as any)?.content || (data as any)?.data?.content || [];
    const totalElements = (data as any)?.totalElements || (data as any)?.data?.totalElements || 0;

    return (
        <div className="flex flex-col w-full bg-gray-50/30 hide-scroll-arrows">

            {/* ==============================================
                Thanh Filter (Sticky: Luôn nổi trên cùng)
            ============================================== */}
            <div className="sticky top-0 z-30 bg-white border-b border-gray-200 p-4 flex flex-col gap-3 shadow-sm">
                <div className="flex gap-2">
                    <Input placeholder="Tìm kiếm khu vực..." className="flex-1" />
                    <Select defaultValue="all" className="w-32" options={[{ value: 'all', label: 'Mức giá' }]} />
                    <Select defaultValue="all" className="w-32 hidden sm:block" options={[{ value: 'all', label: 'Diện tích' }]} />
                    <Button type="primary" icon={<FilterOutlined />}>Lọc</Button>
                </div>
            </div>

            {/* ==============================================
                Khu vực Danh sách Bài đăng
            ============================================== */}
            <div className="p-4 flex flex-col gap-4">

                {/* Thông báo số lượng kết quả */}
                {!isLoading && !isError && (
                    <div className="text-sm text-gray-500 mb-1">
                        Tìm thấy <span className="font-bold text-blue-600">{totalElements}</span> tin đăng phù hợp
                    </div>
                )}

                {/* XỬ LÝ TRẠNG THÁI LOADING */}
                {isLoading ? (
                    // Hiển thị 10 khung xương (Skeleton) giả lập lúc đang tải mạng
                    Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex gap-4">
                            <Skeleton.Image className="!w-32 !h-32 rounded-lg" active />
                            <div className="flex-1">
                                <Skeleton active paragraph={{ rows: 8 }} title={{ width: '80%' }} />
                            </div>
                        </div>
                    ))
                ) : isError ? (
                    /* XỬ LÝ TRẠNG THÁI LỖI MẠNG/SERVER */
                    <div className="py-20 bg-white rounded-xl border border-gray-200">
                        <Empty description="Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau." />
                    </div>
                ) : posts.length > 0 ? (
                    /* XỬ LÝ CÓ DỮ LIỆU */
                    <>
                        {/* Vòng lặp render Component Thẻ Bài Đăng */}
                        <div className="flex flex-col gap-4">
                            {posts.map((post: any) => (
                                <PostCard key={post.id} post={post} />
                            ))}
                        </div>

                        {/* Phân trang (Pagination) */}
                        {totalElements > pageSize && (
                            <div className="mt-8 flex justify-center pb-6">
                                <Pagination
                                    current={page}
                                    pageSize={pageSize}
                                    total={totalElements}
                                    onChange={(newPage) => {
                                        setPage(newPage);
                                        // Cuộn mượt mà lên đầu trang danh sách khi chuyển trang
                                        document.querySelector('.overflow-y-auto')?.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    showSizeChanger={false} // Ẩn nút chọn số lượng / trang
                                    className="scale-90 sm:scale-100" // Thu nhỏ một chút trên điện thoại
                                />
                            </div>
                        )}
                    </>
                ) : (
                    /* XỬ LÝ KHÔNG TÌM THẤY DỮ LIỆU (MẢNG RỖNG) */
                    <div className="py-20 bg-white rounded-xl border border-gray-200 shadow-sm">
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description="Không tìm thấy bất động sản nào phù hợp với bộ lọc"
                        />
                    </div>
                )}

            </div>
        </div>
    );
}