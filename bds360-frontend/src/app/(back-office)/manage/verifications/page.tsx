// @/app/(back-office)/manage/verifications/page.tsx
'use client';

import { DataTable, RefreshButton, TableState } from '@/components/base';
import { TableActionDropdown } from '@/components/composite';
import { APP_ROUTES } from '@/config';
import { getPageMeta } from '@/constants';
import {
    useGetVerificationRequests,
    VerificationFilterParams,
    VerificationSubmission
} from '@/features/users';
import { VerificationReviewModal } from '@/features/users/components/verification-review.modal';
import { VERIFICATION_STATUS_LABEL } from '@/features/users/users.constant';
import { useAppTheme } from '@/hooks/use-app-theme';
import { formatDateTime, } from '@/utils';
import { CheckCircleOutlined, CloseCircleOutlined, EyeOutlined, SearchOutlined, SyncOutlined } from '@ant-design/icons';
import { Avatar, Flex, Input, Segmented, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemo, useState } from 'react';

const { Title, Text } = Typography;

const VERIFICATION_STATUS_COLOR: Record<string, string> = {
    PENDING: 'warning',
    APPROVED: 'success',
    REJECTED: 'error',
};

export default function ManageVerificationsPage() {
    const { colorBgContainer, colorBorderSecondary, colorTextSecondary } = useAppTheme();
    const { icon, title } = getPageMeta(APP_ROUTES.MANAGE.VERIFICATIONS);

    const defaultFilters = useMemo<VerificationFilterParams>(() => ({
        page: 0,
        size: 10,
        sortBy: 'createdAt',
        sortDirection: 'DESC',
        status: undefined,
        search: undefined,
    }), []);

    const [filters, setFilters] = useState<VerificationFilterParams>(defaultFilters);
    const [searchValue, setSearchValue] = useState<string>('');

    const [reviewModal, setReviewModal] = useState<{ isOpen: boolean; data: VerificationSubmission | null }>({
        isOpen: false,
        data: null,
    });

    const { data, isFetching } = useGetVerificationRequests(filters);

    const isFilterChanged = useMemo(() => {
        return JSON.stringify(filters) !== JSON.stringify(defaultFilters);
    }, [filters, defaultFilters]);

    const handleTableChange = (newState: TableState) => {
        setFilters(prev => ({
            ...prev,
            page: newState.currentPage - 1,
            size: newState.pageSize,
            sortBy: newState.sortBy,
            sortDirection: newState.sortDirection,
        }));
    };

    const handleResetFilters = () => {
        setFilters({ ...defaultFilters });
        setSearchValue('');
    };

    const handleSearch = (value: string) => {
        setFilters(prev => ({ ...prev, search: value || undefined, page: 0 }));
    };

    const columns: ColumnsType<VerificationSubmission> = [
        {
            title: 'Mã YC',
            dataIndex: 'id',
            key: 'id',
            width: 80,
            sorter: true,
            render: (id) => <Text className="font-mono">{id}</Text>
        },
        {
            title: 'Người dùng',
            key: 'user',
            render: (_, record) => (
                <Flex align="center" gap={12}>
                    <Avatar src={record.userAvatar}>{record.userName.charAt(0)}</Avatar>
                    <Flex vertical>
                        <Text strong>{record.userName}</Text>
                        <Text type="secondary" className="text-[12px]">{record.userEmail}</Text>
                    </Flex>
                </Flex>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            align: "center",
            key: 'status',
            sorter: true,

            width: 140,
            render: (status: keyof typeof VERIFICATION_STATUS_LABEL) => {
                let statusIcon = <SyncOutlined spin />;
                if (status === 'APPROVED') statusIcon = <CheckCircleOutlined />;
                if (status === 'REJECTED') statusIcon = <CloseCircleOutlined />;

                return (
                    <Tag icon={statusIcon} color={VERIFICATION_STATUS_COLOR[status]} variant="filled" className="border-none px-2 py-1">
                        {VERIFICATION_STATUS_LABEL[status]}
                    </Tag>
                );
            },
        },
        {
            title: 'Ngày gửi',
            dataIndex: 'createdAt',
            key: 'createdAt',
            align: "center",

            width: 160,
            sorter: true,
            render: (date: string) => <Text type="secondary" className="text-[13px]">{formatDateTime(date)}</Text>,
        },
        {
            title: 'Người duyệt',
            dataIndex: 'reviewedBy',
            key: 'reviewedBy',
            sorter: true,

            width: 180,
            align: "right",
            render: (reviewedBy: string) => <Text type="secondary" className="text-[13px]">{reviewedBy || '--'}</Text>,
        },
        {
            title: '',
            key: 'action',
            width: 35,
            align: 'center',
            fixed: 'right',
            render: (_, record) => (
                <TableActionDropdown actions={[
                    {
                        key: 'review',
                        label: record.status === 'PENDING' ? 'Duyệt hồ sơ' : 'Xem chi tiết',
                        icon: <EyeOutlined />,
                        onClick: () => setReviewModal({ isOpen: true, data: record }),
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
                    Xét duyệt yêu cầu xác minh danh tính (CCCD/CMND) của người dùng.
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
                        <Segmented
                            options={[
                                { label: 'Tất cả', value: 'ALL' },
                                { label: 'Đang chờ', value: 'PENDING' },
                                { label: 'Đã duyệt', value: 'APPROVED' },
                                { label: 'Từ chối', value: 'REJECTED' },
                            ]}
                            value={filters.status || 'ALL'}
                            onChange={(val) => setFilters(prev => ({
                                ...prev,
                                status: val === 'ALL' ? undefined : (val as any),
                                page: 0
                            }))}
                        />

                        <Input.Search
                            placeholder="Tìm theo tên, email..."
                            allowClear
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            onSearch={handleSearch}
                            className="!w-64"
                            prefix={<SearchOutlined style={{ color: colorTextSecondary }} />}
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
                    <DataTable<VerificationSubmission>
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

            <VerificationReviewModal
                isOpen={reviewModal.isOpen}
                onClose={() => setReviewModal({ isOpen: false, data: null })}
                submission={reviewModal.data}
            />
        </div>
    );
}