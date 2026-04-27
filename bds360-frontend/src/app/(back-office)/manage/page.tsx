// @/app/(back-office)/manage/page.tsx
'use client';

import { useAppTheme } from '@/hooks/use-app-theme';
import { formatCurrency, formatNumber } from '@/utils/number.util';
import {
    AlertOutlined,
    ArrowDownOutlined,
    ArrowRightOutlined,
    ArrowUpOutlined,
    ContainerOutlined,
    CrownOutlined,
    DollarOutlined,
    TeamOutlined
} from '@ant-design/icons';
import {
    Avatar,
    Card, Col,
    Flex,
    Progress,
    Row, Select,
    Skeleton,
    Table,
    Tag,
    Typography
} from 'antd';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
    Bar, CartesianGrid, Cell, ComposedChart, Line, Pie, PieChart,
    ResponsiveContainer, Tooltip, XAxis, YAxis
} from 'recharts';

import { APP_ROUTES } from '@/config/routes';
import { LISTING_TYPE_LABEL } from '@/constants/listing.constant';
import { getPageMeta } from '@/constants/menus.constant';
import { VIP_PACKAGES } from '@/constants/vip-packages.constant';
import { useGetSystemOverviewStats } from '@/features/statistics/api/manage-overview-statistics.queries';

const { Title, Text } = Typography;

const DEMAND_COLORS = ['#1890ff', '#52c41a', '#faad14'];
const TOP_PROVINCE_COLOR = '#722ed1';

export default function SystemOverviewPage() {
    const { colorPrimary, colorBgLayout } = useAppTheme();
    const [daysFilter, setDaysFilter] = useState<number>(30);

    const { data: dashboardData, isLoading } = useGetSystemOverviewStats(daysFilter);
    const kpis = dashboardData?.kpis;
    const backlog = dashboardData?.backlog;

    const vipChartData = useMemo(() => {
        if (!dashboardData?.vipDistributions) return [];
        return dashboardData.vipDistributions.map(item => {
            const pkg = VIP_PACKAGES.find(p => p.vipLevel === item.vipLevel);
            return {
                name: pkg?.shortName || `VIP ${item.vipLevel}`,
                value: item.count,
                color: pkg?.themeColor || '#d9d9d9',
            };
        });
    }, [dashboardData?.vipDistributions]);

    const { icon, title } = getPageMeta(APP_ROUTES.MANAGE.DASHBOARD);


    return (
        <Flex vertical gap={20} style={{ background: colorBgLayout, minHeight: '100%' }}>
            <Flex justify="space-between" align="end" wrap="wrap" gap={12}>
                <Flex vertical>

                    <Title level={3} style={{ margin: 0 }}>
                        <span style={{ marginRight: 8 }}>{icon}</span>
                        {title}
                    </Title>
                    <Text type="secondary" style={{ marginTop: 4 }}>
                        Bức tranh toàn cảnh về sức khỏe tài chính, vận hành và người dùng.
                    </Text>
                </Flex>

                <Select
                    value={daysFilter}
                    onChange={setDaysFilter}
                    variant="filled"
                    style={{ width: 150, height: 36 }}
                    options={[
                        { label: 'Hôm nay', value: 1 },
                        { label: '7 ngày qua', value: 7 },
                        { label: '30 ngày qua', value: 30 },
                        { label: 'Năm nay', value: 365 },
                    ]}
                />
            </Flex>

            <Card className="rounded-xl border-none shadow-sm" styles={{ body: { padding: '16px 24px' } }}>
                <Row gutter={[24, 16]} align="middle">
                    <Col xs={24} md={4} xl={3}>
                        <Flex align="center" gap={8}>
                            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#fff1f0', color: '#ff4d4f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                                <AlertOutlined />
                            </div>
                            <Text strong style={{ fontSize: 13 }}>Việc cần làm</Text>
                        </Flex>
                    </Col>

                    <Col xs={24} md={20} xl={21}>
                        <Flex gap={24} wrap="wrap" className="w-full">
                            <Link href={APP_ROUTES.MANAGE.POSTS} className="flex-1 min-w-[200px] hover:opacity-80 transition-opacity" style={{ display: 'block' }}>
                                <Flex align="center" gap={12}>
                                    <div style={{ width: 4, height: 40, background: '#faad14', borderRadius: 4 }} />
                                    <Flex vertical>
                                        <Text type="secondary" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Chờ xử lý</Text>
                                        <Text style={{ fontSize: 20, fontWeight: 700, color: '#141414' }}>{formatNumber(backlog?.pendingPosts || 0)} <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>tin đăng</Text></Text>
                                    </Flex>
                                </Flex>
                            </Link>

                            <Link href={APP_ROUTES.MANAGE.STATISTICS.USERS} className="flex-1 min-w-[200px] hover:opacity-80 transition-opacity" style={{ display: 'block' }}>
                                <Flex align="center" gap={12}>
                                    <div style={{ width: 4, height: 40, background: '#1890ff', borderRadius: 4 }} />
                                    <Flex vertical>
                                        <Text type="secondary" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Định danh (KYC)</Text>
                                        <Text style={{ fontSize: 20, fontWeight: 700, color: '#141414' }}>{formatNumber(backlog?.pendingVerifications || 0)} <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>yêu cầu</Text></Text>
                                    </Flex>
                                </Flex>
                            </Link>

                            <Link href={APP_ROUTES.MANAGE.STATISTICS.TRANSACTIONS} className="flex-1 min-w-[200px] hover:opacity-80 transition-opacity" style={{ display: 'block' }}>
                                <Flex align="center" gap={12}>
                                    <div style={{ width: 4, height: 40, background: '#ff4d4f', borderRadius: 4 }} />
                                    <Flex vertical>
                                        <Text type="secondary" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Giao dịch nạp lỗi</Text>
                                        <Text style={{ fontSize: 20, fontWeight: 700, color: '#141414' }}>{formatNumber(backlog?.pendingDeposits || 0)} <Text type="secondary" style={{ fontSize: 12, fontWeight: 500 }}>cảnh báo</Text></Text>
                                    </Flex>
                                </Flex>
                            </Link>
                        </Flex>
                    </Col>
                </Row>
            </Card>

            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} xl={6}>
                    <StatsCard
                        title="Tổng doanh thu"
                        value={kpis?.totalRevenue || 0}
                        isCurrency
                        icon={<DollarOutlined />}
                        color="#52c41a"
                        trend={kpis?.revenueGrowthPercent}
                        isLoading={isLoading}
                        footer={
                            <Link href={APP_ROUTES.MANAGE.STATISTICS.TRANSACTIONS} className="hover:opacity-80 block w-full">
                                <Flex align="center" gap={4}>
                                    <Text type="secondary" style={{ fontSize: 12 }}>Xem báo cáo dòng tiền</Text>
                                    <ArrowRightOutlined style={{ fontSize: 10, color: '#8c8c8c' }} />
                                </Flex>
                            </Link>
                        }
                    />
                </Col>
                <Col xs={24} sm={12} xl={6}>
                    <StatsCard
                        title="Thành viên hoạt động"
                        value={kpis?.activeUsers || 0}
                        icon={<TeamOutlined />}
                        color="#1890ff"
                        isLoading={isLoading}
                        footer={
                            <Link href={APP_ROUTES.MANAGE.STATISTICS.USERS} className="hover:opacity-80 block w-full">
                                <Flex align="center" gap={4}>
                                    <Text type="secondary" style={{ fontSize: 12 }}>Xem báo cáo người dùng</Text>
                                    <ArrowRightOutlined style={{ fontSize: 10, color: '#8c8c8c' }} />
                                </Flex>
                            </Link>
                        }
                    />
                </Col>
                <Col xs={24} sm={12} xl={6}>
                    <StatsCard
                        title="Tổng tin hiển thị"
                        value={kpis?.activeListings || 0}
                        icon={<ContainerOutlined />}
                        color="#722ed1"
                        isLoading={isLoading}
                        footer={
                            <Text type="secondary" style={{ fontSize: 12 }}>
                                Tin đăng đang hoạt động
                            </Text>
                        }
                    />
                </Col>
                <Col xs={24} sm={12} xl={6}>
                    <StatsCard
                        title="Tỷ lệ phủ VIP"
                        value={kpis?.vipConversionRate || 0}
                        suffix="%"
                        icon={<CrownOutlined />}
                        color="#eb2f96"
                        isLoading={isLoading}
                        footer={
                            <Flex align="center" style={{ height: 32, width: '100%' }}>
                                <Progress percent={kpis?.vipConversionRate || 0} size="small" showInfo={false} strokeColor="#eb2f96" railColor="#f0f0f0" strokeWidth={6} />
                            </Flex>
                        }
                    />
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                <Col xs={24} lg={16}>
                    <ChartCard title="Tăng trưởng Vĩ mô (Doanh thu & Khách hàng)" isLoading={isLoading}>
                        <ResponsiveContainer width="100%" height={320}>
                            {/* Tăng top margin để có chỗ hiển thị Label đơn vị */}
                            <ComposedChart data={dashboardData?.macroTrends || []} margin={{ top: 35, right: 20, bottom: 0, left: 10 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#bfbfbf' }} tickFormatter={(val) => dayjs(val).format('DD/MM')} />

                                <YAxis
                                    yAxisId="left"
                                    axisLine={{ stroke: '#f5f5f5' }}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: '#bfbfbf' }}
                                    tickFormatter={(val) => formatCompactMoney(val)}
                                    width={60}
                                    label={{ value: 'VNĐ', position: 'top', offset: 15, fontSize: 11, fill: '#8c8c8c', fontWeight: 600 }}
                                />
                                <YAxis
                                    yAxisId="right"
                                    orientation="right"
                                    axisLine={{ stroke: '#f5f5f5' }}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: '#bfbfbf' }}
                                    width={40}
                                    label={{ value: 'Tài khoản', position: 'top', offset: 15, fontSize: 11, fill: '#8c8c8c', fontWeight: 600 }}
                                />

                                <Tooltip content={<CustomComposedTooltip />} cursor={{ fill: '#f5f5f5' }} />

                                <Bar yAxisId="left" dataKey="revenue" name="Doanh thu" fill={colorPrimary} radius={[4, 4, 0, 0]} maxBarSize={40} />
                                {/* Giảm strokeWidth xuống 2, tắt dot */}
                                <Line yAxisId="right" type="monotone" dataKey="newUsers" name="Thành viên mới" stroke="#52c41a" strokeWidth={2} dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </Col>

                <Col xs={24} lg={8}>
                    <ChartCard title="Phân bổ tin VIP" isLoading={isLoading}>
                        <Flex vertical align="center" justify="center" style={{ height: 320 }}>
                            <ResponsiveContainer width="100%" height={240}>
                                <PieChart>
                                    <Pie data={vipChartData} innerRadius={70} outerRadius={90} paddingAngle={8} dataKey="value" stroke="none">
                                        {vipChartData.map((entry, idx) => <Cell key={`cell-${idx}`} fill={entry.color} />)}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip unit="tin" />} />
                                </PieChart>
                            </ResponsiveContainer>
                            <CustomLegend data={vipChartData} unit="tin" />
                        </Flex>
                    </ChartCard>
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                <Col xs={24} xl={12}>
                    <Card
                        title={<Flex align="center" gap={8}><CrownOutlined style={{ color: '#faad14', fontSize: 14 }} /><Text strong style={{ fontSize: 14 }}>Top khách hàng chi tiêu</Text></Flex>}
                        className="rounded-xl shadow-sm border-none h-full"
                    >
                        <Table
                            dataSource={dashboardData?.topSpenders || []}
                            loading={isLoading}
                            pagination={false}
                            size="small"
                            rowKey="userId"
                            columns={[
                                {
                                    title: 'Hạng', key: 'index', width: 60, align: 'center',
                                    render: (_, __, index) => {
                                        let color = '#8c8c8c';
                                        if (index === 0) color = '#fadb14';
                                        if (index === 1) color = '#d4b106';
                                        if (index === 2) color = '#d46b08';
                                        return <div style={{ width: 24, height: 24, borderRadius: '50%', background: `${color}20`, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12, margin: '0 auto' }}>{index + 1}</div>;
                                    }
                                },
                                {
                                    title: 'Khách hàng', key: 'user',
                                    render: (_, record) => (
                                        <Flex align="center" gap={10}>
                                            <Avatar src={record.avatar} size={32} />
                                            <Flex vertical>
                                                <Text style={{ fontWeight: 600, fontSize: 13 }}>{record.name}</Text>
                                                <Text type="secondary" style={{ fontSize: 11 }}>{record.email}</Text>
                                            </Flex>
                                        </Flex>
                                    )
                                },
                                {
                                    title: 'Tổng chi tiêu', dataIndex: 'totalSpent', key: 'totalSpent', align: 'right',
                                    render: (val) => <Text strong style={{ color: '#52c41a' }}>{formatCurrency(val)}</Text>
                                },
                            ]}
                        />
                    </Card>
                </Col>

                <Col xs={24} xl={12}>
                    <Card
                        title={<Flex align="center" gap={8}><CrownOutlined style={{ color: '#ff4d4f', fontSize: 14 }} /><Text strong style={{ fontSize: 14 }}>Top Tin đăng hút khách</Text></Flex>}
                        className="rounded-xl shadow-sm border-none h-full"
                    >
                        <Table
                            tableLayout="fixed"

                            scroll={{ x: 490 }}
                            dataSource={dashboardData?.topPosts || []}
                            loading={isLoading}
                            pagination={false}
                            size="small"
                            rowKey="id"
                            columns={[
                                {
                                    title: 'Bất động sản', dataIndex: 'title', key: 'title',
                                    render: (val, record) => {
                                        const pkg = VIP_PACKAGES.find(p => p.vipLevel === record.vipLevel);
                                        return (
                                            <>
                                                <Text style={{ fontWeight: 500, fontSize: 12 }} ellipsis={{ tooltip: val }}>{val}</Text>
                                                <br />
                                                <Tag className='mr-1' color={record.listingType === 'SALE' ? 'blue' : 'cyan'} style={{ marginTop: 4 }}>
                                                    {LISTING_TYPE_LABEL[record.listingType as keyof typeof LISTING_TYPE_LABEL] || record.listingType}
                                                </Tag>
                                                <Tag color={pkg?.tagColor || 'default'} style={{ marginTop: 4 }}>{pkg?.shortName || `VIP ${record.vipLevel}`}</Tag>
                                            </>
                                        );
                                    }
                                },
                                {
                                    title: 'Lượt xem', dataIndex: 'views', key: 'views', align: 'center', width: 100,
                                    render: (val) => <Text strong style={{ color: '#ff4d4f', fontSize: 10 }}>{formatNumber(val)}</Text>
                                },
                                {
                                    title: 'Người đăng', dataIndex: 'userName', key: 'userName', width: 150, align: 'right',
                                    render: (_, record) => (
                                        <Flex align="center" justify="flex-end" gap={8}>
                                            <Flex vertical style={{ minWidth: 0, textAlign: 'right' }}>
                                                <Text style={{ fontWeight: 500, fontSize: 13, lineHeight: 1.2 }} ellipsis={{ tooltip: record.userName }}>{record.userName}</Text>
                                                <Text type="secondary" style={{ fontSize: 11 }}>{dayjs(record.createdAt).format('DD/MM/YYYY')}</Text>
                                            </Flex>
                                            <Avatar src={record.userAvatar} size={28} />
                                        </Flex>
                                    )
                                },
                            ]}
                        />
                    </Card>
                </Col>
            </Row>
        </Flex>
    );
}

function StatsCard({ title, value, suffix = '', icon, color, trend, isLoading, footer, isCurrency = false }: any) {
    const displayValue = isCurrency ? formatCompactMoney(value) : formatNumber(value);

    return (
        <Card
            styles={{ body: { padding: '16px 20px' } }}
            className="rounded-xl border-none shadow-sm h-full hover:shadow-md transition-all duration-300"
        >
            {isLoading ? <Skeleton active paragraph={{ rows: 2 }} title={false} /> : (
                <Flex vertical gap={12} style={{ height: '100%' }}>
                    <Flex justify="space-between" align="start">
                        <Flex vertical gap={2} style={{ flex: 1 }}>
                            <Text type="secondary" style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                {title}
                            </Text>
                            <Flex align="baseline" gap={4}>
                                <Text style={{ fontSize: 26, fontWeight: 700, color: '#1a1a1a', letterSpacing: '-0.02em' }}>
                                    {displayValue}
                                </Text>
                                {suffix && <Text type="secondary" style={{ fontSize: 13, fontWeight: 500 }}>{suffix}</Text>}
                            </Flex>
                        </Flex>
                        <div style={{
                            width: 44, height: 44, borderRadius: 12,
                            background: `${color}15`, color: color, fontSize: 20,
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            {icon}
                        </div>
                    </Flex>

                    <Flex vertical gap={6} style={{ marginTop: 'auto' }}>
                        {trend !== undefined && (
                            <Flex align="center" gap={6}>
                                <div style={{
                                    padding: '2px 8px', borderRadius: '100px',
                                    background: trend > 0 ? '#f6ffed' : '#fff1f0',
                                    display: 'flex', alignItems: 'center', gap: 4
                                }}>
                                    {trend > 0 ? <ArrowUpOutlined style={{ color: '#52c41a', fontSize: 10 }} /> : <ArrowDownOutlined style={{ color: '#ff4d4f', fontSize: 10 }} />}
                                    <Text style={{ fontSize: 12, fontWeight: 700, color: trend > 0 ? '#52c41a' : '#ff4d4f' }}>
                                        {Math.abs(trend)}%
                                    </Text>
                                </div>
                                <Text type="secondary" style={{ fontSize: 12 }}>so kỳ trước</Text>
                            </Flex>
                        )}
                        <div style={{ height: 28, display: 'flex', alignItems: 'center', borderTop: '1px dashed #f0f0f0', paddingTop: 8, marginTop: 4 }}>
                            {footer}
                        </div>
                    </Flex>
                </Flex>
            )}
        </Card>
    );
}

function formatCompactMoney(amount?: number | null): string {
    if (!amount) return '0 ₫';
    if (amount >= 1_000_000_000) return `${(amount / 1_000_000_000).toLocaleString('vi-VN')} Tỷ`;
    if (amount >= 1_000_000) return `${(amount / 1_000_000).toLocaleString('vi-VN')} Tr`;
    return formatCurrency(amount);
}

function ChartCard({ title, children, isLoading }: { title: string, children: React.ReactNode, isLoading: boolean }) {
    return (
        <Card
            title={<Text style={{ fontSize: 15, fontWeight: 700, color: '#1f1f1f' }}>{title}</Text>}
            className="rounded-xl border-none shadow-sm h-full"
            styles={{ body: { paddingTop: 16, paddingBottom: 16 } }}
        >
            {isLoading ? <Skeleton active paragraph={{ rows: 6 }} /> : children}
        </Card>
    );
}

const CustomComposedTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const isDate = typeof label === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(label);
        return (
            <div style={{
                background: 'rgba(255,255,255,0.98)', padding: '12px 16px',
                borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', border: '1px solid #f0f0f0', minWidth: 200
            }}>
                {isDate && <div style={{ fontSize: 11, color: '#8c8c8c', marginBottom: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{dayjs(label).format('DD MMM, YYYY')}</div>}

                {payload.map((entry: any, index: number) => (
                    <Flex key={index} align="center" justify="space-between" gap={24} style={{ marginBottom: index === 0 ? 8 : 0 }}>
                        <Flex align="center" gap={8}>
                            <div style={{ width: 8, height: 8, borderRadius: entry.dataKey === 'revenue' ? 2 : '50%', background: entry.color || entry.payload?.fill }} />
                            <Text style={{ fontSize: 13, color: '#595959', fontWeight: 500 }}>{entry.name}</Text>
                        </Flex>
                        <Text style={{ fontSize: 14, fontWeight: 700, color: '#141414' }}>
                            {entry.dataKey === 'revenue' ? formatCurrency(entry.value) : formatNumber(entry.value)}
                        </Text>
                    </Flex>
                ))}
            </div>
        );
    }
    return null;
};

const CustomTooltip = ({ active, payload, label, unit }: any) => {
    if (active && payload && payload.length) {
        return (
            <div style={{
                background: 'rgba(255,255,255,0.98)', padding: '10px 14px',
                borderRadius: '10px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', border: '1px solid #f0f0f0'
            }}>
                {payload.map((entry: any, index: number) => (
                    <Flex key={index} align="center" justify="space-between" gap={12}>
                        <Flex align="center" gap={6}>
                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: entry.color || entry.payload?.fill }} />
                            <Text style={{ fontSize: 12, color: '#595959' }}>{entry.name}</Text>
                        </Flex>
                        <Text style={{ fontSize: 13, fontWeight: 700 }}>
                            {formatNumber(entry.value)} {unit && <Text style={{ fontSize: 12, fontWeight: 400, color: '#8c8c8c' }}>{unit}</Text>}
                        </Text>
                    </Flex>
                ))}
            </div>
        );
    }
    return null;
};

function CustomLegend({ data, unit }: { data: any[], unit?: string }) {
    if (!data || data.length === 0) return null;
    return (
        <Flex gap={16} wrap="wrap" justify="center" style={{ marginTop: 12 }}>
            {data.map((item) => (
                <Flex key={item.name} align="center" gap={6}>
                    <div style={{ width: 8, height: 8, borderRadius: '2px', background: item.color }} />
                    <Text style={{ fontSize: 12, color: '#595959', fontWeight: 500 }}>
                        {item.name}: <Text style={{ color: '#1a1a1a', fontWeight: 600 }}>{formatNumber(item.value)} {unit && <Text style={{ fontSize: 11, fontWeight: 400, color: '#8c8c8c' }}>{unit}</Text>}</Text>
                    </Text>
                </Flex>
            ))}
        </Flex>
    );
}