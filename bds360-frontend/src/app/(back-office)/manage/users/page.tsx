// @/app/(back-office)/manage/users/page.tsx
'use client';

import { DataTable, FilterButton, RefreshButton, TableState } from '@/components/base';
import { TableActionDropdown } from '@/components/composite';
import { APP_ROUTES } from '@/config';
import { GENDER_LABEL, getPageMeta, Role, USER_ROLE_COLOR, USER_ROLE_LABEL, USER_ROLE_OPTIONS } from '@/constants';
import {
    useGetUsers,
    UserFilterParams,
} from '@/features/users';
import { UserDeleteModal } from '@/features/users/components/user-delete.modal';
import { UserDetailModal } from '@/features/users/components/user-detail.modal';
import { UserFilterModal } from '@/features/users/components/user-filter.modal';
import { UserFormModal } from '@/features/users/components/user-form.modal';
import { useAppTheme } from '@/hooks/use-app-theme';
import { User } from '@/types';
import { formatCurrency, formatDateTime } from '@/utils';
import { CheckCircleFilled, CloseCircleFilled, DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { Avatar, Button, Flex, Segmented, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useMemo, useState } from 'react';

const { Title, Text } = Typography;

// const ROLE_COLOR: Record<string, string> = {
//     ADMIN: 'red',
//     MODERATOR: 'purple',
//     USER: 'blue',
// };

export default function ManageUsersPage() {
    const { colorBgContainer, colorBorderSecondary, colorSuccess } = useAppTheme();
    const { icon, title } = getPageMeta(APP_ROUTES.MANAGE.USERS);

    const defaultFilters = useMemo<UserFilterParams>(() => ({
        page: 0,
        size: 10,
        sortBy: 'createdAt',
        sortDirection: 'DESC',
        role: undefined,
        gender: undefined,
        name: undefined,
        email: undefined,
        phone: undefined,
        createdFrom: undefined,
        createdTo: undefined,
    }), []);

    const [filters, setFilters] = useState<UserFilterParams>(defaultFilters);

    const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false);
    const [formModal, setFormModal] = useState<{ isOpen: boolean; data: User | null }>({
        isOpen: false,
        data: null,
    });
    const [detailModal, setDetailModal] = useState<{ isOpen: boolean; id: number | null }>({
        isOpen: false,
        id: null,
    });
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: number | null }>({
        isOpen: false,
        id: null,
    });

    const { data, isFetching } = useGetUsers(filters);

    const isFilterChanged = useMemo(() => {
        return JSON.stringify(filters) !== JSON.stringify(defaultFilters);
    }, [filters, defaultFilters]);

    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (filters.gender) count++;
        if (filters.role) count++;
        if (filters.name || filters.email || filters.phone) count++;
        if (filters.createdFrom && filters.createdTo) count++;
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

    const handleApplyAdvancedFilter = (newFilters: Partial<UserFilterParams>) => {
        setFilters(prev => ({
            ...prev,
            ...newFilters,
            page: 0
        }));
    };

    const handleResetFilters = () => {
        setFilters({ ...defaultFilters });
    };

    const columns: ColumnsType<User> = [
        {
            title: 'Mã',
            dataIndex: 'id',
            key: 'id',
            width: 80,
            sorter: true,
            render: (id) => <Text className="font-mono">{id}</Text>
        },
        {
            title: 'Người dùng',
            dataIndex: 'name',
            key: 'name',
            render: (_, record) => (
                <Flex align="center" gap={12}>
                    <Avatar src={record.avatar}>{record.name.charAt(0)}</Avatar>
                    <Flex vertical>
                        <Text strong>{record.name}</Text>
                        <Text type="secondary" className="text-[12px]">{record.email}</Text>
                    </Flex>
                </Flex>
            ),
        },
        {
            title: 'SĐT',
            dataIndex: 'phone',
            key: 'phone',
            width: 140,
            render: (phone: string) => <Text>{phone || '--'}</Text>,
        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            key: 'role',
            width: 130,
            render: (role: Role) => (
                <Tag color={USER_ROLE_COLOR[role]}>
                    {USER_ROLE_LABEL[role]}
                </Tag>
            )
        },
        {
            title: 'Giới tính',
            dataIndex: 'gender',
            key: 'gender',
            align: 'center',
            width: 90,
            render: (gender: keyof typeof GENDER_LABEL) => <Text>{GENDER_LABEL[gender]}</Text>,
        },
        {
            title: 'Số dư',
            dataIndex: 'balance',
            key: 'balance',
            align: 'right',
            width: 140,
            sorter: true,
            render: (balance: number) => (
                <Text >
                    {formatCurrency(balance)}
                </Text>
            ),
        },
        {
            title: 'Xác thực',
            dataIndex: 'isVerified',
            key: 'isVerified',
            align: 'center',
            width: 100,
            render: (isVerified: boolean) => (
                isVerified
                    ? <CheckCircleFilled style={{ color: colorSuccess, fontSize: 16 }} />
                    : <CloseCircleFilled style={{ color: colorBorderSecondary, fontSize: 16 }} />
            ),
        },
        {
            title: 'Ngày tham gia',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 140,
            align: 'right',
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
                        label: 'Xem chi tiết',
                        icon: <EyeOutlined />,
                        onClick: () => setDetailModal({ isOpen: true, id: record.id }),
                    },
                    {
                        key: 'edit',
                        label: 'Chỉnh sửa',
                        icon: <EditOutlined />,
                        onClick: () => setFormModal({ isOpen: true, data: record }),
                    },
                    {
                        key: 'delete',
                        label: 'Xóa người dùng',
                        icon: <DeleteOutlined />,
                        danger: true,
                        onClick: () => setDeleteModal({ isOpen: true, id: record.id }),
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
                    Quản lý danh sách người dùng, vai trò và trạng thái tài khoản trên hệ thống.
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
                        {/* <Segmented
                            options={[
                                { label: 'Tất cả vai trò', value: 'ALL' },
                                ...USER_ROLE_OPTIONS
                            ]}
                            value={filters.role || 'ALL'}
                            onChange={(val) => setFilters(prev => ({
                                ...prev,
                                role: val === 'ALL' ? undefined : (val as any),
                                page: 0
                            }))}
                        /> */}
                        <div className="flex items-center gap-3 overflow-x-auto whitespace-nowrap">
                            <Segmented
                                className="min-w-max"
                                options={[
                                    { label: 'Tất cả ', value: 'ALL' },
                                    ...USER_ROLE_OPTIONS
                                ]}
                                value={filters.role || 'ALL'}
                                onChange={(val) =>
                                    setFilters(prev => ({
                                        ...prev,
                                        role: val === 'ALL' ? undefined : (val as Role),
                                        page: 0
                                    }))
                                }
                            />
                        </div>

                        <FilterButton className="shrink-0"
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

                    <div className="w-full sm:w-auto flex-shrink-0">
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            className="w-full sm:w-auto"
                            onClick={() => setFormModal({ isOpen: true, data: null })}
                        >
                            Tạo mới
                        </Button>
                    </div>
                </div>

                <div className="w-full pt-2 px-4 pb-4">
                    <DataTable<User>
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

            <UserFilterModal
                isOpen={isAdvancedFilterOpen}
                onClose={() => setIsAdvancedFilterOpen(false)}
                filters={filters}
                onApply={handleApplyAdvancedFilter}
            />

            <UserFormModal
                isOpen={formModal.isOpen}
                onClose={() => setFormModal({ isOpen: false, data: null })}
                user={formModal.data}
            />

            <UserDetailModal
                isOpen={detailModal.isOpen}
                userId={detailModal.id}
                onClose={() => setDetailModal({ isOpen: false, id: null })}
            />

            <UserDeleteModal
                isOpen={deleteModal.isOpen}
                userId={deleteModal.id}
                onClose={() => setDeleteModal({ isOpen: false, id: null })}
            />
        </div>
    );
}