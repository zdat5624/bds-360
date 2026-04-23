// @/features/notifications/api/notifications.queries.ts
import customFetch from '@/lib/custom-fetch';
import { PageResponse } from '@/types';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Notification, NotificationCount, NotificationFilterParams } from './types';

export const NOTIFICATIONS_QUERY_KEYS = {
    all: ['notifications'] as const,
    lists: () => [...NOTIFICATIONS_QUERY_KEYS.all, 'list'] as const,
    list: (filters: NotificationFilterParams) => [...NOTIFICATIONS_QUERY_KEYS.lists(), filters] as const,
    badges: () => [...NOTIFICATIONS_QUERY_KEYS.all, 'badges'] as const,
    unreadTotal: () => [...NOTIFICATIONS_QUERY_KEYS.badges(), 'total'] as const,
    unreadDetails: () => [...NOTIFICATIONS_QUERY_KEYS.badges(), 'details'] as const,
};

const getMyNotifications = async (filters: NotificationFilterParams): Promise<PageResponse<Notification>> => {
    // Axios sẽ tự động biến object filters thành query params: ?page=0&size=10&sortBy=createdAt...
    return customFetch.get('/notifications', {
        params: filters
    });
};

const getUnreadCounts = async (): Promise<NotificationCount[]> => {

    return customFetch.get('/notifications/unread-counts');
};

export const useGetMyNotifications = (filters: NotificationFilterParams) => {
    return useQuery({
        queryKey: NOTIFICATIONS_QUERY_KEYS.list(filters),
        queryFn: () => getMyNotifications(filters),
        placeholderData: keepPreviousData, // Giữ data cũ khi đang load data mới (đổi trang/tab)
    });
};

export const useGetUnreadCount = (enabled: boolean = true) => {
    return useQuery({
        queryKey: NOTIFICATIONS_QUERY_KEYS.unreadTotal(),
        queryFn: async () => {
            const detailedCounts = await getUnreadCounts();
            // Đảm bảo ép kiểu Number để tránh lỗi cộng chuỗi "01" + "2" = "012"
            return detailedCounts.reduce((sum, item) => sum + Number(item.count || 0), 0);
        },
        enabled: enabled,
        refetchInterval: 30000,
    });
};

export const useGetUnreadCountsDetail = () => {
    return useQuery({
        queryKey: NOTIFICATIONS_QUERY_KEYS.unreadDetails(),
        queryFn: getUnreadCounts,
    });
};