// @/features/notifications/api/types.ts

import { BaseFilterParams } from '@/types';
import { NotificationType } from '../notifications.constant';

export interface Notification {
    id: number;
    message: string;
    type: NotificationType;
    read: boolean;
    createdAt: string;
}

export interface NotificationCount {
    type: NotificationType;
    count: number;
}

export interface CreateNotificationPayload {
    userId: number;
    message: string;
    type: NotificationType;
}

export interface NotificationFilterParams extends BaseFilterParams {
    isRead?: boolean;
    type?: NotificationType;
}
export interface ViewPhoneNotificationPayload {
    postId?: number;
    recipientId: number;
}