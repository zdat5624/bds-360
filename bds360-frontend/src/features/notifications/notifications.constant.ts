// @/features/notifications/notifications.constant.ts

export const NOTIFICATION_TYPE_OPTIONS = {
    POST: 'POST',
    TRANSACTION: 'TRANSACTION',
    SYSTEM_ALERT: 'SYSTEM_ALERT',
} as const;

export type NotificationType = keyof typeof NOTIFICATION_TYPE_OPTIONS;