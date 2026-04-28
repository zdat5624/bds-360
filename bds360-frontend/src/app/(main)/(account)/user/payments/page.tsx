// @/app/(main)/(account)/user/transactions/page.tsx
'use client';

import { DataTable, TableState } from '@/components/base';
import { TableActionDropdown } from '@/components/composite/table-action.dropdown';
import { TopUpButton } from '@/features/transactions/components/top-up.button';
import { TransactionDetailModal } from '@/features/transactions/components/transaction-detail.modal';
import { useAppTheme } from '@/hooks/use-app-theme';
import { DATE_FORMAT, dayjs, formatCurrency, formatDateTime, toApiEndDate, toApiStartDate } from '@/utils';
import { CreditCardOutlined, EyeOutlined, SwapOutlined } from '@ant-design/icons';
import { DatePicker, Divider, Select, Tabs, Tag, Tooltip, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useState } from 'react';

// Import từ module transactions
import { useGetMyTransactions } from '@/features/transactions/api/transactions.queries';
import { Transaction, TransactionFilterParams } from '@/features/transactions/api/types';
import { TRANSACTION_STATUS_COLOR, TRANSACTION_STATUS_LABEL, TRANSACTION_STATUS_OPTIONS, TRANSACTION_TYPE_LABEL, TRANSACTION_TYPE_OPTIONS, TransactionStatus, TransactionType } from '@/features/transactions/transactions.constant';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export default function UserTransactionsPage() {
    // --- HOOKS & THEME ---
    const { colorSuccess, colorTextSecondary, colorText, colorBorderSecondary } = useAppTheme();


    // --- STATE BỘ LỌC ---
    const [filters, setFilters] = useState<TransactionFilterParams>({
        page: 0,
        size: 10,
        sortBy: 'createdAt',
        sortDirection: 'DESC',
        type: undefined,
        status: 'SUCCESS',
        startDate: undefined,
        endDate: undefined,
    });

    // --- STATE BẬT TẮT MODAL CHI TIẾT ---
    const [detailModal, setDetailModal] = useState<{ isOpen: boolean; transactionId: number | null }>({
        isOpen: false,
        transactionId: null,
    });

    const tableState: TableState = {
        currentPage: (filters.page ?? 0) + 1,
        pageSize: filters.size ?? 10,
        sortBy: filters.sortBy,
        sortDirection: filters.sortDirection,
    };

    const handleTableStateChange = (newState: TableState) => {
        setFilters((prev) => ({
            ...prev,
            page: newState.currentPage - 1,
            size: newState.pageSize,
            sortBy: newState.sortBy || 'createdAt',
            sortDirection: newState.sortDirection || 'DESC',
        }));
    };

    const { data, isFetching } = useGetMyTransactions(filters);



    // --- HANDLERS BỘ LỌC ---
    const handleTabChange = (key: string) => {
        setFilters((prev) => ({
            ...prev,
            page: 0,
            type: key === 'ALL' ? undefined : (key as TransactionType),
        }));
    };

    const handleStatusChange = (value?: string) => {
        setFilters((prev) => ({
            ...prev,
            page: 0,
            status: value as any,
        }));
    };

    const handleDateRangeChange = (dates: any) => {
        setFilters((prev) => ({
            ...prev,
            page: 0,
            startDate: dates?.[0] ? toApiStartDate(dates[0]) : undefined,
            endDate: dates?.[1] ? toApiEndDate(dates[1]) : undefined,
        }));
    };

    // --- ĐỊNH NGHĨA CỘT BẢNG ---
    const columns: ColumnsType<Transaction> = [
        {
            title: 'Loại giao dịch',
            dataIndex: 'type',
            width: 140,
            sorter: true,

            key: 'type',
            render: (type: TransactionType) => (
                <span style={{ color: colorText }}>
                    {TRANSACTION_TYPE_LABEL[type]}
                </span>
            ),
        },
        {
            title: 'Số tiền',
            dataIndex: 'amount',
            key: 'amount',
            align: 'right',
            sorter: true,
            render: (amount: number, record: Transaction) => {
                const absAmount = Math.abs(amount);
                const formattedAmount = formatCurrency(absAmount);
                const isDeposit = record.type === 'DEPOSIT';

                return (
                    <span
                        className={isDeposit ? "font-semibold" : ""}
                        style={{ color: isDeposit ? colorSuccess : colorText }}
                    >
                        {isDeposit ? '+' : '-'}{formattedAmount}
                    </span>
                );
            },
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            sorter: true,

            align: 'center',
            render: (status: TransactionStatus) => (
                <Tag color={TRANSACTION_STATUS_COLOR[status]} variant="filled">
                    {TRANSACTION_STATUS_LABEL[status]}
                </Tag>
            ),
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            width: '35%',
            sorter: true,

            render: (text) => (
                <Tooltip title={text} placement="topLeft">
                    <div
                        // line-clamp-1: Ép hiển thị tối đa 1 dòng rồi ra 3 chấm
                        // break-all / break-words: Đảm bảo chữ dài không dấu cách cũng bị bẻ gãy
                        className="line-clamp-1 break-words"
                        style={{ color: colorTextSecondary }}
                    >
                        {text}
                    </div>
                </Tooltip>
            ),
        },
        {
            title: 'Thời gian',
            align: 'right',
            width: 140,
            dataIndex: 'createdAt',
            key: 'createdAt',
            sorter: true,
            render: (date) => formatDateTime(date),
        },
        {
            title: '',
            key: 'action',
            width: 40,
            align: 'center',
            fixed: 'right',
            render: (_, record) => (
                <TableActionDropdown
                    actions={[
                        {
                            key: 'view_detail',
                            label: 'Xem chi tiết',
                            icon: <EyeOutlined />,
                            onClick: () => setDetailModal({ isOpen: true, transactionId: record.id }),
                        },
                    ]}
                />
            ),
        },



    ];

    return (
        <div className="w-full flex flex-col gap-4">
            {/* 1. KHU VỰC HEADER */}
            <div>
                <div className="flex flex-wrap justify-between items-start sm:items-center gap-4">
                    <div>
                        <Title level={3} className="!m-0 flex items-center gap-2">
                            <CreditCardOutlined />
                            Lịch sử giao dịch
                        </Title>
                        <Text type="secondary" className="mt-1 block">
                            Quản lý lịch sử nạp tiền và thanh toán phí đăng tin của bạn.
                        </Text>
                    </div>
                    <TopUpButton
                        type="primary"
                        icon={<SwapOutlined />}
                        className="h-9 w-full sm:w-auto"

                    >
                        Nạp tiền
                    </TopUpButton>

                </div>
                <Divider className="!mt-4 !mb-0" />
            </div>

            {/* 2. KHU VỰC THANH CÔNG CỤ (Action Bar) */}
            <div className="flex flex-wrap items-center justify-between gap-4 w-full">

                {/* 2.1 Bên trái: Tabs + Bộ Lọc */}
                {/* flex-1 giúp khu vực này tự chiếm hết không gian còn lại để đẩy nút nạp tiền sang phải */}
                <div className="flex flex-wrap items-center gap-4 flex-1 min-w-0">

                    {/* VÙNG TABS */}
                    <div className="min-w-0 overflow-hidden max-w-full">
                        <Tabs
                            activeKey={filters.type || 'ALL'}
                            onChange={handleTabChange}
                            className="
                            [&_.ant-tabs-nav]:!mb-0
                            [&_.ant-tabs-nav::before]:hidden
                            [&_.ant-tabs-nav-list]:border-b
                        "
                            style={{
                                // 👇 inject màu dynamic từ theme
                                ['--tabs-border-color' as any]: colorBorderSecondary
                            }}
                            items={[
                                { key: 'ALL', label: 'Tất cả' },
                                ...TRANSACTION_TYPE_OPTIONS.map(opt => ({ key: opt.value, label: opt.label }))
                            ]}
                        />
                    </div>

                    {/* VÙNG FILTERS: DatePicker + Select */}
                    <div className="flex flex-wrap items-center gap-3">
                        <RangePicker
                            format={DATE_FORMAT.DEFAULT}
                            placeholder={['Từ ngày', 'Đến ngày']}
                            onChange={handleDateRangeChange}
                            className="w-full sm:w-[240px]"
                            allowClear
                            value={[
                                filters.startDate ? dayjs(filters.startDate) : null,
                                filters.endDate ? dayjs(filters.endDate) : null,
                            ]}
                        />

                        <Select
                            allowClear
                            placeholder="Lọc theo trạng thái"
                            onChange={handleStatusChange}
                            value={filters.status}
                            className="w-full sm:w-[180px]"
                            options={TRANSACTION_STATUS_OPTIONS}
                        />
                    </div>
                </div>


            </div>

            {/* 3. KHU VỰC BẢNG DỮ LIỆU */}
            <DataTable<Transaction>
                columns={columns}
                data={data?.content || []}
                total={data?.totalElements || 0}
                loading={isFetching}
                tableState={tableState}
                onChangeState={handleTableStateChange}
                rowKey="id"
                onRowClick={(record) => setDetailModal({ isOpen: true, transactionId: record.id })}
            />

            {/* 4. MODAL CHI TIẾT */}
            <TransactionDetailModal
                isOpen={detailModal.isOpen}
                transactionId={detailModal.transactionId}
                onClose={() => setDetailModal({ isOpen: false, transactionId: null })}
            />
        </div>
    );
}