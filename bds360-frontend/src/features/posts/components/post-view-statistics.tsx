// @/features/posts/components/post-view-statistics.tsx

'use client';

import { DATE_FORMAT, formatDate } from '@/utils/date.util';
import { Card, Empty, Select, Skeleton, Typography } from 'antd';
import { useMemo, useState } from 'react';
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { useGetPostViewsDaily, useGetPostViewsMonthly } from '../api/posts.queries';
import { PostViewChartResponse } from '../api/types';

const { Title } = Typography;

interface PostViewStatisticsProps {
    postId: number;
}

export function PostViewStatistics({ postId }: PostViewStatisticsProps) {
    const [viewMode, setViewMode] = useState<'daily' | 'monthly'>('daily');
    const [limit, setLimit] = useState<number>(14);

    const { data: dailyData, isFetching: isLoadingDaily } = useGetPostViewsDaily(
        postId,
        limit,
        viewMode === 'daily'
    );
    const { data: monthlyData, isFetching: isLoadingMonthly } = useGetPostViewsMonthly(
        postId,
        limit,
        viewMode === 'monthly'
    );

    const isLoading = viewMode === 'daily' ? isLoadingDaily : isLoadingMonthly;

    const chartData = useMemo(() => {
        const rawData = viewMode === 'daily' ? dailyData : monthlyData;
        if (!rawData || rawData.length === 0) return [];

        return rawData.map((item: PostViewChartResponse) => {
            const formattedLabel =
                viewMode === 'daily'
                    ? formatDate(item.date, DATE_FORMAT.SHORT_DATE)
                    : formatDate(item.date, DATE_FORMAT.MONTH_YEAR);

            return {
                ...item,
                label: formattedLabel,
                views: item.views || 0,
            };
        });
    }, [dailyData, monthlyData, viewMode]);

    const handleModeChange = (mode: 'daily' | 'monthly') => {
        setViewMode(mode);
        setLimit(mode === 'daily' ? 14 : 6);
    };

    const limitOptions = viewMode === 'daily'
        ? [
            { label: '14 ngày qua', value: 14 },
            { label: '30 ngày qua', value: 30 },
            { label: '60 ngày qua', value: 60 },
        ]
        : [
            { label: '6 tháng qua', value: 6 },
            { label: '12 tháng qua', value: 12 },
            { label: '18 tháng qua', value: 18 },
            { label: '24 tháng qua', value: 24 },
        ];

    return (
        <Card className="w-full shadow-sm rounded-lg border border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <Title level={5} className="!m-0 text-gray-800 font-semibold">
                    Thống kê lượt xem
                </Title>

                <div className="flex items-center gap-2">
                    <Select
                        value={viewMode}
                        onChange={handleModeChange}
                        style={{ width: 120 }}
                        options={[
                            { label: 'Theo ngày', value: 'daily' },
                            { label: 'Theo tháng', value: 'monthly' },
                        ]}
                    />

                    <Select
                        value={limit}
                        onChange={(value) => setLimit(value)}
                        style={{ width: 130 }}
                        options={limitOptions}
                    />
                </div>
            </div>

            <div className="w-full h-[320px]">
                {isLoading ? (
                    <Skeleton.Node active style={{ width: '100%', height: '300px' }} />
                ) : chartData.length === 0 ? (
                    <div className="w-full h-full flex items-center justify-center">
                        <Empty description="Chưa có dữ liệu thống kê" />
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={chartData}
                            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                            {/* Định nghĩa Gradient cho vùng Area */}
                            <defs>
                                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#1677ff" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#1677ff" stopOpacity={0} />
                                </linearGradient>
                            </defs>

                            <CartesianGrid
                                strokeDasharray="2 2"
                                vertical={false}
                                stroke="#F3F4F6"
                            />

                            <XAxis
                                dataKey="label"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#9CA3AF', fontSize: 11 }}
                                angle={-45}           // Xoay nghiêng 45 độ
                                textAnchor="end"      // Gắn đuôi chữ vào đúng vị trí mốc dữ liệu

                                // 2. Tăng chiều cao vùng chứa trục X (Bắt buộc khi xoay để không mất chữ)
                                height={60}

                                // 3. Kết hợp khoảng cách thông minh
                                interval="preserveStartEnd"
                                minTickGap={10}       // Khoảng cách giữa các nhãn sau khi đã xoay

                                dy={10}               // Đẩy chữ xuống một chút để không dính vào đường line
                            />

                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                allowDecimals={false}
                            />

                            <Tooltip
                                cursor={{ stroke: '#1677ff', strokeWidth: 1, strokeDasharray: '4 4' }}
                                contentStyle={{
                                    borderRadius: '12px',
                                    border: 'none',
                                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                    padding: '10px'
                                }}
                                formatter={(value: ValueType | undefined, name, props) => [
                                    <span key={`count-${props?.dataKey}`} style={{ color: '#1677ff', fontWeight: 'bold' }}>
                                        {value ?? 0} lượt
                                    </span>,
                                    'Lượt xem'
                                ]}
                                labelStyle={{ color: '#6B7280', marginBottom: '4px' }}
                            />

                            <Area
                                type="monotone"
                                dataKey="views"
                                stroke="#1677ff"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorViews)"
                                dot={{
                                    r: 2.5,
                                    strokeWidth: 0.6,
                                    fill: '#fff',
                                    stroke: '#1677ff',
                                    filter: 'drop-shadow(0 2px 4px rgba(22,119,255,0.3))'
                                }}
                                activeDot={{
                                    r: 5,
                                    fill: '#1677ff',
                                    stroke: '#fff',
                                    strokeWidth: 0.6,
                                    filter: 'drop-shadow(0 4px 8px rgba(22,119,255,0.5))'
                                }}
                                animationDuration={1500}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </div>
        </Card>
    );
}

