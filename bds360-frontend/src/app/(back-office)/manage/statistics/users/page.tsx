// @/app/(back-office)/manage/statistics/users/page.tsx

'use client';

import { useAppTheme } from '@/hooks/use-app-theme';
import { formatDateTime } from '@/utils/date.util'; // Import formatDateTime
import { formatNumber } from '@/utils/number.util';
import {
    ArrowDownOutlined,
    ArrowUpOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined,
    FireOutlined,
    SafetyCertificateOutlined,
    TeamOutlined,
    UserAddOutlined
} from '@ant-design/icons';
import {
    Avatar,
    Button,
    Card, Col,
    Flex,
    Progress,
    Row, Select,
    Skeleton,
    Table,
    Typography
} from 'antd';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import {
    Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart,
    ResponsiveContainer, Tooltip, XAxis, YAxis
} from 'recharts';

import { APP_ROUTES } from '@/config';
import { getPageMeta } from '@/constants/menus.constant';
import { useGetManageUserDashboardStats } from '@/features/statistics/api/manage-user-statistics.queries';
import { useGetUsers, useGetVerificationRequests } from '@/features/users/api/user.queries';
import Link from 'next/link';

const { Title, Text } = Typography;

const BEHAVIOR_COLORS = ['#1890ff', '#f0f0f0'];
const PRESTIGE_COLORS = ['#52c41a', '#e3e3e3'];
const TOP_AGENT_COLOR = '#722ed1';

export default function ManageUserStatisticsPage() {
    const { colorPrimary, colorBgLayout } = useAppTheme();
    const [daysFilter, setDaysFilter] = useState<number>(30);

    const { data: dashboardData, isLoading } = useGetManageUserDashboardStats(daysFilter);
    const kpis = dashboardData?.kpis;

    const { data: pendingVerifications, isLoading: loadingVerifications } = useGetVerificationRequests({
        status: 'PENDING',
        sortBy: 'createdAt',
        sortDirection: 'ASC',
        page: 0,
        size: 5
    });

    const { data: newUsers, isLoading: loadingNewUsers } = useGetUsers({
        sortBy: 'createdAt',
        sortDirection: 'DESC',
        page: 0,
        size: 5
    });

    const continuousGrowthData = useMemo(() => {
        if (!dashboardData?.growthTrend) return [];
        const dataMap = new Map(dashboardData.growthTrend.map(item => [item.date, item.newUsers]));
        const result = [];
        for (let i = daysFilter - 1; i >= 0; i--) {
            const dateStr = dayjs().subtract(i, 'day').format('YYYY-MM-DD');
            result.push({
                date: dateStr,
                newUsers: dataMap.get(dateStr) || 0
            });
        }
        return result;
    }, [dashboardData?.growthTrend, daysFilter]);

    const behaviorChartData = [
        { name: 'Người đăng tin', value: dashboardData?.behaviorStats?.postersCount || 0 },
        { name: 'Khách chỉ xem', value: dashboardData?.behaviorStats?.viewersCount || 0 }
    ];

    const prestigeChartData = [
        { name: 'Đã xác thực', value: dashboardData?.prestigeStats?.verifiedCount || 0 },
        { name: 'Chưa xác thực', value: dashboardData?.prestigeStats?.unverifiedCount || 0 }
    ];
    const { icon, title } = getPageMeta(APP_ROUTES.MANAGE.STATISTICS.USERS);

    return (
        <Flex vertical gap={20} style={{ background: colorBgLayout, minHeight: '100%' }}>
            <Flex justify="space-between" align="end" wrap="wrap" gap={12}>
                <Flex vertical>
                    <Title level={3} style={{ margin: 0 }}>
                        <span style={{ marginRight: 8 }}>{icon}</span>
                        {title}
                    </Title>
                    <Text type="secondary" style={{ marginTop: 4 }} >
                        Báo cáo tăng trưởng và chỉ số người dùng trong hệ thống.
                    </Text>
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
                        title="Tổng người dùng"
                        value={kpis?.totalUsers || 0}
                        icon={<TeamOutlined />}
                        color="#1890ff"
                        isLoading={isLoading}
                        footer={
                            <Text type="secondary" style={{ fontSize: 12 }}>
                                <Text strong style={{ color: '#52c41a' }}>+0</Text> đăng ký hôm nay
                            </Text>
                        }
                    />
                </Col>
                <Col xs={24} sm={12} xl={6}>
                    <StatsCard
                        title="Thành viên mới"
                        value={kpis?.newUsers || 0}
                        icon={<UserAddOutlined />}
                        color="#faad14"
                        trend={kpis?.newUserGrowthPercent}
                        isLoading={isLoading}
                        footer={
                            <div style={{ height: 32, width: '100%', marginLeft: -8 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={continuousGrowthData.slice(-7)}>
                                        <Area type="monotone" dataKey="newUsers" stroke="#faad14" fill="#faad14" fillOpacity={0.1} strokeWidth={1.5} isAnimationActive={false} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        }
                    />
                </Col>
                <Col xs={24} sm={12} xl={6}>
                    <StatsCard
                        title="Tỷ lệ định danh"
                        value={kpis?.verificationRate || 0}
                        suffix="%"
                        icon={<SafetyCertificateOutlined />}
                        color="#52c41a"
                        isLoading={isLoading}
                        footer={
                            <Flex align="center" style={{ height: 32, width: '100%' }}>
                                <Progress percent={kpis?.verificationRate} size="small" showInfo={false} strokeColor="#52c41a" railColor="#f0f0f0" strokeWidth={6} />
                            </Flex>
                        }
                    />
                </Col>
                <Col xs={24} sm={12} xl={6}>
                    <StatsCard
                        title="Đang đăng tin"
                        value={kpis?.activeUsers || 0}
                        icon={<FireOutlined />}
                        color="#ff4d4f"
                        isLoading={isLoading}
                        footer={
                            <Text type="secondary" style={{ fontSize: 12 }}>
                                Trung bình <Text strong>3.4</Text> bài/người dùng
                            </Text>
                        }
                    />
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                <Col xs={24} lg={16}>
                    <ChartCard title="Thành viên mới" isLoading={isLoading}>
                        <ResponsiveContainer width="100%" height={280}>
                            <AreaChart data={continuousGrowthData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={colorPrimary} stopOpacity={0.1} />
                                        <stop offset="95%" stopColor={colorPrimary} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#bfbfbf' }} tickFormatter={(val) => dayjs(val).format('DD/MM')} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#bfbfbf' }} />
                                <Tooltip content={<CustomTooltip />} cursor={{ stroke: colorPrimary, strokeWidth: 1 }} />
                                <Area type="monotone" dataKey="newUsers" name="Thành viên" stroke={colorPrimary} strokeWidth={2} fill="url(#colorGrowth)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </Col>

                <Col xs={24} lg={8}>
                    <ChartCard title="Hành vi hệ thống" isLoading={isLoading}>
                        <Flex vertical align="center" justify="center" style={{ height: 280 }}>
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie data={behaviorChartData} innerRadius={60} outerRadius={80} paddingAngle={8} dataKey="value" stroke="none">
                                        {behaviorChartData.map((_, idx) => <Cell key={`cell-${idx}`} fill={BEHAVIOR_COLORS[idx % BEHAVIOR_COLORS.length]} />)}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                            <CustomLegend data={behaviorChartData} colors={BEHAVIOR_COLORS} />
                        </Flex>
                    </ChartCard>
                </Col>

                <Col xs={24} lg={8}>
                    <ChartCard title="Xác thực danh tính" isLoading={isLoading}>
                        <Flex vertical align="center" justify="center" style={{ height: 280 }}>
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie data={prestigeChartData} outerRadius={80} dataKey="value" stroke="#fff" strokeWidth={3}>
                                        {prestigeChartData.map((_, idx) => <Cell key={`cell-${idx}`} fill={PRESTIGE_COLORS[idx % PRESTIGE_COLORS.length]} />)}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                            <CustomLegend data={prestigeChartData} colors={PRESTIGE_COLORS} />
                        </Flex>
                    </ChartCard>
                </Col>

                <Col xs={24} lg={16}>
                    <ChartCard title="Top 10 người dùng nổi bật" isLoading={isLoading}>
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={dashboardData?.topAgents} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                                <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="#f5f5f5" />
                                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#bfbfbf' }} />
                                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#434343', fontWeight: 500 }} width={160} />
                                <Tooltip cursor={{ fill: '#f5f5f5' }} content={<CustomTooltip />} />
                                <Bar dataKey="activePostCount" name="Tin đăng" fill={TOP_AGENT_COLOR} radius={[0, 4, 4, 0]} barSize={12} />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                <Col xs={24} xl={12}>
                    <Card
                        title={<Flex align="center" gap={8}><ExclamationCircleOutlined style={{ color: 'orange', fontSize: 14 }} /><Text strong style={{ fontSize: 14 }}>Phê duyệt định danh đang chờ</Text></Flex>}
                        className="rounded-xl shadow-sm border-none h-full"
                    >
                        <Table
                            dataSource={pendingVerifications?.content || []}
                            loading={loadingVerifications}
                            pagination={false}
                            size="small"
                            rowKey="id"
                            columns={[
                                {
                                    title: 'Thành viên',
                                    key: 'userName',
                                    render: (_, record) => (

                                        <Flex align="center" gap={10}>
                                            <Avatar src={record.userAvatar} size={28} />
                                            <Flex vertical>
                                                <Text style={{ fontWeight: 500, fontSize: 13, lineHeight: 1.2 }}>{record.userName}</Text>
                                                <Text type="secondary" style={{ fontSize: 11 }}>{record.userEmail}</Text>
                                            </Flex>
                                        </Flex>

                                    )
                                },
                                {
                                    title: 'Ngày nộp',
                                    dataIndex: 'createdAt',
                                    key: 'createdAt',
                                    render: (val) => <Text type="secondary" style={{ fontSize: 12 }}>{formatDateTime(val)}</Text>
                                },
                                {
                                    title: '', key: 'action', align: 'right',
                                    render: () => (
                                        <Link
                                            href={APP_ROUTES.MANAGE.VERIFICATIONS}
                                        >
                                            <Button
                                                type="link"
                                                size="small"
                                                style={{ fontSize: 12 }}

                                            >
                                                Chi tiết
                                            </Button>
                                        </Link>
                                    )
                                },
                            ]}
                        />
                    </Card>
                </Col>
                <Col xs={24} xl={12}>
                    <Card
                        title={<Flex align="center" gap={8}><UserAddOutlined style={{ color: colorPrimary, fontSize: 14 }} /><Text strong style={{ fontSize: 14 }}>Người dùng mới nhất</Text></Flex>}
                        className="rounded-xl shadow-sm border-none h-full"
                    >
                        <Table
                            dataSource={newUsers?.content || []}
                            loading={loadingNewUsers}
                            pagination={false}
                            size="small"
                            rowKey="id"
                            columns={[
                                {
                                    title: 'Thông tin', key: 'user',
                                    render: (_, record) => (
                                        <Flex align="center" gap={10}>
                                            <Avatar src={record.avatar} size={28} />
                                            <Flex vertical>
                                                <Text style={{ fontWeight: 500, fontSize: 13, lineHeight: 1.2 }}>{record.name}</Text>
                                                <Text type="secondary" style={{ fontSize: 11 }}>{record.email}</Text>
                                            </Flex>
                                        </Flex>
                                    )
                                },
                                {
                                    title: 'Định danh', dataIndex: 'isVerified', key: 'isVerified', align: 'center',
                                    render: (val) => val ? <CheckCircleOutlined style={{ color: '#52c41a' }} /> : <Text disabled>-</Text>
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
                        {/* Chiều cao footer cố định để 4 card luôn bằng nhau */}
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

        const isDate =
            typeof label === 'string' &&
            /^\d{4}-\d{2}-\d{2}$/.test(label);

        return (
            <div style={{
                background: 'rgba(255,255,255,0.98)',
                padding: '10px 14px',
                borderRadius: '10px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                border: '1px solid #f0f0f0'
            }}>

                {/* ✅ CHỈ HIỂN THỊ DATE KHI ĐÚNG FORMAT */}
                {isDate && (
                    <div style={{
                        fontSize: 10,
                        color: '#8c8c8c',
                        marginBottom: 6,
                        fontWeight: 600
                    }}>
                        {dayjs(label).format('DD MMM, YYYY')}
                    </div>
                )}

                {/* Content */}
                {payload.map((entry: any, index: number) => (
                    <Flex key={index} align="center" justify="space-between" gap={12}>
                        <Flex align="center" gap={6}>
                            <div
                                style={{
                                    width: 6,
                                    height: 6,
                                    borderRadius: '50%',
                                    background: entry.color || entry.payload.fill
                                }}
                            />
                            <Text style={{ fontSize: 12, color: '#595959' }}>
                                {entry.name}
                            </Text>
                        </Flex>
                        <Text style={{ fontSize: 13, fontWeight: 700 }}>
                            {formatNumber(entry.value)}
                        </Text>
                    </Flex>
                ))}
            </div>
        );
    }
    return null;
};

function CustomLegend({ data, colors }: { data: any[], colors: string[] }) {
    return (
        <Flex gap={16} wrap="wrap" justify="center" style={{ marginTop: 12 }}>
            {data.map((item, idx) => (
                <Flex key={item.name} align="center" gap={6}>
                    <div style={{ width: 8, height: 8, borderRadius: '2px', background: colors[idx % colors.length] }} />
                    <Text style={{ fontSize: 12, color: '#595959', fontWeight: 500 }}>
                        {item.name}: <Text style={{ color: '#1a1a1a', fontWeight: 600 }}>{formatNumber(item.value)}</Text>
                    </Text>
                </Flex>
            ))}
        </Flex>
    );
}