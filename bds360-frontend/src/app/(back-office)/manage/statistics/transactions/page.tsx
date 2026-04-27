// @/app/(back-office)/manage/statistics/transactions/page.tsx
'use client';

import { useAppTheme } from '@/hooks/use-app-theme';
import { formatCurrency, formatNumber } from '@/utils/number.util';
import {
    ArrowDownOutlined,
    ArrowUpOutlined,
    BankOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    FallOutlined,
    RiseOutlined,
    WalletOutlined
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
import { getPageMeta } from '@/constants';
import { useGetManageTransactionDashboardStats } from '@/features/statistics/api/manage-transaction-statistics.queries';
import {
    TRANSACTION_STATUS_COLOR,
    TRANSACTION_STATUS_LABEL,
    TransactionStatus
} from '@/features/transactions';

const { Title, Text } = Typography;

// Recharts can mau HEX truc tiep nen giu lai bang mau nay cho bieu do Pie
const STATUS_HEX_COLORS: Record<TransactionStatus, string> = {
    SUCCESS: '#52c41a',
    PENDING: '#faad14',
    FAILED: '#ff4d4f'
};

const TOP_SPENDER_COLOR = '#1890ff';

export default function ManageTransactionStatisticsPage() {
    const { colorPrimary, colorBgLayout } = useAppTheme();
    const [daysFilter, setDaysFilter] = useState<number>(30);

    const { data: dashboardData, isLoading } = useGetManageTransactionDashboardStats(daysFilter);
    const kpis = dashboardData?.kpis;

    const continuousCashFlowData = useMemo(() => {
        if (!dashboardData?.cashFlowTrend) return [];
        const dataMap = new Map(dashboardData.cashFlowTrend.map(item => [item.date, item]));
        const result = [];
        for (let i = daysFilter - 1; i >= 0; i--) {
            const dateStr = dayjs().subtract(i, 'day').format('YYYY-MM-DD');
            const existingData = dataMap.get(dateStr);
            result.push({
                date: dateStr,
                cashIn: existingData?.cashIn || 0,
                cashOut: existingData?.cashOut || 0,
            });
        }
        return result;
    }, [dashboardData?.cashFlowTrend, daysFilter]);

    const statusChartData = dashboardData?.statusBreakdown?.map(item => ({
        name: TRANSACTION_STATUS_LABEL[item.status] || item.status,
        value: item.count,
        color: STATUS_HEX_COLORS[item.status]
    })) || [];

    const getStatusTag = (status: TransactionStatus) => {
        const color = TRANSACTION_STATUS_COLOR[status] || 'default';
        const label = TRANSACTION_STATUS_LABEL[status] || status;

        switch (status) {
            case 'SUCCESS': return <Tag icon={<CheckCircleOutlined />} color={color}>{label}</Tag>;
            case 'PENDING': return <Tag icon={<ClockCircleOutlined />} color={color}>{label}</Tag>;
            case 'FAILED': return <Tag icon={<CloseCircleOutlined />} color={color}>{label}</Tag>;
            default: return <Tag color={color}>{label}</Tag>;
        }
    };

    const { icon, title } = getPageMeta(APP_ROUTES.MANAGE.STATISTICS.TRANSACTIONS);

    return (
        <Flex vertical gap={20} style={{ background: colorBgLayout, minHeight: '100%' }}>
            <Flex justify="space-between" align="end" wrap="wrap" gap={12}>
                <Flex vertical>
                    <Flex vertical>
                        <Title level={3} style={{ margin: 0 }}>
                            <span style={{ marginRight: 8 }}>{icon}</span>
                            {title}
                        </Title>
                        <Text type="secondary" style={{ marginTop: 4 }} >
                            Báo cáo chi tiết về tình hình nạp, tiêu dùng và số dư hệ thống.

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
                        title="Tổng nạp (Cash In)"
                        value={kpis?.totalCashIn || 0}
                        isCurrency
                        icon={<RiseOutlined />}
                        color="#52c41a"
                        trend={kpis?.cashInGrowthPercent}
                        isLoading={isLoading}
                        footer={
                            <div style={{ height: 32, width: '100%', marginLeft: -8 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={continuousCashFlowData.slice(-7)}>
                                        <Area type="monotone" dataKey="cashIn" stroke="#52c41a" fill="#52c41a" fillOpacity={0.1} strokeWidth={1.5} isAnimationActive={false} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        }
                    />
                </Col>
                <Col xs={24} sm={12} xl={6}>
                    <StatsCard
                        title="Tổng tiêu (Usage)"
                        value={kpis?.totalServiceUsage || 0}
                        isCurrency
                        icon={<FallOutlined />}
                        color="#1890ff"
                        trend={kpis?.serviceUsageGrowthPercent}
                        isLoading={isLoading}
                        footer={
                            <div style={{ height: 32, width: '100%', marginLeft: -8 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={continuousCashFlowData.slice(-7)}>
                                        <Area type="monotone" dataKey="cashOut" stroke="#1890ff" fill="#1890ff" fillOpacity={0.1} strokeWidth={1.5} isAnimationActive={false} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        }
                    />
                </Col>
                <Col xs={24} sm={12} xl={6}>
                    <StatsCard
                        title="Dư nợ hệ thống"
                        value={kpis?.totalLiabilities || 0}
                        isCurrency
                        icon={<WalletOutlined />}
                        color="#722ed1"
                        isLoading={isLoading}
                        footer={
                            <Text type="secondary" style={{ fontSize: 12 }}>
                                Tổng số dư của toàn bộ người dùng
                            </Text>
                        }
                    />
                </Col>
                <Col xs={24} sm={12} xl={6}>
                    <StatsCard
                        title="Tỷ lệ nạp lỗi"
                        value={kpis?.failedDepositRate || 0}
                        suffix="%"
                        icon={<BankOutlined />}
                        color="#ff4d4f"
                        isLoading={isLoading}
                        footer={
                            <Flex align="center" style={{ height: 32, width: '100%' }}>
                                <Progress percent={kpis?.failedDepositRate} size="small" showInfo={false} strokeColor="#ff4d4f" railColor="#f0f0f0" strokeWidth={6} />
                            </Flex>
                        }
                    />
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                {/* Đổi width thành lg={24} để Tương quan dòng tiền chiếm trọn hàng */}
                <Col xs={24} lg={24}>
                    <ChartCard title="Tương quan dòng tiền (Nạp / Tiêu)" isLoading={isLoading}>
                        <ResponsiveContainer width="100%" height={280}>
                            <AreaChart data={continuousCashFlowData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorCashIn" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#52c41a" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#52c41a" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorCashOut" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#1890ff" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#1890ff" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#bfbfbf' }} tickFormatter={(val) => dayjs(val).format('DD/MM')} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#bfbfbf' }} tickFormatter={(val) => formatCompactMoney(val)} width={80} />
                                <Tooltip content={<CustomCurrencyTooltip />} cursor={{ stroke: '#d9d9d9', strokeWidth: 1 }} />
                                <Area type="monotone" dataKey="cashIn" name="Tiền nạp" stroke="#52c41a" strokeWidth={2} fill="url(#colorCashIn)" />
                                <Area type="monotone" dataKey="cashOut" name="Tiêu dùng" stroke="#1890ff" strokeWidth={2} fill="url(#colorCashOut)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </Col>

                {/* Trạng thái giao dịch chiếm 1/3 (lg={8}) */}
                <Col xs={24} lg={8}>
                    <ChartCard title="Trạng thái giao dịch" isLoading={isLoading}>
                        <Flex vertical align="center" justify="center" style={{ height: 280 }}>
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie data={statusChartData} innerRadius={60} outerRadius={80} paddingAngle={8} dataKey="value" stroke="none">
                                        {statusChartData.map((entry, idx) => <Cell key={`cell-${idx}`} fill={entry.color} />)}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                            <CustomLegend data={statusChartData} />
                        </Flex>
                    </ChartCard>
                </Col>

                {/* Đổi width thành lg={16} để Top 10 Khách hàng ghép cùng hàng với Trạng thái giao dịch */}
                <Col xs={24} lg={16}>
                    <ChartCard title="Top 10 Khách hàng chi tiêu cao nhất" isLoading={isLoading}>
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={dashboardData?.topSpenders} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                                <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="#f5f5f5" />
                                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#bfbfbf' }} tickFormatter={(val) => formatCompactMoney(val)} />
                                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#434343', fontWeight: 500 }} width={160} />
                                <Tooltip cursor={{ fill: '#f5f5f5' }} content={<CustomCurrencyTooltip />} />
                                <Bar dataKey="totalSpent" name="Tổng chi tiêu" fill={TOP_SPENDER_COLOR} radius={[0, 4, 4, 0]} barSize={16} />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                <Col xs={24} xl={12}>
                    <Card
                        title={<Flex align="center" gap={8}><RiseOutlined style={{ color: '#52c41a', fontSize: 14 }} /><Text strong style={{ fontSize: 14 }}>Lịch sử nạp tiền mới nhất</Text></Flex>}
                        className="rounded-xl shadow-sm border-none h-full"
                    >
                        <Table
                            dataSource={dashboardData?.recentDeposits || []}
                            loading={isLoading}
                            pagination={false}
                            size="small"
                            rowKey="txnId"
                            columns={[
                                {
                                    title: 'Mã GD', dataIndex: 'txnId', key: 'txnId',
                                    render: (val) => <Text type="secondary" style={{ fontSize: 11, fontFamily: 'monospace' }}>{val}</Text>
                                },
                                {
                                    title: 'Khách hàng', key: 'user',
                                    render: (_, record) => (
                                        <Flex align="center" gap={8}>
                                            <Avatar src={record.userAvatar} size={24} />
                                            <Text style={{ fontWeight: 500, fontSize: 12 }}>{record.userName}</Text>
                                        </Flex>
                                    )
                                },
                                {
                                    title: 'Số tiền', dataIndex: 'amount', key: 'amount', align: 'right',
                                    render: (val) => <Text strong style={{ color: '#52c41a' }}>{formatCurrency(val)}</Text>
                                },
                                {
                                    title: 'Thời gian', dataIndex: 'createdAt', key: 'createdAt', align: 'right',
                                    render: (val) => <Text type="secondary" style={{ fontSize: 11 }}>{dayjs(val).format('HH:mm DD/MM')}</Text>
                                },
                            ]}
                        />
                    </Card>
                </Col>
                <Col xs={24} xl={12}>
                    <Card
                        title={<Flex align="center" gap={8}><FallOutlined style={{ color: '#1890ff', fontSize: 14 }} /><Text strong style={{ fontSize: 14 }}>Giao dịch tiêu dùng lớn nhất</Text></Flex>}
                        className="rounded-xl shadow-sm border-none h-full"
                    >
                        <Table
                            dataSource={dashboardData?.topSpendingLogs || []}
                            loading={isLoading}
                            pagination={false}
                            size="small"
                            rowKey="txnId"
                            columns={[
                                {
                                    title: 'Khách hàng', key: 'user',
                                    render: (_, record) => (
                                        <Flex align="center" gap={8}>
                                            <Avatar src={record.userAvatar} size={24} />
                                            <Text style={{ fontWeight: 500, fontSize: 12 }}>{record.userName}</Text>
                                        </Flex>
                                    )
                                },
                                {
                                    title: 'Số tiền', dataIndex: 'amount', key: 'amount', align: 'right',
                                    render: (val) => <Text strong style={{ color: '#ff4d4f' }}>-{formatCurrency(val)}</Text>
                                },
                                {
                                    title: 'Thời gian', dataIndex: 'createdAt', key: 'createdAt', align: 'right',
                                    render: (val) => <Text type="secondary" style={{ fontSize: 11 }}>{dayjs(val).format('DD/MM/YYYY')}</Text>
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
                                <Text style={{ fontSize: 24, fontWeight: 600, color: '#1a1a1a', letterSpacing: '-0.02em' }}>
                                    {displayValue}
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

function formatCompactMoney(amount?: number | null): string {
    if (!amount) return '0 ₫';
    if (amount >= 1_000_000_000) return `${(amount / 1_000_000_000).toLocaleString('vi-VN')} Tỷ`;
    if (amount >= 1_000_000) return `${(amount / 1_000_000).toLocaleString('vi-VN')} Tr`;
    return formatCurrency(amount);
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

const CustomCurrencyTooltip = ({ active, payload, label }: any) => {
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
                        <Text style={{ fontSize: 13, fontWeight: 700 }}>{formatCurrency(entry.value)}</Text>
                    </Flex>
                ))}
            </div>
        );
    }
    return null;
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div style={{
                background: 'rgba(255,255,255,0.98)', padding: '10px 14px',
                borderRadius: '10px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', border: '1px solid #f0f0f0'
            }}>
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