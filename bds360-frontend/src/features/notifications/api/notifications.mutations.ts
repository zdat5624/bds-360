// @/features/notifications/api/notifications.mutations.ts

import customFetch from '@/lib/custom-fetch';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { NOTIFICATIONS_QUERY_KEYS } from './notifications.queries';
import { ViewPhoneNotificationPayload } from './types';

const markAsRead = async (ids: number[]): Promise<void> => {
    // Gửi mảng ids thẳng vào body theo cấu trúc backend: @RequestBody List<Long> ids
    return customFetch.put('/notifications/mark-as-read', ids);
};

const markAllAsRead = async (): Promise<void> => {
    return customFetch.put('/notifications/mark-all-as-read');
};

const notifyViewPhone = async (payload: ViewPhoneNotificationPayload): Promise<void> => {
    return customFetch.post('/notifications/view-phone', payload);
};

export const useMarkAsRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: markAsRead,
        onSuccess: () => {
            // Quét sạch cache danh sách và cập nhật lại số trên chuông
            queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEYS.lists() });
            queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEYS.badges() });
        },
    });
};

export const useMarkAllAsRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: markAllAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEYS.lists() });
            queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEYS.badges() });
        },
    });
};

export const useNotifyViewPhone = () => {
    return useMutation({
        mutationFn: notifyViewPhone,
        // Không cần invalidate vì người bắn thông báo không cần làm mới list của chính họ
    });
};