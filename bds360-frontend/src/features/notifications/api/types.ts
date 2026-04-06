// @/features/notifications/api/types.ts

import { BaseFilterRequest } from '@/types';
import { NotificationType } from '../notifications.constant';

export interface Notification {
    id: number;
    message: string;
    type: NotificationType;
    isRead: boolean;
    createdAt: string;
}

export interface NotificationCount {
    type: NotificationType;
    count: number;
}

export interface NotificationFilterRequest extends BaseFilterRequest {
    isRead?: boolean;
    type?: NotificationType;
}

export interface ViewPhoneNotificationPayload {
    postId: number;
    recipientId: number;
}