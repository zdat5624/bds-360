// File: @/app/(main)/(public)/(listings)/rent/page.tsx
'use client';

import { PostCard, SmartFilterBar, useGetPosts, usePostFilterUrl } from '@/features/posts';
import { Empty, Pagination, Skeleton } from 'antd';
import { Suspense } from 'react';

// 1. TÁCH LOGIC CHÍNH VÀO COMPONENT CON
function RentContent() {
    const { filters, page, updateUrl } = usePostFilterUrl('RENT');
    const pageSize = 10;

    const { data, isLoading, isError } = useGetPosts('public', {
        ...filters,
        page: page - 1,
        size: pageSize,
    });

    const posts = data?.content || [];
    const totalElements = data?.totalElements || 0;

    return (
        <div className="flex flex-col w-full bg-gray-50/30">
            {/* Thanh Filter */}
            <div className="z-30 bg-white shadow-sm">
                <div className="p-4">
                    <SmartFilterBar
                        initialFilters={filters}
                        onApply={(newFilters) => updateUrl(newFilters, 1)}
                    />
                </div>
                <div className="px-4">
                    <div className="border-b border-gray-200"></div>
                </div>
            </div>

            {/* Khu vực Danh sách Bài đăng */}
            <div className="p-4 flex flex-col gap-4">
                {!isLoading && !isError && (
                    <div className="text-sm text-gray-500 mb-1">
                        Tìm thấy <span className="font-bold text-[#e03c31]">{totalElements}</span> tin đăng phù hợp
                    </div>
                )}

                {isLoading ? (
                    Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex gap-4">
                            <Skeleton.Image className="!w-32 !h-32 rounded-lg" active />
                            <div className="flex-1">
                                <Skeleton active paragraph={{ rows: 3 }} title={{ width: '80%' }} />
                            </div>
                        </div>
                    ))
                ) : isError ? (
                    <div className="py-20 bg-white rounded-xl border border-gray-200">
                        <Empty description="Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau." />
                    </div>
                ) : posts.length > 0 ? (
                    <>
                        <div className="flex flex-col gap-4">
                            {posts.map((post: any) => (
                                <PostCard key={post.id} post={post} />
                            ))}
                        </div>

                        {totalElements > pageSize && (
                            <div className="mt-8 flex justify-center pb-6">
                                <Pagination
                                    current={page}
                                    pageSize={pageSize}
                                    total={totalElements}
                                    onChange={(newPage) => {
                                        updateUrl(filters, newPage);
                                        // 🌟 FIX CUỘN TRANG LÊN ĐẦU
                                        const scrollableDiv = document.querySelector('.overflow-y-auto');
                                        if (scrollableDiv) {
                                            scrollableDiv.scrollTo({ top: 0, behavior: 'smooth' });
                                        } else {
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }
                                    }}
                                    showSizeChanger={false}
                                    className="scale-90 sm:scale-100 custom-pagination"
                                />
                            </div>
                        )}
                    </>
                ) : (
                    <div className="py-20 ">
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

// 2. KHUNG XƯƠNG CHỜ (FALLBACK) CHỐNG VỠ LAYOUT
function RentFallback() {
    return (
        <div className="flex flex-col w-full bg-gray-50/30 min-h-screen">
            <div className="z-30 bg-white shadow-sm p-4 h-[76px] flex items-center">
                <Skeleton.Input active block style={{ height: 40 }} />
            </div>
            <div className="p-4 flex flex-col gap-4 mt-2">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex gap-4">
                        <Skeleton.Image className="!w-32 !h-32 rounded-lg" active />
                        <div className="flex-1">
                            <Skeleton active paragraph={{ rows: 3 }} title={{ width: '80%' }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// 3. PAGE CHÍNH BỌC SUSPENSE
export default function RentPage() {
    return (
        <Suspense fallback={<RentFallback />}>
            <RentContent />
        </Suspense>
    );
}