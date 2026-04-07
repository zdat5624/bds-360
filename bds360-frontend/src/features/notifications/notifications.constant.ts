// @/features/notifications/notifications.constant.ts

export const NOTIFICATION_TYPE_VALUES = ['POST', 'TRANSACTION', 'SYSTEM_ALERT'] as const;

export type NotificationType = (typeof NOTIFICATION_TYPE_VALUES)[number];

export const NOTIFICATION_TYPE_OPTIONS = Object.fromEntries(
    NOTIFICATION_TYPE_VALUES.map((item) => [item, item])
) as Record<NotificationType, NotificationType>;