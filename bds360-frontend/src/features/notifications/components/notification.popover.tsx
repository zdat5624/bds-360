// @/features/notifications/components/notification.popover.tsx
'use client';

import { APP_ROUTES } from '@/config/routes'; // 👈 Import Routes
import { useAppTheme } from '@/hooks/use-app-theme';
import { getSmartRelativeTime } from '@/utils';
import { CheckCircleOutlined, RightOutlined } from '@ant-design/icons'; // Thêm icon mũi tên
import { Avatar, Button, Empty, Select, Spin, Tabs, Tooltip, Typography } from 'antd';
import Link from 'next/link'; // 👈 Import Link của Next.js
import { useEffect, useMemo, useState } from 'react';
import { useMarkAllAsRead, useMarkAsRead } from '../api/notifications.mutations';
import { useGetMyNotifications } from '../api/notifications.queries';
import { NotificationFilterParams } from '../api/types';
import {
    NOTIFICATION_TYPE_ICON,
    NOTIFICATION_TYPE_LABEL,
    NOTIFICATION_TYPE_OPTIONS
} from '../notifications.constant';

const { Text } = Typography;

interface NotificationPopoverProps {
    onClose: () => void;
}

export function NotificationPopoverContent({ onClose }: NotificationPopoverProps) {
    const {
        colorPrimary,
        colorBgContainer,
        colorBorderSecondary,
        colorText,
        colorBgTextHover
    } = useAppTheme();

    // --- 1. STATES ---
    const [filters, setFilters] = useState<NotificationFilterParams>({
        page: 0,
        size: 5,
        type: undefined,
        isRead: undefined,
        sortBy: 'createdAt',
        sortDirection: 'DESC',
    });

    const [retainedItems, setRetainedItems] = useState<Record<number, any>>({});

    // --- 2. TANSTACK QUERY ---
    const { data, isFetching, isPlaceholderData } = useGetMyNotifications(filters);
    const { mutate: markAsRead } = useMarkAsRead();
    const { mutate: markAllAsRead, isPending: isMarkingAll } = useMarkAllAsRead();

    useEffect(() => {
        setRetainedItems({});
    }, [filters]);

    // --- 3. HANDLERS ---
    const handleTabChange = (key: string) => {
        setFilters(prev => ({
            ...prev,
            page: 0,
            type: key === 'ALL' ? undefined : (key as any)
        }));
    };

    const handleReadFilterChange = (val: string) => {
        let isRead: boolean | undefined;
        if (val === 'READ') isRead = true;
        if (val === 'UNREAD') isRead = false;
        setFilters(prev => ({ ...prev, page: 0, isRead }));
    };

    const handleLoadMore = () => {
        setFilters(prev => ({ ...prev, size: (prev.size || 5) + 5 }));
    };

    const handleItemClick = (item: any) => {
        if (!item.read) {
            markAsRead([item.id]);
            setRetainedItems(prev => ({ ...prev, [item.id]: { ...item, read: true } }));
        }
    };

    // --- 4. MERGE DATA ---
    const serverNotifications = data?.content || [];
    const hasMore = (data?.totalElements || 0) > serverNotifications.length;

    const displayNotifications = useMemo(() => {
        if (filters.isRead !== false) {
            return serverNotifications;
        }

        const merged = [...serverNotifications];

        Object.values(retainedItems).forEach(retained => {
            if (!merged.some(n => n.id === retained.id)) {
                merged.push(retained);
            }
        });

        return merged.sort((a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }, [serverNotifications, retainedItems, filters.isRead]);

    return (
        <div
            className="w-[350px] sm:w-[400px] max-h-[85vh] flex flex-col overflow-hidden rounded-lg shadow-lg"
            style={{ background: colorBgContainer }}
        >
            {/* ================= SECTION 1: HEADER & TABS ================= */}
            <div className="px-4 pt-3 border-b shrink-0" style={{ borderColor: colorBorderSecondary }}>
                <div className="flex justify-between items-center mb-2">
                    <Text strong className="text-base">Thông báo</Text>
                    <div className="flex items-center gap-2">
                        <Select
                            value={filters.isRead === true ? 'READ' : filters.isRead === false ? 'UNREAD' : 'ALL'}
                            onChange={handleReadFilterChange}
                            size="small"
                            className="w-[105px]"
                            options={[
                                { value: 'ALL', label: 'Tất cả' },
                                { value: 'UNREAD', label: 'Chưa đọc' },
                                { value: 'READ', label: 'Đã đọc' },
                            ]}
                        />
                        <Tooltip title="Đánh dấu tất cả đã đọc">
                            <Button
                                type="text"
                                size="small"
                                className="flex items-center justify-center"
                                icon={<CheckCircleOutlined className="text-lg" />}
                                loading={isMarkingAll}
                                onClick={() => markAllAsRead()}
                            />
                        </Tooltip>
                    </div>
                </div>

                <Tabs
                    activeKey={filters.type || 'ALL'}
                    onChange={handleTabChange}
                    size="small"
                    className="[&_.ant-tabs-nav]:!mb-0"
                    items={[
                        { key: 'ALL', label: 'Tất cả' },
                        ...Object.values(NOTIFICATION_TYPE_OPTIONS).map(type => ({
                            key: type,
                            label: NOTIFICATION_TYPE_LABEL[type]
                        }))
                    ]}
                />
            </div>

            {/* ================= SECTION 2: NOTIFICATION LIST ================= */}
            <div className="overflow-y-auto flex-1 min-h-[250px] max-h-[450px] relative">
                {isFetching && isPlaceholderData && displayNotifications.length > 0 && (
                    <div
                        className="absolute inset-0 z-20 flex justify-center pt-10"
                        style={{ backgroundColor: `${colorBgContainer}95` }}
                    >
                        <Spin description="Đang tải..." />
                    </div>
                )}

                {displayNotifications.length === 0 ? (
                    isFetching ? (
                        <div className="flex justify-center items-center h-[250px]"><Spin /></div>
                    ) : (
                        <div className="flex justify-center items-center h-[250px]">
                            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không có thông báo nào" />
                        </div>
                    )
                ) : (
                    <div className="flex flex-col">
                        {displayNotifications.map((item) => (
                            <div
                                key={item.id}
                                className="flex gap-3 px-4 py-4 cursor-pointer transition-all duration-200 border-b last:border-b-0 hover:brightness-95"
                                style={{
                                    backgroundColor: item.read ? colorBgContainer : colorBgTextHover,
                                    borderColor: colorBorderSecondary
                                }}
                                onClick={() => handleItemClick(item)}
                            >
                                <div className="shrink-0 pt-0.5">
                                    <Avatar
                                        size="default"
                                        icon={NOTIFICATION_TYPE_ICON[item.type]}
                                    />
                                </div>

                                <div className="flex-1 min-w-0 flex flex-col gap-1">
                                    <div className="flex justify-between items-start gap-2">
                                        <Text
                                            strong={!item.read}
                                            className="text-[13px] leading-snug line-clamp-3"
                                            style={{ color: colorText }}
                                        >
                                            {item.message}
                                        </Text>

                                        {!item.read && (
                                            <div
                                                className="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 shadow-sm"
                                                style={{ backgroundColor: colorPrimary }}
                                            />
                                        )}
                                    </div>
                                    <Text type="secondary" className="text-[11px]">
                                        {getSmartRelativeTime(item.createdAt)}
                                    </Text>
                                </div>
                            </div>
                        ))}

                        {/* Nút Load More chèn ngay dưới list tin (nếu còn) */}
                        {hasMore && (
                            <div className="text-center py-3 border-b" style={{ borderColor: colorBorderSecondary }}>
                                <Button
                                    type="text"
                                    size="small"
                                    shape="round"
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={(e) => {
                                        e.currentTarget.blur();
                                        handleLoadMore();
                                    }}
                                    loading={isFetching}
                                    className="text-xs transition-all hover:!text-[var(--ant-color-primary)] hover:underline"
                                >
                                    Xem thêm cũ hơn
                                </Button>
                            </div>
                        )}

                    </div>
                )}
            </div>

            {/* ================= SECTION 3: FOOTER (LINK TO FULL PAGE) ================= */}
            <div
                className="shrink-0 border-t p-2 bg-gray-50/50 flex justify-center"
                style={{ borderColor: colorBorderSecondary }}
            >
                <Link
                    href={APP_ROUTES.USER.NOTIFICATIONS}
                    onClick={onClose} // Đóng popover khi click
                    className="w-full flex justify-center"
                >
                    <Button
                        type="text"
                        block
                        className="font-medium flex items-center justify-center gap-1 hover:bg-transparent"
                        style={{ color: colorPrimary }}
                    >
                        Xem tất cả thông báo
                        <RightOutlined className="text-[10px]" />
                    </Button>
                </Link>
            </div>
        </div>
    );
}