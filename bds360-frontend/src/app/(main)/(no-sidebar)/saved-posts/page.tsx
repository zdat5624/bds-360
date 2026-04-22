// @/app/(main)/(nosidebar)/saved-posts/page.tsx
'use client';

import { APP_ROUTES } from '@/config/routes';
import { useGetSavedPosts } from '@/features/posts/api/posts.queries';
import { PostCard } from '@/features/posts/components/post-card';
import { Breadcrumb, Empty, Pagination, Select, Spin, Typography } from 'antd';
import Link from 'next/link';
import { useState } from 'react';
import { SavedPostsSidebar } from './SavedPostsSidebar';

const { Title, Text } = Typography;

// Định nghĩa các tuỳ chọn sắp xếp khớp với logic Backend
const SORT_OPTIONS = [
    { label: 'Mới lưu nhất', value: 'newest_DESC' },
    { label: 'Lưu cũ nhất', value: 'oldest_ASC' },
    { label: 'Tin mới đăng', value: 'latest_DESC' },
    { label: 'Giá: Thấp đến cao', value: 'price_ASC' },
    { label: 'Giá: Cao xuống thấp', value: 'price_DESC' },
    { label: 'Diện tích: Nhỏ đến lớn', value: 'area_ASC' },
    { label: 'Diện tích: Lớn xuống nhỏ', value: 'area_DESC' },
];

export default function SavedPostsPage() {
    // 1. Quản lý State phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(6);

    // 2. Quản lý State sắp xếp
    const [sortBy, setSortBy] = useState<string>('newest');
    const [sortDirection, setSortDirection] = useState<'ASC' | 'DESC'>('DESC');

    // 3. Fetch dữ liệu
    const { data, isLoading } = useGetSavedPosts({
        page: currentPage - 1,
        size: pageSize,
        sortBy: sortBy,
        sortDirection: sortDirection
    });

    const posts = data?.content || [];
    const totalElements = data?.totalElements || 0;

    // 4. Handlers
    const handlePageChange = (page: number, size: number) => {
        setCurrentPage(page);
        setPageSize(size);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSortChange = (value: string) => {
        const [newSortBy, newSortDirection] = value.split('_');
        setSortBy(newSortBy);
        setSortDirection(newSortDirection as 'ASC' | 'DESC');
        setCurrentPage(1); // 🌟 Quan trọng: Đổi sort thì phải quay về trang 1
    };

    return (
        <main className="bg-white min-h-screen pb-12">
            {/* Breadcrumb Section */}
            <div className=" !mb-0">
                <div className="max-w-[960px] mx-auto px-4 !py-4">
                    <Breadcrumb
                        items={[
                            { title: <Link href={APP_ROUTES.PUBLIC.HOME}>Trang chủ</Link> },
                            { title: 'Tin đăng đã lưu' },
                        ]}
                    />
                </div>
            </div>

            <div className="max-w-[960px] mx-auto px-4">
                <div className="flex flex-col md:flex-row gap-6">

                    {/* BÊN TRÁI: DANH SÁCH TIN ĐĂNG */}
                    <div className="flex-1 min-w-0">

                        {/* 🌟 HEADER: TITLE & SORT DROPDOWN */}
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-4">
                            <div>
                                <Title level={2} className="!text-2xl !mb-2 font-bold text-gray-800">
                                    Tin đăng đã lưu
                                </Title>
                                <Text className="text-gray-500 text-sm">
                                    Tổng số <span className="font-semibold text-gray-800">{totalElements}</span> tin đăng
                                </Text>
                            </div>

                            {/* Dropdown Sắp xếp */}
                            <div className="flex items-center gap-2">
                                <Text className="text-gray-500 text-sm hidden md:inline-block">Sắp xếp:</Text>
                                <Select
                                    value={`${sortBy}_${sortDirection}`}
                                    onChange={handleSortChange}
                                    options={SORT_OPTIONS}
                                    className="w-[180px]"
                                    placement="bottomRight"
                                />
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="flex justify-center py-20">
                                <Spin size="large" tip="Đang tải danh sách..." />
                            </div>
                        ) : posts.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 gap-2">
                                    {posts.map((savedPost) => (
                                        <PostCard key={savedPost.id} post={savedPost} />
                                    ))}
                                </div>

                                {totalElements > pageSize && (
                                    <div className="flex justify-center mt-8">
                                        <Pagination
                                            current={currentPage}
                                            pageSize={pageSize}
                                            total={totalElements}
                                            onChange={handlePageChange}
                                            showSizeChanger={true}
                                            pageSizeOptions={['6', '12', '24']}
                                        />
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="py-12 border border-gray-100 rounded-lg bg-gray-50 text-center">
                                <Empty
                                    description="Bạn chưa lưu tin đăng nào."
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                />
                            </div>
                        )}
                    </div>

                    {/* BÊN PHẢI: SIDEBAR TIỆN ÍCH */}
                    <div className="w-full md:w-[280px] shrink-0">
                        <SavedPostsSidebar />
                    </div>

                </div>
            </div>
        </main>
    );
}