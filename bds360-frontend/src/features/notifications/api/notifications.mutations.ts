// @/features/notifications/api/notifications.mutations.ts
import customFetch from '@/lib/custom-fetch';
import { PageResponse } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { NOTIFICATIONS_QUERY_KEYS } from './notifications.queries';
import { CreateNotificationPayload, Notification, ViewPhoneNotificationPayload } from './types';

const markAsRead = async (ids: number[]): Promise<void> => {
    return customFetch.put('/notifications/mark-as-read', ids);
};

const markAllAsRead = async (): Promise<void> => {
    return customFetch.put('/notifications/mark-all-as-read');
};

const notifyViewPhone = async (payload: ViewPhoneNotificationPayload): Promise<void> => {
    return customFetch.post('/notifications/view-phone', payload);
};

const createNotification = async (payload: CreateNotificationPayload): Promise<void> => {
    return customFetch.post('/notifications', payload);
};

export const useMarkAsRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: markAsRead,
        onSuccess: (_, ids) => {
            // --- CẬP NHẬT THỦ CÔNG ĐỂ TIN NHẮN KHÔNG BIẾN MẤT ---
            // Tìm tất cả các query có key bắt đầu bằng ['notifications', 'list']
            queryClient.setQueriesData<PageResponse<Notification>>(
                { queryKey: NOTIFICATIONS_QUERY_KEYS.lists() },
                (oldData) => {
                    if (!oldData) return oldData;

                    return {
                        ...oldData,
                        content: oldData.content.map((item) =>
                            ids.includes(item.id) ? { ...item, read: true } : item
                        ),
                    };
                }
            );

            // Vẫn phải Invalidate Badge để số lượng trên chuông giảm ngay lập tức
            queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEYS.badges() });

            // LƯU Ý: Ta KHÔNG gọi invalidate cho 'lists' ở đây 
            // để tránh việc danh sách bị fetch lại và mất tin vừa đọc.
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
    return useMutation({ mutationFn: notifyViewPhone });
};

export const useCreateNotification = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createNotification,
        onSuccess: () => {
            // Nếu admin tạo tin cho chính mình thì mới cần invalidate
            // queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEYS.all });
        },
    });
};


// Trong @/features/notifications/api/notifications.mutations.ts

const deleteNotifications = async (ids: number[]): Promise<void> => {
    // Lưu ý: Với phương thức DELETE trong axios/customFetch, body thường phải bọc trong { data: payload }
    return customFetch.delete('/notifications', { data: ids });
};

export const useDeleteNotifications = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteNotifications,
        onSuccess: (_, ids) => {
            // 1. Xóa trực tiếp các item khỏi cache để UI cập nhật ngay lập tức
            queryClient.setQueriesData<PageResponse<Notification>>(
                { queryKey: NOTIFICATIONS_QUERY_KEYS.lists() },
                (oldData) => {
                    if (!oldData) return oldData;
                    return {
                        ...oldData,
                        content: oldData.content.filter((item) => !ids.includes(item.id)),
                        totalElements: oldData.totalElements - ids.length, // Giảm tổng số lượng
                    };
                }
            );

            // 2. Cập nhật lại badge (số lượng trên chuông)
            queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEYS.badges() });

        },
    });
};