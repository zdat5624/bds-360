// @/app/(main)/(account)/user/notifications/page.tsx

'use client';

import { DataTable, TableState } from '@/components/base';
import { ConfirmModal } from '@/components/base/confirm.modal';
import { useAppTheme } from '@/hooks/use-app-theme';
import { formatDateTime } from '@/utils';
import {
    BellOutlined,
    CheckOutlined,
    ClearOutlined,
    DeleteOutlined,
    EyeOutlined
} from '@ant-design/icons';
import { Badge, Button, Divider, Select, Tabs, Typography, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';

// API & Components
import { TableActionDropdown } from '@/components/composite';
import {
    useDeleteNotifications,
    useMarkAllAsRead,
    useMarkAsRead
} from '@/features/notifications/api/notifications.mutations';
import {
    useGetMyNotifications,
    useGetUnreadCountsDetail
} from '@/features/notifications/api/notifications.queries';
import { Notification, NotificationFilterParams } from '@/features/notifications/api/types';
import { NotificationDetailModal } from '@/features/notifications/components/notification-detail.modal';
import {
    NOTIFICATION_TYPE_LABEL,
    NOTIFICATION_TYPE_OPTIONS,
    NotificationType
} from '@/features/notifications/notifications.constant';

const { Title, Text } = Typography;

export default function UserNotificationsPage() {
    // --- HOOKS & THEME ---
    const { colorTextSecondary, colorText, colorPrimary, colorBorderSecondary } = useAppTheme();

    // --- STATE BỘ LỌC & PHÂN TRANG ---
    const [filters, setFilters] = useState<NotificationFilterParams>({
        page: 0,
        size: 10,
        sortBy: 'createdAt',
        sortDirection: 'DESC',
        type: undefined,
        isRead: undefined,
    });

    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [localReadIds, setLocalReadIds] = useState<number[]>([]);
    const [displayData, setDisplayData] = useState<Notification[]>([]);

    // State quản lý chi tiết thông báo
    const [detailModal, setDetailModal] = useState<{ isOpen: boolean; notification: Notification | null }>({
        isOpen: false,
        notification: null,
    });

    // ✅ State quản lý Xóa thông báo (Dùng chung cho cả xóa lẻ & xóa nhiều)
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; ids: number[] }>({
        isOpen: false,
        ids: [],
    });

    const tableState: TableState = {
        currentPage: (filters.page ?? 0) + 1,
        pageSize: filters.size ?? 10,
        sortBy: filters.sortBy,
        sortDirection: filters.sortDirection,
    };

    // --- DATA FETCHING & MUTATIONS ---
    const { data, isFetching } = useGetMyNotifications(filters);
    const { data: unreadCounts } = useGetUnreadCountsDetail();

    const markAsReadMutation = useMarkAsRead();
    const markAllAsReadMutation = useMarkAllAsRead();
    const { mutate: deleteMutate, isPending: isDeleting } = useDeleteNotifications();

    const getUnreadCountByType = (type: NotificationType) => {
        return unreadCounts?.find((item) => item.type === type)?.count || 0;
    };

    // --- EFFECT XỬ LÝ OPTIMISTIC UI ---
    useEffect(() => {
        if (data?.content) {
            if (filters.isRead === false) {
                setDisplayData((prev) => {
                    const newItems = [...data.content];
                    prev.forEach(item => {
                        if (localReadIds.includes(item.id) && !newItems.some(n => n.id === item.id)) {
                            newItems.push({ ...item, read: true });
                        }
                    });
                    return newItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                });
            } else {
                setDisplayData(data.content);
            }
        } else {
            setDisplayData([]);
        }
    }, [data?.content, filters.isRead, localReadIds]);

    // --- HANDLERS ---
    const handleTableStateChange = (newState: TableState) => {
        setFilters((prev) => ({
            ...prev,
            page: newState.currentPage - 1,
            size: newState.pageSize,
            sortBy: newState.sortBy || 'createdAt',
            sortDirection: newState.sortDirection || 'DESC',
        }));
    };

    const handleTabChange = (key: string) => {
        setFilters((prev) => ({
            ...prev,
            page: 0,
            type: key === 'ALL' ? undefined : (key as NotificationType),
        }));
        setSelectedRowKeys([]);
        setLocalReadIds([]);
    };

    const handleReadFilterChange = (value?: string) => {
        setFilters((prev) => ({
            ...prev,
            page: 0,
            isRead: value === 'read' ? true : value === 'unread' ? false : undefined,
        }));
        setSelectedRowKeys([]);
        setLocalReadIds([]);
    };

    const handleMarkSelectedAsRead = async () => {
        if (!selectedRowKeys.length) return;
        const currentSelected = selectedRowKeys as number[];
        setLocalReadIds(prev => [...prev, ...currentSelected]);
        try {
            await markAsReadMutation.mutateAsync(currentSelected);
            message.success('Đã đánh dấu các thông báo đã chọn là đã đọc');
            setSelectedRowKeys([]);
        } catch (error) {
            setLocalReadIds(prev => prev.filter(id => !currentSelected.includes(id)));
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await markAllAsReadMutation.mutateAsync();
            message.success('Đã đánh dấu tất cả thông báo là đã đọc');
            setSelectedRowKeys([]);
            setLocalReadIds([]);
        } catch (error) { }
    };

    const handleRowClick = (record: Notification) => {
        const isCurrentlyRead = record.read || localReadIds.includes(record.id);
        if (!isCurrentlyRead) {
            setLocalReadIds(prev => [...prev, record.id]);
            markAsReadMutation.mutate([record.id]);
        }
        setDetailModal({ isOpen: true, notification: record });
    };

    const handleDeleteSuccess = (deletedCount: number) => {
        if (displayData.length === deletedCount && (filters.page || 0) > 0) {
            setFilters(prev => ({ ...prev, page: (prev.page || 0) - 1 }));
        }
        setSelectedRowKeys([]);
    };

    // ✅ Hàm xử lý Xóa thông báo tập trung
    const handleConfirmDelete = () => {
        deleteMutate(deleteModal.ids, {
            onSuccess: () => {
                message.success(`Đã xóa ${deleteModal.ids.length} thông báo`);
                const deletedCount = deleteModal.ids.length;
                setDeleteModal({ isOpen: false, ids: [] });
                handleDeleteSuccess(deletedCount);
            }
        });
    };

    // --- ĐỊNH NGHĨA CỘT BẢNG ---
    const columns: ColumnsType<Notification> = [
        {
            title: 'Phân loại',
            dataIndex: 'type',
            key: 'type',
            width: 140,
            render: (type: NotificationType) => (
                <span style={{ color: colorTextSecondary }}>
                    {NOTIFICATION_TYPE_LABEL[type]}
                </span>
            ),
        },
        {
            title: 'Nội dung',
            dataIndex: 'message',
            key: 'message',
            width: 350,
            render: (text: string, record: Notification) => {
                const isRead = record.read || localReadIds.includes(record.id);
                return (
                    <div className="flex items-center gap-2">
                        {!isRead && (
                            <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: colorPrimary }} />
                        )}

                        <div
                            className={`line-clamp-1 break-words flex-1 min-w-0 ${!isRead ? 'font-semibold' : 'font-normal'}`}
                            style={{ color: !isRead ? colorText : colorTextSecondary }}
                        >
                            {text}
                        </div>
                    </div>
                );
            },
        },
        {
            title: 'Thời gian',
            dataIndex: 'createdAt',
            key: 'createdAt',
            align: 'right',
            width: 130,
            render: (date: string) => formatDateTime(date),
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
                            onClick: () => handleRowClick(record),
                        },
                        {
                            key: 'delete',
                            label: 'Xóa thông báo',
                            icon: <DeleteOutlined />,
                            danger: true, // ✅ Antd tự động xử lý màu đỏ và full width hit-box
                            onClick: () => setDeleteModal({ isOpen: true, ids: [record.id] }), // ✅ Gọi State trực tiếp
                        },
                    ]}
                />
            ),
        },
    ];

    return (
        <div className="w-full flex flex-col gap-4">
            {/* 1. HEADER */}
            <div>
                <Title level={3} className="!m-0 flex items-center gap-2">
                    <BellOutlined /> Thông báo
                </Title>
                <Text type="secondary" className="mt-1 block">
                    Cập nhật các hoạt động mới nhất về bài đăng và giao dịch của bạn.
                </Text>
                <Divider className="!mt-4 !mb-0" />
            </div>

            {/* 2. ACTION BAR */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
                {/* 2.1 TABS */}
                <div className="w-full md:flex-1 min-w-0 overflow-hidden">
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
                            ...Object.values(NOTIFICATION_TYPE_OPTIONS).map(type => ({
                                key: type,
                                label: (
                                    <div className="flex items-center gap-1.5">
                                        {NOTIFICATION_TYPE_LABEL[type]}
                                        <Badge
                                            count={getUnreadCountByType(type)}
                                            overflowCount={99}
                                            style={{ backgroundColor: colorPrimary }}
                                            offset={[-5, -10]}
                                        />
                                    </div>
                                ),
                            }))
                        ]}
                    />
                </div>

                {/* 2.2 FILTERS & ACTIONS */}
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <Select
                        allowClear
                        placeholder="Lọc trạng thái"
                        onChange={handleReadFilterChange}
                        className="flex-1 sm:flex-none sm:w-[160px]"
                        options={[
                            { value: 'all', label: 'Tất cả' },
                            { value: 'read', label: 'Đã đọc' },
                            { value: 'unread', label: 'Chưa đọc' },
                        ]}
                    />

                    {selectedRowKeys.length > 0 && (
                        <div className="flex items-center gap-2">
                            <Button
                                type='primary'
                                onClick={handleMarkSelectedAsRead}
                                icon={<CheckOutlined />}
                                loading={markAsReadMutation.isPending}
                            >
                                Đọc mục chọn
                            </Button>

                            {/* ✅ Nút Xóa hàng loạt trực tiếp gọi State */}
                            <Button
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => setDeleteModal({ isOpen: true, ids: selectedRowKeys as number[] })}
                                className="animate-in fade-in zoom-in duration-200"
                            >
                                Xóa ({selectedRowKeys.length})
                            </Button>
                        </div>
                    )}

                    <Button
                        onClick={handleMarkAllAsRead}
                        icon={<ClearOutlined />}
                        loading={markAllAsReadMutation.isPending}
                    >
                        Đọc tất cả
                    </Button>
                </div>
            </div>

            {/* 3. DATA TABLE */}
            <DataTable<Notification>
                columns={columns}
                data={displayData}
                total={data?.totalElements || 0}
                loading={isFetching}
                tableState={tableState}
                onChangeState={handleTableStateChange}
                rowKey="id"
                onRowClick={handleRowClick}
                enableRowSelection={true}
                onRowSelectionChange={(keys) => setSelectedRowKeys(keys)}
                selectedRowKeys={selectedRowKeys}
            />

            <NotificationDetailModal
                isOpen={detailModal.isOpen}
                onClose={() => setDetailModal({ ...detailModal, isOpen: false })}
                notification={detailModal.notification}
            />

            {/* ✅ Đặt Modal Xóa ở root của trang để tối ưu hiệu năng */}
            <ConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
                onConfirm={handleConfirmDelete}
                isLoading={isDeleting}
                title="Xóa thông báo"
                content={`Bạn có chắc chắn muốn xóa vĩnh viễn ${deleteModal.ids.length} thông báo đã chọn?`}
                okText="Xóa ngay"
                cancelText="Hủy"
            />
        </div>
    );
}