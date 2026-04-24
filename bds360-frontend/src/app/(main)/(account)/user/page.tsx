// @/app/(main)/(account)/user/page.tsx
'use client';

import { VIP_PACKAGES } from '@/constants';
import { POST_STATUS_LABEL, USER_POST_STATUS_DISPLAY } from '@/features/posts/posts.constant';
import {
    useGetCashFlowChart,
    useGetPostStatusBreakdown,
    useGetTopPosts,
    useGetUserKpiSummary,
    useGetUserViewsChart,
} from '@/features/statistics/api/user-statistics.queries';
import { useAppTheme } from '@/hooks/use-app-theme';
import { formatNumber } from '@/utils/number.util';
import {
    CheckCircleOutlined,
    EyeOutlined,
    HistoryOutlined,
    LineChartOutlined,
    RiseOutlined,
    WalletOutlined,
} from '@ant-design/icons';
import { Card, Col, Empty, Row, Select, Skeleton, Space, Table, Tag, Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    XAxis,
    YAxis,
} from 'recharts';

const { Title, Text } = Typography;

// Hệ màu đồng bộ SaaS
const PIE_COLORS = ['#52c41a', '#faad14', '#f5222d', '#8c8c8c', '#1890ff'];

export default function UserDashboard() {
    const { colorPrimary } = useAppTheme();
    const [isMounted, setIsMounted] = useState(false);

    // --- State cho bộ lọc thời gian ---
    const [viewPeriod, setViewPeriod] = useState(30); // ngày
    const [cashPeriod, setCashPeriod] = useState(6); // tháng

    useEffect(() => setIsMounted(true), []);

    // --- QUERIES ---
    const { data: kpis, isLoading: loadingKpi } = useGetUserKpiSummary();
    const { data: viewsData, isLoading: loadingViews } = useGetUserViewsChart(viewPeriod);
    const { data: rawStatusData, isLoading: loadingStatus } = useGetPostStatusBreakdown();
    const { data: topPosts, isLoading: loadingTop } = useGetTopPosts(5);
    const { data: cashFlow, isLoading: loadingCash } = useGetCashFlowChart(cashPeriod);

    // --- LOGIC: Gộp REVIEW_LATER vào APPROVED và Đồng bộ nhãn ---
    const processedStatusData = useMemo(() => {
        if (!rawStatusData) return [];
        const mergedMap: Record<string, number> = {};

        rawStatusData.forEach((item) => {
            const displayStatus = USER_POST_STATUS_DISPLAY[item.status] || item.status;
            mergedMap[displayStatus] = (mergedMap[displayStatus] || 0) + item.count;
        });

        return Object.entries(mergedMap).map(([status, count]) => ({
            status,
            label: status === 'APPROVED' ? 'Đang hoạt động' : POST_STATUS_LABEL[status as keyof typeof POST_STATUS_LABEL],
            count,
        }));
    }, [rawStatusData]);

    if (!isMounted) return null;

    return (
        <div className="flex flex-col gap-6 pb-10">
            {/* --- HEADER --- */}
            <div>
                <Title level={3} className="!mb-1 !font-bold tracking-tight">Tổng quan tài khoản</Title>
                <Text type="secondary">Chào mừng bạn! Theo dõi hiệu quả tin đăng và dòng tiền của bạn tại đây.</Text>
            </div>

            {/* --- 4 KPI CARDS --- */}
            <Row gutter={[20, 20]}>
                <Col xs={24} sm={12} xl={6}>
                    <StatsCard
                        title="Số dư khả dụng"
                        value={kpis?.availableBalance || 0}
                        suffix="đ"
                        icon={<WalletOutlined />}
                        loading={loadingKpi}
                        accentColor="#1890ff"
                    />
                </Col>
                <Col xs={24} sm={12} xl={6}>
                    <StatsCard
                        title="Tin đang hoạt động"
                        value={kpis?.activePosts || 0}
                        icon={<CheckCircleOutlined />}
                        loading={loadingKpi}
                        accentColor="#52c41a"
                    />
                </Col>
                <Col xs={24} sm={12} xl={6}>
                    <StatsCard
                        title="Tổng lượt xem"
                        value={kpis?.totalViews || 0}
                        icon={<EyeOutlined />}
                        loading={loadingKpi}
                        accentColor="#722ed1"
                    />
                </Col>
                <Col xs={24} sm={12} xl={6}>
                    <StatsCard
                        title="Chi tiêu tháng này"
                        value={kpis?.monthlySpending || 0}
                        suffix="đ"
                        icon={<RiseOutlined />}
                        loading={loadingKpi}
                        accentColor="#faad14"
                    />
                </Col>
            </Row>

            {/* --- MAIN CHARTS --- */}
            <Row gutter={[20, 20]}>
                {/* Lượt tiếp cận tin đăng */}
                <Col xs={24} lg={16}>
                    <Card
                        title={<Space><LineChartOutlined /><span>Lượt tiếp cận tin đăng</span></Space>}
                        extra={
                            <Select
                                value={viewPeriod}
                                onChange={setViewPeriod}
                                size="small"
                                className="w-32"
                                options={[
                                    { label: '30 ngày qua', value: 30 },
                                    { label: '6 tháng qua', value: 180 },
                                    { label: '1 năm qua', value: 365 },
                                ]}
                            />
                        }
                        className="rounded-2xl border-none shadow-sm h-full"
                    >
                        {loadingViews ? <Skeleton active paragraph={{ rows: 8 }} /> : (
                            <div className="h-[320px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={viewsData}>
                                        <defs>
                                            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={colorPrimary} stopOpacity={0.15} />
                                                <stop offset="95%" stopColor={colorPrimary} stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#bfbfbf' }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#bfbfbf' }} />
                                        <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }} />
                                        <Area type="monotone" dataKey="views" name="Lượt xem" stroke={colorPrimary} strokeWidth={3} fill="url(#colorViews)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </Card>
                </Col>

                {/* Donut Chart: Trạng thái tin */}
                <Col xs={24} lg={8}>
                    <Card title="Trạng thái bài đăng" className="rounded-2xl border-none shadow-sm h-full">
                        {loadingStatus ? <Skeleton active paragraph={{ rows: 5 }} /> : (
                            <div className="h-[320px] w-full flex flex-col items-center justify-center">
                                <ResponsiveContainer width="100%" height={220}>
                                    <PieChart>
                                        <Pie
                                            data={processedStatusData}
                                            innerRadius={65}
                                            outerRadius={85}
                                            paddingAngle={8}
                                            dataKey="count"
                                            nameKey="label"
                                        >
                                            {processedStatusData.map((_, index) => (
                                                <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} stroke="none" />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 w-full px-4">
                                    {processedStatusData.map((item, index) => (
                                        <div key={item.status} className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }} />
                                            <span className="text-[12px] text-gray-500 truncate">{item.label}: <b>{item.count}</b></span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </Card>
                </Col>
            </Row>

            <Row gutter={[20, 20]}>
                {/* Biến động thu chi */}
                <Col xs={24} lg={12}>
                    <Card
                        title={<Space><HistoryOutlined /><span>Biến động thu chi</span></Space>}
                        extra={
                            <Select
                                value={cashPeriod}
                                onChange={setCashPeriod}
                                size="small"
                                className="w-32"
                                options={[
                                    { label: '6 tháng qua', value: 6 },
                                    { label: '1 năm qua', value: 12 },
                                    { label: '3 năm qua', value: 36 },
                                ]}
                            />
                        }
                        className="rounded-2xl border-none shadow-sm"
                    >
                        {loadingCash ? <Skeleton active paragraph={{ rows: 6 }} /> : (
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={cashFlow} margin={{ top: 20 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                                        <YAxis hide />
                                        <RechartsTooltip cursor={{ fill: '#fafafa' }} contentStyle={{ borderRadius: '10px', border: 'none' }} />
                                        <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: 20 }} />
                                        {/* Nạp tiền: Xanh lá */}
                                        <Bar dataKey="depositAmount" name="Nạp tiền" fill="#52c41a" radius={[4, 4, 0, 0]} barSize={16} />
                                        {/* Tiêu dùng: Vàng Gold */}
                                        <Bar dataKey="paymentAmount" name="Tiêu dùng" fill="#faad14" radius={[4, 4, 0, 0]} barSize={16} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </Card>
                </Col>

                {/* Top tin đăng hiệu quả */}
                <Col xs={24} lg={12}>
                    <Card title="Bài đăng hiệu quả nhất" className="rounded-2xl border-none shadow-sm h-full">
                        {loadingTop ? <Skeleton active /> : (
                            <Table
                                dataSource={topPosts}
                                pagination={false}
                                size="middle"
                                rowKey="postId"
                                columns={[
                                    {
                                        title: 'Tin đăng',
                                        dataIndex: 'title',
                                        key: 'title',
                                        // width: "100%",
                                        render: (text, record) => {
                                            const vipInfo = VIP_PACKAGES.find(v => v.shortName === record.vipName);
                                            return (
                                                <div className="flex items-center gap-2 max-w-[150px] md:max-w-[400px]">
                                                    <Text strong className="truncate min-w-0 flex-1">
                                                        {text}
                                                    </Text>
                                                    <Tag color={vipInfo?.tagColor || 'default'} className="shrink-0 text-[10px] px-1.5">
                                                        {record.vipName}
                                                    </Tag>


                                                </div>

                                            );



                                        },
                                    },

                                    {
                                        title: 'Lượt xem',
                                        dataIndex: 'views',
                                        key: 'views',
                                        align: 'right',
                                        width: 140,
                                        render: (val) => (
                                            <Space className="text-blue-600 font-bold">
                                                <EyeOutlined />
                                                {formatNumber(val)}
                                            </Space>
                                        )
                                    }
                                ]}
                                locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Chưa có dữ liệu" /> }}

                                scroll={{ x: 500 }}
                            />
                        )}
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

// --- SUB-COMPONENT: STATS CARD ---
function StatsCard({ title, value, suffix = '', icon, loading, accentColor }: any) {
    return (
        <Card className="rounded-xl border-none shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden min-h-[96px]">
            {loading ? <Skeleton active paragraph={{ rows: 1 }} title={false} /> : (
                <div className="flex items-center gap-4 py-1">
                    <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
                        style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
                    >
                        {icon}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <Text type="secondary" className="text-[11px] font-bold uppercase tracking-wider mb-0.5 opacity-70">{title}</Text>
                        <div className="flex items-baseline gap-1">
                            {/* 🔥 GIẢM ĐỘ ĐẬM: Đổi từ font-black sang font-bold (700) */}
                            <span className="text-xl font-bold text-gray-800">
                                {typeof value === 'number' ? formatNumber(value) : value}
                            </span>
                            {suffix && <span className="text-xs font-semibold text-gray-400">{suffix}</span>}
                        </div>
                    </div>
                </div>
            )}
        </Card>
    );
}