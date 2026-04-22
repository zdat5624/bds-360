// @/app/(main)/(public)/posts/[id]/post-analytics.tsx
'use client';

import { useGetNearbyLocations, useGetPriceHistory } from '@/features/posts/api/posts.queries';
import { NearbyLocation, Post } from '@/features/posts/api/types';
import { usePostFilterUrl } from '@/features/posts/hooks/use-post-filter-url';
import { cn } from '@/lib/utils';
import { InfoCircleOutlined, RightOutlined } from '@ant-design/icons';
import { Skeleton, Tooltip, Typography } from 'antd';
import { useMemo, useState } from 'react';
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    Tooltip as RechartsTooltip,
    ReferenceLine,
    ResponsiveContainer,
    XAxis,
    YAxis
} from 'recharts';

const { Title } = Typography;

interface PostAnalyticsProps {
    post: Post;
    className?: string;
}

const formatAnalyticsPrice = (price: number, type: 'SALE' | 'RENT') => {
    if (!price) return '0';
    const value = price / 1000000;
    const unit = type === 'SALE' ? 'tr/m²' : 'tr/tháng';
    return `${Number.isInteger(value) ? value : value.toFixed(1)} ${unit}`;
};

const getPriceParts = (price: number, type: 'SALE' | 'RENT') => {
    if (!price) return { value: '0', unit: type === 'SALE' ? 'tr/m²' : 'tr/tháng' };
    const val = price / 1000000;
    return {
        value: Number.isInteger(val) ? val.toString() : val.toFixed(1),
        unit: type === 'SALE' ? 'tr/m²' : 'tr/tháng'
    };
};

const formatYAxis = (tickItem: number) => {
    const val = tickItem / 1000000;
    return Number.isInteger(val) ? val.toString() : val.toFixed(1);
};

export function PostAnalytics({ post, className }: PostAnalyticsProps) {
    const [months, setMonths] = useState<number>(24);
    const [showAllNearby, setShowAllNearby] = useState(false);

    const { updateUrl } = usePostFilterUrl(post.type);

    const analyticsParams = useMemo(() => ({
        type: post.type,
        categoryId: post.category?.id,
        provinceCode: post.provinceCode,
        districtCode: post.districtCode,
        wardCode: post.wardCode,
        months: months
    }), [post, months]);

    const { data: priceData, isLoading: isLoadingPrice } = useGetPriceHistory(analyticsParams);
    const { data: nearbyData, isLoading: isLoadingNearby } = useGetNearbyLocations(analyticsParams);

    const dynamicTitle = useMemo(() => {
        const addressParts = [post.wardName, post.districtName].filter(Boolean).join(', ');
        return `Lịch sử giá ${post.category?.name?.toLowerCase() || ''} tại ${addressParts}`;
    }, [post]);

    const unitLabel = post.type === 'SALE' ? "tr/m²" : "tr/tháng";
    const displayNearbyData = showAllNearby ? nearbyData : nearbyData?.slice(0, 5);
    const hasMoreNearby = nearbyData && nearbyData.length > 5;

    const normalizedPrice = post.type === 'SALE' && post.area > 0
        ? post.price / post.area
        : post.price;

    const handleNearbyClick = (loc: NearbyLocation) => {
        const filters: any = { type: post.type, provinceCode: post.provinceCode };
        if (loc.locationType === 'WARD') {
            filters.districtCode = post.districtCode;
            filters.wardCode = loc.locationCode;
        } else {
            filters.districtCode = loc.locationCode;
        }
        updateUrl(filters);
    };

    const CustomReferenceLabel = (props: any) => {
        const { viewBox } = props;
        if (!viewBox) return null;

        const cx = viewBox.x + viewBox.width;
        const cy = viewBox.y;

        return (
            <g>
                <circle cx={cx} cy={cy} r={7} fill="rgba(255, 77, 79, 0.2)" stroke="rgba(255, 77, 79, 0.1)" strokeWidth={3} />
                <circle cx={cx} cy={cy} r={3} fill="#ff4d4f" />
            </g>
        );
    };

    const CustomLegend = (props: any) => {
        const { payload } = props;

        // Sắp xếp lại Legend: Cao nhất -> Trung bình -> Thấp nhất
        const sortedPayload = [...payload].sort((a, b) => {
            const order: Record<string, number> = { 'Cao nhất': 1, 'Trung bình': 2, 'Thấp nhất': 3 };
            return (order[a.value] || 4) - (order[b.value] || 4);
        });

        return (
            <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 !mt-4 text-[13px] text-gray-600">
                {sortedPayload.map((entry: any, index: number) => (
                    <div key={`item-${index}`} className="flex items-center gap-1.5">
                        <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: entry.color }}
                        />
                        <span>{entry.value}</span>
                    </div>
                ))}

                <div className="flex items-center gap-1.5">
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-40 ring-4 ring-red-100"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                    </span>
                    <span>
                        Giá tin đang xem: <span className="font-bold text-gray-800">{formatAnalyticsPrice(normalizedPrice, post.type)}</span>
                    </span>
                </div>
            </div>
        );
    };

    return (
        <div className={cn("flex flex-col gap-4", className)}>

            {/* WIDGET 1: BIỂU ĐỒ LỊCH SỬ GIÁ */}
            <div className="w-full">
                <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                    <div className="flex items-start gap-2 flex-1 min-w-[250px]">
                        <Title
                            level={4}
                            className="!m-0 !text-base !font-medium tracking-normal text-gray-700 leading-snug"
                        >
                            {dynamicTitle}
                        </Title>
                        <Tooltip
                            title="Dữ liệu được tổng hợp từ các tin đăng trên hệ thống. Đây là mức giá trung bình để tham khảo, không đại diện cho giá giao dịch thực tế."
                            overlayClassName="max-w-xs"
                        >
                            <InfoCircleOutlined className="text-gray-400 cursor-help text-base shrink-0 mt-1" />
                        </Tooltip>
                    </div>

                    <div className="flex items-center bg-gray-50 p-1 rounded-md border border-gray-200 shrink-0">
                        {[
                            { label: '1 năm', value: 12 },
                            { label: '2 năm', value: 24 },
                            { label: '3 năm', value: 36 }
                        ].map(opt => (
                            <button
                                key={opt.value}
                                onClick={() => setMonths(opt.value)}
                                className={cn(
                                    "px-3 py-1 text-[13px] font-medium rounded-md transition-all duration-200 whitespace-nowrap",
                                    months === opt.value
                                        ? "bg-white text-blue-600 shadow-sm border border-gray-200"
                                        : "text-gray-500 hover:text-gray-800 border border-transparent"
                                )}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                {isLoadingPrice ? (
                    <Skeleton active paragraph={{ rows: 8 }} />
                ) : priceData ? (
                    <div className="relative pt-2">
                        <div className="pl-2 mb-2 text-xs text-gray-400 italic">
                            (Đơn vị: {unitLabel})
                        </div>

                        <div className="h-[280px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={priceData.trend}
                                    margin={{ top: 15, right: 15, left: -25, bottom: 0 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />

                                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#bfbfbf' }} axisLine={{ stroke: '#f0f0f0' }} tickLine={false} dy={10} />
                                    <YAxis tickFormatter={formatYAxis} tick={{ fontSize: 12, fill: '#bfbfbf' }} axisLine={{ stroke: '#f0f0f0' }} tickLine={false} />

                                    <RechartsTooltip
                                        // Sắp xếp lại Tooltip: Cao nhất -> Trung bình -> Thấp nhất
                                        itemSorter={(item) => {
                                            const order: Record<string, number> = { maxPrice: 1, avgPrice: 2, minPrice: 3 };
                                            return order[item.dataKey as string] || 4;
                                        }}
                                        formatter={(value: any, name: any) => [
                                            formatAnalyticsPrice(Number(value) || 0, post.type),
                                            name
                                        ]}
                                        labelStyle={{ fontWeight: 'bold', color: '#333', marginBottom: '8px' }}
                                        itemStyle={{ whiteSpace: 'nowrap' }}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
                                    />

                                    <Legend content={<CustomLegend />} />

                                    <ReferenceLine
                                        y={normalizedPrice}
                                        stroke="#ff4d4f"
                                        strokeDasharray="3 3"
                                        strokeWidth={1}
                                        opacity={0.6}
                                        ifOverflow="extendDomain"
                                        label={<CustomReferenceLabel />}
                                    />

                                    {/* Line max và min nằm trên cùng đoạn mã để vẽ ở lớp dưới */}
                                    <Line type="linear" dataKey="maxPrice" name="Cao nhất" stroke="#cdbfd6" strokeWidth={1} dot={false} activeDot={{ r: 4 }} />
                                    <Line type="linear" dataKey="minPrice" name="Thấp nhất" stroke="#f8daa6" strokeWidth={1} dot={false} activeDot={{ r: 4 }} />

                                    {/* Line avg nằm dưới cùng đoạn mã để luôn hiển thị đè lên trên (cao nhất) */}
                                    <Line type="linear" dataKey="avgPrice" name="Trung bình" stroke="#1677ff" strokeWidth={2} dot={{ r: 3, fill: '#1677ff', strokeWidth: 1 }} activeDot={{ r: 5, fill: '#1677ff', strokeWidth: 1 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                ) : (
                    <div className="py-10 text-center text-gray-400">Không có dữ liệu thống kê.</div>
                )}
            </div>

            {/* WIDGET 2: SO SÁNH KHU VỰC LÂN CẬN */}
            {(isLoadingNearby || (nearbyData && nearbyData.length > 0)) && (
                <div className="w-full">
                    {isLoadingNearby ? (
                        <Skeleton active paragraph={{ rows: 4 }} />
                    ) : (
                        <div className="flex flex-col w-full text-sm text-[#2c2c2c]">

                            <div className="border border-gray-100 rounded-md overflow-hidden">

                                <div className="flex justify-between items-center shadow-background shadow-sm px-4 py-3 border-b border-gray-100">
                                    <div className="flex-1">
                                        <div className="font-semibold text-[14px]">So sánh giá khu vực lân cận</div>
                                        <div className="text-gray-500 text-[11px] mt-0.5">Tại {post.districtName}</div>
                                    </div>
                                    <div className="whitespace-nowrap flex flex-col items-end pr-2">
                                        <div className="font-semibold text-[13px]">Giá {post.type === 'SALE' ? 'bán' : 'thuê'} phổ biến nhất</div>
                                        <div className="text-gray-500 text-[11px] mt-0.5">Tháng {new Date().getMonth() + 1}/{new Date().getFullYear()}</div>
                                    </div>
                                    <div className="w-[70px]"></div>
                                </div>

                                <div className="bg-white">
                                    {displayNearbyData?.map((loc, index) => {
                                        const isCurrentViewing = loc.locationCode === post.wardCode || loc.locationCode === post.districtCode;
                                        const priceObj = getPriceParts(loc.avgPrice, post.type);
                                        const isLastInDisplay = index === displayNearbyData.length - 1;

                                        return (
                                            <div
                                                key={loc.locationCode}
                                                className={cn(
                                                    "flex items-center px-4 py-3 cursor-pointer group transition-colors hover:bg-gray-50/80",
                                                    !isLastInDisplay && "border-b border-gray-100"
                                                )}
                                                onClick={() => handleNearbyClick(loc)}
                                            >
                                                <div className="flex-1 flex flex-row items-center gap-2">
                                                    <span className="text-[#2c2c2c] group-hover:text-blue-600 transition-colors font-medium">
                                                        {loc.locationName}
                                                    </span>
                                                    {isCurrentViewing && (
                                                        <span className="text-[8px] font-normal bg-gray-400 text-white px-1.5 py-0.5 rounded leading-none">
                                                            Đang xem
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="whitespace-nowrap flex flex-col items-end pr-2">
                                                    <div className="font-medium text-[15px] group-hover:text-blue-600 transition-colors">
                                                        {priceObj.value} <span className="font-normal text-xs text-gray-500">{priceObj.unit}</span>
                                                    </div>
                                                </div>

                                                <div className="w-[70px] flex justify-end items-center gap-1 text-xs text-gray-400 group-hover:text-blue-600">
                                                    <span>{loc.activePostsCount} tin</span>
                                                    <RightOutlined className="text-[10px]" />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {hasMoreNearby && !showAllNearby && (
                                <div
                                    className="text-center mt-3 pt-2 text-blue-600 cursor-pointer hover:underline text-sm font-medium"
                                    onClick={() => setShowAllNearby(true)}
                                >
                                    Xem tất cả khu vực
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

        </div>
    );
}