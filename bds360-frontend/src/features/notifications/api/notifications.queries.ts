// @/features/notifications/api/notifications.queries.ts

import customFetch from '@/lib/custom-fetch';
import { PageResponse } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { Notification, NotificationCount, NotificationFilterParams } from './types';

export const NOTIFICATIONS_QUERY_KEYS = {
    all: ['notifications'] as const,
    lists: () => [...NOTIFICATIONS_QUERY_KEYS.all, 'list'] as const,
    list: (filters: NotificationFilterParams) => [...NOTIFICATIONS_QUERY_KEYS.lists(), filters] as const,
    // Tách riêng key cho bộ đếm (badges) để dễ dàng refetch
    badges: () => [...NOTIFICATIONS_QUERY_KEYS.all, 'badges'] as const,
    unreadTotal: () => [...NOTIFICATIONS_QUERY_KEYS.badges(), 'total'] as const,
    unreadDetails: () => [...NOTIFICATIONS_QUERY_KEYS.badges(), 'details'] as const,
};

const getMyNotifications = async (filters: NotificationFilterParams): Promise<PageResponse<Notification>> => {
    return customFetch.get('/notifications', { params: filters });
};

const getUnreadCount = async (): Promise<number> => {
    return customFetch.get('/notifications/unread-count');
};

const getUnreadCounts = async (): Promise<NotificationCount[]> => {
    return customFetch.get('/notifications/unread-counts');
};

export const useGetMyNotifications = (filters: NotificationFilterParams) => {
    return useQuery({
        queryKey: NOTIFICATIONS_QUERY_KEYS.list(filters),
        queryFn: () => getMyNotifications(filters),
    });
};

// Dùng cho cục chuông tổng trên Header
export const useGetUnreadCount = () => {
    return useQuery({
        queryKey: NOTIFICATIONS_QUERY_KEYS.unreadTotal(),
        queryFn: getUnreadCount,
        refetchInterval: 30000, // Background refetch mỗi 30s để hỗ trợ WebSocket nếu socket rớt
    });
};

// Dùng cho Menu chi tiết bên trong trang Thông báo
export const useGetUnreadCountsDetail = () => {
    return useQuery({
        queryKey: NOTIFICATIONS_QUERY_KEYS.unreadDetails(),
        queryFn: getUnreadCounts,
    });
};