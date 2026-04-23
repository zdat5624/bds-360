// @/app/(main)/(public)/u/[id]/page.tsx
'use client';

import { PostSellerSidebar } from '@/app/(main)/(public)/posts/[id]/post-seller-sidebar';
import { ListingType } from '@/constants/listing.constant';
import { useGetPosts } from '@/features/posts/api/posts.queries';
import { ListingCard } from '@/features/posts/components/listing-card';
import { AppstoreOutlined } from '@ant-design/icons';
import { Empty, Pagination, Segmented, Select, Skeleton } from 'antd';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

// --- CẤU HÌNH SORT ĐÃ ĐƯỢC CẬP NHẬT TÊN HIỂN THỊ ---
const SORT_OPTIONS = [
    { label: 'Mới nhất', value: 'createdAt_DESC' },
    { label: 'Cũ nhất', value: 'createdAt_ASC' },
    { label: 'Giá: Thấp đến cao', value: 'price_ASC' },
    { label: 'Giá: Cao đến thấp', value: 'price_DESC' },
];

export default function UserProfilePage() {
    const params = useParams();
    const userId = Number(params.id);

    // --- STATES ---
    const [selectedType, setSelectedType] = useState<ListingType>('SALE');
    const [isTypeInitialized, setIsTypeInitialized] = useState(false);

    const [sortOption, setSortOption] = useState<string>('createdAt_DESC');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 12;

    const [sortBy, sortDirection] = sortOption.split('_');

    // --- QUERIES TÌM SỐ LƯỢNG ---
    const { data: saleData, isLoading: isLoadingSale } = useGetPosts('public', {
        userId,
        userEmail: '',
        type: 'SALE',
        size: 1,
        isApprovedOnly: true
    });

    const { data: rentData, isLoading: isLoadingRent } = useGetPosts('public', {
        userId,
        userEmail: '',
        type: 'RENT',
        size: 1,
        isApprovedOnly: true
    });

    const saleCount = saleData?.totalElements || 0;
    const rentCount = rentData?.totalElements || 0;
    const totalCount = saleCount + rentCount;

    // --- LOGIC AUTO-SELECT TAB ---
    useEffect(() => {
        if (!isTypeInitialized && !isLoadingSale && !isLoadingRent) {
            if (rentCount > saleCount) {
                setSelectedType('RENT');
            } else {
                setSelectedType('SALE');
            }
            setIsTypeInitialized(true);
        }
    }, [isLoadingSale, isLoadingRent, saleCount, rentCount, isTypeInitialized]);

    // --- QUERY DATA CHÍNH ---
    const { data: mainData, isLoading: isLoadingMain, isFetching } = useGetPosts('public', {
        userId,
        userEmail: '',
        type: selectedType,
        page: currentPage - 1,
        size: pageSize,
        sortBy,
        sortDirection: sortDirection as 'ASC' | 'DESC',
        isApprovedOnly: true
    });

    // Lấy thông tin User để truyền vào Sidebar
    const userInfo = useMemo(() => {
        return mainData?.content?.[0]?.user
            || saleData?.content?.[0]?.user
            || rentData?.content?.[0]?.user;
    }, [mainData, saleData, rentData]);

    const isInitialLoading = isLoadingSale || isLoadingRent || !isTypeInitialized;

    // --- HANDLERS ---
    const handleTypeChange = (value: string) => {
        setSelectedType(value as ListingType);
        setCurrentPage(1);
    };

    const handleSortChange = (value: string) => {
        setSortOption(value);
        setCurrentPage(1);
    };

    return (
        <main className="min-h-screen  py-4">
            <div className="max-w-[1200px] mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">

                    {/* ==========================================
                        CỘT TRÁI: SIDEBAR USER PROFILE
                    ========================================== */}
                    <div className="lg:col-span-1">
                        {isInitialLoading && !userInfo ? (
                            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                                <Skeleton.Avatar active size={64} shape="circle" className="mx-auto block mb-4" />
                                <Skeleton paragraph={{ rows: 4 }} active />
                            </div>
                        ) : userInfo ? (
                            <PostSellerSidebar user={userInfo} />
                        ) : (
                            <div className="bg-white p-5 rounded-2xl shadow-sm text-center border border-gray-100">
                                <div className="w-16 h-16 rounded-full bg-gray-100 mx-auto mb-3 flex items-center justify-center">
                                    <span className="text-gray-400 font-bold">U</span>
                                </div>
                                <h3 className="font-bold text-gray-800">Người dùng ẩn danh</h3>
                                <p className="text-sm text-gray-500">Chưa có thông tin</p>
                            </div>
                        )}
                    </div>

                    {/* ==========================================
                        CỘT PHẢI: NỘI DUNG CHÍNH
                    ========================================== */}
                    <div className="lg:col-span-3 flex flex-col min-w-0">

                        {/* 1. WIDGET THỐNG KÊ */}
                        <div className="bg-white rounded-2xl p-5 mb-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                                    <AppstoreOutlined className="text-blue-600 text-lg" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900 leading-tight">Danh sách tin đăng</h2>
                                    <p className="text-gray-500 text-sm mt-0.5">
                                        Tài khoản này đang có <strong className="text-[#0068FF]">{totalCount}</strong> tin đang rao
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <div className="bg-green-50/80 border border-green-100 px-4 py-2 rounded-xl text-center min-w-[90px]">
                                    <div className="text-green-600 font-bold text-lg leading-none mb-1">{saleCount}</div>
                                    <div className="text-green-700 text-[10px] font-semibold uppercase tracking-wide">Mua bán</div>
                                </div>
                                <div className="bg-orange-50/80 border border-orange-100 px-4 py-2 rounded-xl text-center min-w-[90px]">
                                    <div className="text-orange-600 font-bold text-lg leading-none mb-1">{rentCount}</div>
                                    <div className="text-orange-700 text-[10px] font-semibold uppercase tracking-wide">Cho thuê</div>
                                </div>
                            </div>
                        </div>

                        {/* 2. CONTROLS HEADER */}
                        <div className="  pb-4 pt-1">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <Segmented
                                    size="large"
                                    value={selectedType}
                                    onChange={handleTypeChange}
                                    className="font-medium shadow-sm !p-1 bg-white border border-gray-200/60"
                                    options={[
                                        { label: `Mua bán (${saleCount})`, value: 'SALE' },
                                        { label: `Cho thuê (${rentCount})`, value: 'RENT' },
                                    ]}
                                />

                                <Select
                                    size="large"
                                    value={sortOption}
                                    onChange={handleSortChange}
                                    options={SORT_OPTIONS}
                                    className="w-full sm:w-[180px] shadow-sm"
                                    placement="bottomRight"
                                />
                            </div>
                        </div>

                        {/* 3. DANH SÁCH LISTING CARD */}
                        {isInitialLoading || (isFetching && !mainData) ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[1, 2, 3, 4, 5, 6].map((key) => (
                                    <div key={key} className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm h-[320px]">
                                        <Skeleton.Image active className="!w-full !h-[160px] mb-4 rounded-lg" />
                                        <Skeleton active title={{ width: '80%' }} paragraph={{ rows: 2 }} />
                                    </div>
                                ))}
                            </div>
                        ) : mainData?.content && mainData.content.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {mainData.content.map((post) => (
                                        <ListingCard key={post.id} post={post} />
                                    ))}
                                </div>

                                {mainData.totalElements > pageSize && (
                                    <div className="flex justify-center mt-12 mb-4">
                                        <Pagination
                                            current={currentPage}
                                            pageSize={pageSize}
                                            total={mainData.totalElements}
                                            onChange={(page) => {
                                                setCurrentPage(page);
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }}
                                            showSizeChanger={false}
                                        />
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-20 flex flex-col items-center justify-center">
                                <Empty
                                    description={
                                        <span className="text-gray-500">
                                            Người dùng chưa có tin {selectedType === 'SALE' ? 'mua bán' : 'cho thuê'} nào.
                                        </span>
                                    }
                                />
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </main>
    );
}