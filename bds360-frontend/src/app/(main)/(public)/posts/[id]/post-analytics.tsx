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

const { Title, Text } = Typography;

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
    const [months, setMonths] = useState<number>(12);
    const [showAllNearby, setShowAllNearby] = useState(false);
    const { updateUrl } = usePostFilterUrl(post.type);

    const analyticsParams = useMemo(() => ({
        type: post.type,
        categoryId: post.category?.id,
        // categoryId: undefined,
        provinceCode: post.provinceCode,
        districtCode: post.districtCode,
        // wardCode: post.wardCode,
        wardCode: undefined,

        months: months
    }), [post, months]);

    const { data: priceData, isLoading: isLoadingPrice } = useGetPriceHistory(analyticsParams);
    const { data: nearbyData, isLoading: isLoadingNearby } = useGetNearbyLocations(analyticsParams);

    const dynamicTitle = useMemo(() => {
        // const addressParts = [post.wardName, post.districtName].filter(Boolean).join(', ');
        const addressParts = [post.districtName, post.provinceName].filter(Boolean).join(', ');

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
        const sortedPayload = [...payload].sort((a, b) => {
            const order: Record<string, number> = { 'Cao nhất': 1, 'Trung bình': 2, 'Thấp nhất': 3 };
            return (order[a.value] || 4) - (order[b.value] || 4);
        });

        return (
            <div className="flex flex-wrap justify-center items-center gap-x-4 md:gap-x-6 gap-y-2 mt-6 text-[12px] md:text-[13px] text-gray-600">
                {sortedPayload.map((entry: any, index: number) => (
                    <div key={`item-${index}`} className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span>{entry.value}</span>
                    </div>
                ))}
                <div className="flex items-center gap-1.5">
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-40 ring-4 ring-red-100"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                    </span>
                    <span>
                        Giá đang xem: <span className="font-bold text-gray-800">{formatAnalyticsPrice(normalizedPrice, post.type)}</span>
                    </span>
                </div>
            </div>
        );
    };

    return (
        <div className={cn("flex flex-col gap-10", className)}>
            <div className="w-full">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div className="flex items-start gap-2 flex-1">
                        <Title level={4} className="!m-0 !text-base !font-semibold text-gray-700 leading-snug">
                            {dynamicTitle}
                        </Title>
                        <Tooltip title="Dữ liệu trung bình để tham khảo, không đại diện cho giá giao dịch thực tế.">
                            <InfoCircleOutlined className="text-gray-400 cursor-help text-base shrink-0 mt-0.5" />
                        </Tooltip>
                    </div>

                    <div className="flex items-center bg-gray-50 p-1 rounded-md border border-gray-200 shrink-0 self-end sm:self-center">
                        {[12, 24, 36].map(val => (
                            <button
                                key={val}
                                onClick={() => setMonths(val)}
                                className={cn(
                                    "px-3 py-1 text-[12px] font-medium rounded-md transition-all whitespace-nowrap",
                                    months === val ? "bg-white text-blue-600 shadow-sm border border-gray-200" : "text-gray-500 hover:text-gray-800 border border-transparent"
                                )}
                            >
                                {val / 12} năm
                            </button>
                        ))}
                    </div>
                </div>

                {isLoadingPrice ? (
                    <Skeleton active paragraph={{ rows: 8 }} />
                ) : priceData ? (
                    <div className="relative pt-2">
                        <div className="pl-2 mb-4 text-[11px] text-gray-400 italic">(Đơn vị: {unitLabel})</div>
                        <div className="h-[250px] md:h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={priceData.trend} margin={{ top: 15, right: 15, left: -25, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#bfbfbf' }} axisLine={{ stroke: '#f0f0f0' }} tickLine={false} dy={10} />
                                    <YAxis tickFormatter={formatYAxis} tick={{ fontSize: 11, fill: '#bfbfbf' }} axisLine={{ stroke: '#f0f0f0' }} tickLine={false} />
                                    <RechartsTooltip
                                        itemSorter={(item) => ({ maxPrice: 1, avgPrice: 2, minPrice: 3 }[item.dataKey as string] || 4)}
                                        formatter={(value: any, name: any) => [formatAnalyticsPrice(Number(value) || 0, post.type), name]}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
                                    />
                                    <Legend content={<CustomLegend />} />
                                    <ReferenceLine y={normalizedPrice} stroke="#ff4d4f" strokeDasharray="3 3" label={<CustomReferenceLabel />} />
                                    <Line type="linear" dataKey="maxPrice" name="Cao nhất" stroke="#cdbfd6" strokeWidth={1} dot={false} />
                                    <Line type="linear" dataKey="minPrice" name="Thấp nhất" stroke="#f8daa6" strokeWidth={1} dot={false} />
                                    <Line type="linear" dataKey="avgPrice" name="Trung bình" stroke="#1677ff" strokeWidth={2} dot={{ r: 3, fill: '#1677ff' }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                ) : (
                    <div className="py-10 text-center text-gray-400 text-sm">Không có dữ liệu thống kê.</div>
                )}
            </div>

            {(isLoadingNearby || (nearbyData && nearbyData.length > 0)) && (
                <div className="w-full">
                    <div className="mb-4">
                        <Title level={4} className="!m-0 !text-base !font-semibold text-gray-700">So sánh giá cùng một khu vực quận/huyện</Title>
                        <Text type="secondary" className="text-[12px]">Tại {post.districtName}</Text>
                    </div>

                    {isLoadingNearby ? (
                        <Skeleton active paragraph={{ rows: 4 }} />
                    ) : (
                        <div className="w-full border border-gray-100 rounded-lg overflow-hidden">
                            <div className="overflow-x-auto no-scrollbar">
                                <div className="min-w-[400px]">
                                    <div className="flex justify-between items-center bg-gray-50/50 px-4 py-3 border-b border-gray-100">
                                        <div className="flex-1 font-semibold text-[13px] text-gray-600">Khu vực</div>
                                        <div className="w-[180px] text-right font-semibold text-[13px] text-gray-600 pr-4">Giá phổ biến nhất</div>
                                        <div className="w-[80px]"></div>
                                    </div>

                                    <div className="bg-white">
                                        {displayNearbyData?.map((loc, index) => {
                                            const isCurrent = loc.locationCode === post.wardCode || loc.locationCode === post.districtCode;
                                            const price = getPriceParts(loc.avgPrice, post.type);
                                            return (
                                                <div
                                                    key={loc.locationCode}
                                                    className={cn(
                                                        "flex items-center px-4 py-3.5 cursor-pointer group transition-colors hover:bg-blue-50/30",
                                                        index !== displayNearbyData.length - 1 && "border-b border-gray-50"
                                                    )}
                                                    onClick={() => handleNearbyClick(loc)}
                                                >
                                                    <div className="flex-1 flex items-center gap-2 min-w-0">
                                                        <span className="text-[14px] text-gray-700 group-hover:text-blue-600 font-medium truncate">
                                                            {loc.locationName}
                                                        </span>
                                                        {isCurrent && (
                                                            <span className="text-[9px] bg-gray-400 text-white px-1.5 py-0.5 rounded flex-shrink-0 uppercase font-bold">Đang xem</span>
                                                        )}
                                                    </div>
                                                    <div className="w-[180px] text-right pr-4 shrink-0">
                                                        <span className="font-bold text-[15px] text-gray-800 group-hover:text-blue-600">{price.value}</span>
                                                        <span className="text-[11px] text-gray-400 ml-1">{price.unit}</span>
                                                    </div>
                                                    <div className="w-[80px] flex justify-end items-center gap-1.5 text-gray-400 group-hover:text-blue-600 shrink-0">
                                                        <span className="text-[12px]">{loc.activePostsCount} tin</span>
                                                        <RightOutlined className="text-[10px]" />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {hasMoreNearby && !showAllNearby && (
                        <div className="flex justify-center mt-4">
                            <button
                                onClick={() => setShowAllNearby(true)}
                                className="text-blue-600 hover:text-blue-800 text-sm font-semibold transition-colors py-2 px-4 rounded-md hover:bg-blue-50"
                            >
                                Xem tất cả khu vực
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}