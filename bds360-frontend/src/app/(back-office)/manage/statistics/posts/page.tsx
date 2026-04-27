// @/app/(back-office)/manage/statistics/posts/page.tsx

'use client';

import { useAppTheme } from '@/hooks/use-app-theme';
import { formatDateTime } from '@/utils/date.util';
import { formatNumber } from '@/utils/number.util';
import {
    ArrowDownOutlined,
    ArrowUpOutlined,
    CrownOutlined,
    EyeOutlined,
    FileAddOutlined,
    FireOutlined,
    InboxOutlined
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
import { useMemo, useState } from 'react';
import {
    Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart,
    ResponsiveContainer, Tooltip, XAxis, YAxis
} from 'recharts';

import { APP_ROUTES } from '@/config';
import { LISTING_TYPE_LABEL } from '@/constants/listing.constant';
import { getPageMeta } from '@/constants/menus.constant';
import { VIP_PACKAGES } from '@/constants/vip-packages.constant';
import { useGetManagePostDashboardStats } from '@/features/statistics/api/manage-post-statistics.queries';

const { Title, Text } = Typography;

const DEMAND_COLORS = ['#1890ff', '#52c41a', '#faad14'];
const TOP_PROVINCE_COLOR = '#722ed1';

export default function ManagePostStatisticsPage() {
    const { colorPrimary, colorBgLayout } = useAppTheme();
    const [daysFilter, setDaysFilter] = useState<number>(30);

    const { data: dashboardData, isLoading } = useGetManagePostDashboardStats(daysFilter);
    const kpis = dashboardData?.kpis;

    const continuousSupplyData = useMemo(() => {
        if (!dashboardData?.supplyTrend) return [];
        const dataMap = new Map(dashboardData.supplyTrend.map(item => [item.date, item.count]));
        const result = [];
        for (let i = daysFilter - 1; i >= 0; i--) {
            const dateStr = dayjs().subtract(i, 'day').format('YYYY-MM-DD');
            result.push({
                date: dateStr,
                count: dataMap.get(dateStr) || 0
            });
        }
        return result;
    }, [dashboardData?.supplyTrend, daysFilter]);

    const demandChartData = dashboardData?.demandStructure?.map((item, idx) => ({
        name: LISTING_TYPE_LABEL[item.type] || item.type,
        value: item.count || 0,
        color: DEMAND_COLORS[idx % DEMAND_COLORS.length]
    })) || [];
    const { icon, title } = getPageMeta(APP_ROUTES.MANAGE.STATISTICS.POSTS);

    return (
        <Flex vertical gap={20} style={{ background: colorBgLayout, minHeight: '100%' }}>
            <Flex justify="space-between" align="end" wrap="wrap" gap={12}>

                <Flex vertical>
                    <Flex vertical>
                        <Title level={3} style={{ margin: 0 }}>
                            <span style={{ marginRight: 8 }}>{icon}</span>
                            {title}
                        </Title>
                        <Text type="secondary" style={{ marginTop: 4 }}>
                            Thống kê tin đắng, tình trạng kiểm duyệt và phân bổ khu vực.
                        </Text>
                    </Flex>
                </Flex>

                <Select
                    value={daysFilter}
                    onChange={setDaysFilter}
                    variant="filled"
                    style={{ width: 150, height: 36 }}
                    options={[
                        { label: '7 ngày qua', value: 7 },
                        { label: '30 ngày qua', value: 30 },
                        { label: '6 tháng qua', value: 180 },
                        { label: '1 năm qua', value: 365 },
                    ]}
                />
            </Flex>

            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} xl={6}>
                    <StatsCard
                        title="Đang hiển thị"
                        value={kpis?.activeListings || 0}
                        icon={<EyeOutlined />}
                        color="#52c41a"
                        isLoading={isLoading}
                        footer={
                            <Text type="secondary" style={{ fontSize: 12 }}>
                                Tin đăng đang hiển thị cho mọi người
                            </Text>
                        }
                    />
                </Col>
                <Col xs={24} sm={12} xl={6}>
                    <StatsCard
                        title="Tin đăng mới"
                        value={kpis?.newPosts || 0}
                        icon={<FileAddOutlined />}
                        color="#1890ff"
                        trend={kpis?.newPostsGrowthPercent}
                        isLoading={isLoading}
                        footer={
                            <div style={{ height: 32, width: '100%', marginLeft: -8 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={continuousSupplyData.slice(-7) || []}>
                                        <Area type="monotone" dataKey="count" stroke="#1890ff" fill="#1890ff" fillOpacity={0.1} strokeWidth={1.5} isAnimationActive={false} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        }
                    />
                </Col>
                <Col xs={24} sm={12} xl={6}>
                    <StatsCard
                        title="Cần xử lý (Chờ duyệt)"
                        value={kpis?.moderationBacklog || 0}
                        icon={<InboxOutlined />}
                        color="#faad14"
                        isLoading={isLoading}
                        footer={
                            <Text type="secondary" style={{ fontSize: 12 }}>
                                Tin tồn đọng cần KDV rà soát
                            </Text>
                        }
                    />
                </Col>
                <Col xs={24} sm={12} xl={6}>
                    <StatsCard
                        title="Tỷ lệ tin VIP"
                        value={kpis?.vipRatio || 0}
                        suffix="%"
                        icon={<CrownOutlined />}
                        color="#eb2f96"
                        isLoading={isLoading}
                        footer={
                            <Flex align="center" style={{ height: 32, width: '100%' }}>
                                <Progress percent={kpis?.vipRatio || 0} size="small" showInfo={false} strokeColor="#eb2f96" railColor="#f0f0f0" strokeWidth={6} />
                            </Flex>
                        }
                    />
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                <Col xs={24} lg={24}>
                    <ChartCard title="Xu hướng đăng tin mới" isLoading={isLoading}>
                        <ResponsiveContainer width="100%" height={280}>
                            <AreaChart data={continuousSupplyData || []} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorSupply" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={colorPrimary} stopOpacity={0.1} />
                                        <stop offset="95%" stopColor={colorPrimary} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#bfbfbf' }} tickFormatter={(val) => dayjs(val).format('DD/MM')} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#bfbfbf' }} />
                                <Tooltip content={<CustomTooltip />} cursor={{ stroke: colorPrimary, strokeWidth: 1 }} />
                                <Area type="monotone" dataKey="count" name="Tin đăng" stroke={colorPrimary} strokeWidth={2} fill="url(#colorSupply)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </Col>

                <Col xs={24} lg={8}>
                    <ChartCard title="Cơ cấu nhu cầu" isLoading={isLoading}>
                        <Flex vertical align="center" justify="center" style={{ height: 320 }}>
                            <ResponsiveContainer width="100%" height={240}>
                                <PieChart>
                                    <Pie data={demandChartData || []} innerRadius={70} outerRadius={90} paddingAngle={8} dataKey="value" stroke="none">
                                        {demandChartData.map((entry, idx) => <Cell key={`cell-${idx}`} fill={entry.color} />)}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                            <CustomLegend data={demandChartData || []} />
                        </Flex>
                    </ChartCard>
                </Col>

                <Col xs={24} lg={16}>
                    <ChartCard title="Top 10 Khu vực nóng (Sôi động nhất)" isLoading={isLoading}>
                        <ResponsiveContainer width="100%" height={320}>
                            <BarChart data={dashboardData?.topProvinces || []} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                                <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="#f5f5f5" />
                                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#bfbfbf' }} />
                                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#434343', fontWeight: 500 }} width={160} />
                                <Tooltip cursor={{ fill: '#f5f5f5' }} content={<CustomTooltip />} />
                                <Bar dataKey="count" name="Số lượng tin" fill={TOP_PROVINCE_COLOR} radius={[0, 4, 4, 0]} barSize={16} />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                <Col xs={24} xl={12}>
                    <Card
                        title={<Flex align="center" gap={8}><FireOutlined style={{ color: '#ff4d4f', fontSize: 14 }} /><Text strong style={{ fontSize: 14 }}>Top tin đăng thu hút nhất</Text></Flex>}
                        className="rounded-xl shadow-sm border-none h-full"
                    >
                        <Table
                            tableLayout="fixed"
                            scroll={{ x: 400 }}
                            dataSource={dashboardData?.topViewedPosts || []}
                            loading={isLoading}
                            pagination={false}
                            size="small"
                            rowKey="id"
                            columns={[
                                {
                                    title: 'Tiêu đề', dataIndex: 'title', key: 'title', width: 250,
                                    render: (val, record) => {
                                        const pkg = VIP_PACKAGES.find(p => p.vipLevel === record.vipLevel);
                                        return (
                                            <>
                                                <Text style={{ fontWeight: 500, fontSize: 13 }} ellipsis={{ tooltip: val }}>{val}</Text>
                                                <Tag className='mr-1' color={record.listingType === 'SALE' ? 'blue' : 'cyan'}>
                                                    {LISTING_TYPE_LABEL[record.listingType as keyof typeof LISTING_TYPE_LABEL] || record.listingType}
                                                </Tag>
                                                <Tag color={pkg?.tagColor || 'default'}>{pkg?.shortName || `VIP ${record.vipLevel}`}</Tag>
                                            </>
                                        );
                                    }
                                },
                                {
                                    title: 'Lượt xem', dataIndex: 'views', key: 'views', align: 'center', width: 90,
                                    render: (val) => <Text strong style={{ color: '#ff4d4f' }}>{formatNumber(val)}</Text>
                                },
                                {
                                    title: 'Người đăng',
                                    dataIndex: 'userName',
                                    key: 'userName',
                                    width: 150,
                                    align: 'right',
                                    render: (_, record) => (
                                        <Flex align="center" justify="flex-end" gap={8}>

                                            <Flex vertical style={{ minWidth: 0, textAlign: 'right' }}>
                                                <Text
                                                    style={{ fontWeight: 500, fontSize: 13, lineHeight: 1.2 }}
                                                    ellipsis={{ tooltip: record.userName }}
                                                >
                                                    {record.userName}
                                                </Text>

                                                <Text type="secondary" style={{ fontSize: 11 }}>
                                                    {formatDateTime(record.createdAt)}
                                                </Text>
                                            </Flex>
                                            <Avatar src={record.userAvatar} size={28} />

                                        </Flex>
                                    )
                                },

                            ]}
                        />
                    </Card>
                </Col>
                <Col xs={24} xl={12}>
                    <Card
                        title={<Flex align="center" gap={8}><CrownOutlined style={{ color: '#faad14', fontSize: 14 }} /><Text strong style={{ fontSize: 14 }}>Tin VIP mới lên sàn</Text></Flex>}
                        className="rounded-xl shadow-sm border-none h-full"
                    >
                        <Table
                            tableLayout="fixed"
                            scroll={{ x: 400 }}
                            dataSource={dashboardData?.latestVipPosts || []}
                            loading={isLoading}
                            pagination={false}
                            size="small"
                            rowKey="id"
                            columns={[
                                {
                                    title: 'Tiêu đề', dataIndex: 'title', key: 'title', width: 250,
                                    render: (val, record) => {
                                        const pkg = VIP_PACKAGES.find(p => p.vipLevel === record.vipLevel);
                                        return (
                                            <>
                                                <Text style={{ fontWeight: 500, fontSize: 13 }} ellipsis={{ tooltip: val }}>{val}</Text>
                                                <Tag className='mr-1' color={record.listingType === 'SALE' ? 'blue' : 'cyan'}>
                                                    {LISTING_TYPE_LABEL[record.listingType as keyof typeof LISTING_TYPE_LABEL] || record.listingType}
                                                </Tag>
                                                <Tag color={pkg?.tagColor || 'default'}>{pkg?.shortName || `VIP ${record.vipLevel}`}</Tag>
                                            </>
                                        );
                                    }
                                },
                                {
                                    title: 'Lượt xem', dataIndex: 'views', key: 'views', align: 'center', width: 90,
                                    render: (val) => <Text strong style={{ color: '#ff4d4f' }}>{formatNumber(val)}</Text>
                                },
                                {
                                    title: 'Người đăng',
                                    dataIndex: 'userName',
                                    key: 'userName',
                                    width: 150,
                                    align: 'right',
                                    render: (_, record) => (
                                        <Flex align="center" justify="flex-end" gap={8}>

                                            <Flex vertical style={{ minWidth: 0, textAlign: 'right' }}>
                                                <Text
                                                    style={{ fontWeight: 500, fontSize: 13, lineHeight: 1.2 }}
                                                    ellipsis={{ tooltip: record.userName }}
                                                >
                                                    {record.userName}
                                                </Text>

                                                <Text type="secondary" style={{ fontSize: 11 }}>
                                                    {formatDateTime(record.createdAt)}
                                                </Text>
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

function StatsCard({ title, value, suffix = '', icon, color, trend, isLoading, footer }: any) {
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
                                <Text style={{ fontSize: 26, fontWeight: 600, color: '#1a1a1a', letterSpacing: '-0.02em' }}>
                                    {formatNumber(value)}
                                </Text>
                                {suffix && <Text type="secondary" style={{ fontSize: 13, fontWeight: 500 }}>{suffix}</Text>}
                            </Flex>
                        </Flex>
                        <div style={{
                            width: 40, height: 40, borderRadius: 12,
                            background: `${color}10`, color: color, fontSize: 18,
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            {icon}
                        </div>
                    </Flex>

                    <Flex vertical gap={6}>
                        {trend !== undefined && (
                            <Flex align="center" gap={4}>
                                <div style={{
                                    padding: '1px 6px', borderRadius: '100px',
                                    background: trend > 0 ? '#f6ffed' : '#fff1f0',
                                    display: 'flex', alignItems: 'center', gap: 3
                                }}>
                                    {trend > 0 ? <ArrowUpOutlined style={{ color: '#52c41a', fontSize: 9 }} /> : <ArrowDownOutlined style={{ color: '#ff4d4f', fontSize: 9 }} />}
                                    <Text style={{ fontSize: 11, fontWeight: 700, color: trend > 0 ? '#52c41a' : '#ff4d4f' }}>
                                        {Math.abs(trend)}%
                                    </Text>
                                </div>
                                <Text type="secondary" style={{ fontSize: 11 }}>so kỳ trước</Text>
                            </Flex>
                        )}
                        <div style={{ height: 32, display: 'flex', alignItems: 'center' }}>
                            {footer}
                        </div>
                    </Flex>
                </Flex>
            )}
        </Card>
    );
}

function ChartCard({ title, children, isLoading }: { title: string, children: React.ReactNode, isLoading: boolean }) {
    return (
        <Card
            title={<Text style={{ fontSize: 14, fontWeight: 600, color: '#262626' }}>{title}</Text>}
            className="rounded-xl border-none shadow-sm h-full"
            styles={{ body: { paddingTop: 8, paddingBottom: 16 } }}
        >
            {isLoading ? <Skeleton active paragraph={{ rows: 6 }} /> : children}
        </Card>
    );
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const isDate = typeof label === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(label);
        return (
            <div style={{
                background: 'rgba(255,255,255,0.98)', padding: '10px 14px',
                borderRadius: '10px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', border: '1px solid #f0f0f0'
            }}>
                {isDate && <div style={{ fontSize: 10, color: '#8c8c8c', marginBottom: 6, fontWeight: 600 }}>{dayjs(label).format('DD MMM, YYYY')}</div>}
                {!isDate && label && <div style={{ fontSize: 11, color: '#8c8c8c', marginBottom: 6, fontWeight: 600 }}>{label}</div>}

                {payload.map((entry: any, index: number) => (
                    <Flex key={index} align="center" justify="space-between" gap={12}>
                        <Flex align="center" gap={6}>
                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: entry.color || entry.payload.fill }} />
                            <Text style={{ fontSize: 12, color: '#595959' }}>{entry.name}</Text>
                        </Flex>
                        <Text style={{ fontSize: 13, fontWeight: 700 }}>{formatNumber(entry.value)}</Text>
                    </Flex>
                ))}
            </div>
        );
    }
    return null;
};

function CustomLegend({ data }: { data: any[] }) {
    if (!data || data.length === 0) return null;
    return (
        <Flex gap={16} wrap="wrap" justify="center" style={{ marginTop: 12 }}>
            {data.map((item, idx) => (
                <Flex key={item.name} align="center" gap={6}>
                    <div style={{ width: 8, height: 8, borderRadius: '2px', background: item.color }} />
                    <Text style={{ fontSize: 12, color: '#595959', fontWeight: 500 }}>
                        {item.name}: <Text style={{ color: '#1a1a1a', fontWeight: 600 }}>{formatNumber(item.value)}</Text>
                    </Text>
                </Flex>
            ))}
        </Flex>
    );
}