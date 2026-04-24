// @/app/(back-office)/manage/transactions/page.tsx
'use client';

import { DataTable, FilterButton, RefreshButton, TableState } from '@/components/base';
import { TableActionDropdown } from '@/components/composite';
import { APP_ROUTES } from '@/config';
import { getPageMeta } from '@/constants';
import {
    Transaction,
    TRANSACTION_STATUS_COLOR,
    TRANSACTION_STATUS_LABEL,
    TRANSACTION_TYPE_LABEL,
    TransactionDetailModal,
    TransactionFilterParams,
    TransactionStatus,
    TransactionType,
    useGetAdminTransactions
} from '@/features/transactions';
import { TransactionFilterModal } from '@/features/transactions/components/transaction-filter.modal';
import { useAppTheme } from '@/hooks/use-app-theme';
import { formatCurrency, formatDateTime, toApiEndDate, toApiStartDate } from '@/utils';
import { DATE_FORMAT, dayjs } from '@/utils/date.util';
import { EyeOutlined } from '@ant-design/icons';
import { DatePicker, Flex, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemo, useState } from 'react';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export default function ManageTransactionsPage() {
    const { colorBgContainer, colorBorderSecondary, colorSuccess, colorError } = useAppTheme();
    const { icon, title } = getPageMeta(APP_ROUTES.MANAGE.TRANSACTIONS);

    const defaultFilters = useMemo<TransactionFilterParams>(() => ({
        page: 0,
        size: 10,
        sortBy: 'createdAt',
        sortDirection: 'DESC',
        type: undefined,
        status: undefined,
        email: undefined,
        transactionId: undefined,
        txnId: undefined,
        startDate: undefined,
        endDate: undefined,
    }), []);

    const [filters, setFilters] = useState<TransactionFilterParams>(defaultFilters);

    const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false);
    const [detailModal, setDetailModal] = useState<{ isOpen: boolean; id: number | null }>({
        isOpen: false,
        id: null,
    });

    const { data, isFetching } = useGetAdminTransactions(filters);

    const isFilterChanged = useMemo(() => {
        return JSON.stringify(filters) !== JSON.stringify(defaultFilters);
    }, [filters, defaultFilters]);

    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (filters.status) count++;
        if (filters.type) count++;
        if (filters.email || filters.transactionId || filters.txnId) count++;
        if (filters.startDate && filters.endDate) count++;
        return count;
    }, [filters]);

    const handleTableChange = (newState: TableState) => {
        setFilters(prev => ({
            ...prev,
            page: newState.currentPage - 1,
            size: newState.pageSize,
            sortBy: newState.sortBy,
            sortDirection: newState.sortDirection,
        }));
    };

    const handleApplyAdvancedFilter = (newFilters: Partial<TransactionFilterParams>) => {
        setFilters(prev => ({
            ...prev,
            ...newFilters,
            page: 0
        }));
        setIsAdvancedFilterOpen(false);
    };

    const handleResetFilters = () => {
        setFilters({ ...defaultFilters });
    };

    const columns: ColumnsType<Transaction> = [
        {
            title: 'Mã HT',
            dataIndex: 'id',
            key: 'id',
            width: 100,
            sorter: true,
            render: (id) => <Text className="font-mono">{id}</Text>
        },
        {
            title: 'Khách hàng',
            dataIndex: 'user',
            key: 'user',
            render: (user) => (
                <Flex vertical>
                    <Text strong>{user.name}</Text>
                    <Text type="secondary" className="text-[12px]">{user.email}</Text>
                </Flex>
            ),
        },
        {
            title: 'Mã GD (VNPAY)',
            dataIndex: 'txnId',
            key: 'txnId',
            width: 160,
            sorter: true,
            render: (txnId: string) => {
                if (!txnId) return <Text>--</Text>;

                return (
                    <Text className="font-mono text-[12px]" copyable>
                        {txnId}
                    </Text>
                );
            }
        },

        {
            title: 'Loại',
            dataIndex: 'type',
            key: 'type',
            width: 120,
            align: "center",

            render: (type: TransactionType) => TRANSACTION_TYPE_LABEL[type],
        },
        {
            title: 'Số tiền',
            dataIndex: 'amount',
            key: 'amount',
            align: 'right',
            width: 150,
            sorter: true,
            render: (amount: number, record) => {
                const isDeposit = record.type === 'DEPOSIT';
                return (
                    <Text strong style={{ color: isDeposit ? colorSuccess : colorError }}>
                        {isDeposit ? '+' : '-'}{formatCurrency(Math.abs(amount))}
                    </Text>
                );
            },
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            align: "center",

            width: 130,
            render: (status: TransactionStatus) => (
                <Tag color={TRANSACTION_STATUS_COLOR[status]} variant="filled" className="border-none">
                    {TRANSACTION_STATUS_LABEL[status]}
                </Tag>
            ),
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            align: "right",
            width: 170,
            sorter: true,
            render: (date: string) => <Text type="secondary" className="text-[13px]">{formatDateTime(date)}</Text>,
        },
        {
            title: '',
            key: 'action',
            width: 60,
            align: 'center',
            fixed: 'right',
            render: (_, record) => (
                <TableActionDropdown actions={[
                    {
                        key: 'view',
                        label: 'Chi tiết',
                        icon: <EyeOutlined />,
                        onClick: () => setDetailModal({ isOpen: true, id: record.id }),
                    },
                ]} />
            ),
        },
    ];

    return (
        <div className="w-full flex flex-col gap-4">
            <Flex vertical>
                <Title level={3} style={{ margin: 0 }}>
                    <span style={{ marginRight: 8 }}>{icon}</span>
                    {title}
                </Title>
                <Text type="secondary" style={{ marginTop: 4 }}>
                    Đối soát và quản lý lịch sử dòng tiền nạp/thanh toán trên toàn hệ thống.
                </Text>
            </Flex>

            <div
                className="w-full flex flex-col rounded-lg shadow-sm overflow-hidden"
                style={{ backgroundColor: colorBgContainer, border: `1px solid ${colorBorderSecondary}` }}
            >
                <div
                    className="flex flex-wrap justify-between gap-4 items-center border-b px-4 py-4"
                    style={{ borderColor: colorBorderSecondary }}
                >
                    <div className="flex flex-wrap items-center gap-3">
                        <RangePicker
                            className="!w-64"
                            format={DATE_FORMAT.DEFAULT}
                            value={filters.startDate ? [dayjs(filters.startDate), dayjs(filters.endDate)] : null}
                            allowClear={true}
                            onChange={(dates) => setFilters(prev => ({
                                ...prev,
                                startDate: dates ? toApiStartDate(dates[0]) : undefined,
                                endDate: dates ? toApiEndDate(dates[1]) : undefined,
                                page: 0
                            }))}
                        />

                        <FilterButton
                            activeCount={activeFilterCount}
                            onClick={() => setIsAdvancedFilterOpen(true)}
                            onClear={handleResetFilters}
                        />

                        {isFilterChanged && (
                            <RefreshButton
                                loading={isFetching}
                                onClick={handleResetFilters}
                            />
                        )}
                    </div>


                </div>

                <div className="w-full pt-2 px-4 pb-4">
                    <DataTable<Transaction>
                        columns={columns}
                        data={data?.content || []}
                        total={data?.totalElements || 0}
                        loading={isFetching}
                        tableState={{
                            currentPage: filters.page! + 1,
                            pageSize: filters.size!,
                            sortBy: filters.sortBy,
                            sortDirection: filters.sortDirection
                        }}
                        onChangeState={handleTableChange}
                        rowKey="id"
                        bordered={false}
                    />
                </div>
            </div>

            <TransactionFilterModal
                isOpen={isAdvancedFilterOpen}
                onClose={() => setIsAdvancedFilterOpen(false)}
                filters={filters}
                onApply={handleApplyAdvancedFilter}
            />

            <TransactionDetailModal
                isOpen={detailModal.isOpen}
                transactionId={detailModal.id}
                onClose={() => setDetailModal({ isOpen: false, id: null })}
            />
        </div>
    );
}